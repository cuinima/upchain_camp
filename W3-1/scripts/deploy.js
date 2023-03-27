const { ethers } = require("hardhat");
const BigNumber = require("bignumber.js");

async function main() {
  let Owner, ERC2612, vault;
  [Owner] = await ethers.getSigners();
  const MyERC2612 = await ethers.getContractFactory("MyERC2612", Owner);
  ERC2612 = await MyERC2612.deploy();
  await ERC2612.deployed();
  console.log("ERC2612:" + ERC2612.address)
  const Vault = await ethers.getContractFactory("Vault2612", Owner);
  vault = await Vault.deploy(ERC2612.address);
  await vault.deployed();
  console.log("vault:" + vault.address);
  const deadline = await Math.floor(Date.now()/1000) + 60 * 60 * 24;
  console.log("deadline:",deadline);

  const nonce = await ERC2612.nonces(Owner.address);
  const chainId = (await ethers.provider.getNetwork()).chainId;
  const domain = {
      name: await ERC2612.name(),
       version: '1', 
       chainId, 
       verifyingContract: ERC2612.address
  }
  console.log("domain",domain);
  const types = {
      Permit: [
        {name: "owner", type: "address"}, 
        {name: "spender", type: "address"}, 
        {name: "value",type: "uint256"},
        {name: "nonce", type: "uint256"}, 
        {name: "deadline", type: "uint256"},
      ],
  };
  console.log("types",types);

  const message = {
      owner: Owner.address, spender: vault.address, value: 10000000, nonce: nonce, deadline: deadline,
  };
  console.log("message",message);
  const signature = await Owner._signTypedData(domain, types, message);
  const {v, r, s} = ethers.utils.splitSignature(signature);
  console.log("v,r,s",v, r, s);
  let tx = await vault.permitDeposit(10000000,deadline, v, r, s,{ gasLimit: 1000000, gasPrice: ethers.utils.parseUnits("200", "gwei") });
  await tx.wait();
  console.log(tx);
  const balance = await vault.balances(Owner.address);
  console.log("balance",balance);
 
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
