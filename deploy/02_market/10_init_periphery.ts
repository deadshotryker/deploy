import {
  ConfigNames,
  loadPoolConfig,
} from "../../helpers/market-config-helpers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { V3_PERIPHERY_VERSION } from "../../helpers/constants";
import { POOL_ADDRESSES_PROVIDER_ID } from "../../helpers/deploy-ids";
import { checkRequiredEnvironment as checkRequiredEnvironment } from "../../helpers/market-config-helpers";
import { eNetwork } from "../../helpers/types";
import { MARKET_NAME } from "../../helpers/env";
import { deployOrLoad, getDeploymentAddress } from "../../helpers/zkdeploy";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const poolConfig = await loadPoolConfig(MARKET_NAME as ConfigNames);
  const network = (
    process.env.FORK ? process.env.FORK : hre.network.name
  ) as eNetwork;

  // Deploy Mock Flash Loan Receiver if testnet deployment
  if (!hre.config.networks[network].live || poolConfig.TestnetMarket) {
    await deployOrLoad(hre, "MockFlashLoanReceiver", "MockFlashLoanReceiver", [
      await getDeploymentAddress(hre, POOL_ADDRESSES_PROVIDER_ID),
    ]);
  }

  return true;
};

// This script can only be run successfully once per market, core version, and network
func.id = `PeripheryInit:${MARKET_NAME}:aave-v3-periphery@${V3_PERIPHERY_VERSION}`;

func.dependencies = [
  "before-deploy",
  "core",
  "periphery-pre",
  "provider",
  "init-pool",
  "oracles",
];

func.skip = async () => checkRequiredEnvironment();

export default func;
