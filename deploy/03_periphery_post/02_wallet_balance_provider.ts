import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { deployOrLoad } from "../../helpers/zkdeploy";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  await deployOrLoad(hre, "WalletBalanceProvider", "WalletBalanceProvider");
};

func.tags = ["periphery-post", "walletProvider"];

export default func;
