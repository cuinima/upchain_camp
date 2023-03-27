const { ethers } = require("hardhat");
const { expect } = require("chai");


let ERC721,vault;
let Owner;
describe("MyERC721", function () {
  async function init() {
    [Owner] = await ethers.getSigners();
    console.log("Owner:" + Owner.address);
    //通过设置getContractFactory指定部署钱包
    const MyERC721 = await ethers.getContractFactory("MyERC721",Owner);
    ERC721 = await MyERC721.deploy();
    await ERC721.deployed();
    console.log("ERC721:" + ERC721.address);
    // const Vault = await ethers.getContractFactory("Vault",Owner);
    // vault = await Vault.deploy();
    // await vault.deployed();
    // console.log("vault:" + vault.address);
    
  }

  before(async function () {
    await init();
  });

  // 查询vault中Owner地址余额
  it("Vault amount 0", async function () {
        ERC721.connect(Owner).mintNFT(Owner.address,"ipfs://QmY26HtXXQ6XWNkoUnLXddyzPVp5LAMJVsuZiDPn3iGiTA")
  });
 


});
