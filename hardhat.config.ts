import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

const MEZO_MAINNET_RPC_URL = process.env.MEZO_MAINNET_RPC_URL || "https://mainnet.mezo.public.validationcloud.io/";
const MEZO_TESTNET_RPC_URL = process.env.MEZO_TESTNET_RPC_URL || "https://rpc.test.mezo.org";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "0x0000000000000000000000000000000000000000000000000000000000000000";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      evmVersion: "london",
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    mezo_mainnet: {
      url: MEZO_MAINNET_RPC_URL,
      chainId: 31612,
      accounts: [PRIVATE_KEY],
    },
    mezo_testnet: {
      url: MEZO_TESTNET_RPC_URL,
      chainId: 31611,
      accounts: [PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: {
      mezo_mainnet: "NO_API_KEY_NEEDED",
      mezo_testnet: "NO_API_KEY_NEEDED",
    },
    customChains: [
      {
        network: "mezo_mainnet",
        chainId: 31612,
        urls: {
          apiURL: "https://explorer.mezo.org/api",
          browserURL: "https://explorer.mezo.org",
        },
      },
      {
        network: "mezo_testnet",
        chainId: 31611,
        urls: {
          apiURL: "https://explorer.test.mezo.org/api",
          browserURL: "https://explorer.test.mezo.org",
        },
      },
    ],
  },
};

export default config;
