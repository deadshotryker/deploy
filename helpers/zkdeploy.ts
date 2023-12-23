import * as fs from "fs";

import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import { Overrides, Wallet } from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";

export const deployWrapper = async (
  hre: HardhatRuntimeEnvironment,
  name: string,
  args?: any[],
  overrides?: Overrides,
  noVerify?: boolean
) => {
  const wallet = new Wallet(process.env.PRIVATE_KEY || "");

  const d = Deployer.fromEthWallet(hre, wallet);
  const artifact = await d.loadArtifact(name);
  const deployment = await d.deploy(artifact, args, overrides);

  console.log(
    `${deployment.address} -> tx hash: ${deployment.deployTransaction.hash}`
  );

  await deployment.deployTransaction.wait(1);

  // Verify contract programmatically
  if (!noVerify)
    await hre.run("verify:verify", {
      address: deployment.address,
      // contract: name,
      constructorArguments: args,
      // bytecode: artifact.bytecode,
    });

  return deployment;
};

export const getZKArtifact = async (
  hre: HardhatRuntimeEnvironment,
  name: string
) => {
  const wallet = new Wallet(process.env.PRIVATE_KEY || "");

  const d = Deployer.fromEthWallet(hre, wallet);
  return await d.loadArtifact(name);
};

export const save = (
  network: string,
  key: string,
  contract: string,
  address: string,
  verified: boolean = false,
  args: any[] = []
) => {
  if (network === "hardhat") return;
  const filename = `./deployments/${network}.json`;

  let out: any = {};
  if (fs.existsSync(filename)) {
    const data = fs.readFileSync(filename).toString();
    out = data === "" ? {} : JSON.parse(data);
  }

  out[key] = {
    contract,
    verified,
    address,
    args,
  };

  fs.writeFileSync(filename, JSON.stringify(out, null, 2));
  console.log(`saved ${key}:${address} into ${network}.json`);
};

export const getDeploymentAddress = (
  hre: HardhatRuntimeEnvironment,
  key: string
) => {
  const outputFile = load(hre.network.name);
  if (!outputFile[key]) return;
  return outputFile[key].address;
};

export const getDeploymentContract = (
  hre: HardhatRuntimeEnvironment,
  key: string
) => {
  const outputFile = load(hre.network.name);
  if (!outputFile[key]) return;
  return outputFile[key].contract;
};

export const load = (network: string) => {
  const filename = `./deployments/${network}.json`;

  let out: any = {};
  if (fs.existsSync(filename)) {
    const data = fs.readFileSync(filename).toString();
    out = data === "" ? {} : JSON.parse(data);
  }

  return out;
};

export const getAllDeploymentsZK = async (hre: HardhatRuntimeEnvironment) => {
  const filename = `./deployments/${hre.network.name}.json`;

  let out: any = {};
  if (fs.existsSync(filename)) {
    const data = fs.readFileSync(filename).toString();
    out = data === "" ? {} : JSON.parse(data);
    return Object.keys(out);
  }

  return [];
};

export const deployOrLoad = async (
  hre: HardhatRuntimeEnvironment,
  key: string,
  contractName: string,
  args: any[] = [],
  noVerify = false,
  skipSave = false
) => {
  const addr = await getDeploymentAddress(hre, key);
  if (addr && !skipSave) {
    console.log(`using ${key} at ${addr}`);
    return await hre.ethers.getContractAt(contractName, addr);
  }

  const { provider } = hre.ethers;
  const estimateGasPrice = await provider.getGasPrice();
  const gasPrice = estimateGasPrice.mul(5).div(4);

  console.log(
    `\ndeploying ${key} at ${hre.ethers.utils.formatUnits(
      gasPrice,
      `gwei`
    )} gwei`
  );

  const instance = await deployWrapper(
    hre,
    contractName,
    args,
    { gasPrice },
    noVerify
  );
  await instance.deployed();

  if (!skipSave)
    await save(
      hre.network.name,
      key,
      contractName,
      instance.address,
      false,
      args
    );

  return instance;
};
