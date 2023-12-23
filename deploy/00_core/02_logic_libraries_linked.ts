import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { deployOrLoad } from "../../helpers/zkdeploy";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  // flashloan logic requires the borrow logic library

  await deployOrLoad(hre, "FlashLoanLogic", "FlashLoanLogic", []);
  await deployOrLoad(hre, "LiquidationLogic", "LiquidationLogic", []);

  return true;
};

func.id = "LogicLibraries2";
func.tags = ["core", "logic"];

export default func;
