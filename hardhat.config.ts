import {
  DETERMINISTIC_DEPLOYMENT,
  DETERMINISTIC_FACTORIES,
  ETHERSCAN_KEY,
  getCommonNetworkConfig,
  hardhatNetworkSettings,
  loadTasks,
} from "./helpers/hardhat-config-helpers";
import {
  eArbitrumNetwork,
  eAvalancheNetwork,
  eBSCNetwork,
  eEthereumNetwork,
  eFantomNetwork,
  eHarmonyNetwork,
  eOptimismNetwork,
  ePolygonNetwork,
  eTenderly,
  eZkSyncNetwork,
} from "./helpers/types";
import { DEFAULT_NAMED_ACCOUNTS, ZERO_ADDRESS } from "./helpers/constants";

// import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy";
import "hardhat-contract-sizer";
import "hardhat-dependency-compiler";
import "@nomicfoundation/hardhat-chai-matchers";
import "@typechain/hardhat";

import "@matterlabs/hardhat-zksync-verify";
import "@matterlabs/hardhat-zksync-deploy";
import "@matterlabs/hardhat-zksync-solc";

const SKIP_LOAD = process.env.SKIP_LOAD === "true";
const TASK_FOLDERS = ["misc", "market-registry"];

// Prevent to load tasks before compilation and typechain
if (!SKIP_LOAD) {
  loadTasks(TASK_FOLDERS);
}

