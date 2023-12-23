import { getChainlinkOracles } from "../../helpers/market-config-helpers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { V3_CORE_VERSION, ZERO_ADDRESS } from "../../helpers/constants";
import {
  ORACLE_ID,
  POOL_ADDRESSES_PROVIDER_ID,
} from "../../helpers/deploy-ids";
import {
  loadPoolConfig,
  ConfigNames,
  checkRequiredEnvironment,
  getReserveAddresses,
} from "../../helpers/market-config-helpers";
import { eNetwork, ICommonConfiguration } from "../../helpers/types";
import { getPairsTokenAggregator } from "../../helpers/init-helpers";
import { parseUnits } from "ethers/lib/utils";
import { MARKET_NAME } from "../../helpers/env";
import { deployOrLoad, getDeploymentAddress } from "../../helpers/zkdeploy";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const poolConfig = await loadPoolConfig(MARKET_NAME as ConfigNames);
  const network = (
    process.env.FORK ? process.env.FORK : hre.network.name
  ) as eNetwork;

  const { OracleQuoteUnit } = poolConfig as ICommonConfiguration;

  const addressesProviderAddress = await getDeploymentAddress(
    hre,
    POOL_ADDRESSES_PROVIDER_ID
  );

  const fallbackOracleAddress = ZERO_ADDRESS;

  const reserveAssets = await getReserveAddresses(poolConfig, network);
  const chainlinkAggregators = await getChainlinkOracles(poolConfig, network);

  const [assets, sources] = getPairsTokenAggregator(
    reserveAssets,
    chainlinkAggregators
  );

  // Deploy AaveOracle
  await deployOrLoad(hre, ORACLE_ID, "AaveOracle", [
    addressesProviderAddress,
    assets,
    sources,
    fallbackOracleAddress,
    ZERO_ADDRESS,
    parseUnits("1", OracleQuoteUnit),
  ]);

  return true;
};

func.id = `Oracles:${MARKET_NAME}:aave-v3-core@${V3_CORE_VERSION}`;

func.tags = ["market", "oracle"];

func.dependencies = ["before-deploy"];

func.skip = async () => checkRequiredEnvironment();

export default func;
