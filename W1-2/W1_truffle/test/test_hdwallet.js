require('dotenv').config();
const { MNEMONIC, PROJECT_ID } = process.env;
console.log(MNEMONIC,PROJECT_ID);
const HDWalletProvider = require('@truffle/hdwallet-provider');

let wallet = new HDWalletProvider(MNEMONIC, `https://goerli.infura.io/v3/${PROJECT_ID}`)