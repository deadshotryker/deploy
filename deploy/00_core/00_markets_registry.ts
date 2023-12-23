import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { PoolAddressesProviderRegistry } from "../../typechain";
import { waitForTx } from "../../helpers/utilities/tx";
import { COMMON_DEPLOY_PARAMS } from "../../helpers/env";
import { deployOrLoad, deployWrapper } from "../../helpers/zkdeploy";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer, addressesProviderRegistryOwner } =
    await hre.getNamedAccounts();

  const registryInstance = await deployOrLoad(
    hre,
    "PoolAddressesProviderRegistry",
    "PoolAddressesProviderRegistry",
    [deployer]
  );

  await waitForTx(
    await registryInstance.transferOwnership(addressesProviderRegistryOwner)
  );

  console.log(
    `[Deployment] Transferred ownership of PoolAddressesProviderRegistry to: ${addressesProviderRegistryOwner} `
  );
  return true;
};

func.tags = ["core", "registry"];

export default func;
