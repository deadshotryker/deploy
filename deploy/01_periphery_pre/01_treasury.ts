import { POOL_ADMIN } from "./../../helpers/constants";
import { getProxyImplementationBySlot } from "./../../helpers/utilities/tx";
import { getFirstSigner } from "./../../helpers/utilities/signer";
import { eNetwork } from "./../../helpers/types";
import { MARKET_NAME } from "./../../helpers/env";
import {
  loadPoolConfig,
  getParamPerNetwork,
  isTestnetMarket,
} from "./../../helpers/market-config-helpers";
import { ZERO_ADDRESS } from "../../helpers/constants";
import {
  TREASURY_CONTROLLER_ID,
  TREASURY_IMPL_ID,
} from "../../helpers/deploy-ids";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { COMMON_DEPLOY_PARAMS } from "../../helpers/env";
import { TREASURY_PROXY_ID } from "../../helpers/deploy-ids";
import {
  InitializableAdminUpgradeabilityProxy,
  waitForTx,
} from "../../helpers";
import {
  AaveEcosystemReserveController__factory,
  AaveEcosystemReserveV2,
  AaveEcosystemReserveV2__factory,
  InitializableAdminUpgradeabilityProxy__factory,
} from "../../typechain";
import { getAddress } from "ethers/lib/utils";
import { deployOrLoad, getDeploymentAddress } from "../../helpers/zkdeploy";

/**
 * @notice A treasury proxy can be deployed per network or per market.
 * You need to take care to upgrade this proxy to the desired implementation.
 */

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { ReserveFactorTreasuryAddress } = await loadPoolConfig(MARKET_NAME);

  const network = (process.env.FORK || hre.network.name) as eNetwork;
  const treasuryAddress = getParamPerNetwork(
    ReserveFactorTreasuryAddress,
    network
  );
  let treasuryOwner = POOL_ADMIN[network];

  if (isTestnetMarket(await loadPoolConfig(MARKET_NAME))) {
    treasuryOwner = deployer;
  }

  // Deploy Treasury proxy
  const proxy = (await deployOrLoad(
    hre,
    TREASURY_PROXY_ID,
    "InitializableAdminUpgradeabilityProxy",
    []
  )) as InitializableAdminUpgradeabilityProxy;

  // Deploy Treasury Controller
  const treasuryController = await deployOrLoad(
    hre,
    TREASURY_CONTROLLER_ID,
    "AaveEcosystemReserveController",
    [treasuryOwner]
  );

  // Deploy Treasury implementation and initialize proxy
  const treasuryImpl = (await deployOrLoad(
    hre,
    TREASURY_IMPL_ID,
    "AaveEcosystemReserveV2",
    []
  )) as AaveEcosystemReserveV2;

  // Call to initialize at implementation contract to prevent other calls.
  await waitForTx(await treasuryImpl.initialize(ZERO_ADDRESS));

  const initializePayload = treasuryImpl.interface.encodeFunctionData(
    "initialize",
    [treasuryController.address]
  );

  await waitForTx(
    await proxy["initialize(address,address,bytes)"](
      treasuryImpl.address,
      treasuryOwner,
      initializePayload
    )
  );

  return true;
};

func.tags = ["periphery-pre", "TreasuryProxy"];
func.dependencies = [];
func.id = "Treasury";

export default func;
