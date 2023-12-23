import {
  getAToken,
  getPoolAddressesProvider,
  getStableDebtToken,
  getVariableDebtToken,
} from "../../helpers/contract-getters";
import { getAaveProtocolDataProvider } from "../../helpers/contract-getters";
import { task } from "hardhat/config";
import Bluebird from "bluebird";
import { FORK } from "../../helpers/hardhat-config-helpers";

interface ATokenConfig {
  revision: string;
  name: string;
  symbol: string;
  decimals: string;
  treasury: string;
  incentives: string;
  pool: string;
  underlying: string;
}

task(`review-atokens-detailed`).setAction(async () => {
  console.log("start review");

  const poolAddressesProvider = await getPoolAddressesProvider();

  const protocolDataProvider = await getAaveProtocolDataProvider(
    await poolAddressesProvider.getPoolDataProvider()
  );

  const reserves = await protocolDataProvider.getAllReservesTokens();
  console.log(`got ${reserves.length} reserves`);

  for (let x = 0; x < reserves.length; x++) {
    const [symbol, asset] = reserves[x];

    const { aTokenAddress, stableDebtTokenAddress, variableDebtTokenAddress } =
      await protocolDataProvider.getReserveTokensAddresses(asset);

    const varDebt = await getVariableDebtToken(variableDebtTokenAddress);
    const stable = await getStableDebtToken(stableDebtTokenAddress);
    const aToken = await getAToken(aTokenAddress);

    const config = await protocolDataProvider.getReserveConfigurationData(
      asset
    );

    console.log(`\n\nReserve: ${symbol} ${asset}`);

    console.log(`\nvariable debt details`);
    console.log(`details: ${await varDebt.symbol()} ${await varDebt.name()}`);
    console.log(`address: ${varDebt.address}`);
    console.log(`supply: ${await varDebt.totalSupply()}`);
    console.log(`revision: ${await varDebt.DEBT_TOKEN_REVISION()}`);
    console.log(`incentives: ${await varDebt.getIncentivesController()}`);
    console.log(`ltv: ${config.ltv}`);

    console.log(`\nstable debt details`);
    console.log(`details: ${await stable.symbol()} ${await stable.name()}`);
    console.log(`address: ${stable.address}`);
    console.log(`supply: ${await stable.totalSupply()}`);
    console.log(`revision: ${await stable.DEBT_TOKEN_REVISION()}`);
    console.log(`incentives: ${await stable.getIncentivesController()}`);
    console.log(`enabled: ${config.stableBorrowRateEnabled}`);

    if ((await stable.totalSupply()).gt(0)) {
      console.log("\x1b[31mthere is some stable debt!! \x1b[0m");

      if ((await stable.DEBT_TOKEN_REVISION()).lt(3)) {
        console.log("\x1b[31mdebt token out of date also!! \x1b[0m");
      }
    }

    console.log(`\natoken details`);
    console.log(`details: ${await aToken.symbol()} ${await aToken.name()}`);
    console.log(`address: ${aToken.address}`);
    console.log(`supply: ${await aToken.totalSupply()}`);
    console.log(`revision: ${await aToken.ATOKEN_REVISION()}`);
    console.log(`treasury: ${await aToken.RESERVE_TREASURY_ADDRESS()}`);
    console.log(`incentives: ${await aToken.getIncentivesController()}`);
    console.log(`collateral?: ${config.usageAsCollateralEnabled}`);
    console.log(`active: ${config.isActive}`);
    console.log(`borrowing: ${config.borrowingEnabled}`);
    console.log(`frozen: ${config.isFrozen}`);

    console.log(`\n\n=======`);
  }
});
