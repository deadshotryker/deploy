import {
  ConfigNames,
  isTestnetMarket,
  loadPoolConfig,
} from "./../../helpers/market-config-helpers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { WRAPPED_NATIVE_TOKEN_PER_NETWORK } from "../../helpers/constants";
import { eNetwork } from "../../helpers/types";
import { POOL_PROXY_ID, TESTNET_TOKEN_PREFIX } from "../../helpers";
import { MARKET_NAME } from "../../helpers/env";
import { deployOrLoad, getDeploymentAddress } from "../../helpers/zkdeploy";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const network = (
    process.env.FORK ? process.env.FORK : hre.network.name
  ) as eNetwork;
  const poolConfig = loadPoolConfig(MARKET_NAME as ConfigNames);

  let wrappedNativeTokenAddress;

  // Local networks that are not live or testnet, like hardhat network, will deploy a WETH9 contract as mockup for testing deployments
  if (isTestnetMarket(poolConfig)) {
    wrappedNativeTokenAddress = await getDeploymentAddress(
      hre,
      poolConfig.WrappedNativeTokenSymbol
    );
  } else {
    if (!WRAPPED_NATIVE_TOKEN_PER_NETWORK[network]) {
      throw `Missing Wrapped native token for network: ${network}, fill the missing configuration at ./helpers/constants.ts`;
    }
    wrappedNativeTokenAddress = WRAPPED_NATIVE_TOKEN_PER_NETWORK[network];
  }

  const poolAddress = await getDeploymentAddress(hre, POOL_PROXY_ID);

  await deployOrLoad(hre, "WrappedTokenGatewayV3", "WrappedTokenGatewayV3", [
    wrappedNativeTokenAddress,
    deployer,
    poolAddress,
  ]);
};

func.tags = ["periphery-post", "WrappedTokenGateway"];
func.dependencies = [];
func.id = "WrappedTokenGateway";

export default func;
