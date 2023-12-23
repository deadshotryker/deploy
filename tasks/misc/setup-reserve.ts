import {
  getACLManager,
  getAaveOracle,
  getPoolConfiguratorProxy,
} from "../../helpers/contract-getters";
import { task } from "hardhat/config";
import { waitForTx } from "../../helpers/utilities/tx";
import { getDeploymentAddress } from "../../helpers/zkdeploy";
import { ZERO_ADDRESS } from "../../helpers";

task(`setup-reserve`).setAction(async (_, hre) => {
  const configurator = await getPoolConfiguratorProxy();
  const aclManager = await getACLManager(
    "0x9A60cce3da06d246b492931d2943A8F574e67389"
  );

  const oracleP = await hre.ethers.getContractAt(
    "AaveOracle",
    "0x785765De3E9ac3D8eEb42B4724A7FEA8990142B8"
  );

  const symbol = "DAI";
  const name = "Dai Stablecoin";
  const address = "0x0e97c7a0f8b2c9885c8ac9fc6136e829cbc21d42";
  const oracle = "0xf531672C92Ad4658c54B4fBE855029Df43c57390";
  const deployer = "0xb76F765A785eCa438e1d95f594490088aFAF9acc";

  const get = async (what: string) => await getDeploymentAddress(hre, what);

  const config = {
    aTokenImpl: await get("AToken-zkSync"),
    aTokenName: `ZeroLend ${name}`,
    aTokenSymbol: `z0${symbol}`,
    incentivesController: await get("IncentivesProxy"),
    interestRateStrategyAddress: await get(
      "ReserveStrategy-rateStrategyStableOne"
    ),
    params: "0x10",
    stableDebtTokenImpl: await get("StableDebtToken-zkSync"),
    stableDebtTokenName: `ZeroLend zk Stable Debt ${symbol}`,
    stableDebtTokenSymbol: `stableDebtz0${symbol}`,
    treasury: await get("TreasuryProxy"),
    underlyingAsset: address,
    underlyingAssetDecimals: 18,
    variableDebtTokenImpl: await get("VariableDebtToken-zkSync"),
    variableDebtTokenName: `ZeroLend zk Variable Debt ${symbol}`,
    variableDebtTokenSymbol: `variableDebtz0${symbol}`,
  };

  // console.log("config", config);

  // await waitForTx(await oracleP.setAssetSources([address], [oracle]));

  // await waitForTx(
  //   await configurator.setReserveFreeze(
  //     "0xfd282f16a64c6d304ac05d1a58da15bed0467c71",
  //     true
  //   )
  // );
  // await waitForTx(await atokne.setIncentivesController(ZERO_ADDRESS));
  // await waitForTx(await configurator.setDebtCeiling(address, "3000000"));
  // await waitForTx(await configurator.setReservePause(address, false));

  // await waitForTx(await configurator.dropReserve(address));

  // await waitForTx(
  //   await configurator.initReserves([
  //     {
  //       aTokenImpl: config.aTokenImpl,
  //       aTokenName: config.aTokenName,
  //       aTokenSymbol: config.aTokenSymbol,
  //       incentivesController: config.incentivesController,
  //       interestRateStrategyAddress: config.interestRateStrategyAddress,
  //       params: config.params,
  //       stableDebtTokenImpl: config.stableDebtTokenImpl,
  //       stableDebtTokenName: config.stableDebtTokenName,
  //       stableDebtTokenSymbol: config.stableDebtTokenSymbol,
  //       treasury: config.treasury,
  //       underlyingAsset: config.underlyingAsset,
  //       underlyingAssetDecimals: config.underlyingAssetDecimals,
  //       variableDebtTokenImpl: config.variableDebtTokenImpl,
  //       variableDebtTokenName: config.variableDebtTokenName,
  //       variableDebtTokenSymbol: config.variableDebtTokenSymbol,
  //     },
  //   ])
  // );

  // await waitForTx(await configurator.setReserveBorrowing(address, true));
  // await waitForTx(await configurator.setBorrowableInIsolation(address, true));
  // await waitForTx(
  //   await configurator.configureReserveAsCollateral(address, 7500, 8000, 10500)
  // );

  // await waitForTx(await configurator.setSupplyCap(address, "0"));
  // USDC: "0x75D018f04f9cb37936530F7e3A909474565A2467",
  //     WETH: "0x517F9cd13fE63e698d0466ad854cDba5592eeA73",
  //     USDT: "0xCf58E8e67F2BcDd977e61bB6FDC1B0EEd6E1939d",
  //     LUSD: "0xCf58E8e67F2BcDd977e61bB6FDC1B0EEd6E1939d",

  // await waitForTx(
  //   await configurator.updateStableDebtToken({
  //     asset: "0x493257fd37edb34451f62edf8d2a0c418852ba4c",
  //     incentivesController: "0x54AB34aB3C723bD2674c7082aA6fFcdfd3A5BEdc",
  //     name: "ZeroLend zK Stable Debt USDT",
  //     symbol: "stableDebtz0USDT",
  //     implementation: "0xa04222CCB20E8B6CC2A45856e7f6eF14995BBDB9",
  //     params: "0x",
  //   })
  // );

  // await waitForTx(
  //   await configurator.setReserveStableRateBorrowing(
  //     "0x90059c32eeeb1a2aa1351a58860d98855f3655ad",
  //     false
  //   )
  // );

  await waitForTx(
    await configurator.setAssetEModeCategory(
      "0x2039bb4116b4efc145ec4f0e2ea75012d6c0f181",
      0
    )
  );

  await waitForTx(
    await configurator.configureReserveAsCollateral(
      "0x2039bb4116b4efc145ec4f0e2ea75012d6c0f181",
      0,
      8000,
      10500
    )
  );

  // await waitForTx(
  //   await aclManager.renounceRole(await aclManager.POOL_ADMIN_ROLE(), deployer)
  // );
  // await waitForTx(await configurator.dropReserve(address));

  // await waitForTx(
  //   await configurator.setBorrowableInIsolation(
  //     "0x493257fd37edb34451f62edf8d2a0c418852ba4c",
  //     true
  //   )
  // );
  // liquidationThreshold: "7500",
  // liquidationBonus: "11000",
  // liquidationProtocolFee: "1000",
  // await waitForTx
});
