// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;
contract Bank{
    address public Owner;
    mapping(address=>uint256) public balances;
    constructor(){
        //初始化Owner
        Owner = msg.sender;
    }
    fallback() payable external{
            //记录接收转账地址和金额
            balances[msg.sender] +=  msg.value;
    }
    //管理员鉴权
    modifier OnlyOwner {
        require(msg.sender == Owner,"not Owner!");
        _;
    }
    //管理员取款
    function withraw_All() external OnlyOwner{
        uint256 amount = address(this).balance;
        require(amount > 0,"not enough amount!");
        payable(Owner).transfer(address(this).balance);
    }
    //普通用户取款
    function withraw(uint256 _amount) external {
        uint256 amount = balances[msg.sender];
        //校验取款金额
        require(amount > _amount && amount - _amount > 0 && address(this).balance > _amount,"not enough amount!");
        balances[msg.sender]-=_amount;
        payable(msg.sender).transfer(_amount);
    }
 
}