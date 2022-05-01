// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol"; // to work with COORDINATOR and VRF
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol"; // to use functionalities for Chainlink VRF

error Raffle__SendMoreToEnterRaffle();
error Raffle__RaffleNotOpen();
error Raffle__UpkeepNotNeeded();
error Raffle__TransferFailed();

contract Raffle is VRFConsumerBaseV2 {
    
    /// @notice Enums
    // To let user enter the Raffle or not
    enum RaffleState { 
        Open,
        Calculating
    }

    /// @notice Variables
    RaffleState public s_raffleState; // s_ because 'store' and we are going to change the value
    uint256 public immutable i_entranceFee; // Fee to join the Raffle (Immutable: unchangeable and cheaper)
    uint256 public immutable i_interval; // interval when Raffle State should change
    uint256 public s_lastTimeStamp; // to get last time Raffle State changed
    address payable[] public s_players; // to have raffle players
    address public s_recentWinner; // most recent Winner

    /// @notice VRF Variables
    VRFCoordinatorV2Interface public immutable i_vrfCoordinator; // coordinator for working with Chainlink VRF 
    bytes32 public immutable i_gasLane;
    uint64 public immutable i_subscriptionId;
    uint32 public immutable i_callbackGasLimit;
    uint16 public constant REQUEST_CONFIRMATIONS = 3; // how many blocks are needed to be considered complete
    uint32 public constant NUM_WORDS = 1; // how many random numbers we want to get

    /// @notice Events
    event RaffleEnter(address indexed player); // when a user enters Raffle
    event RequestedRaffleWinner(uint256 indexed requestId); // when VRF gives a random number (winner)
    event WinnerPicked(address indexed winner); // winner is picked

    constructor(uint256 entranceFee, uint256 interval, address vrfCoordinatorV2, bytes32 gasLane, uint64 subscriptionId, uint32 callbackGasLimit) VRFConsumerBaseV2(vrfCoordinatorV2) {
        i_entranceFee = entranceFee;
        i_interval = interval;
        s_lastTimeStamp = block.timestamp;

        //VRF Variables
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2); // interface(address) -> contract, so i_vrfCoordinator is now a contract (we can interat with it)
        i_gasLane = gasLane; // keyHash -> how much gas is max to get Random Number (price per gas)
        i_subscriptionId = subscriptionId;
        i_callbackGasLimit = callbackGasLimit; // when Chainlink node respond with the random number it uses gas - max gas amount
    }

    /**
    * @notice Function for users to join the Raffle
    * @dev 
    * - Check if msg.value is correct
    * - Check state of Raffle -> Open or Calculating
    */
    function enterRaffle() external payable {
        // require(msg.value > i_entranceFee, "Not enough money sent."); ->  Better use custom error
        if (msg.value < i_entranceFee) {
            revert Raffle__SendMoreToEnterRaffle();
        }

        // Check Raffle state
        if (s_raffleState != RaffleState.Open) { // Raffle closed
            revert Raffle__RaffleNotOpen();
        }

        // Raffle Open -> users can enter
        s_players.push((payable(msg.sender))); // store player address into array
        emit RaffleEnter(msg.sender);
    }

    /**
    * @notice Functions for select a RANDOMand AUTOMATICALLY WINNER -> Chainlink Keepers
    * @dev 
    * 1 - Want it done Automatically
    * 2 - Want it to be really RANDOM
    */

    /**
    * @notice Function to check the 4 below requirements, if fulfilled -> pick a Winner
    * @dev 
    * 1 - Be true after some interval
    * 2 - Want the lottery to be open
    * 3 - The contract has ETH
    * 4 - There is al least 1 player
    * 5- Keepers has LINK
    */
    function checkUpkeep(bytes memory /* checkData */) public view returns(bool upkeedNeeded, bytes memory /*performData*/) {
        bool isOpen = RaffleState.Open == s_raffleState; // 2 - check if its open
        bool timePassed = ((block.timestamp - s_lastTimeStamp) > i_interval); // 1 - true if timePassed is > interval
        bool hasBalance = address(this).balance > 0; // 3 - check if contract has ETH
        bool hasPlayers = s_players.length > 0; // 4 - check if there is al least 1 player

        upkeedNeeded = (timePassed && isOpen && hasBalance && hasPlayers); // EVERY REQUIREMENT IS FULFILLED
        return (upkeedNeeded,"0x0");
    }

    /**
    * @notice Functions to actually pick a random NUMBER -> Chainlink keepers to do it Automatically and decentralized
    */
    function performUpkeep(bytes calldata /* performData */) external {
        (bool upkeepNeeded, ) = checkUpkeep(""); //checkUpkeep returns 2 parameters but we only need first 1
        if (!upkeepNeeded) { // requirements not met
            revert Raffle__UpkeepNotNeeded();
        }

        // REQUIREMENTS MET! -> PICK A WINNER (random NUMBER) -> use Chainlink VRF
        s_raffleState = RaffleState.Calculating; // Change Raffle State
        uint256 requestId = i_vrfCoordinator.requestRandomWords(i_gasLane, i_subscriptionId, REQUEST_CONFIRMATIONS, i_callbackGasLimit, NUM_WORDS);
        emit RequestedRaffleWinner(requestId);    
    }

    /**
    * @notice Functions to actually pick a winner -> Pass from Chanlink VRF random NUMBER to WINNER
    * @dev 
    * - randomWords -> array of randomWords
    * - should RESET RAFFLE
    * - should pay winner
    * - use .call() to send ETH (best way to do it)
    */
    function fulfillRandomWords(uint256 /* requestId */, uint256[] memory randomWords) internal override {
        uint256 indexOfWinner = randomWords[0] % s_players.length; // just in case random number is very long we apply modular function
        address payable recentWinner = s_players[indexOfWinner]; // WINNER PICKED
        s_recentWinner = recentWinner; // get view Winner address from outside the contract

        // RESET RAFFLE and PAY WINNER
        s_players = new address payable[](0); // reset players array
        s_raffleState = RaffleState.Open;
        s_lastTimeStamp = block.timestamp; 
        (bool success, ) = recentWinner.call{value: address(this).balance}(""); // We pay winner (SEND ALL THE ETH IN THE CONTRACT)
        if (!success) { // check if transaction succeded
            revert Raffle__TransferFailed();
        }
        emit WinnerPicked(recentWinner);
    }
}