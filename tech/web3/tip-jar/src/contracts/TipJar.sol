// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.4; //same as hardhat.config.js

import 'hardhat/console.sol'; // This allow you to use console.log

contract TipJar {
  uint public totalTips;

  constructor() {
    console.log("New Smart Contract");
  }
}
