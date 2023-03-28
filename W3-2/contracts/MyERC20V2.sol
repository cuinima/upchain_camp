// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;
import "./TokenERC20.sol";
import "@openzeppelin/contracts/utils/Address.sol";
interface TokenRecipient{
    function  tokensReceived(address from, uint256 amount) external returns(bool);
}
contract MyERC20V2 is ERC20 {
    using Address for address;

    bool public _initialized;
    function initToken() public {
        require(!_initialized, "Contract already initialized");
        _initialized = true;
          
        ERC20._name = unicode"泽雪";
        ERC20._symbol = "ZEXUE";
    
        _mint(msg.sender, 10000*10**18);
    }

    
    function transferWithCallback(address recipient, uint256 amount) external returns (bool) {
        _transfer(msg.sender, recipient, amount);
        if (recipient.isContract()) {
            bool rv = TokenRecipient(recipient).tokensReceived(msg.sender, amount);
            require(rv, "No tokensReceived");
        }
        return true;
    }

}