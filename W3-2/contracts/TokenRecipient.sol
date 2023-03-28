// PDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract MyTokenRecipient  {
   function  tokensReceived(address from, uint256 amount) external returns(bool){
       return true;
   }
    fallback() external payable{
        
   }
}