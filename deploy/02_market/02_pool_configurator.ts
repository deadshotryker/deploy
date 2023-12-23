import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import {
  POOL_ADDRESSES_PROVIDER_ID,
  POOL_CONFIGURATOR_IMPL_ID,
  RESERVES_SETUP_HELPER_ID,
} from "../../helpers/deploy-ids";
import { waitForTx } from "../../helpers";
import { deployOrLoad, getDeploymentAddress } from "../../helpers/zkdeploy";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const addressesProviderAddress = await getDeploymentAddress(
    hre,
    POOL_ADDRESSES_PROVIDER_ID
  );

  const poolConfig = await deployOrLoad(
    hre,
    POOL_CONFIGURATOR_IMPL_ID,
    "PoolConfigurator",
    []
  );

  // Initialize implementation
  await waitForTx(await poolConfig.initialize(addressesProviderAddress));
  console.log("Initialized PoolConfigurator Implementation");

  await deployOrLoad(hre, RESERVES_SETUP_HELPER_ID, "ReservesSetupHelper", []);

  return true;
};

func.id = "PoolConfigurator";
func.tags = ["market"];

export default func;
