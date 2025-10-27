// ignition/modules/SimpleBank.js
// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const SimpleBankModule = buildModule("SimpleBankModulev2", (m) => {
  console.log("🏦 Deploying SimpleBank contract...");
  
  // Deploy the SimpleBank contract (no constructor parameters needed)
  const simpleBank = m.contract("SimpleBank", []);
  
  console.log("✅ SimpleBank deployment configured");
  
  return { 
    simpleBank 
  };
});

module.exports = SimpleBankModule;
