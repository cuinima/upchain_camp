// SPDX-License-Identifier: GPL-3.0
pragma solidity  ^0.8.10;

contract Counter{

    uint public counter;

    function add(uint x) public returns(uint){
        counter = counter + x;
        return counter;
    }

   
}