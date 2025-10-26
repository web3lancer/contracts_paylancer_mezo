# Mezo Contracts - Deployment Guide

Smart contract scripts for Mezo protocol integration testing and deployment.

## Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Testnet or Mainnet RPC access

### Installation

```bash
cd ignore1/mezo-contracts
npm install
```

## Configuration

Create `.env` file in the contracts directory:

```env
# Mezo RPC URLs
MEZO_TESTNET_RPC_URL=https://rpc.test.mezo.org
MEZO_MAINNET_RPC_URL=https://mainnet.mezo.public.validationcloud.io/

# Deployer wallet private key (for deployments only)
PRIVATE_KEY=0x0000000000000000000000000000000000000000000000000000000000000000
```

## File Structure

```
mezo-contracts/
├── contracts/          # Solidity smart contracts
├── scripts/            # Deployment and test scripts
├── abi/                # Contract ABIs for frontend
├── hardhat.config.ts   # Hardhat configuration
├── package.json        # Dependencies
└── env.sample          # Example environment
```

## Hardhat Configuration

The `hardhat.config.ts` includes:
- **EVM Version**: London (required for Mezo)
- **Networks**: 
  - `mezo_testnet` (chainId: 31611)
  - `mezo_mainnet` (chainId: 31612)
- **Compiler**: Solidity 0.8.20 with optimizations

## Commands

### Compile Contracts

```bash
npm run compile
```

Compiles all Solidity contracts and generates ABIs.

### Run Tests

```bash
npm run test
```

Runs hardhat test suite (if tests are configured).

### Deploy to Testnet

```bash
npm run deploy:testnet
```

Deploys contracts to Mezo testnet.

### Deploy to Mainnet

```bash
npm run deploy:mainnet
```

Deploys contracts to Mezo mainnet.

## Writing Deployment Scripts

Create scripts in `scripts/` directory:

```typescript
// scripts/deploy.ts
import { ethers } from "hardhat";

async function main() {
  console.log("Starting deployment...");

  const signer = (await ethers.getSigners())[0];
  console.log("Deploying with:", signer.address);

  // Deploy your contract
  // const MyContract = await ethers.getContractFactory("MyContract");
  // const contract = await MyContract.deploy();
  // await contract.deploymentTransaction()?.wait();

  console.log("Deployment complete!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

Run with:
```bash
hardhat run scripts/deploy.ts --network mezo_testnet
```

## Verifying Contracts

### Manual Verification

1. Get the deployment address from deployment script output
2. Go to [Mezo Explorer](https://explorer.test.mezo.org/) (testnet)
3. Search for the contract address
4. Click "Verify & Publish"
5. Upload the flattened contract code

### Using Hardhat Verify

```bash
hardhat verify --network mezo_testnet DEPLOYED_ADDRESS "constructor args"
```

## Testing Against Network

### Query Block Number

```typescript
const blockNumber = await ethers.provider.getBlockNumber();
console.log("Current block:", blockNumber);
```

### Check Balance

```typescript
const balance = await ethers.provider.getBalance("0x...");
console.log("Balance:", ethers.formatEther(balance), "BTC");
```

### Estimate Costs

Use the custom Mezo RPC method:

```typescript
const costEstimate = await ethers.provider.send("mezo_estimateCost", [{
  from: "0x...",
  to: "0x...",
  value: "1000000000000000000", // 1 BTC in wei
}]);
```

## Common Tasks

### Get Account Nonce

```typescript
const nonce = await ethers.provider.getTransactionCount("0x...");
console.log("Nonce:", nonce);
```

### Get Gas Price

```typescript
const gasPrice = await ethers.provider.getGasPrice();
console.log("Gas price:", ethers.formatUnits(gasPrice, "gwei"), "gwei");
```

### Interact with Existing Contract

```typescript
const CONTRACT_ADDRESS = "0x...";
const ABI = [...]; // Import ABI

const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
const result = await contract.someFunction();
```

## Troubleshooting

### "Cannot find module 'hardhat'"
```bash
npm install --save-dev hardhat
```

### RPC Connection Failed
- Check `.env` file has correct RPC URLs
- Verify network is up (check explorer first)
- Try fallback RPC URLs

### Gas Estimation Too High
- Check collateral/debt values in MUSD (18 decimals)
- Use `mezo_estimateCost` for accurate fee estimation
- Testnet gas prices may be different than mainnet

### Transaction Reverted
- Check account has sufficient balance
- Verify contract addresses match network
- Check constructor arguments match deployment

## Security Best Practices

1. **Never commit `.env` files**
   - `.env` is in `.gitignore`
   - Use environment variables in CI/CD

2. **Use testnet first**
   - Always test on testnet before mainnet
   - Verify contract behavior with small amounts

3. **Verify deployment address**
   - Double-check contract address after deployment
   - Never trust unofficial explorers

4. **Protect private keys**
   - Use hardware wallets for mainnet
   - Use separate accounts for testnet/mainnet
   - Rotate keys regularly

## Network Information

### Mezo Testnet (31611)
- RPC: https://rpc.test.mezo.org
- Explorer: https://explorer.test.mezo.org/
- Faucet: [Get testnet BTC](https://faucet.test.mezo.org/)

### Mezo Mainnet (31612)
- RPC: https://mainnet.mezo.public.validationcloud.io/
- Explorer: https://explorer.mezo.org/
- Block time: ~12 seconds
- Gas: Similar to Ethereum

## Important Addresses

All addresses are configured in `src/integrations/mezo/contracts/addresses.ts`

Key tokens:
- **MUSD** (Mezo USD stablecoin)
- **tBTC** (Wrapped Bitcoin on Mezo)

## Need Help?

- [Mezo Documentation](https://docs.mezo.org)
- [Hardhat Documentation](https://hardhat.org/docs)
- Check contract ABIs in `abi/` folder
- Review frontend integration in `src/integrations/mezo/`
