import { task } from "hardhat/config";
import {
  getAllDeploymentsZK,
  getZKArtifact,
  load,
  save,
} from "../../helpers/zkdeploy";
import Bluebird from "bluebird";

task(`verify-contracts-zk`).setAction(async (_, hre) => {
  const deployments = await getAllDeploymentsZK(hre);

  const deployment = await load(hre.network.name);
  await Bluebird.mapSeries(deployments, async (id) => {
    console.log("verifying", id);
    const inst = deployment[id];

    if (inst.verified) return;
    const artifact = await getZKArtifact(hre, inst.contract);

    // console.log(JSON.stringify(artifact.bytecode));

    await hre.run("verify:verify", {
      address: inst.address,
      // contract: inst.contract,
      constructorArguments: inst.args,
      // bytecode: artifact.bytecode,
    });

    await save(
      hre.network.name,
      id,
      inst.contract,
      inst.address,
      true,
      inst.args
    );
  });
});
