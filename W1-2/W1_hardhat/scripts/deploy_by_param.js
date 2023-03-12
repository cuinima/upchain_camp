const hre = require("hardhat");
const { ethers, network, artifacts } = require("hardhat");
const prams = process.argv
const value = prams[2]

console.log("Counter deploy with value:", value);
async function main() {
    await hre.run('compile');
    // 获得将要部署的合约
    const Counter = await ethers.getContractFactory("Counter");
    const Counter_Contract = await Counter.deploy(value);
    let tx = await Counter_Contract.deployed();
    //tx.wait();
    
    console.log("Counter_Contract deployed to:", Counter_Contract.address);
    await Counter_Contract.count();

  }
  
  main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });