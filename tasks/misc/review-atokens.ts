import {
  getAToken,
  getPoolAddressesProvider,
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

task(`review-atokens`)
  .addFlag("log")
  .setAction(async ({ log }, { deployments, getNamedAccounts, ...hre }) => {
    console.log("start review");
    const network = FORK ? FORK : hre.network.name;

    const poolAddressesProvider = await getPoolAddressesProvider();

    const protocolDataProvider = await getAaveProtocolDataProvider(
      await poolAddressesProvider.getPoolDataProvider()
    );

    const reserves = await protocolDataProvider.getAllReservesTokens();

    console.log(`got ${reserves.length} reserves`);

    const ATokenConfigs: { [key: string]: ATokenConfig } = {};

    for (let x = 0; x < reserves.length; x++) {
      const [symbol, asset] = reserves[x];
      console.log(`working on ${symbol} ${asset}`);

      const {
        aTokenAddress,
        stableDebtTokenAddress,
        variableDebtTokenAddress,
      } = await protocolDataProvider.getReserveTokensAddresses(asset);

      const aToken = await getAToken(asset);
      const config = {
        name: await aToken.name(),
        version: await aToken.ATOKEN_REVISION(),
        symbol: await aToken.symbol(),
        decimals: (await aToken.decimals()).toString(),
        revision: (await aToken.ATOKEN_REVISION()).toString(),
        treasury: await aToken.RESERVE_TREASURY_ADDRESS(),
        incentives: await aToken.getIncentivesController(),
        underlying: await aToken.UNDERLYING_ASSET_ADDRESS(),
        pool: await aToken.POOL(),
      };

      console.log(config);
      console.log(`finished with ${symbol} ${asset}`);
    }
    if (log) {
      console.log("ATokens Config:");
      console.table(ATokenConfigs);
    }
    return ATokenConfigs;
  });
