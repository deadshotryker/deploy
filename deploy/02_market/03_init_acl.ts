import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { V3_CORE_VERSION, ZERO_BYTES_32 } from "../../helpers/constants";
import { waitForTx } from "../../helpers/utilities/tx";
import { ACLManager, PoolAddressesProvider } from "../../typechain";
import { checkRequiredEnvironment } from "../../helpers/market-config-helpers";
import {
  ACL_MANAGER_ID,
  POOL_ADDRESSES_PROVIDER_ID,
} from "../../helpers/deploy-ids";
import { MARKET_NAME } from "../../helpers/env";
import { deployOrLoad, getDeploymentAddress } from "../../helpers/zkdeploy";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts } = hre;
  const { deployer, poolAdmin, aclAdmin, emergencyAdmin } =
    await getNamedAccounts();

  const aclAdminSigner = await hre.ethers.getSigner(aclAdmin);

  const addressesProviderAddress = await getDeploymentAddress(
    hre,
    POOL_ADDRESSES_PROVIDER_ID
  );

  const addressesProviderInstance = (
    await hre.ethers.getContractAt(
      "PoolAddressesProvider",
      addressesProviderAddress
    )
  ).connect(await hre.ethers.getSigner(deployer)) as PoolAddressesProvider;

  // 1. Set ACL admin at AddressesProvider
  await waitForTx(await addressesProviderInstance.setACLAdmin(aclAdmin));

  // 2. Deploy ACLManager and setup administrators
  const aclManager = (await deployOrLoad(hre, ACL_MANAGER_ID, "ACLManager", [
    addressesProviderInstance.address,
  ])) as ACLManager;

  // 3. Setup ACLManager at AddressesProviderInstance
  await waitForTx(
    await addressesProviderInstance.setACLManager(aclManager.address)
  );

  // 4. Add PoolAdmin to ACLManager contract
  await waitForTx(
    await aclManager.connect(aclAdminSigner).addPoolAdmin(poolAdmin)
  );

  // 5. Add EmergencyAdmin  to ACLManager contract
  await waitForTx(
    await aclManager.connect(aclAdminSigner).addEmergencyAdmin(emergencyAdmin)
  );

  const isACLAdmin = await aclManager.hasRole(ZERO_BYTES_32, aclAdmin);
  const isPoolAdmin = await aclManager.isPoolAdmin(poolAdmin);
  const isEmergencyAdmin = await aclManager.isEmergencyAdmin(emergencyAdmin);

  if (!isACLAdmin) throw "[ACL][ERROR] ACLAdmin is not setup correctly";
  if (!isPoolAdmin) throw "[ACL][ERROR] PoolAdmin is not setup correctly";
  if (!isEmergencyAdmin)
    throw "[ACL][ERROR] EmergencyAdmin is not setup correctly";
  console.log("== Market Admins ==");
  console.log("- ACL Admin", aclAdmin);
  console.log("- Pool Admin", poolAdmin);
  console.log("- Emergency Admin", emergencyAdmin);

  return true;
};

// This script can only be run successfully once per market, core version, and network
func.id = `ACLManager:${MARKET_NAME}:aave-v3-core@${V3_CORE_VERSION}`;

func.dependencies = ["before-deploy", "core", "periphery-pre", "provider"];

func.skip = async () => checkRequiredEnvironment();

export default func;
