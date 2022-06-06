/* This Script is used to deploy Raffle.sol contract into a TESTNET
     Deploy: 'yarn hardhat deploy --network rinkeby'
    or 'npx hardhat deploy --network rinkeby' */

const { ethers, network } = require("hardhat")

// Parameters for VRFCoordinator
const ENTRANCE_FEE = ethers.utils.parseEther("0.1"); // fee for Raffle participation
const INTERVAL = 300; // interval to pick a winner (in seconds)
const VRF_CoordinatorAddress = "0x6168499c0cFfCaCD319c818142124B7A15E857ab";
const gasLane = "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc";
const subscriptionId = "3595";
const callbackGasLimit = "500000";

module.exports = async({getNamedAccounts, deployments}) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    
    // We need the Contract's arguments for deploy
    const args = [ENTRANCE_FEE, INTERVAL, VRF_CoordinatorAddress, gasLane, subscriptionId, callbackGasLimit]
    // Deploy Raffle.sol Smart Contract
    const Raffle = await deploy("Raffle", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
}

module.exports.tags = ["all", "raffle"]