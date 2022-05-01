// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

error Raffle__SendMoreToEnterRaffle();
error Raffle__RaffleNotOpen();

contract Raffle {
    
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

    /// @notice Events
    event RaffleEnter(address indexed player); // when a user enters Raffle

    constructor(uint256 entranceFee, uint256 interval) {
        i_entranceFee = entranceFee;
        i_interval = interval;
        s_lastTimeStamp = block.timestamp;
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
    * 
    */

    /**
    * @notice Functions check the 4 below requirements, if fulfilled -> pick a Winner
    * @dev 
    * 1 - Be true after some interval
    * 2 - Want the lottery to be open
    * 3 - The contract has ETH
    * 4- Keepers has LINK
    */
    function checkUpkeep(bytes memory /* checkData */) public view returns(bool upkeedNeeded, bytes memory /*performData*/) {
        bool isOpen = RaffleState.Open == s_raffleState; // 2 - check if its open
        bool timePassed = (block.timestamp - s_lastTimeStamp > i_interval); // 1 - true if timePassed is > interval
        bool hasBalance = address(this).balance > 0; // 3 - check if contract has ETH
        upkeedNeeded = (timePassed && isOpen && hasBalance); // EVERY REQUIREMENT IS FULFILLED
        return (upkeedNeeded,"0x0");
    }




}