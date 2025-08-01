require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-verify");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    hardhat: {
      chainId: 31337
    },
    morphHolesky: {
      url: "https://rpc-holesky.morphl2.io",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 2810,
      gasPrice: 2000000000, // 2 gwei
    }
  },
  etherscan: {
    apiKey: {
      morphHolesky: "abc"
    },
    customChains: [{
      network: "morphHolesky",
      chainId: 2810,
      urls: {
        apiURL: "https://explorer-holesky.morphl2.io/api",
        browserURL: "https://explorer-holesky.morphl2.io"
      }
    }]
  }
};