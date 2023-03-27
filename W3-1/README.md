# ERC20 contracts下MyERC20.sol,Vault.sol

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npm install hardhat --save-dev

npm install @nomicfoundation/hardhat-toolbox --save-dev

npx hardhat

npm install -g @remix-project/remixd

remixd -s contracts -u http://remix.ethereum.org/

npm install @openzeppelin/contracts save-dev

npx hardhat compile
```

![作业1](D:\work\upchain_camp\W3-1\作业1.png)

![作业2](D:\work\upchain_camp\W3-1\作业2.png)

## 作业1:ERC20

```
// SPDX-License-Identifier: SimPL-2.0
pragma solidity ^0.8.10;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
 
contract MyERC20 is ERC20 {
 constructor() ERC20(unicode"泽雪", "ZEXUE") {
 _mint(msg.sender, 10000*10**18);
 }
}
```

```
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
```

![ERC20执行结果](D:\work\upchain_camp\W3-1\ERC20执行结果.png)

## 作业2:ERC2612

```
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

```

```
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-IERC20Permit.sol";

contract Vault2612 {
    address public tokenAddress;
    mapping(address => uint) public balances;

    constructor(address addr) {
        tokenAddress = addr;
    }

    function deposit(uint amount) public {
        IERC20 token = IERC20(tokenAddress);
        token.transferFrom(msg.sender, address(this), amount);
        balances[msg.sender] += amount;
    }

    function withdraw(uint amount) public {
        IERC20 token = IERC20(tokenAddress);
        balances[msg.sender] -= amount;
        token.approve(address(this), amount);
        token.transferFrom(address(this), msg.sender, amount);
    }

    function permitDeposit(uint amount, uint256 deadline, uint8 v, bytes32 r, bytes32 s) public {
        IERC20Permit token = IERC20Permit(tokenAddress);
        token.permit(msg.sender, address(this), amount, deadline, v, r, s);
        deposit(amount);
    }

}
```

![ERC2612执行结果](D:\work\upchain_camp\W3-1\ERC2612执行结果.png)

## 作业3:发行ERC721

`ERC721:0x87631583FF7fB92546954E3F5163372A5AccDE4f`

```
const { ethers } = require("hardhat");
const BigNumber = require("bignumber.js");

async function main() {
  let Owner, ERC721, vault;
  [Owner] = await ethers.getSigners();
  const MyERC721 = await ethers.getContractFactory("MyERC721", Owner);
  ERC721 = await MyERC721.deploy();
  await ERC721.deployed();
  console.log("ERC721:" + ERC721.address)
  let tx = await ERC721.connect(Owner).mintNFT(Owner.address,"ipfs://QmY26HtXXQ6XWNkoUnLXddyzPVp5LAMJVsuZiDPn3iGiTA");
  await tx.wait();
  console.log(tx);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

```



```
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";


contract MyERC721 is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721(unicode"MyERC721", "MYNTF") {}

    function mintNFT(address recipient, string memory tokenURI) public returns (uint256) {
        _tokenIds.increment();

        uint256 newTokenId = _tokenIds.current();
        _mint(recipient, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        return newTokenId;
    }
}
```

![erc721](D:\work\upchain_camp\W3-1\erc721.png)

## 作业4:买卖NFT

```
const { ethers } = require("hardhat");
const { expect } = require("chai");


let nft_swap,ERC721,ERC20;
let Owner,Other;
let tokenId;
describe("NFTSWAP", function () {
  async function init() {
    [Owner,Other] = await ethers.getSigners();
    console.log("Owner:" + Owner.address);
    //通过设置getContractFactory指定部署钱包

    const MyERC20 = await ethers.getContractFactory("MyERC20",Owner);
    ERC20 = await MyERC20.deploy();
    await ERC20.deployed();
    console.log("ERC20:" + ERC20.address);
    const MyERC721 = await ethers.getContractFactory("MyERC721",Owner);
    ERC721 = await MyERC721.deploy();
    await ERC721.deployed();
    console.log("ERC721:" + ERC721.address);
    const NFTSWAP = await ethers.getContractFactory("NFTSWAP",Owner);
    nft_swap = await NFTSWAP.deploy(ERC721.address,ERC20.address);
    await nft_swap.deployed();
    console.log("nft_swap:" + nft_swap.address);
    
  }

  before(async function () {
    await init();
  });

  // 查询vault中Owner地址余额
  it("nft mint", async function () {
        let data = 'ipfs://QmY26HtXXQ6XWNkoUnLXddyzPVp5LAMJVsuZiDPn3iGiTA'

        let tx = await ERC721.mintNFT(Owner.address, data);

        let event = await tx.wait();

        tokenId = event.events.find(event => {
            return event.event === 'Transfer'
        }).args["tokenId"].toNumber();

        await expect(await ERC721.ownerOf(tokenId)).to.equal(Owner.address);
  });
 
  it("testSell", async function () {

        let tx = await ERC20.transfer(Other.address, 2000,{ gasLimit: 1000000, gasPrice: ethers.utils.parseUnits("200", "gwei") });
        await tx.wait();

        tx = await ERC721.approve(nft_swap.address, tokenId);
        await tx.wait();

        tx = await nft_swap.sell(tokenId, 100,{ gasLimit: 1000000, gasPrice: ethers.utils.parseUnits("200", "gwei") });
        await tx.wait();

        await ERC20.connect(Other).approve(nft_swap.address, 100)

        await nft_swap.connect(Other).buyNTF(tokenId, 100,{ gasLimit: 1000000, gasPrice: ethers.utils.parseUnits("200", "gwei") });

        await expect(await ERC721.ownerOf(tokenId)).to.equal(Other.address);
    })

});

```

```
// SPDX-License-Identifier: SimPL-2.0
pragma solidity ^0.8.10;
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract NFTSWAP is IERC721Receiver {
    address public nft_addr;
    address public token_addr;
    mapping(uint256 => market) public sellMap;
    struct market{
        address sell_user;
        bool active;
        uint price;
        
    }
    function sell(uint _tokenId,uint _price) public {
        require(IERC721(nft_addr).ownerOf(_tokenId) == msg.sender,"not have nft");
        require(_price > 0, "price must more than 0");
         //创建挂单
        sellMap[_tokenId] = market({ sell_user : msg.sender,active : true, price : _price});

        IERC721(nft_addr).safeTransferFrom(msg.sender, address(this), _tokenId);
        
    }

    function buyNTF(uint _tokenId, uint price) public {
        IERC721 ntf = IERC721(nft_addr);
        market storage ntfSell = sellMap[_tokenId];
        require(ntfSell.active, "ntf not active");
        require(ntfSell.price == price, "price must equals sell price");
        SafeERC20.safeTransferFrom(IERC20(token_addr), msg.sender, ntfSell.sell_user, price);
        ntf.safeTransferFrom(address(this), msg.sender, _tokenId);
        ntfSell.active = false;

    }
    constructor(address _nft,address _token){
        nft_addr = _nft;
        token_addr = _token;
    }
    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external override pure  returns (bytes4){
        return this.onERC721Received.selector;
    }
}

```

![nftswap](D:\work\upchain_camp\W3-1\nftswap.png)