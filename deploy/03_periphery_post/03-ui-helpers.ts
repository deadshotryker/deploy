import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { COMMON_DEPLOY_PARAMS } from "../../helpers/env";
import {
  chainlinkAggregatorProxy,
  chainlinkEthUsdAggregatorProxy,
} from "../../helpers/constants";
import { eNetwork } from "../../helpers";
import { deployOrLoad } from "../../helpers/zkdeploy";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const network = (
    process.env.FORK ? process.env.FORK : hre.network.name
  ) as eNetwork;

  if (!chainlinkAggregatorProxy[network]) {
    console.log(
      '[Deployments] Skipping the deployment of UiPoolDataProvider due missing constant "chainlinkAggregatorProxy" configuration at ./helpers/constants.ts'
    );
    return;
  }

  // Deploy UiIncentiveDataProvider getter helper
  await deployOrLoad(
    hre,
    "UiIncentiveDataProviderV3",
    "UiIncentiveDataProviderV3"
  );

  // Deploy UiPoolDataProvider getter helper
  await deployOrLoad(hre, "UiPoolDataProviderV3", "UiPoolDataProviderV3", [
    chainlinkAggregatorProxy[network],
    chainlinkEthUsdAggregatorProxy[network],
  ]);
};

func.tags = ["periphery-post", "ui-helpers"];

export default func;
