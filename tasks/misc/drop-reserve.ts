import { getPoolConfiguratorProxy } from "../../helpers/contract-getters";
import { task } from "hardhat/config";
import { waitForTx } from "../../helpers/utilities/tx";

task(`drop-reserve`).setAction(async (_, hre) => {
  const configurator = await getPoolConfiguratorProxy();

  // await waitForTx(
  //   await configurator.dropReserve("0x5d83c0850570de35eaf5c9d6215bf2e8020f656b")
  // );

  const router = await hre.ethers.getContractAt(
    "PoolConfigurator",
    "0xB2CEF7f2eCF1f4f0154D129C6e111d81f68e6d03"
  );

  const token1 = await hre.ethers.getContractAt(
    "IERC20",
    "0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4"
  );
  const token2 = await hre.ethers.getContractAt(
    "IERC20",
    "0x90059C32Eeeb1A2aa1351a58860d98855f3655aD"
  );

  await waitForTx(
    await token1.approve(router.address, "51000000000000000000000000")
  );
  await waitForTx(
    await token2.approve(router.address, "51000000000000000000000000")
  );

  // console.log(
  //   "bal1",
  //   (
  //     await token1.balanceOf("0xb76F765A785eCa438e1d95f594490088aFAF9acc")
  //   ).toString()
  // );
  // console.log(
  //   "bal2",
  //   (
  //     await token2.balanceOf("0xb76F765A785eCa438e1d95f594490088aFAF9acc")
  //   ).toString()
  // );

  const tx = await router.addLiquidity(
    "0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4", // address tokenB,
    "0x90059C32Eeeb1A2aa1351a58860d98855f3655aD", // address tokenA,
    true, // bool stable,
    "500010375", // uint256 amountBDesired,
    "500000000000000000000", // uint256 amountADesired,
    0, // uint256 amountAMin,
    0, // uint256 amountBMin,
    "0xb76F765A785eCa438e1d95f594490088aFAF9acc", // address to,
    "10000000000000000" // uint256 deadline
  );
  console.log(tx.hash);
  // await waitForTx(
  //   await configurator.configureReserveAsCollateral(
  //     "0x5D83C0850570De35eAF5c9D6215BF2e8020f656B",
  //     "7000",
  //     "8000",
  //     "11000"
  //   )
  // );

  // await waitForTx(
  //   await configurator.setReserveBorrowing(
  //     "0xfd282f16a64c6d304ac05d1a58da15bed0467c71",
  //     false
  //   )
  // );

  // await waitForTx(
  //   await configurator.setSiloedBorrowing(
  //     "0xfd282f16a64c6d304ac05d1a58da15bed0467c71",
  //     true
  //   )
  // );

  // await waitForTx(
  //   await configurator.setDebtCeiling(
  //     "0xfd282f16a64c6d304ac05d1a58da15bed0467c71",
  //     500000
  //   )
  // );

  // const tx = await configurator.setDebtCeiling(
  //   "0x5D83C0850570De35eAF5c9D6215BF2e8020f656B",
  //   10000000
  // );

  return;
});
