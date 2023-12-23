import { ORACLE_ID } from "../../helpers/deploy-ids";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { V3_CORE_VERSION } from "../../helpers/constants";
import { waitForTx } from "../../helpers/utilities/tx";
import { PoolAddressesProvider } from "../../typechain";
import { POOL_ADDRESSES_PROVIDER_ID } from "../../helpers/deploy-ids";
import { getAddress } from "@ethersproject/address";
import { checkRequiredEnvironment } from "../../helpers/market-config-helpers";
import { MARKET_NAME } from "../../helpers/env";
import { getDeploymentAddress } from "../../helpers/zkdeploy";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const addressesProviderArtifact = await getDeploymentAddress(
    hre,
    POOL_ADDRESSES_PROVIDER_ID
  );
  const addressesProviderInstance = (
    await hre.ethers.getContractAt(
      "PoolAddressesProvider",
      addressesProviderArtifact
    )
  ).connect(await hre.ethers.getSigner(deployer)) as PoolAddressesProvider;

  // 1. Set price oracle
  const configPriceOracle = await getDeploymentAddress(hre, ORACLE_ID);
  const statePriceOracle = await addressesProviderInstance.getPriceOracle();
  if (getAddress(configPriceOracle) === getAddress(statePriceOracle)) {
    console.log("[addresses-provider] Price oracle already set. Skipping tx.");
  } else {
    await waitForTx(
      await addressesProviderInstance.setPriceOracle(configPriceOracle)
    );
    console.log(
      `[Deployment] Added PriceOracle ${configPriceOracle} to PoolAddressesProvider`
    );
  }

  return true;
};

func.tags = ["market", "oracles"];

func.dependencies = ["before-deploy", "core", "periphery-pre", "provider"];

func.skip = async () => checkRequiredEnvironment();

export default func;
