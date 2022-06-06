/* This Script is used to deploy Mocked contracts -> MOCKS ONLY ON DEVELOPMENT NETWORK
*  Deploy: 'yarn hardhat deploy --tags mocks'
*/

const { network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")

module.exports = async function ({getNamedAccounts, deployments}) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId 

    if(developmentChains.includes(network.name)) { // only wanted to deploy on a development chain
        log("Local network detected! Deploying mocks...")
    }
}