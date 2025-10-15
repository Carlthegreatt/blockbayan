// Blockchain configuration
export const SUPPORTED_CHAINS = {
  ETHEREUM: "ethereum",
  POLYGON: "polygon",
  BSC: "bsc",
  ARBITRUM: "arbitrum",
} as const;

export const CHAIN_INFO = {
  [SUPPORTED_CHAINS.ETHEREUM]: {
    name: "Ethereum",
    symbol: "ETH",
    decimals: 18,
    explorer: "https://etherscan.io",
  },
  [SUPPORTED_CHAINS.POLYGON]: {
    name: "Polygon",
    symbol: "MATIC",
    decimals: 18,
    explorer: "https://polygonscan.com",
  },
  [SUPPORTED_CHAINS.BSC]: {
    name: "BNB Smart Chain",
    symbol: "BNB",
    decimals: 18,
    explorer: "https://bscscan.com",
  },
  [SUPPORTED_CHAINS.ARBITRUM]: {
    name: "Arbitrum",
    symbol: "ETH",
    decimals: 18,
    explorer: "https://arbiscan.io",
  },
} as const;

// Wallet configuration
export const WALLET_STORAGE_KEY = "blockbayan_wallet";
export const USER_STORAGE_KEY = "blockbayan_user";

// Campaign categories
export const CAMPAIGN_CATEGORIES = [
  "Education",
  "Healthcare",
  "Disaster Relief",
  "Community Development",
  "Environmental",
  "Technology",
  "Arts & Culture",
  "Other",
] as const;

// Transaction types
export const TRANSACTION_TYPES = {
  DONATION: "donation",
  WITHDRAWAL: "withdrawal",
  TRANSFER: "transfer",
} as const;

// Status types
export const TRANSACTION_STATUS = {
  SUCCESS: "success",
  PENDING: "pending",
  FAILED: "failed",
} as const;

export const CAMPAIGN_STATUS = {
  ACTIVE: "active",
  COMPLETED: "completed",
  CLOSED: "closed",
} as const;
