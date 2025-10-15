export interface WalletOption {
  id: string;
  name: string;
  icon: string;
  description: string;
  installed?: boolean;
}

export interface WalletData {
  address: string;
  balance: string;
  chain: string;
  isConnected: boolean;
}

export interface Transaction {
  id: string;
  type: "donation" | "withdrawal" | "transfer";
  from: string;
  to: string;
  amount: string;
  time: string;
  status: "success" | "pending" | "failed";
  hash?: string;
  blockNumber?: number;
}
