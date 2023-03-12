require("@nomicfoundation/hardhat-toolbox");

let dotenv = require('dotenv')
dotenv.config({ path: "./.env" })

const {ProxyAgent, setGlobalDispatcher} = require("undici")
const proxyagent= new ProxyAgent("http://127.0.0.1:7777")
setGlobalDispatcher(proxyagent)

const mnemonic = process.env.MNEMONIC
const scankey = process.env.ETHERSCAN_API_KEY
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks:{
    localdev: {
      url:"http://127.0.0.1:8545/",
      chainId: 31337,
      gas: 12000000,
      accounts: {
        mnemonic: mnemonic,
      },
    },
    development: {
      url:"http://127.0.0.1:7545",
      chainId: 5777,
      accounts: {
        mnemonic: mnemonic,
      },
    },
    goerli: {
      url:"https://goerli.infura.io/v3/b2d9806966aa4b8db526b34cce48df5a",
      chainId: 5,
      accounts:  [
        "dae039cbc1be2ece160196bbf4edb459b10f5caf9aad3fff8685689513cbf8f9",
        "e2cdd369d44ea83f9365366b41a35382a5e82f1e86622bcc3f0c9d0453a072a7"
      ],
    },
  },
  etherscan: {
    apiKey: scankey
}
};
