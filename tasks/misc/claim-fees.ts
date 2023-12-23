import { task } from "hardhat/config";
import { waitForTx } from "../../helpers/utilities/tx";

task(`claim-fees`).setAction(async (_, hre) => {
  const pool = await hre.ethers.getContractAt(
    "Pool",
    "0x4d9429246EA989C9CeE203B43F6d1C7D83e3B8F8"
  );

  const reserves = await pool.getReservesList();
  await waitForTx(await pool.mintToTreasury(reserves));
});
