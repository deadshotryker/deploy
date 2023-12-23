import { ZERO_ADDRESS } from "./../../helpers/constants";
import { getPoolConfiguratorProxy } from "./../../helpers/contract-getters";
import {
  ConfigNames,
  loadPoolConfig,
} from "./../../helpers/market-config-helpers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { V3_CORE_VERSION } from "../../helpers/constants";
import { checkRequiredEnvironment } from "../../helpers/market-config-helpers";
import {
  POOL_ADDRESSES_PROVIDER_ID,
  POOL_CONFIGURATOR_IMPL_ID,
  POOL_CONFIGURATOR_PROXY_ID,
  POOL_IMPL_ID,
  POOL_PROXY_ID,
} from "../../helpers/deploy-ids";
import { PoolAddressesProvider } from "../../typechain";
import { waitForTx } from "../../helpers/utilities/tx";
import { MARKET_NAME } from "../../helpers/env";
import { getDeploymentAddress, save } from "../../helpers/zkdeploy";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  // const { save, deploy } = deployments;
  const { deployer } = await hre.getNamedAccounts();
  const poolConfig = await loadPoolConfig(MARKET_NAME as ConfigNames);

  const proxyArtifact = "InitializableImmutableAdminUpgradeabilityProxy";

  const poolImplDeployment = getDeploymentAddress(hre, POOL_IMPL_ID);

  const poolConfiguratorImplDeployment = await getDeploymentAddress(
    hre,
    POOL_CONFIGURATOR_IMPL_ID
  );

  const addressesProvider = await getDeploymentAddress(
    hre,
    POOL_ADDRESSES_PROVIDER_ID
  );

  const addressesProviderInstance = (await hre.ethers.getContractAt(
    "PoolAddressesProvider",
    addressesProvider
  )) as PoolAddressesProvider;

  const isPoolProxyPending =
    (await addressesProviderInstance.getPool()) === ZERO_ADDRESS;

  // Set Pool implementation to Addresses provider and save the proxy deployment artifact at disk
  if (isPoolProxyPending) {
    const setPoolImplTx = await waitForTx(
      await addressesProviderInstance.setPoolImpl(poolImplDeployment)
    );
    const txPoolProxyAddress = await addressesProviderInstance.getPool();
    console.log(
      `[Deployment] Attached Pool implementation and deployed proxy contract: `,
      txPoolProxyAddress
    );
    console.log("- Tx hash:", setPoolImplTx.transactionHash);
  }

  const poolProxyAddress = await addressesProviderInstance.getPool();
  console.log("- Deployed Proxy:", poolProxyAddress);

  await save(
    hre.network.name,
    POOL_PROXY_ID,
    proxyArtifact,
    poolProxyAddress,
    false
  );

  const isPoolConfiguratorProxyPending =
    (await addressesProviderInstance.getPoolConfigurator()) === ZERO_ADDRESS;

  // Set Pool Configurator to Addresses Provider proxy deployment artifact at disk
  if (isPoolConfiguratorProxyPending) {
    const setPoolConfiguratorTx = await waitForTx(
      await addressesProviderInstance.setPoolConfiguratorImpl(
        poolConfiguratorImplDeployment
      )
    );
    console.log(
      `[Deployment] Attached PoolConfigurator implementation and deployed proxy `
    );
    console.log("- Tx hash:", setPoolConfiguratorTx.transactionHash);
  }
  const poolConfiguratorProxyAddress =
    await addressesProviderInstance.getPoolConfigurator();

  console.log("- Deployed Proxy:", poolConfiguratorProxyAddress);

  await save(
    hre.network.name,
    POOL_CONFIGURATOR_PROXY_ID,
    proxyArtifact,
    poolConfiguratorProxyAddress,
    false
  );

  // Set Flash Loan premiums
  const poolConfiguratorInstance = await getPoolConfiguratorProxy();

  // Set total Flash Loan Premium
  await waitForTx(
    await poolConfiguratorInstance.updateFlashloanPremiumTotal(
      poolConfig.FlashLoanPremiums.total
    )
  );
  // Set protocol Flash Loan Premium
  await waitForTx(
    await poolConfiguratorInstance.updateFlashloanPremiumToProtocol(
      poolConfig.FlashLoanPremiums.protocol
    )
  );

  return true;
};

// This script can only be run successfully once per market, core version, and network
func.id = `PoolInitalization:${MARKET_NAME}:aave-v3-core@${V3_CORE_VERSION}`;

func.tags = ["market", "init-pool"];
func.dependencies = ["before-deploy", "core", "periphery-pre", "provider"];

func.skip = async () => checkRequiredEnvironment();

export default func;
