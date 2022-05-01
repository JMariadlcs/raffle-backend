# Raffle Full Stack App
This is a full stack decentralized Raffle App using Chainlink VRF and Chainlink Keepers, Solidity and Next.js from workshop from Chainlink Hackathon Spring 2022.

This repo contains all the stuff for the back-end part, the front-end is hold on [raffle-frontend](https://github.com/JMariadlcs/raffle-frontend).

To achieve fully descentralization the Front-End has been uploaded to IPFS: ipfs://QmebchQmtLav7ohVsbEYZEHS5Ddm4FyT8VQVmN19RK4ojU. 

The workshop followed to complete this repo is [this one](https://www.youtube.com/watch?v=8bMrko6iD9Q&t=5445s).


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
deployments

#Hardhat files
cache
artifacts
```

Notice: you can include more ignore cases in your `.gitignore` by copying the content from [.gitignore](https://github.com/JMariadlcs/raffle-full-stack/blob/main/.gitignore).

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

## How to deploy

- DISCLAIMER: Always deploy first LOCALLY

- Deploy on Rinkeby:
```bash
yarn hardhat deploy --network rinkeby
```
or
```bash
npx hardhat deploy --network rinkeby
```

## Add Chainlink VRF Consumers and Keepers
In order that our Contract works correctly with Chainlink VRF we need to add our Smart Contract Address as VRF consumer. To do so:
1. Go to [Chainlink VRF](https://vrf.chain.link).
2. Create a 'Subscription' or use an existing one
3. Add 'consumer': Smart Contract Address
NOTICE: check that Subscription has enough funds (LINK)

To register into Chainlink Keepers (To execute lottery automatically):
1. Go to [Chainlink Keepers](https://keepers.chain.link/).
2. Click on 'register new keeper'.
3. Fill up the data.

## Resources 
- [Hardhat Smart Contract Lottery](https://github.com/PatrickAlphaC/hardhat-smartcontract-lottery-fcc): Patrick's repo that we are building.
- [Front-end Smart Contract Lottery](https://github.com/smartcontractkit/full-blockchain-solidity-course-js#lesson-10-nextjs-smart-contract-lottery-full-stack--front-end): Patrick's repo for the Front-end part.
- [Chainlink Keepers](https://docs.chain.link/docs/chainlink-keepers/introduction/): Used to pick winner AUTOMATICALLY.
- [Chainlink VRF](https://docs.chain.link/docs/get-a-random-number/): Used to pick a winner RANDOMLY.
- [Chainlink VRF addresses](https://docs.chain.link/docs/vrf-contracts/): Used to pick VRF address to deploy contract.
- [Chainlink VRF subscription](https://vrf.chain.link): Used to create a VRF Chainlink subscription id.
- [Chainlink Keepers subscription](https://keepers.chain.link/): Used to add a keeper.