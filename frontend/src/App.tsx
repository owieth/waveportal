import React, { useEffect, useState } from "react";
import Web3 from "web3";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import WavePortal from "./artifacts/contracts/WavePortal.sol/WavePortal.json";
import "./App.css";

const App = () => {
  type Wave = {
    address: string;
    timestamp: Date;
    message: string;
  };

  type WaveStruct = {
    waver: string;
    message: string;
    timestamp: Date;
  };

  const [currentAccount, setCurrentAccount] = useState("");
  const [allWaves, setAllWaves] = useState([]);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const providerOptions = {
    /* See Provider Options Section */
  };

  const web3Modal = new Web3Modal({
    network: "mainnet", // optional
    //cacheProvider: true, // optional
    providerOptions, // required
  });

  const connectWallet = async () => {
    const provider = await web3Modal.connect();
    const web3 = new Web3(provider);

    const accounts = await web3.eth.getAccounts();

    if (accounts.length !== 0) {
      console.log(accounts[0]);
      setCurrentAccount(accounts[0]);
    } else {
      console.log("No authorized account found");
    }
  };

  const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        const wavePortalContract = new ethers.Contract(
          contractAddress,
          WavePortal.abi,
          signer
        );

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        /*
         * Execute the actual wave from your smart contract
         */
        const waveTxn = await wavePortalContract.wave("this is a message");
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAllWaves = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          WavePortal.abi,
          signer
        );

        /*
         * Call the getAllWaves method from your Smart Contract
         */
        const waves = await wavePortalContract.getAllWaves();

        /*
         * We only need address, timestamp, and message in our UI so let's
         * pick those out
         */
        let wavesCleaned: Wave[] = [];
        waves.forEach((wave: WaveStruct) => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp.getDate() * 1000),
            message: wave.message,
          });
        });

        /*
         * Store our data in React State
         */
        setAllWaves(wavesCleaned as any);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    connectWallet();
  }, []);

  return (
    <div>
      <header></header>
      <div className="mainContainer">
        <div className="dataContainer">
          <div className="header">
            <div className="form">👋 Hey there!</div>
          </div>

          <button className="waveButton" onClick={wave}>
            Wave at Me
          </button>

          {!currentAccount && (
            <button className="waveButton" onClick={connectWallet}>
              Connect Wallet
            </button>
          )}

          {allWaves.map((wave: Wave, index: number) => {
            return (
              <div
                key={index}
                style={{
                  backgroundColor: "OldLace",
                  marginTop: "16px",
                  padding: "8px",
                }}
              >
                <div>Address: {wave.address}</div>
                <div>Time: {wave.timestamp.toString()}</div>
                <div>Message: {wave.message}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default App;
