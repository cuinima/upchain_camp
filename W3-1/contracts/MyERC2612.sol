// SPDX-License-Identifier: SimPL-2.0
pragma solidity ^0.8.10;
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
contract MyERC2612 is ERC20, ERC20Permit {
 constructor() ERC20("cc2612", "ZEXUE2612") ERC20Permit("cc2612") {
 _mint(msg.sender, 100000 * 10 ** 18);
 }
     // 使用签名来验证授权和转移代币
    function transferWithSignature(address to, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s) public returns (bool) {
        permit(msg.sender,to,value,deadline,v,r,s);
        _transfer(msg.sender, to, value);
        return true;
    }

  
}
