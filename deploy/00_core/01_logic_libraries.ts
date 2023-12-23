import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { deployOrLoad } from "../../helpers/zkdeploy";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  await deployOrLoad(hre, "SupplyLogic", "SupplyLogic", []);
  await deployOrLoad(hre, "BorrowLogic", "BorrowLogic", []);
  await deployOrLoad(hre, "EModeLogic", "EModeLogic", []);
  await deployOrLoad(hre, "BridgeLogic", "BridgeLogic", []);
  await deployOrLoad(hre, "ConfiguratorLogic", "ConfiguratorLogic", []);
  await deployOrLoad(hre, "PoolLogic", "PoolLogic", []);

  return true;
};

func.id = "LogicLibraries";
func.tags = ["core", "logic"];

export default func;
