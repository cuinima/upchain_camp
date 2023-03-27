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
