import { rateStrategyVolatileOne } from "./../aave/rateStrategies";
import { eContractid, IReserveParams } from "../../helpers/types";
import { rateStrategyStableOne } from "../test/rateStrategies";

export const strategyStableLP: IReserveParams = {
  strategy: rateStrategyStableOne,
  baseLTVAsCollateral: "0",
  liquidationThreshold: "4500",
  liquidationBonus: "11000",
  liquidationProtocolFee: "1000",
  borrowingEnabled: false,
  stableBorrowRateEnabled: false,
  flashLoanEnabled: false,
  reserveDecimals: "18",
  aTokenImpl: eContractid.AToken,
  reserveFactor: "2000",
  supplyCap: "0",
  borrowCap: "0",
  debtCeiling: "0",
  borrowableIsolation: true,
};

export const strategyPEPE: IReserveParams = {
  strategy: rateStrategyVolatileOne,
  baseLTVAsCollateral: "2000",
  liquidationThreshold: "4500",
  liquidationBonus: "11000",
  liquidationProtocolFee: "1000",
  borrowingEnabled: true,
  stableBorrowRateEnabled: false,
  flashLoanEnabled: true,
  reserveDecimals: "18",
  aTokenImpl: eContractid.AToken,
  reserveFactor: "2000",
  supplyCap: "0",
  borrowCap: "0",
  debtCeiling: "0",
  borrowableIsolation: false,
};

export const strategyLSD: IReserveParams = {
  strategy: rateStrategyVolatileOne,
  baseLTVAsCollateral: "6000",
  liquidationThreshold: "7500",
  liquidationBonus: "11000",
  liquidationProtocolFee: "1000",
  borrowingEnabled: true,
  stableBorrowRateEnabled: false,
  flashLoanEnabled: true,
  reserveDecimals: "18",
  aTokenImpl: eContractid.AToken,
  reserveFactor: "1000",
  supplyCap: "0",
  borrowCap: "0",
  debtCeiling: "1000000",
  borrowableIsolation: true,
};
