// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

error Raffle__SendMoreToEnterRaffle();

contract Raffle {

    uint256 public immutable i_entranceFee; // Fee to join the Raffle (Immutable: unchangeable and cheaper)

    constructor(uint256 entranceFee) {
        i_entranceFee = entranceFee;
    }

    /**
    * @notice Function for users to join the Raffle
    * @dev
    */
    function enterRaffle() external payable {
        // require(msg.value > i_entranceFee, "Not enough money sent."); Better custom error
        if (msg.value < i_entranceFee) {
            revert Raffle__SendMoreToEnterRaffle();
        }
    }



}