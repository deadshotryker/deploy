import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { COMMON_DEPLOY_PARAMS } from "../../helpers/env";
import {
  POOL_ADDRESSES_PROVIDER_ID,
  POOL_IMPL_ID,
} from "../../helpers/deploy-ids";
import { MARKET_NAME } from "../../helpers/env";
import {
  ConfigNames,
  eNetwork,
  getPool,
  getPoolLibraries,
  isL2PoolSupported,
  loadPoolConfig,
  waitForTx,
} from "../../helpers";
import { deployOrLoad, getDeploymentAddress } from "../../helpers/zkdeploy";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const poolConfig = await loadPoolConfig(MARKET_NAME as ConfigNames);
  const network = (
    process.env.FORK ? process.env.FORK : hre.network.name
  ) as eNetwork;

  const addressesProviderAddress = await getDeploymentAddress(
    hre,
    POOL_ADDRESSES_PROVIDER_ID
  );

  if (isL2PoolSupported(poolConfig)) {
    console.log(
      `[INFO] Skipped common Pool due current network '${network}' is not supported`
    );
    return;
  }

  // Deploy common Pool contract
  const pool = await deployOrLoad(hre, POOL_IMPL_ID, "Pool", [
    addressesProviderAddress,
  ]);

  // Initialize implementation
  await waitForTx(await pool.initialize(addressesProviderAddress));
  console.log("Initialized Pool Implementation");
};

func.id = "PoolImplementation";
func.tags = ["market"];

export default func;
