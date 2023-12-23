import { task } from "hardhat/config";
import { getACLManager, getEmissionManager, waitForTx } from "../../helpers";
import { RewardsDataTypes } from "../../typechain/@zerolendxyz/periphery-v3/contracts/rewards/RewardsController";
import { BigNumber } from "ethers";

task(`setup-incentives`, `Setup the incentives`).setAction(async (_, hre) => {
  if (!hre.network.config.chainId) {
    throw new Error("INVALID_CHAIN_ID");
  }

  const emissionManager = await getEmissionManager();

  const earlyZERO = "0x9793eac2fECef55248efA039BEC78e82aC01CB2f";

  const e18 = BigNumber.from(10).pow(18);

  const earlyZERORewards = [
    // {
    //   // SWORD
    //   asset: "0xDB87A5493e308Ee0DEb24C822a559bee52460AFC",
    //   rewardsPerSecond: 1,
    // },
    // {
    //   // VC
    //   asset: "0x1f2dA4FF84d46B12f8931766D6D728a806B410d6",
    //   rewardsPerSecond: 2,
    // },
    // {
    //   // Mute
    //   asset: "0xc3b6D357e0BeADb18A23a53E1dc4839C2D15bdC2",
    //   rewardsPerSecond: 3,    // },
    {
      // aDAI
      asset: "0x15b362768465F966F1E5983b7AE87f4C5Bf75C55",
      rewardsPerSecond: 10,
    },
    {
      // aBUSD
      asset: "0xb727F8e11bc417c90D4DcaF82EdA06cf590533B5",
      rewardsPerSecond: 0,
    },
    {
      // aUSDC
      asset: "0x016341e6Da8da66b33Fd32189328c102f32Da7CC",
      rewardsPerSecond: 102,
    },

    {
      // aBTC var debt
      asset: "0xaBd3C4E4AC6e0d81FCfa5C41a76e9583a8f81909",
      rewardsPerSecond: 10,
    },
    {
      // aUSDC var debt
      asset: "0xE60E1953aF56Db378184997cab20731d17c65004",
      rewardsPerSecond: 60,
    },
    {
      // aWETH
      asset: "0x9002ecb8a06060e3b56669c6B8F18E1c3b119914",
      rewardsPerSecond: 122,
    },
    {
      // aWETH var debt
      asset: "0x56f58d9BE10929CdA709c4134eF7343D73B080Cf",
      rewardsPerSecond: 40,
    },
    {
      // aUSDT
      asset: "0x9ca4806fa54984Bf5dA4E280b7AA8bB821D21505",
      rewardsPerSecond: 51,
    },
    {
      // aUSDT var debt
      asset: "0xa333c6FF89525939271E796FbDe2a2D9A970F831",
      rewardsPerSecond: 34,
    },
    // {
    //   // aPEPE
    //   asset: "0x54330D2333AdBF715eB449AAd38153378601cf67",
    //   rewardsPerSecond: 0,
    // },
    {
      // aBTC
      asset: "0x7c65E6eC6fECeb333092e6FE69672a3475C591fB",
      rewardsPerSecond: 13,
    },
    {
      // aLUSD
      asset: "0xd97Ac0ce99329EE19b97d03E099eB42D7Aa19ddB",
      rewardsPerSecond: 0,
    },
    {
      // aLUSD var debt
      asset: "0x41c618CCE58Fb27cAF4EEb1dd25de1d03A0DAAc6",
      rewardsPerSecond: 4,
    },
    {
      // aDAI var debt
      asset: "0x0325F21eB0A16802E2bACD931964434929985548",
      rewardsPerSecond: 40,
    },
    {
      // aBUSD var debt
      asset: "0x3E1F1812c2a4f356d1b4FB5Ff7cca5B2ac653b94",
      rewardsPerSecond: 0,
    },
  ];

  const wethRewards = [
    {
      // aBUSD
      asset: "0xb727F8e11bc417c90D4DcaF82EdA06cf590533B5",
      rewardsPerSecond18: "0",
    },
    {
      // aDAI
      asset: "0x15b362768465F966F1E5983b7AE87f4C5Bf75C55",
      rewardsPerSecond18: "38051750380",
    },
  ];

  const earlyZEROs: RewardsDataTypes.RewardsConfigInputStruct[] =
    earlyZERORewards.map((r) => ({
      emissionPerSecond: e18.mul(r.rewardsPerSecond).toString(), // emissionPerSecond: PromiseOrValue<BigNumberish>; 500 maha a month
      totalSupply: "0", // totalSupply: PromiseOrValue<BigNumberish>;
      distributionEnd: "1712490051", // distributionEnd: PromiseOrValue<BigNumberish>;
      asset: r.asset, // asset: PromiseOrValue<string>;
      reward: earlyZERO, // reward: PromiseOrValue<string>;
      transferStrategy: "0xc0FCEa0B31c79f70b5453A9C70E361FcaCcB43A2", // transferStrategy: PromiseOrValue<string>;
      rewardOracle: "0x1bB24651CF854D44bA33A32dE09D595Da4faa8D1", // rewardOracle: PromiseOrValue<string>;
    }));

  const weths: RewardsDataTypes.RewardsConfigInputStruct[] = wethRewards.map(
    (r) => ({
      emissionPerSecond: r.rewardsPerSecond18.toString(), // emissionPerSecond: PromiseOrValue<BigNumberish>; 500 maha a month
      totalSupply: "0", // totalSupply: PromiseOrValue<BigNumberish>;
      distributionEnd: "1712490051", // distributionEnd: PromiseOrValue<BigNumberish>;
      asset: r.asset, // asset: PromiseOrValue<string>;
      reward: "0x5AEa5775959fBC2557Cc8789bC1bf90A239D9a91", // reward: PromiseOrValue<string>;
      transferStrategy: "0xc0FCEa0B31c79f70b5453A9C70E361FcaCcB43A2", // transferStrategy: PromiseOrValue<string>;
      rewardOracle: "0x517F9cd13fE63e698d0466ad854cDba5592eeA73", // rewardOracle: PromiseOrValue<string>;
    })
  );

  // const weth = await hre.ethers.getContractAt(
  //   "@zerolendxyz/core-v3/contracts/misc/interfaces/IWETH.sol:IWETH",
  //   "0x9793eac2fECef55248efA039BEC78e82aC01CB2f"
  // );
  // // const tx1 = await weth.deposit({ value: "200000000000000000" });
  // // console.log(tx1.hash);

  // const tx2 = await weth.approve(
  //   "0xc0FCEa0B31c79f70b5453A9C70E361FcaCcB43A2",
  //   "100000000000000000000000000000000000000000000000"
  // );
  // console.log(tx2.hash);

  // console.log(earlyZEROs);
  // console.log(weths);
  await waitForTx(
    await emissionManager.configureAssets([...earlyZEROs, ...weths])
  );

  // console.log("PullRewardsTransferStrategy deployed at:", artifact.address);
  console.log(`\tFinished deployment`);
});
