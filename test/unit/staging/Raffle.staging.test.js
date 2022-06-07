/**  Script used to execute integrated testing -> assume we are in a testnet
 *    ----- LAST STEP BEFORE MAINNET -----
 *    To execute all the test: yarn hardhat test --network rinkeby
 *    To execute a single test (eg.1st test): yarn hardhat test --grep "" --network rinkeby
 *    To see coverage: yarn hardhat coverage
 */


 const { network, deployments, ethers, getNamedAccounts } = require("hardhat")
 const { assert, expect } = require("chai")
 const { developmentChains, networkConfig } = require("../../helper-hardhat-config")
 
developmentChains.includes(network.name) ? describe.skip : // case WE ARE in a development chain -> deploy Mocks
    describe("Raffle Staging Tests", function () {
        let raffle, raffleEntranceFee, deployer
        const chainId = network.config.chainId

        beforeEach(async function () {
            deployer = (await getNamedAccounts()).deployer
            await deployments.fixture(["all"])
            raffle = await ethers.getContract("Raffle", deployer)
            vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock", deployer)
            raffleEntranceFee = await raffle.getEntranceFee()
            interval = await raffle.getInterval()
        })
    })