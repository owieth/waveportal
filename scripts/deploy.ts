import hre from "hardhat";
import { ethers } from 'ethers';

async function main(): Promise<void> {
  const [deployer] = await hre.ethers.getSigners();
  const accountBalance = await deployer.getBalance();

  console.log('Deploying contracts with account: ', deployer.address);
  console.log('Account balance: ', accountBalance.toString());

  // We get the contract to deploy
  const WavePortal = await hre.ethers.getContractFactory("WavePortal");
  const wavePortal = await WavePortal.deploy({
    value: ethers.utils.parseEther('0.01'),
  });

  await wavePortal.deployed();

  console.log("WavePortal deployed to:", wavePortal.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
