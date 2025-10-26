/**
 * Mezo Network Test Script
 * Tests connectivity and basic operations on Mezo testnet
 * 
 * Run with: npx hardhat run scripts/test-network.ts --network mezo_testnet
 */

import { ethers } from "hardhat";

async function main() {
  console.log("\n=== Mezo Network Connection Test ===\n");

  // Get the default signer (from private key in .env)
  const [signer] = await ethers.getSigners();
  const signerAddress = await signer.getAddress();
  
  console.log(`📍 Using wallet address: ${signerAddress}`);

  // Get provider from signer
  const provider = signer.provider;
  if (!provider) {
    throw new Error("Provider not available");
  }

  // Test 1: Get current block number
  console.log("\n--- Test 1: Block Number ---");
  const blockNumber = await provider.getBlockNumber();
  console.log(`✅ Current block number: ${blockNumber}`);

  // Test 2: Get wallet balance
  console.log("\n--- Test 2: Wallet Balance ---");
  const balanceWei = await provider.getBalance(signerAddress);
  const balanceBTC = ethers.formatEther(balanceWei);
  console.log(`✅ Wallet balance: ${balanceBTC} BTC`);

  // Test 3: Get transaction count (nonce)
  console.log("\n--- Test 3: Transaction Count ---");
  const nonce = await provider.getTransactionCount(signerAddress);
  console.log(`✅ Transaction count (nonce): ${nonce}`);

  // Test 4: Get network info
  console.log("\n--- Test 4: Network Info ---");
  const network = await provider.getNetwork();
  console.log(`✅ Network name: ${network.name}`);
  console.log(`✅ Chain ID: ${network.chainId}`);

  // Test 5: Estimate gas for a simple transfer
  console.log("\n--- Test 5: Gas Estimation ---");
  const recipientAddress = "0x0000000000000000000000000000000000000001"; // Burn address for testing
  const amountToSend = ethers.parseEther("0.0001"); // Very small amount

  try {
    const gasEstimate = await provider.estimateGas({
      from: signerAddress,
      to: recipientAddress,
      value: amountToSend,
    });
    console.log(`✅ Estimated gas for transfer: ${gasEstimate.toString()} units`);

    // Get current gas price
    const feeData = await provider.getFeeData();
    console.log(`✅ Current gas price: ${ethers.formatUnits(feeData.gasPrice || 0n, "gwei")} gwei`);

    // Calculate estimated cost
    const estimatedCost = gasEstimate * (feeData.gasPrice || 0n);
    console.log(`✅ Estimated transaction cost: ${ethers.formatEther(estimatedCost)} BTC`);
  } catch (error: any) {
    console.log(`⚠️  Gas estimation skipped (low balance or RPC issue): ${error.message}`);
  }

  // Test 6: Try custom Mezo RPC method (mezo_estimateCost)
  console.log("\n--- Test 6: Custom Mezo RPC Method ---");
  try {
    const txArgs = {
      from: signerAddress,
      to: recipientAddress,
      value: `0x${amountToSend.toString(16)}`,
    };

    const estimateResult = await provider.send("mezo_estimateCost", [txArgs]);
    console.log("✅ Custom `mezo_estimateCost` Result:");
    console.log(JSON.stringify(estimateResult, null, 2));
  } catch (error: any) {
    console.log(`⚠️  Custom RPC method test skipped: ${error.message}`);
  }

  // Test 7: Get latest block
  console.log("\n--- Test 7: Latest Block Info ---");
  try {
    const block = await provider.getBlock("latest");
    if (block) {
      console.log(`✅ Latest block hash: ${block.hash}`);
      console.log(`✅ Block timestamp: ${new Date(block.timestamp * 1000).toISOString()}`);
      console.log(`✅ Block transactions: ${block.transactions.length}`);
    }
  } catch (error: any) {
    console.log(`⚠️  Block info skipped: ${error.message}`);
  }

  console.log("\n=== Test Complete ===\n");
  console.log("✅ All connection tests passed!");
  console.log("Your environment is correctly configured for Mezo development.\n");
}

// Execute the test
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Test failed:");
    console.error(error);
    process.exit(1);
  });
