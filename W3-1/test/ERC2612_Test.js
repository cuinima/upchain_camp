const { ethers } = require("hardhat");
const { expect } = require("chai");


let ERC2612,vault;
let Owner;
describe("MyERC2612", function () {
  async function init() {
    [Owner] = await ethers.getSigners();
    //通过设置getContractFactory指定部署钱包
    const MyERC2612 = await ethers.getContractFactory("MyERC2612",Owner);
    ERC2612 = await MyERC2612.deploy();
    await ERC2612.deployed();
    console.log("ERC2612:" + ERC2612.address);
    const Vault = await ethers.getContractFactory("Vault",Owner);
    vault = await Vault.deploy();
    await vault.deployed();
    console.log("vault:" + vault.address);
    
    

  }

  before(async function () {
    await init();
  });

   // 查询vault中Owner地址余额
   it("Vault amount 0", async function () {
    //const _PERMIT_TYPEHASH = await ethers.utils.solidityKeccak256("Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)");
    const _PERMIT_TYPEHASH = "0x6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c9";
    const nonce = await ERC2612.useNonce(Owner.address)+1;
    const deadline = Math.floor(Date.now()/1000) + 60 * 60 * 24;
    const chainId = (await ethers.provider.getNetwork()).chainId;
    const domain = {
      name: await ERC2612.name(),
      version:'1',
      chainId:chainId,
      verifyingContract:ERC2612.address
    };
    const types = {
      Permit:[
        {name:"_PERMIT_TYPEHASH",type:"bytes32"},
        {name:"owner",type:"address"},
        {name:"spender",type:"address"},
        {name:"value", type:"uint256"},
        {name:"nonce",type:"uint256"},
        {name:"deadline",type:"uint256"}
              ]};
    const message = {
      _PERMIT_TYPEHASH:_PERMIT_TYPEHASH,owner:Owner.address,spender:vault.address,value:1000,nonce:nonce,deadline:deadline
    };
    const signature = await Owner._signTypedData(domain,types,message);
    const {v,r,s} = ethers.utils.splitSignature(signature);
    await ERC2612.connect(Owner).transferWithSignature(vault.address,1000,deadline,v,r,s,{ gasLimit: 1000000, gasPrice: ethers.utils.parseUnits("10", "gwei") });

    expect(await vault.deposited(Owner.address)).to.equal(1000);
  });



});
