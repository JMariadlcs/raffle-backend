/* This Script is used to deploy update frontend contract addresses and ABI
     Deploy: 'yarn hardhat deploy --network rinkeby'
    or 'npx hardhat deploy --network rinkeby' */

const { frontEndContractsFile, frontEndAbiFile } = require("../helper-hardhat-config")
const fs = require("fs")
const { network, ethers } = require("hardhat")

module.exports = async () => {
    if (process.env.UPDATE_FRONT_END) {
        console.log("Writing to front end...")
        updateContractAddresses()
        updateAbi()
        console.log("Front end written!")
    }
}

async function updateAbi() {
    const raffle = await ethers.getContract("Raffle")
    fs.writeFileSync(frontEndAbiFile, raffle.interface.format(ethers.utils.FormatTypes.json))
}

async function updateContractAddresses() {
    const raffle = await ethers.getContract("Raffle")
    console.log("heeyyy")
    const contractAddresses = JSON.parse(fs.readFileSync(frontEndContractsFile, "utf8"))
    if (network.config.chainId.toString() in contractAddresses) {
        console.log("Writing contract")
        if (!contractAddresses[network.config.chainId.toString()].includes(raffle.address)) {
            console.log("Writing contract2")
            contractAddresses[network.config.chainId.toString()].push(raffle.address)
        }
    } else {
        console.log("Writing contract3")
        contractAddresses[network.config.chainId.toString()] = [raffle.address]
    }
    console.log(frontEndContractsFile)
    fs.writeFileSync(frontEndContractsFile, JSON.stringify(contractAddresses))
}
module.exports.tags = ["all", "frontend"]