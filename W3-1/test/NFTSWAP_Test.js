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
