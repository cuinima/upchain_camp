const { ethers } = require("hardhat");
const { expect } = require("chai");


let ERC20,vault;
let Owner;
describe("MyERC20", function () {
  async function init() {
    [Owner] = await ethers.getSigners();
    //通过设置getContractFactory指定部署钱包
    const MyERC20 = await ethers.getContractFactory("MyERC20",Owner);
    ERC20 = await MyERC20.deploy();
    await ERC20.deployed();
    console.log("ERC20:" + ERC20.address);
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
    //expect(await Vault.deposited(Owner.address)).to.equal(0);
    const balance = await vault.deposited(Owner.address);
    expect(balance).to.equal(0);
  });
  it("approve vault  99999", async function () {
    //expect(await Vault.deposited(Owner.address)).to.equal(0);
    await ERC20.connect(Owner).approve(vault.address,99999);
    expect(await ERC20.allowance(Owner.address,vault.address)).to.equal(99999);
  });
  it("vault deposite  10000", async function () {
    //expect(await Vault.deposited(Owner.address)).to.equal(0);
    await vault.connect(Owner).deposite(ERC20.address,10000,{ gasLimit: 1000000, gasPrice: ethers.utils.parseUnits("10", "gwei") });
    expect(await vault.deposited(Owner.address)).to.equal(10000);
  });
  it("vault withdraw  10000", async function () {
    //expect(await Vault.deposited(Owner.address)).to.equal(0);
    await vault.connect(Owner).withdraw(ERC20.address,10000,{ gasLimit: 1000000, gasPrice: ethers.utils.parseUnits("10", "gwei") });
    expect(await vault.deposited(Owner.address)).to.equal(0);
  });




});
