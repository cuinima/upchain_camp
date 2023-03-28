const {expect} = require("chai");
const {ethers} = require("hardhat/internal/lib/hardhat-lib");

let owner,other,proxy,erc20,erc20_v2,token_recive;
describe("MainTest", function () {
    async function init() {
        [owner,other] = await ethers.getSigners();

        const CounterProxy = await ethers.getContractFactory("CounterProxy",owner);
        proxy = await CounterProxy.deploy();
        await proxy.deployed();
        console.log("proxy:" + proxy.address);

        const MyERC20 = await ethers.getContractFactory("MyERC20",owner)
        erc20 = await MyERC20.deploy();
        await erc20.deployed();
        console.log("erc20:" + erc20.address);

        const MyERC20V2 = await ethers.getContractFactory("MyERC20V2",owner)
        erc20_v2 = await MyERC20V2.deploy();
        await erc20_v2.deployed();
        console.log("erc20_v2:" + erc20_v2.address);

        const TokenRecipient = await ethers.getContractFactory("MyTokenRecipient",owner)
        token_recive = await TokenRecipient.deploy();
        await token_recive.deployed();
        console.log("token_recive:" + token_recive.address);
        
    

    }

    before(async function () {
        await init();
    })



    it("proxy upgradeTo", async function () {

        await proxy.connect(owner).upgradeTo(erc20.address);
        
        const contractV1 = new ethers.Contract(proxy.address, erc20.interface);
        await contractV1.connect(owner).initToken();
        const name = await contractV1.connect(owner).name();

        await expect(name).to.equal("泽雪");
        
    })
    it("proxy upgradeTo V2", async function () {

        await proxy.connect(owner).upgradeTo(erc20_v2.address);
        const contractV2 = new ethers.Contract(proxy.address, erc20_v2.interface);
        let transfer_status = await contractV2.connect(owner).transferWithCallback(token_recive.address,1000000);
        transfer_status.wait();
        await expect(await contractV2.connect(owner).balanceOf(token_recive.address)).to.equal(1000000);
        
    })


})