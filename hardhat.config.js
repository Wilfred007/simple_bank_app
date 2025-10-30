// hardhat.config.js
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

console.log("🔧 Loading Hardhat configuration...");

const BASE_MAINNET_RPC_URL = process.env.BASE_MAINNET_RPC_URL || "https://mainnet.base.org";
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const BASESCAN_API_KEY = process.env.BASESCAN_API_KEY;

// Ensure private key is provided
if (!PRIVATE_KEY) {
  console.warn("⚠️  PRIVATE_KEY not found in environment variables");
  console.warn("📝 Create a .env file with your private key:");
  console.warn("   PRIVATE_KEY=your_wallet_private_key_here");
  console.warn("   BASE_MAINNET_RPC_URL=https://mainnet.base.org");
  console.warn("   BASESCAN_API_KEY=your_basescan_api_key_here");
} else {
  console.log("✅ Private key loaded");
}

if (!BASESCAN_API_KEY) {
  console.warn("⚠️  BASESCAN_API_KEY not found - contract verification will fail");
  console.warn("📝 Get your API key from https://basescan.org/myapikey");
} else {
  console.log("✅ Basescan API key loaded");
}

console.log("🌐 RPC URL:", BASE_MAINNET_RPC_URL);

/** @type import('hardhat/config').HardhatUserConfig */
const config = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true,
    },
  },
  
  networks: {
    // Development network (local)
    hardhat: {
      chainId: 31337,
      gas: "auto",
      gasPrice: "auto",
      accounts: {
        mnemonic: "test test test test test test test test test test test junk",
        count: 20,
      },
    },
    
    // Local development
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
    
    // Base Mainnet
    baseMainnet: {
      url: BASE_MAINNET_RPC_URL,
      chainId: 8453,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      gas: "auto",
      gasPrice: "auto", 
      gasMultiplier: 1.2,
      timeout: 60000,
    },
  },
  
  // Contract verification - Etherscan API V2 format
  etherscan: {
    apiKey: BASESCAN_API_KEY || "",
    customChains: [
      {
        network: "baseMainnet",
        chainId: 8453,
        urls: {
          apiURL: "https://api.basescan.org/api",
          browserURL: "https://basescan.org"
        }
      }
    ]
  },
  
  // Sourcify verification (optional)
  sourcify: {
    enabled: false
  },
  
  // Gas reporting
  gasReporter: {
    enabled: process.env.REPORT_GAS === "true",
    currency: "USD",
    gasPrice: 1,
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
  },
  
  // Contract paths
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  
  // Mocha testing configuration
  mocha: {
    timeout: 60000,
  },
  
  // Default network for Hardhat tasks
  defaultNetwork: "hardhat",
};

console.log("✅ Hardhat configuration loaded successfully");
console.log("📋 Available networks:", Object.keys(config.networks || {}));

module.exports = config;