# raffle-full-stack

This is a full stack decentralized Raffle App using Solidity, Next.js and VRF Chainlink from workshop from Chainlink Hackathon Spring 2022.

## Objetives

<< Writing the contracts >>
1. Decentralized RANDOM Raffle.
2. User enter (for a fee).
3. Pick a RANDOM winner.
    1. Autonomous: We never have to interact.
    2. Provable random.

<< Build the Front End >>
1. Buttons using NextJS
2. Deploy it in a decentralized context

## Requirements for creating similar projects from scratch
- Start hardhat project:
```bash
npm init -y
npm install --save-dev hardhat
npx hardhat
```
- Add .gitignore file containing:
```bash
node_modules
.env
coverage
coverage.json
typechain

#Hardhat files
cache
artifacts
```

- Install dependencies:
```bash
yarn add --dev @nomiclabs/hardhat-ethers@npm:hardhat-deploy-ethers ethers @nomiclabs/hardhat-etherscan @nomiclabs/hardhat-waffle chai ethereum-waffle hardhat hardhat-contract-sizer hardhat-deploy hardhat-gas-reporter prettier prettier-plugin-solidity solhint solidity-coverage dotenv @chainlink/contracts
```
or
```bash
npm install --save-dev @nomiclabs/hardhat-ethers@npm:hardhat-deploy-ethers ethers
npm install @nomiclabs/hardhat-ethers
npm install @chainlink/contracts
npm install dotenv --save
```

## How to compile
```bash
yarn hardhat compile
```
or
```bash
npx hardhat compile
```

## Resources 
- [Hardhat Smart Contract Lottery](https://github.com/smartcontractkit/full-blockchain-solidity-course-js#lesson-9-hardhat-smart-contract-lottery): Patrick's repo that we are building.
- [Front-end Smart Contract Lottery](https://github.com/smartcontractkit/full-blockchain-solidity-course-js#lesson-10-nextjs-smart-contract-lottery-full-stack--front-end): Patrick's repo for the Front-end part.
- [Chainlink Keepers](https://docs.chain.link/docs/chainlink-keepers/introduction/): Used to pick winner AUTOMATICALLY.