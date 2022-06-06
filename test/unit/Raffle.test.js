/**  Script used to execute unit testing -> ONLY ON DEVELOPMENT CHAINS
 *    To execute all the test: yarn hardhat test
 *    To execute a single test (eg.1st test): yarn hardhat test --grep ""
 *    To see coverage: yarn hardhat coverage
 */


const { network, deployments, ethers, getNamedAccounts } = require("hardhat")
const { assert, expect } = require("chai")
const { developmentChains, networkConfig } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name) ? describe.skip : // case WE ARE in a development chain -> deploy Mocks
    describe("Raffle Unit Tests", async function () {
        let raffle, vrfCoordinatorV2Mock, raffleEntranceFee, deployer
        const chainId = network.config.chainId

        beforeEach(async function () {
            deployer = (await getNamedAccounts()).deployer
            await deployments.fixture(["all"])
            raffle = await ethers.getContract("Raffle", deployer)
            vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock", deployer)
            raffleEntranceFee = await raffle.getEntranceFee()
        })

        describe("constructor", async function() {
            it("Initializes Raffle correctly", async function() {
                const raffleState = await raffle.getRaffleState()
                const interval = await raffle.getInterval()
                assert.equal(raffleState.toString(), "0")
                assert.equal(interval.toString(), networkConfig[chainId]["interval"])
            })
        })

        describe("enterRaffle", async function() {
            it("reverts when not enough ETH is sent", async function() {
                await expect(raffle.enterRaffle()).to.be.revertedWith("Raffle__SendMoreToEnterRaffle")
            })
            it("records players when they enter", async function () {
                await raffle.enterRaffle({ value: raffleEntranceFee })
                const playerFromContract = await raffle.getPlayer(0)
                assert.equal(playerFromContract, deployer)
            })
            it("emits events when enter", async function() {
                await expect(raffle.enterRaffle( {value: raffleEntranceFee })).to.emit(raffle, "RaffleEnter")
            })
            it("does not allow entrance when raffle is calculating", async function() {
                await expect(raffle.enterRaffle( {value: raffleEntranceFee }))
            })
        })
    })