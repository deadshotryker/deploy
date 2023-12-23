import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { V3_CORE_VERSION } from "../../helpers/constants";
import {
  checkRequiredEnvironment,
  ConfigNames,
  getReserveAddresses,
  getTreasuryAddress,
  loadPoolConfig,
  savePoolTokens,
} from "../../helpers/market-config-helpers";
import { eNetwork, IAaveConfiguration } from "../../helpers/types";
import {
  configureReservesByHelper,
  initReservesByHelper,
} from "../../helpers/init-helpers";
import {
  POOL_ADDRESSES_PROVIDER_ID,
  POOL_DATA_PROVIDER,
} from "../../helpers/deploy-ids";
import { MARKET_NAME } from "../../helpers/env";
import { deployOrLoad, getDeploymentAddress } from "../../helpers/zkdeploy";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const network = (
    process.env.FORK ? process.env.FORK : hre.network.name
  ) as eNetwork;
  const { deployer } = await hre.getNamedAccounts();

  const poolConfig = (await loadPoolConfig(
    MARKET_NAME as ConfigNames
  )) as IAaveConfiguration;

  const addressesProvider = await getDeploymentAddress(
    hre,
    POOL_ADDRESSES_PROVIDER_ID
  );

  const {
    ATokenNamePrefix,
    StableDebtTokenNamePrefix,
    VariableDebtTokenNamePrefix,
    SymbolPrefix,
    ReservesConfig,
    RateStrategies,
  } = poolConfig;

  // Deploy Rate Strategies
  for (const strategy in RateStrategies) {
    const strategyData = RateStrategies[strategy];
    const args = [
      addressesProvider,
      strategyData.optimalUsageRatio,
      strategyData.baseVariableBorrowRate,
      strategyData.variableRateSlope1,
      strategyData.variableRateSlope2,
      strategyData.stableRateSlope1,
      strategyData.stableRateSlope2,
      strategyData.baseStableRateOffset,
      strategyData.stableRateExcessOffset,
      strategyData.optimalStableToTotalDebtRatio,
    ];

    await deployOrLoad(
      hre,
      `ReserveStrategy-${strategyData.name}`,
      "DefaultReserveInterestRateStrategy",
      args
    );
  }

  // Deploy Reserves ATokens

  const treasuryAddress = await getTreasuryAddress(poolConfig, network);
  const incentivesController = await getDeploymentAddress(
    hre,
    "IncentivesProxy"
  );
  const reservesAddresses = await getReserveAddresses(poolConfig, network);

  if (Object.keys(reservesAddresses).length == 0) {
    console.warn("[WARNING] Skipping initialization. Empty asset list.");
    return;
  }

  await initReservesByHelper(
    ReservesConfig,
    reservesAddresses,
    ATokenNamePrefix,
    StableDebtTokenNamePrefix,
    VariableDebtTokenNamePrefix,
    SymbolPrefix,
    deployer,
    treasuryAddress,
    incentivesController
  );
  console.log(`[Deployment] Initialized all reserves`);

  await configureReservesByHelper(ReservesConfig, reservesAddresses);

  // Save AToken and Debt tokens artifacts
  const dataProvider = await getDeploymentAddress(hre, POOL_DATA_PROVIDER);
  await savePoolTokens(reservesAddresses, dataProvider);

  console.log(`[Deployment] Configured all reserves`);
  return true;
};

// This script can only be run successfully once per market, core version, and network
func.id = `ReservesInit:${MARKET_NAME}:aave-v3-core@${V3_CORE_VERSION}`;

func.tags = ["market", "init-reserves"];
func.dependencies = [
  "before-deploy",
  "core",
  "periphery-pre",
  "provider",
  "init-pool",
  "oracles",
];

func.skip = async () => checkRequiredEnvironment();

export default func;
