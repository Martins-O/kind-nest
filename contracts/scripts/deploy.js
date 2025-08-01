const hre = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  console.log("🚀 Starting deployment to Morph Holesky testnet...");
  
  // Get the deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  
  // Check balance
  const balance = await deployer.getBalance();
  console.log("Account balance:", hre.ethers.utils.formatEther(balance), "ETH");
  
  if (balance.eq(0)) {
    console.log("⚠️  Warning: Account balance is 0. Make sure to fund your account with ETH from the Morph faucet:");
    console.log("🚰 Faucet: https://bridge-holesky.morphl2.io/faucet");
  }

  // Deploy ExpenseFactory
  console.log("\n📄 Deploying ExpenseFactory...");
  const ExpenseFactory = await hre.ethers.getContractFactory("ExpenseFactory");
  const expenseFactory = await ExpenseFactory.deploy();
  await expenseFactory.deployed();
  
  console.log("✅ ExpenseFactory deployed to:", expenseFactory.address);
  
  // Wait for a few block confirmations
  console.log("⏳ Waiting for block confirmations...");
  await expenseFactory.deployTransaction.wait(3);
  
  // Create deployment info
  const deploymentInfo = {
    network: hre.network.name,
    chainId: hre.network.config.chainId || "unknown",
    contracts: {
      ExpenseFactory: {
        address: expenseFactory.address,
        txHash: expenseFactory.deployTransaction.hash,
        blockNumber: expenseFactory.deployTransaction.blockNumber,
      }
    },
    deployer: deployer.address,
    deployedAt: new Date().toISOString(),
    gasUsed: {
      ExpenseFactory: (await expenseFactory.deployTransaction.wait()).gasUsed.toString()
    }
  };

  // Save deployment info
  const deploymentsDir = path.join(__dirname, '..', 'deployments');
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }
  
  const deploymentFile = path.join(deploymentsDir, `${hre.network.name}.json`);
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
  
  console.log("\n📋 Deployment Summary:");
  console.log("Network:", hre.network.name);
  console.log("Chain ID:", hre.network.config.chainId || "unknown");
  console.log("ExpenseFactory:", expenseFactory.address);
  console.log("Gas used:", deploymentInfo.gasUsed.ExpenseFactory);
  console.log("Deployment info saved to:", deploymentFile);
  
  // Save contract addresses for frontend
  const frontendDir = path.join(__dirname, '..', '..', 'frontend', 'lib');
  if (!fs.existsSync(frontendDir)) {
    fs.mkdirSync(frontendDir, { recursive: true });
  }
  
  const contractsFile = path.join(frontendDir, 'contracts.ts');
  const contractsContent = `// Auto-generated contract addresses
// Generated on: ${new Date().toISOString()}

export const CONTRACTS = {
  EXPENSE_FACTORY: '${expenseFactory.address}' as const,
} as const;

export const NETWORK_INFO = {
  chainId: ${hre.network.config.chainId || 2810},
  name: '${hre.network.name}',
  rpcUrl: '${hre.network.config.url || 'https://rpc-holesky.morphl2.io'}',
} as const;
`;
  
  fs.writeFileSync(contractsFile, contractsContent);
  console.log("Contract addresses saved for frontend:", contractsFile);
  
  // Test the deployed contract
  console.log("\n🧪 Testing deployed contract...");
  try {
    const totalGroups = await expenseFactory.getTotalGroupsCount();
    console.log("✅ Contract is working! Total groups:", totalGroups.toString());
  } catch (error) {
    console.log("❌ Error testing contract:", error.message);
  }
  
  console.log("\n🎉 Deployment completed successfully!");
  console.log("\nNext steps:");
  console.log("1. Verify contract on Morph Explorer (optional)");
  console.log("2. Fund your account if balance is low");
  console.log("3. Update frontend environment variables");
  console.log("4. Test the application");
  
  if (hre.network.name === "morphHolesky") {
    console.log("\n🔍 Verify on Morph Explorer:");
    console.log(`https://explorer-holesky.morphl2.io/address/${expenseFactory.address}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });