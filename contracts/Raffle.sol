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
    address payable[] public s_players; // to have raffle players

    /// @notice Events
    event RaffleEnter(address indexed player); // when a user enters Raffle

    constructor(uint256 entranceFee) {
        i_entranceFee = entranceFee;
    }

    /**
    * @notice Function for users to join the Raffle
    * @dev 
    * - Check if msg.value is correct
    * - Check state of Raffle -> Open or Calculating
    */
    function enterRaffle() external payable {
        // require(msg.value > i_entranceFee, "Not enough money sent."); Better custom error
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



}