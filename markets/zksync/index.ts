import {
  AssetType,
  eZkSyncNetwork,
  IAaveConfiguration,
  TransferStrategy,
} from "../../helpers/types";
import AaveMarket from "../aave";
import {
  strategyUSDC,
  strategyWETH,
  strategyUSDT,
  strategyDAI,
  strategyWBTC,
} from "../aave/reservesConfigs";

export const zkConfig: IAaveConfiguration = {
  ...AaveMarket,
  MarketId: "zkSync",
  ATokenNamePrefix: "zK",
  StableDebtTokenNamePrefix: "zK",
  VariableDebtTokenNamePrefix: "zK",
  SymbolPrefix: "z0",
  ProviderId: 280,
  WrappedNativeTokenSymbol: "WETH",
  ReservesConfig: {
    USDC: strategyUSDC,
    WETH: strategyWETH,
    USDT: strategyUSDT,
    LUSD: strategyDAI,
    WBTC: strategyWBTC,
  },
  ReserveAssets: {
    [eZkSyncNetwork.zkGoerli]: {
      // USDC: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
      WETH: "0x2170ed0880ac9a755fd29b2688956bd959f933f8",
      // USDT: "0x55d398326f99059fF775485246999027B3197955",
    },
    [eZkSyncNetwork.zkEra]: {
      USDC: "0x3355df6d4c9c3035724fd0e3914de96a5a83aaf4",
      WETH: "0x5AEa5775959fBC2557Cc8789bC1bf90A239D9a91",
      USDT: "0x493257fd37edb34451f62edf8d2a0c418852ba4c",
      LUSD: "0x503234f203fc7eb888eec8513210612a43cf6115",
      WBTC: "0xbbeb516fb02a01611cbbe0453fe3c580d7281011",
    },
  },
  IncentivesConfig: {
    enabled: {
      [eZkSyncNetwork.zkEra]: true,
      [eZkSyncNetwork.zkGoerli]: true,
    },
    rewards: {
      [eZkSyncNetwork.zkEra]: {
        WETH: "0x5AEa5775959fBC2557Cc8789bC1bf90A239D9a91",
      },
      [eZkSyncNetwork.zkGoerli]: {
        WETH: "0x2170ed0880ac9a755fd29b2688956bd959f933f8",
      },
    },
    rewardsOracle: {
      [eZkSyncNetwork.zkEra]: {
        WETH: "0x517F9cd13fE63e698d0466ad854cDba5592eeA73",
      },
    },
    incentivesInput: {
      [eZkSyncNetwork.zkEra]: [
        {
          emissionPerSecond: "34629756533",
          duration: 86400 * 365,
          asset: "WETH",
          assetType: AssetType.AToken,
          reward: "WETH",
          rewardOracle: "0x517F9cd13fE63e698d0466ad854cDba5592eeA73",
          transferStrategy: TransferStrategy.PullRewardsStrategy,
          transferStrategyParams: "0",
        },
      ],
    },
  },
  EModes: {
    StableEMode: {
      id: "1",
      ltv: "9700",
      liquidationThreshold: "9750",
      liquidationBonus: "10100",
      label: "Stablecoins",
      assets: ["USDC", "USDT", "BUSD"],
    },
  },
  ChainlinkAggregator: {
    [eZkSyncNetwork.zkGoerli]: {
      USDC: "0x69e657c4a7a39C73aE35F5d962d4aa42f2F159Cb",
      WETH: "0x36A542F6dEB68381646BF52024a888AEa3345546",
      USDT: "0x6387e52851D0015D45b12d2bA02B4D98cB842074",
    },
    [eZkSyncNetwork.zkEra]: {
      // rETH: "",
      cbETH: "0x3D5BcB12800A092FC85Ca00837594146F274C273",
      BUSD: "0x1a963D0C6bF364C1C8AE4F17b6aB773c627cEFB7",

      USDC: "0x75D018f04f9cb37936530F7e3A909474565A2467",
      WETH: "0x517F9cd13fE63e698d0466ad854cDba5592eeA73",
      USDT: "0xCf58E8e67F2BcDd977e61bB6FDC1B0EEd6E1939d",
      LUSD: "0xCf58E8e67F2BcDd977e61bB6FDC1B0EEd6E1939d",
      WBTC: "0xe99FFA17f20F3f8022862d1BD13519D305eF1377",
    },
  },
};

export default zkConfig;
