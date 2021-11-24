// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
import "hardhat/console.sol";

contract WavePortal is VRFConsumerBase {
    uint256 totalWaves;
    bytes32 internal keyHash;
    uint256 internal fee;
    uint256 public randomResult;

    event NewWave(address indexed from, string message, uint256 timestamp);

    struct Wave {
        address waver;
        string message;
        uint256 timestamp;
    }

    Wave[] waves;

    constructor()
        payable
        VRFConsumerBase(
            0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B,
            0x01BE23585060835E02B77ef475b0Cc51aA1e0709
        )
    {
        keyHash = 0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311;
        fee = 0.1 * 10**18;
    }

    function wave(string memory _message) public {
        totalWaves += 1;
        waves.push(Wave(msg.sender, _message, block.timestamp));
        getRandomNumber();

        console.log(randomResult);

        if (randomResult <= 50) {
            uint256 prizeAmount = 0.0001 ether;
            require(
                prizeAmount <= address(this).balance,
                "Trying to withdraw more money than the contract has."
            );
            (bool success, ) = (msg.sender).call{value: prizeAmount}("");
            require(success, "Failed to withdraw money from contract.");
        }

        emit NewWave(msg.sender, _message, block.timestamp);
    }

    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }

    function getTotalWaves() public view returns (uint256) {
        return totalWaves;
    }

    function getRandomNumber() public returns (bytes32 requestId) {
        require(
            LINK.balanceOf(address(this)) >= fee,
            "Not enough LINK - fill contract with faucet"
        );
        return requestRandomness(keyHash, fee);
    }

    /**
     * Callback function used by VRF Coordinator
     */
    function fulfillRandomness(
        bytes32, /* requestId */
        uint256 randomness
    ) internal override {
        randomResult = randomness;
    }
}
