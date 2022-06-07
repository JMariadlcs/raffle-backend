/* This Script is used to deploy Mocked contracts -> MOCKS ONLY ON DEVELOPMENT NETWORK
*  Deploy: 'yarn hardhat deploy --tags mocks'
*/

const { network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")

const BASE_FEE = ethers.utils.parseEther("0.25") // 0.25 is this the premium in LINK (in Rinkeby)
const GAS_PRICE_LINK = 1e9 // calculated value based on gas price of the chain // 0.000000001 LINK per gas

module.exports = async function ({getNamedAccounts, deployments}) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId 

    if(developmentChains.includes(network.name)) { // only wanted to deploy on a development chain
        log("Local network detected! Deploying mocks...")
        await deploy("VRFCoordinatorV2Mock", {
            from: deployer,
            log: true,
            args: [BASE_FEE, GAS_PRICE_LINK],
        })

        log("Mocks Deployed!")
        log("----------------------------------------------------------")
        log("You are deploying to a local network, you'll need a local network running to interact: 'yarn hardhat node'")
        log("Please run `yarn hardhat console --network localhost` to interact with the deployed smart contracts!")
        log("----------------------------------------------------------")
    }

    
}
module.exports.tags = ["all", "mocks"]