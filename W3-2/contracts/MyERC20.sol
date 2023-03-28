// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;
import "./TokenERC20.sol";
 
contract MyERC20 is ERC20 {


    bool public _initialized;
    function initToken() public {
        require(!_initialized, "Contract already initialized");
        _initialized = true;
          
        ERC20._name = unicode"泽雪";
        ERC20._symbol = "ZEXUE";
    
        _mint(msg.sender, 10000*10**18);
    }

}