/**
 * Mezo Contract Query Script
 * Queries deployed Mezo contracts (tBTC, MUSD) on testnet
 * 
 * Run with: npx hardhat run scripts/query-contracts.ts --network mezo_testnet
 */

import { ethers } from "hardhat";

// Contract addresses on Mezo Testnet (from docs.md)
const MEZO_TESTNET_CONTRACT
  MUSD: "0x118917a40FAF1CD7a13dB0Ef56C86De7973Ac503",
  tBTC: "0x517f2982701695D4E52f1ECFBEf3ba31Df470161",
  Portal: "0x6978E3e11b8Bc34ea836C1706fC742aC4Cb6b0Db",
  BitcoinDepositor: "0x7205535961649C4F94e1b4BAfBe26d23e2bbDd84",
};

// Standard ERC20 ABI (minimal for queries)
const ERC20_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
];

async function main() {
  console.log("\n=== Mezo Contract Query Test ===\n");

  const [signer] = await ethers.getSigners();
  const signerAddress = await signer.getAddress();

  console.log(`📍 Using wallet address: ${signerAddress}\n`);

  // Test MUSD Token
  console.log("--- Querying MUSD Token ---");
  try {
    const musdContract = new ethers.Contract(
      MEZO_TESTNET_CONTRACTS.MUSD,
      ERC20_ABI,
      signer
    );

    const musdName = await musdContract.name();
    const musdSymbol = await musdContract.symbol();
    const musdDecimals = await musdContract.decimals();
    const musdTotalSupply = await musdContract.totalSupply();
    const musdBalance = await musdContract.balanceOf(signerAddress);

    console.log(`✅ Name: ${musdName}`);
    console.log(`✅ Symbol: ${musdSymbol}`);
    console.log(`✅ Decimals: ${musdDecimals}`);
    console.log(
      `✅ Total Supply: ${ethers.formatUnits(musdTotalSupply, musdDecimals)} ${musdSymbol}`
    );
    console.log(
      `✅ Your Balance: ${ethers.formatUnits(musdBalance, musdDecimals)} ${musdSymbol}`
    );
  } catch (error: any) {
    console.log(`❌ MUSD query failed: ${error.message}`);
  }

  // Test tBTC Token
  console.log("\n--- Querying tBTC Token ---");
  try {
    const tbtcContract = new ethers.Contract(
      MEZO_TESTNET_CONTRACTS.tBTC,
      ERC20_ABI,
      signer
    );

    const tbtcName = await tbtcContract.name();
    const tbtcSymbol = await tbtcContract.symbol();
    const tbtcDecimals = await tbtcContract.decimals();
    const tbtcTotalSupply = await tbtcContract.totalSupply();
    const tbtcBalance = await tbtcContract.balanceOf(signerAddress);

    console.log(`✅ Name: ${tbtcName}`);
    console.log(`✅ Symbol: ${tbtcSymbol}`);
    console.log(`✅ Decimals: ${tbtcDecimals}`);
    console.log(
      `✅ Total Supply: ${ethers.formatUnits(tbtcTotalSupply, tbtcDecimals)} ${tbtcSymbol}`
    );
    console.log(
      `✅ Your Balance: ${ethers.formatUnits(tbtcBalance, tbtcDecimals)} ${tbtcSymbol}`
    );
  } catch (error: any) {
    console.log(`❌ tBTC query failed: ${error.message}`);
  }

  console.log("\n=== Query Complete ===\n");
  console.log("✅ Contract query tests finished!");
  console.log(
    "Note: If balances are 0, you need to get testnet tokens from a faucet.\n"
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Query failed:");
    console.error(error);
    process.exit(1);
  });
