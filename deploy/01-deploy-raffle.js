/* This Script is used to deploy Raffle.sol contract into a TESTNET
     Deploy: 'yarn hardhat deploy --network rinkeby'
    or 'npx hardhat deploy --network rinkeby' */

const { ethers, network } = require("hardhat");
const { developmentChains, networkConfig } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify")

const VRF_SUB_FUND_AMOUNT = ethers.utils.parseEther("30")
console.log("eee")
module.exports = async({getNamedAccounts, deployments}) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    let vrfCoordinatorV2Address, subscriptionId
    console.log("chainId" + chainId)
    if (developmentChains.includes(network.name)) { // Select VRFCoordinatorV2Mock in case we are deploying on a development chain
        const vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
        vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address
        const transactionResponse = await vrfCoordinatorV2Mock.createSubscription() // create VRF SubscriptionId
        const transactionReceipt = await transactionResponse.wait(1) // inside `transactionReceipt`is the SubscriptionId
        subscriptionId = transactionReceipt.events[0].args.subId

        // We need to fund de subscriptionID
        await vrfCoordinatorV2Mock.fundSubscription(subscriptionId, VRF_SUB_FUND_AMOUNT)

    } else { // not localnetwork -> pick from networkConfig
        vrfCoordinatorV2Address = networkConfig[chainId]["vrfCoordinatorV2"]
        subscriptionId = networkConfig[chainId]["subscriptionId"]
    }

    // Parameters for VRFCoordinator
    const ENTRANCE_FEE = networkConfig[chainId]["entranceFee"] // fee for Raffle participation
    const INTERVAL = networkConfig[chainId]["interval"] // interval to pick a winner (in seconds)
    const gasLane = networkConfig[chainId]["gasLane"]
    const callbackGasLimit = networkConfig[chainId]["callbackGasLimit"]

    // We need the Contract's arguments for deploy
    const arguments = [ENTRANCE_FEE, INTERVAL, vrfCoordinatorV2Address, gasLane, subscriptionId, callbackGasLimit]
    // Deploy Raffle.sol Smart Contract
    const Raffle = await deploy("Raffle", {
        from: deployer,
        args: arguments,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
/*
    // Verify contract on Etherscan if we are not deploying on a development chain
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...")
        await verify(Raffle.address, arguments)
    }
*/
    log("----------------------------------------------------")
}

module.exports.tags = ["all", "raffle"]