require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();
require('@openzeppelin/hardhat-upgrades');
require("@nomicfoundation/hardhat-verify");

const { ProxyAgent, setGlobalDispatcher } = require("undici");
const proxyAgent = new ProxyAgent(process.env.PROXY_AGENT);
setGlobalDispatcher(proxyAgent);

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    sepolia: {
      url:process.env.SEPOLIA_RPC_URL, 
      accounts: [process.env.PRIVATE_KEY],
      chainId: 11155111, 
      proxyAddress: [process.env.PROXY_ADDRESS_SEPOLIA]
    },
    goerli: {
      url:process.env.GOERLI_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 5,
      constructorArgs: [process.env.EmitWinner_Goerli_Address]
    },
    localhost: {
      url: "http://127.0.0.1:8545/",
      chainId: 31337,
      proxyAddress: [process.env.PROXY_ADDRESS_LOCALHOST]
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_KEY
  },
  solidity: "0.8.4",
};
