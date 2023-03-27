// SPDX-License-Identifier: SimPL-2.0
pragma solidity ^0.8.10;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
 
contract MyERC20 is ERC20 {
 constructor() ERC20(unicode"泽雪", "ZEXUE") {
 _mint(msg.sender, 10000*10**18);
 }
}