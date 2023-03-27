// SPDX-License-Identifier: SimPL-2.0
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
contract Vault{
   mapping(address => uint) public deposited;
 
   function deposite(address _erc20,uint _amount) external{
        IERC20(_erc20).transferFrom(msg.sender, address(this), _amount);
        deposited[msg.sender] += _amount;
   }
    function withdraw(address _erc20,uint256 _amount) public {
            require(_amount > 0, "Withdraw amount must be greater than 0");
            require(deposited[msg.sender] >= _amount, "Not enough amount");
            deposited[msg.sender] -= _amount;
            IERC20(_erc20).transfer(msg.sender, _amount);
    }
     
    function balanceOf(address account) public view returns (uint256) {
        return deposited[account];
    }
 
}