export default {
  contractSizer: {
    alphaSort: true,
    runOnCompile: false,
    disambiguatePaths: false,
  },
  solidity: {
    compilers: [
      {
        version: "0.8.12",
        settings: {
          optimizer: { enabled: true, runs: 100_000 },
          evmVersion: "berlin",
        },
      },
      {
        version: "0.7.5",
        settings: {
          optimizer: { enabled: true, runs: 100_000 },
        },
      },
    ],
  },
  typechain: {
    outDir: "typechain",
    target: "ethers-v5",
  },
  defaultNetwork: eZkSyncNetwork.zkEra,
  networks: {
    hardhat: hardhatNetworkSettings,
    [eZkSyncNetwork.zkGoerli]: {
      ...getCommonNetworkConfig(eZkSyncNetwork.zkGoerli, 280),
      ethNetwork: "goerli", // or a Goerli RPC endpoint from Infura/Alchemy/Chainstack etc.
      zksync: true,
      verifyURL:
        "https://zksync2-testnet-explorer.zksync.dev/contract_verification",
    },
    [eZkSyncNetwork.zkEra]: {
      ...getCommonNetworkConfig(eZkSyncNetwork.zkEra, 324),
      ethNetwork: "mainnet", // or a Goerli RPC endpoint from Infura/Alchemy/Chainstack etc.
      zksync: true,
      verifyURL:
        "https://zksync2-mainnet-explorer.zksync.io/contract_verification",
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      ...hardhatNetworkSettings,
    },
    tenderly: getCommonNetworkConfig("tenderly", 3030),
    main: getCommonNetworkConfig(eEthereumNetwork.main, 1),
    kovan: getCommonNetworkConfig(eEthereumNetwork.kovan, 42),
    rinkeby: getCommonNetworkConfig(eEthereumNetwork.rinkeby, 4),
    ropsten: getCommonNetworkConfig(eEthereumNetwork.ropsten, 3),

    arbitrum: getCommonNetworkConfig(eArbitrumNetwork.arbitrum, 42161),
    [eArbitrumNetwork.arbitrumTestnet]: getCommonNetworkConfig(
      eArbitrumNetwork.arbitrumTestnet,
      421611
    ),
    [eHarmonyNetwork.main]: getCommonNetworkConfig(
      eHarmonyNetwork.main,
      1666600000
    ),
    [eHarmonyNetwork.testnet]: getCommonNetworkConfig(
      eHarmonyNetwork.testnet,
      1666700000
    ),
    [eAvalancheNetwork.avalanche]: getCommonNetworkConfig(
      eAvalancheNetwork.avalanche,
      43114
    ),
    [eAvalancheNetwork.fuji]: getCommonNetworkConfig(
      eAvalancheNetwork.fuji,
      43113
    ),
    [eFantomNetwork.main]: getCommonNetworkConfig(eFantomNetwork.main, 250),
    [eFantomNetwork.testnet]: getCommonNetworkConfig(
      eFantomNetwork.testnet,
      4002
    ),
    [eOptimismNetwork.testnet]: getCommonNetworkConfig(
      eOptimismNetwork.testnet,
      420
    ),
    [eBSCNetwork.bsc]: getCommonNetworkConfig(eBSCNetwork.bsc, 56),
    [eOptimismNetwork.main]: getCommonNetworkConfig(eOptimismNetwork.main, 10),
    [eEthereumNetwork.goerli]: getCommonNetworkConfig(
      eEthereumNetwork.goerli,
      5
    ),
    [eEthereumNetwork.sepolia]: getCommonNetworkConfig(
      eEthereumNetwork.sepolia,
      11155111
    ),
    [eArbitrumNetwork.goerliNitro]: getCommonNetworkConfig(
      eArbitrumNetwork.goerliNitro,
      421613
    ),
  },
  namedAccounts: {
    ...DEFAULT_NAMED_ACCOUNTS,
  },
  mocha: {
    timeout: 0,
  },
  zksolc: {
    version: "1.3.13",
    settings: {
      libraries: {
        "@zerolendxyz/core-v3/contracts/protocol/libraries/logic/BridgeLogic.sol":
          {
            BridgeLogic: "0x6CDe8a8cEE9771A30dE4fEAB8eaccb58cb0d30aF",
          },
        "@zerolendxyz/core-v3/contracts/protocol/libraries/logic/ConfiguratorLogic.sol":
          {
            ConfiguratorLogic: "0x8731d4E5b990025143609F4A40eC80Fb482E46A0",
          },
        "@zerolendxyz/core-v3/contracts/protocol/libraries/logic/PoolLogic.sol":
          {
            PoolLogic: "0xA8D16FB0620E3376093cb89e2cD9dEF9fE47Daaa",
          },
        "@zerolendxyz/core-v3/contracts/protocol/libraries/logic/EModeLogic.sol":
          {
            EModeLogic: "0xD84E953a621bb9D81Dc998E0b1482D2916153c23",
          },
        "@zerolendxyz/core-v3/contracts/protocol/libraries/logic/LiquidationLogic.sol":
          {
            LiquidationLogic: "0x8855Fd7d577A05d04Cea2E026c5BAa4Bb47feAf9",
          },
        "@zerolendxyz/core-v3/contracts/protocol/libraries/logic/SupplyLogic.sol":
          {
            SupplyLogic: "0x9223dC9205Cf8336CA59bA0bD390647E62D487E5",
          },
        "@zerolendxyz/core-v3/contracts/protocol/libraries/logic/FlashLoanLogic.sol":
          {
            FlashLoanLogic: "0x424C0995114a614c12506D9A994d3eE140742f12",
          },
        "@zerolendxyz/core-v3/contracts/protocol/libraries/logic/BorrowLogic.sol":
          {
            BorrowLogic: "0x81D6b98Beb0A4288dCFab724FDeaE52E5Aa2F7b1",
          },
      },
    },
  },
  dependencyCompiler: {
    paths: [
      "@zerolendxyz/core-v3/contracts/mocks/helpers/MockIncentivesController.sol",
      "@zerolendxyz/core-v3/contracts/mocks/helpers/MockReserveConfiguration.sol",
      "@zerolendxyz/core-v3/contracts/mocks/oracle/CLAggregators/MockAggregator.sol",
      "@zerolendxyz/core-v3/contracts/mocks/tokens/MintableERC20.sol",
      "@zerolendxyz/core-v3/contracts/mocks/flashloan/MockFlashLoanReceiver.sol",
      "@zerolendxyz/core-v3/contracts/mocks/tokens/WETH9Mocked.sol",
      "@zerolendxyz/core-v3/contracts/mocks/upgradeability/MockVariableDebtToken.sol",
      "@zerolendxyz/core-v3/contracts/mocks/upgradeability/MockAToken.sol",
      "@zerolendxyz/core-v3/contracts/mocks/upgradeability/MockStableDebtToken.sol",
      "@zerolendxyz/core-v3/contracts/mocks/upgradeability/MockInitializableImplementation.sol",
      "@zerolendxyz/core-v3/contracts/protocol/configuration/PoolAddressesProviderRegistry.sol",
      "@zerolendxyz/core-v3/contracts/protocol/configuration/PoolAddressesProvider.sol",
      "@zerolendxyz/core-v3/contracts/misc/AaveOracle.sol",
      "@zerolendxyz/core-v3/contracts/protocol/tokenization/AToken.sol",
      "@zerolendxyz/core-v3/contracts/protocol/tokenization/DelegationAwareAToken.sol",
      "@zerolendxyz/core-v3/contracts/protocol/tokenization/StableDebtToken.sol",
      "@zerolendxyz/core-v3/contracts/protocol/tokenization/VariableDebtToken.sol",
      "@zerolendxyz/core-v3/contracts/protocol/libraries/logic/GenericLogic.sol",
      "@zerolendxyz/core-v3/contracts/protocol/libraries/logic/ValidationLogic.sol",
      "@zerolendxyz/core-v3/contracts/protocol/libraries/logic/ReserveLogic.sol",
      "@zerolendxyz/core-v3/contracts/protocol/libraries/logic/SupplyLogic.sol",
      "@zerolendxyz/core-v3/contracts/protocol/libraries/logic/EModeLogic.sol",
      "@zerolendxyz/core-v3/contracts/protocol/libraries/logic/BorrowLogic.sol",
      "@zerolendxyz/core-v3/contracts/protocol/libraries/logic/BridgeLogic.sol",
      "@zerolendxyz/core-v3/contracts/protocol/libraries/logic/FlashLoanLogic.sol",
      "@zerolendxyz/core-v3/contracts/protocol/libraries/logic/CalldataLogic.sol",
      "@zerolendxyz/core-v3/contracts/protocol/pool/Pool.sol",
      "@zerolendxyz/core-v3/contracts/protocol/pool/L2Pool.sol",
      "@zerolendxyz/core-v3/contracts/protocol/pool/PoolConfigurator.sol",
      "@zerolendxyz/core-v3/contracts/protocol/pool/DefaultReserveInterestRateStrategy.sol",
      "@zerolendxyz/core-v3/contracts/protocol/libraries/aave-upgradeability/InitializableImmutableAdminUpgradeabilityProxy.sol",
      "@zerolendxyz/core-v3/contracts/dependencies/openzeppelin/upgradeability/InitializableAdminUpgradeabilityProxy.sol",
      "@zerolendxyz/core-v3/contracts/deployments/ReservesSetupHelper.sol",
      "@zerolendxyz/core-v3/contracts/misc/AaveProtocolDataProvider.sol",
      "@zerolendxyz/core-v3/contracts/misc/L2Encoder.sol",
      "@zerolendxyz/core-v3/contracts/protocol/configuration/ACLManager.sol",
      "@zerolendxyz/core-v3/contracts/dependencies/weth/WETH9.sol",
      "@zerolendxyz/core-v3/contracts/dependencies/openzeppelin/contracts/IERC20Detailed.sol",
      "@zerolendxyz/core-v3/contracts/dependencies/openzeppelin/contracts/IERC20.sol",
      "@zerolendxyz/core-v3/contracts/mocks/oracle/PriceOracle.sol",
      "@zerolendxyz/core-v3/contracts/mocks/tokens/MintableDelegationERC20.sol",
      "@zerolendxyz/periphery-v3/contracts/misc/UiPoolDataProviderV3.sol",
      "@zerolendxyz/periphery-v3/contracts/misc/WalletBalanceProvider.sol",
      "@zerolendxyz/periphery-v3/contracts/misc/WrappedTokenGatewayV3.sol",
      "@zerolendxyz/periphery-v3/contracts/misc/interfaces/IWETH.sol",
      "@zerolendxyz/periphery-v3/contracts/misc/UiIncentiveDataProviderV3.sol",
      "@zerolendxyz/periphery-v3/contracts/rewards/RewardsController.sol",
      "@zerolendxyz/periphery-v3/contracts/rewards/transfer-strategies/StakedTokenTransferStrategy.sol",
      "@zerolendxyz/periphery-v3/contracts/rewards/transfer-strategies/PullRewardsTransferStrategy.sol",
      "@zerolendxyz/periphery-v3/contracts/rewards/EmissionManager.sol",
      "@zerolendxyz/periphery-v3/contracts/mocks/WETH9Mock.sol",
      "@zerolendxyz/periphery-v3/contracts/mocks/testnet-helpers/Faucet.sol",
      "@zerolendxyz/periphery-v3/contracts/mocks/testnet-helpers/TestnetERC20.sol",
      "@zerolendxyz/periphery-v3/contracts/treasury/Collector.sol",
      "@zerolendxyz/periphery-v3/contracts/treasury/CollectorController.sol",
      "@zerolendxyz/periphery-v3/contracts/treasury/AaveEcosystemReserveV2.sol",
      "@zerolendxyz/periphery-v3/contracts/treasury/AaveEcosystemReserveController.sol",
      "@zerolendxyz/periphery-v3/contracts/adapters/paraswap/ParaSwapLiquiditySwapAdapter.sol",
      "@zerolendxyz/periphery-v3/contracts/adapters/paraswap/ParaSwapRepayAdapter.sol",
    ],
  },
  deterministicDeployment: DETERMINISTIC_DEPLOYMENT
    ? DETERMINISTIC_FACTORIES
    : undefined,
  etherscan: {
    apiKey: ETHERSCAN_KEY,
  },
};
