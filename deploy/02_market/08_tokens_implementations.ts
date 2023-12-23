import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { COMMON_DEPLOY_PARAMS } from "../../helpers/env";
import {
  ATOKEN_IMPL_ID,
  DELEGATION_AWARE_ATOKEN_IMPL_ID,
  POOL_ADDRESSES_PROVIDER_ID,
  STABLE_DEBT_TOKEN_IMPL_ID,
  VARIABLE_DEBT_TOKEN_IMPL_ID,
} from "../../helpers/deploy-ids";
import {
  AToken,
  DelegationAwareAToken,
  PoolAddressesProvider,
  StableDebtToken,
  VariableDebtToken,
} from "../../typechain";
import { ZERO_ADDRESS } from "../../helpers/constants";
import { waitForTx } from "../../helpers";
import { MARKET_NAME } from "../../helpers/env";
import { deployOrLoad, getDeploymentAddress } from "../../helpers/zkdeploy";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const addressesProvider = await getDeploymentAddress(
    hre,
    POOL_ADDRESSES_PROVIDER_ID
  );

  const addressesProviderInstance = (await hre.ethers.getContractAt(
    "PoolAddressesProvider",
    addressesProvider
  )) as PoolAddressesProvider;

  const poolAddress = await addressesProviderInstance.getPool();

  const aToken = (await deployOrLoad(hre, ATOKEN_IMPL_ID, "AToken", [
    poolAddress,
  ])) as AToken;

  await waitForTx(
    await aToken.initialize(
      poolAddress, // initializingPool
      ZERO_ADDRESS, // treasury
      ZERO_ADDRESS, // underlyingAsset
      ZERO_ADDRESS, // incentivesController
      0, // aTokenDecimals
      "ATOKEN_IMPL", // aTokenName
      "ATOKEN_IMPL", // aTokenSymbol
      "0x00" // params
    )
  );

  const delegationAwareAToken = (await deployOrLoad(
    hre,
    DELEGATION_AWARE_ATOKEN_IMPL_ID,
    "DelegationAwareAToken",
    [poolAddress]
  )) as DelegationAwareAToken;

  await waitForTx(
    await delegationAwareAToken.initialize(
      poolAddress, // initializingPool
      ZERO_ADDRESS, // treasury
      ZERO_ADDRESS, // underlyingAsset
      ZERO_ADDRESS, // incentivesController
      0, // aTokenDecimals
      "DELEGATION_AWARE_ATOKEN_IMPL", // aTokenName
      "DELEGATION_AWARE_ATOKEN_IMPL", // aTokenSymbol
      "0x00" // params
    )
  );

  const stableDebtToken = (await deployOrLoad(
    hre,
    STABLE_DEBT_TOKEN_IMPL_ID,
    "StableDebtToken",
    [poolAddress]
  )) as StableDebtToken;

  await waitForTx(
    await stableDebtToken.initialize(
      poolAddress, // initializingPool
      ZERO_ADDRESS, // underlyingAsset
      ZERO_ADDRESS, // incentivesController
      0, // debtTokenDecimals
      "STABLE_DEBT_TOKEN_IMPL", // debtTokenName
      "STABLE_DEBT_TOKEN_IMPL", // debtTokenSymbol
      "0x00" // params
    )
  );

  const variableDebtToken = (await deployOrLoad(
    hre,
    VARIABLE_DEBT_TOKEN_IMPL_ID,
    "VariableDebtToken",
    [poolAddress]
  )) as VariableDebtToken;

  await waitForTx(
    await variableDebtToken.initialize(
      poolAddress, // initializingPool
      ZERO_ADDRESS, // underlyingAsset
      ZERO_ADDRESS, // incentivesController
      0, // debtTokenDecimals
      "VARIABLE_DEBT_TOKEN_IMPL", // debtTokenName
      "VARIABLE_DEBT_TOKEN_IMPL", // debtTokenSymbol
      "0x00" // params
    )
  );

  return true;
};

func.tags = ["market", "tokens"];

export default func;
