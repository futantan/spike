// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.4; //same as hardhat.config.js

import 'hardhat/console.sol'; // This allow you to use console.log

contract TipJar {
	uint256 totalTips; // store the number of the tips received;

	address payable owner;

	struct Tip {
		address sender; //The person who gives you the tip
		string message; //A message from the sender;
		string name; //THe name of the sender
		uint256 timestamp; //When the tip was sent
		uint256 amount; //the amount of ether sent to you
	}

	Tip[] tips;

	event NewTip(address indexed from, string message, uint256 amount);
	event NewWithdraw(uint256 amount);

	constructor() {
		owner = payable(msg.sender); // set the contract creator based in who instantiated it
	}

	function sendTip(string memory _message, string memory _name) public payable {
		require(msg.sender.balance >= msg.value, 'Not enough funds');
		totalTips += 1;
		tips.push(Tip(msg.sender, _message, _name, block.timestamp, msg.value));
		emit NewTip(msg.sender, _message, msg.value);
	}

		/*
	 * a function that give access to the stored tips struct
	 * is just read from the blockchain so is marked as view
	 */
	function getAllTips() public view returns (Tip[] memory) {
		return tips;
	}

	/*
	 * public funtion (like a getter) that returns the total number of tips
	 * is marked as public and as a view, meaning that only reads from the blockchain so is gas free
	 * In a function you should declare what it returns
	 */
	function getTotalTips() public view returns (uint256) {
		return totalTips;
	}

	modifier onlyOwner {
		require(msg.sender == owner, 'caller is not the owner');
		_;
	}

	function withdraw() public onlyOwner {
		uint256 amount = address(this).balance;
		require(amount > 0, 'You have no ether to withdraw');
		(bool success, ) = owner.call{value: amount}('');
		require(success, 'Withdraw failed');
		emit NewWithdraw(amount);
	}
}
