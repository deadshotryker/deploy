import { eBSCNetwork, IAaveConfiguration } from "./../../helpers/types";
import AaveMarket from "../aave";
import {
  strategyDAI,
  strategyUSDC,
  strategyWETH,
  strategyUSDT,
} from "../aave/reservesConfigs";

export const BscConfig: IAaveConfiguration = {
  ...AaveMarket,
  MarketId: "BSC",
  ATokenNamePrefix: "BSC",
  StableDebtTokenNamePrefix: "BSC",
  VariableDebtTokenNamePrefix: "BSC",
  SymbolPrefix: "b",
  ProviderId: 56,

  WrappedNativeTokenSymbol: "WBNB",
  ReservesConfig: {
    BUSD: strategyDAI,
    USDC: strategyDAI,
    WETH: strategyWETH,
    WBNB: strategyWETH,
    USDT: strategyDAI,
  },
  ReserveAssets: {
    [eBSCNetwork.bsc]: {
      BUSD: "0xe9e7cea3dedca5984780bafc599bd69add087d56",
      USDC: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
      WETH: "0x2170ed0880ac9a755fd29b2688956bd959f933f8",
      WBNB: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
      USDT: "0x55d398326f99059fF775485246999027B3197955",
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
    [eBSCNetwork.bsc]: {
      BUSD: "0xcBb98864Ef56E9042e7d2efef76141f15731B82f",
      USDC: "0x51597f405303C4377E36123cBc172b13269EA163",
      WETH: "0x9ef1B8c0E4F7dc8bF5719Ea496883DC6401d5b2e",
      WBNB: "0x0567F2323251f0Aab15c8dFb1967E4e8A7D42aeE",
      USDT: "0xB97Ad0E74fa7d920791E90258A6E2085088b4320",
    },
  },
};

export default BscConfig;
