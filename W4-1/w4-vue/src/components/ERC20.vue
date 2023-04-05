<script>
import { ethers } from 'ethers'

import erc2612Addr from '../../deployments/dev/MyERC2612.json'
import erc2612Abi from '../../deployments/abi/MyERC2612.json'

import bankAddr from '../../deployments/dev/Vault2612.json'
import bankAbi from '../../deployments/abi/Vault2612.json'

export default {

  name: 'erc20',

  data() {
    return {
      account: null,
      recipient: null,
      amount: null,
      depositAmount: null,
      depositAddress: null,
  
    }
  },

  async created() {
  },

  methods: {
    async connect() {
      await this.initProvider()
      await this.initAccount()

      // 如果获取到了账号,进行合约初始化，并读取合约数据
      if (this.account) {
        this.initContract()
        this.readContract();
      }

    },

    async initProvider(){
      if(window.ethereum) {
          this.provider = new ethers.providers.Web3Provider(window.ethereum);
          let network = await this.provider.getNetwork()
          this.chainId = network.chainId;
          console.log("chainId:", this.chainId);

      } else{
        console.log("Need install MetaMask")
      }
    },

    async initAccount(){
        try {
          this.accounts = await this.provider.send("eth_requestAccounts", []);
          console.log("accounts:" + this.accounts);
          this.account = this.accounts[0];
          // ERC2612:0xFac37C3523eB1e4Fec597e7AF039BFD1cc87b24F
          // vault:0x032f6D03a6EdbDFd5a9d43B96A4aE4225B20793d
          //打印这两个地址
          console.log("ERC2612:"+"0xFac37C3523eB1e4Fec597e7AF039BFD1cc87b24F");
          console.log("vault:"+"0x032f6D03a6EdbDFd5a9d43B96A4aE4225B20793d");
          this.signer = this.provider.getSigner()
        } catch(error){
            console.log("User denied account access", error)
        }
    },

    async initContract() {
      console.log("erc2612Addr.address:"+erc2612Addr.address);
      this.erc20Token = new ethers.Contract(erc2612Addr.address, 
        erc2612Abi, this.signer);
      console.log("bankAddr.address:"+bankAddr.address);
      this.bank = new ethers.Contract(bankAddr.address, 
        bankAbi, this.signer);

    }, 

    readContract() {
      this.bank.balances(this.account).then((r) => {
        this.depositAmount = ethers.utils.formatUnits(r, 18);
      });
      
    },

    //q:3635c9adc5dea00000 转十进制是多少
    //a: 1000000000000000000
    //q:帮我修改一下代码 获取到gasprice 和预估gas 并添加到合约的调用里面
    
    approve(){
      let amount = ethers.utils.parseUnits(this.amount, 18);
      console.log("amount:"+amount);
      //预估gas
      let gas =  this.erc20Token.estimateGas.approve(this.recipient, amount).then((r) => {
        console.log("gasLimit:"+r);
      });
      //调用合约的时候怎么指定gas

      this.erc20Token.approve(this.recipient, amount,{gasLimit:200000}).then((r) => {
        console.log(r);  // 返回值不是true
        this.readContract();
      })
    },
    //q: 为什么这里的amount要乘以10的18次方，而不是直接用amount
    //a: 因为erc20的token的最小单位是wei，而我们的token是18位小数，所以要乘以10的18次方
    deposit(){
      let amount = ethers.utils.parseUnits(this.amount, 18);
      this.bank.deposit(amount).then((r)=>{
        console.log(r);
        this.readContract();
      });
    },


    async permitDeposit() {
      try {
        let nonce = await this.erc20Token.nonces(this.account);
        this.deadline = Math.ceil(Date.now() / 1000) + parseInt(20 * 60);
        console.log("amount:"+this.amount);
        let amount = ethers.utils.parseUnits(this.amount, 18);
        
        const domain = {
            name: await this.erc20Token.name(),
            version: '1',
            chainId: this.chainId,
            verifyingContract: erc2612Addr.address
        }

        const types = {
            Permit: [
              {name: "owner", type: "address"},
              {name: "spender", type: "address"},
              {name: "value", type: "uint256"},
              {name: "nonce", type: "uint256"},
              {name: "deadline", type: "uint256"}
            ]
        }

        const message = {
            owner: this.account,
            spender: bankAddr.address,
            value: amount,
            nonce: nonce ,
            deadline: this.deadline
        }

        const signature = await this.signer._signTypedData(domain, types, message);
        console.log(signature);

        const {v, r, s} = ethers.utils.splitSignature(signature);
        console.log("v:",v);
        console.log("r:",r);
        console.log("s:",s);
        let tx = await this.bank.permitDeposit( amount,this.deadline, v, r, s);
        console.log("tx",tx);
        let receipt = await tx.wait();
        console.log("receipt",receipt);
        this.readContract();
      } catch (e) {
        console.log(e);
        console.log(e.message);
        alert("Error , please check the console log:", e)
      }
      


    },
  }
}


</script>

<template>
  <div >

    <button @click="connect"> 链接钱包 </button>
    <div>
    我的地址 : {{  account }}
  </div>
      <div>
        <br /> 我的存款金额 : {{ depositAmount  }}

      </div>

      <div >
        <br />金额
        <input type="text" v-model="amount" />
        <br />授权地址:
        <input type="text" v-model="recipient" />
        <button @click="approve">授权</button>
        <br />存款地址:
        <input type="text" v-model="depositAddress" />
        <button @click="deposit">存款</button> 
        <br />
        <button @click="permitDeposit">离线授权存款</button>
      </div>



  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

div {
  font-size: 1.2rem;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
