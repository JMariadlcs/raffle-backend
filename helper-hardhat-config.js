const { ethers } = require("hardhat")

const networkConfig = {
    default: {
        name: "hardhat",
        keepersUpdateInterval: "30",
    },
    31337: {
        name: "localhost",
        subscriptionId: "588",
        gasLane: "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc", // 30 gwei same that in Rinkeby (does not matter)
        keepersUpdateInterval: "30",
        entranceFee: ethers.utils.parseEther("0.01"), 
        callbackGasLimit: "500000", // 500,000 gas
        interval: "30",
    },
    4: {
        name: "rinkeby",
        subscriptionId: "5998",
        gasLane: "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc", // 30 gwei
        keepersUpdateInterval: "30",
        entranceFee: ethers.utils.parseEther("0.01"), 
        callbackGasLimit: "500000", // 500,000 gas
        vrfCoordinatorV2: "0x6168499c0cFfCaCD319c818142124B7A15E857ab",
        interval: "30",
    },
    1: {
        name: "mainnet",
        keepersUpdateInterval: "30",
    },
}

const developmentChains = ["hardhat", "localhost"]


module.exports = {
    networkConfig,
    developmentChains,
}