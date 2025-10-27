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
  console.warn("   BASE_SEPOLIA_RPC_URL=https://sepolia.base.org");
} else {
  console.log("✅ Private key loaded");
}

console.log("🌐 RPC URL:", BASE_MAINNET_RPC_URL);

/** @type import('hardhat/config').HardhatUserConfig */
const config = {
  solidity: {
    version: "0.8.28", // Updated to match OpenZeppelin v5.0.0
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true, // Enable for better optimization
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
// baseMainnet: {
//   url: BASE_MAINNET_RPC_URL,
//   chainId: 8453,
//   accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
//   gas: "auto",
//   gasPrice: "auto", 
//   gasMultiplier: 1.2,
//   timeout: 60000,
// },
    
    // // Alternative network name (for compatibility)
    // "base-sepolia": {
    //   url: BASE_SEPOLIA_RPC_URL,
    //   chainId: 84532,
    //   accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    //   gas: "auto", 
    //   gasPrice: "auto",
    //   gasMultiplier: 1.2,
    //   timeout: 60000,
    // },

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
  
  // Contract verification
  etherscan: {
    apiKey: {
      baseSepolia: BASESCAN_API_KEY || "dummy",
      baseMainnet: BASESCAN_API_KEY || "dummy",
    },
    customChains: [
      {
        network: "baseMainnet",
        chainId: 8453,
        urls: {
          apiURL: "https://api-sepolia.basescan.org/api",
          browserURL: "https://sepolia.basescan.org"
        }
      },
      {
        network: "baseMainnet",
        chainId: 8453,
        urls: {
          apiURL: "https://mainnet.base.org",
          browserURL: "https://basescan.org" 
        }
      }
    ]
  },
  
  // Gas reporting
  gasReporter: {
    enabled: process.env.REPORT_GAS === "true",
    currency: "USD",
    gasPrice: 1, // In gwei
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
    timeout: 60000, // 60 seconds
  },
  
  // Default network for Hardhat tasks
  defaultNetwork: "hardhat",
};

console.log("✅ Hardhat configuration loaded successfully");
console.log("📋 Available networks:", Object.keys(config.networks || {}));

// Export the configuration
module.exports = config;


// import type { HardhatUserConfig } from "hardhat/config";
// import hardhatVerify from "@nomicfoundation/hardhat-verify";

// import hardhatToolboxViemPlugin from "@nomicfoundation/hardhat-toolbox-viem";
// import { configVariable } from "hardhat/config";

// const config: HardhatUserConfig = {
//  plugins: [hardhatToolboxViemPlugin, hardhatVerify],
//  solidity: {
//   profiles: {
//    default: {
//     version: "0.8.28",
//    },
//    production: {
//     version: "0.8.28",
//     settings: {
//      optimizer: {
//       enabled: true,
//       runs: 200,
//      },
//     },
//    },
//   },
//  },
//  verify: {
//   etherscan: {
//    apiKey: configVariable("ETHERSCAN_API_KEY"),
//   },
//  },
//  networks: {
//   hardhatMainnet: {
//    type: "edr-simulated",
//    chainType: "l1",
//   },
//   hardhatOp: {
//    type: "edr-simulated",
//    chainType: "op",
//   },
//   sepolia: {
//    type: "http",
//    chainType: "l1",
//    url: configVariable("SEPOLIA_RPC_URL"),
//    accounts: [configVariable("SEPOLIA_PRIVATE_KEY")],
//   },
//   baseSepolia: {
//    type: "http",
//    url: "https://sepolia.base.org",
//    accounts: [configVariable("BASE_SEPOLIA_PRIVATE_KEY")],
//   },
//   baseMainnet: {
//    type: "http",
//    url: "https://mainnet.base.org",
//    accounts: [configVariable("BASE_SEPOLIA_PRIVATE_KEY")],
//   },
//  },
// };

// export default config;