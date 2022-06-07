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
       
        beforeEach(async function () {
            deployer = (await getNamedAccounts()).deployer
            raffle = await ethers.getContract("Raffle", deployer)
            raffleEntranceFee = await raffle.getEntranceFee()
        })

        describe("fulfillRandomWords", function() {
            it("works with real Chainlink Keepers and Chainlink VRF, a random winner is piscked", async function() {
                // enter de raffle
                const startingTimeStamp = await raffle.getLatestTimeStamp()
                const accounts = await ethers.getSigners()

                await new Promise(async (resolve, reject) => {
                    raffle.once("WinnerPicked", async () => { // Once WinnerPicked event is emited -> continue
                    console.log("WinnerPicked event fired!")
                        try{
                            // add ASSERTS HERE
                            // executed after winner is picked and event is emmitted
                            const recentWinner = await raffle.getRecentWinner()
                            const raffleState = await raffle.getRaffleState()
                            const winnerEndingBalance = await accounts[0].getBalance() // deployer
                            const endingTimeStamp = await raffle.getLatestTimeStamp()

                            await expect(raffle.getPlayers(0)).to.be.reverted
                            assert.equal(recentWinner.toString(), accounts[0].deployer)
                            assert.equal(raffleState.toString(), "0")
                            assert.equal(winnerEndingBalance.toString(), winnerStatingBalance.add(raffleEntranceFee).toString())
                            assert(endingTimeStamp > startingTimeStamp)
                            resolve()
                        }catch(error) {
                            console.log(error)
                            reject(e)
                        }
                    })
                    // Entering the raffle
                    await raffle.enterRaffle({ value: raffleEntranceFee })
                    const winnerStatingBalance = await accounts[0].getBalance()
                })
            })
        })
    })