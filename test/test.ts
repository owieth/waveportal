import { ethers } from "hardhat";
import { expect } from "chai";

describe("WavePortal", function () {
  it("Should get Initialstate of Waves and then update", async function () {
    const waveContractFactory = await ethers.getContractFactory('WavePortal');
    const waveContract = await waveContractFactory.deploy({
      value: ethers.utils.parseEther('1'),
    });
    await waveContract.deployed();
    console.log('Contract deployed:', waveContract.address);

    let contractBalance = await ethers.provider.getBalance(
      waveContract.address
    );
    console.log(
      'Contract balance:',
      ethers.utils.formatEther(contractBalance)
    );

    let waveTxn = await waveContract.wave('A message!');
    await waveTxn.wait();

    contractBalance = await ethers.provider.getBalance(waveContract.address);
    console.log(
      'Contract balance:',
      ethers.utils.formatEther(contractBalance)
    );

    let allWaves = await waveContract.getAllWaves();

    expect(allWaves.length).to.greaterThan(0);
  });
});
