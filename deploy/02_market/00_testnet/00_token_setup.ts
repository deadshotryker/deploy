import {
  STAKE_AAVE_PROXY,
  TESTNET_REWARD_TOKEN_PREFIX,
} from "../../../helpers/deploy-ids";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { COMMON_DEPLOY_PARAMS } from "../../../helpers/env";
import {
  checkRequiredEnvironment,
  ConfigNames,
  isIncentivesEnabled,
  isProductionMarket,
  loadPoolConfig,
} from "../../../helpers/market-config-helpers";
import { eNetwork } from "../../../helpers/types";
import {
  // FAUCET_ID,
  TESTNET_TOKEN_PREFIX,
  FAUCET_OWNABLE_ID,
} from "../../../helpers/deploy-ids";
import Bluebird from "bluebird";
import {
  deployInitializableAdminUpgradeabilityProxy,
  setupStkAave,
} from "../../../helpers/contract-deployments";
import { MARKET_NAME, PERMISSIONED_FAUCET } from "../../../helpers/env";
import { deployOrLoad, getDeploymentAddress } from "../../../helpers/zkdeploy";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer, incentivesEmissionManager, incentivesRewardsVault } =
    await hre.getNamedAccounts();
  const poolConfig = await loadPoolConfig(MARKET_NAME as ConfigNames);
  const network = (
    process.env.FORK ? process.env.FORK : hre.network.name
  ) as eNetwork;

  console.log("Live network:", !!hre.config.networks[network].live);

  if (isProductionMarket(poolConfig)) {
    console.log(
      "[Deployment] Skipping testnet token setup at production market"
    );
    // Early exit if is not a testnet market
    return;
  }
  // Deployment of FaucetOwnable helper contract
  // TestnetERC20 is owned by Faucet. Faucet is owned by defender relayer.
  console.log("- Deployment of FaucetOwnable contract");
  const faucetOwnable = await deployOrLoad(hre, FAUCET_OWNABLE_ID, "Faucet", [
    deployer,
    PERMISSIONED_FAUCET,
  ]);

  console.log(
    `- Setting up testnet tokens for "${MARKET_NAME}" market at "${network}" network`
  );

  const reservesConfig = poolConfig.ReservesConfig;
  const reserveSymbols = Object.keys(reservesConfig);

  if (reserveSymbols.length === 0) {
    console.warn(
      "Market Config does not contain ReservesConfig. Skipping testnet token setup."
    );
    return;
  }

  // 0. Deployment of ERC20 mintable tokens for testing purposes
  await Bluebird.each(reserveSymbols, async (symbol) => {
    if (!reservesConfig[symbol]) {
      throw `[Deployment] Missing token "${symbol}" at ReservesConfig`;
    }

    if (symbol == poolConfig.WrappedNativeTokenSymbol) {
      console.log("Deploy of WETH9 mock");
      await deployOrLoad(
        hre,
        poolConfig.WrappedNativeTokenSymbol,
        "WETH9Mock",
        [
          poolConfig.WrappedNativeTokenSymbol,
          poolConfig.WrappedNativeTokenSymbol,
          faucetOwnable.address,
        ]
      );
    } else {
      console.log("Deploy of TestnetERC20 contract", symbol);
      await deployOrLoad(hre, symbol, "TestnetERC20", [
        symbol,
        symbol,
        reservesConfig[symbol].reserveDecimals,
        faucetOwnable.address,
      ]);
    }
  });

  if (isIncentivesEnabled(poolConfig)) {
    // 2. Deployment of Reward Tokens

    const rewardSymbols: string[] = Object.keys(
      poolConfig.IncentivesConfig.rewards[network] || {}
    );

    for (let y = 0; y < rewardSymbols.length; y++) {
      const reward = rewardSymbols[y];
      await deployOrLoad(
        hre,
        `${reward}${TESTNET_REWARD_TOKEN_PREFIX}`,
        "TestnetERC20",
        [reward, reward, 18, faucetOwnable.address]
      );
    }

    // // 3. Deployment of Stake Aave
    // const COOLDOWN_SECONDS = "3600";
    // const UNSTAKE_WINDOW = "1800";
    // const aaveTokenArtifact = await getDeploymentAddress(
    //   hre,
    //   `AAVE${TESTNET_TOKEN_PREFIX}`
    // );

    // const stakeProxy = await deployInitializableAdminUpgradeabilityProxy(
    //   STAKE_AAVE_PROXY
    // );

    // // Setup StkAave
    // await setupStkAave(stakeProxy, [
    //   aaveTokenArtifact.address,
    //   aaveTokenArtifact.address,
    //   COOLDOWN_SECONDS,
    //   UNSTAKE_WINDOW,
    //   incentivesRewardsVault,
    //   incentivesEmissionManager,
    //   (1000 * 60 * 60).toString(),
    // ]);

    // console.log("Testnet Reserve Tokens");
    // console.log("======================");

    // const allDeployments = await deployments.all();
    // const testnetDeployment = Object.keys(allDeployments).filter((x) =>
    //   x.includes(TESTNET_TOKEN_PREFIX)
    // );
    // testnetDeployment.forEach((key) =>
    //   console.log(key, allDeployments[key].address)
    // );

    // console.log("Testnet Reward Tokens");
    // console.log("======================");

    // const rewardDeployment = Object.keys(allDeployments).filter((x) =>
    //   x.includes(TESTNET_REWARD_TOKEN_PREFIX)
    // );

    // rewardDeployment.forEach((key) =>
    //   console.log(key, allDeployments[key].address)
    // );

    console.log(
      "Native Token Wrapper WETH9",
      (await getDeploymentAddress(hre, poolConfig.WrappedNativeTokenSymbol))
        .address
    );
  }
  console.log(
    "[Deployment][WARNING] Remember to setup the above testnet addresses at the ReservesConfig field inside the market configuration file and reuse testnet tokens"
  );
  console.log(
    "[Deployment][WARNING] Remember to setup the Native Token Wrapper (ex WETH or WMATIC) at `helpers/constants.ts`"
  );
};

func.tags = ["market", "init-testnet", "token-setup"];

func.dependencies = ["before-deploy", "periphery-pre"];

func.skip = async () => checkRequiredEnvironment();

export default func;
