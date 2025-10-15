/**
 * Wallet Store - Client-side state management for wallet and ETH pricing
 * This provides consistent ETH-to-PHP/USD conversion and wallet state across the app
 */

// Simulated ETH Price Data for Presentation
export const ETH_PRICE = {
  USD: 3400, // 1 ETH = $3,400 USD
  PHP: 135000, // 1 ETH = ₱135,000 PHP (assuming 1 USD = ~39.70 PHP)
};

export interface WalletData {
  connected: boolean;
  address: string;
  type: string;
  balance: string;
  network: string;
}

export interface Transaction {
  id: string;
  type: 'donation' | 'withdrawal' | 'campaign_creation';
  amount: string;
  amountETH: number;
  amountUSD: string;
  amountPHP: string;
  from: string;
  to: string;
  campaign?: string;
  txHash: string;
  timestamp: string;
  status: 'success' | 'pending' | 'failed';
  gasFee: number;
}

/**
 * Convert ETH to PHP
 */
export function ethToPHP(ethAmount: number | string): string {
  const amount = typeof ethAmount === 'string' ? parseFloat(ethAmount) : ethAmount;
  return (amount * ETH_PRICE.PHP).toLocaleString('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Convert ETH to USD
 */
export function ethToUSD(ethAmount: number | string): string {
  const amount = typeof ethAmount === 'string' ? parseFloat(ethAmount) : ethAmount;
  return (amount * ETH_PRICE.USD).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Format ETH amount with proper decimals
 */
export function formatETH(ethAmount: number | string): string {
  const amount = typeof ethAmount === 'string' ? parseFloat(ethAmount) : ethAmount;
  return amount.toFixed(4);
}

/**
 * Get wallet data from storage
 */
export function getWalletData(): WalletData | null {
  if (typeof window === 'undefined') return null;
  
  const walletDataLS = localStorage.getItem('wallet');
  const walletDataSS = sessionStorage.getItem('wallet');
  const walletData = walletDataLS || walletDataSS;
  
  if (!walletData) return null;
  
  try {
    const parsed = JSON.parse(walletData);
    const balance = sessionStorage.getItem('walletBalance') || '0.00';
    
    return {
      connected: parsed.connected || false,
      address: parsed.address || '',
      type: parsed.type || '',
      balance: balance,
      network: parsed.network || 'Ethereum',
    };
  } catch (error) {
    console.error('Error parsing wallet data:', error);
    return null;
  }
}

/**
 * Save wallet data to storage
 */
export function saveWalletData(wallet: Partial<WalletData>): void {
  if (typeof window === 'undefined') return;
  
  const current = getWalletData();
  const updated = { ...current, ...wallet };
  
  const storageData = {
    connected: updated.connected,
    address: updated.address,
    type: updated.type,
    network: updated.network || 'Ethereum',
  };
  
  localStorage.setItem('wallet', JSON.stringify(storageData));
  sessionStorage.setItem('wallet', JSON.stringify(storageData));
  
  if (updated.balance) {
    sessionStorage.setItem('walletBalance', updated.balance);
  }
}

/**
 * Update wallet balance
 */
export function updateWalletBalance(newBalance: string): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem('walletBalance', newBalance);
}

/**
 * Get all transactions
 */
export function getTransactions(): Transaction[] {
  if (typeof window === 'undefined') return [];
  
  const txData = sessionStorage.getItem('transactions');
  if (!txData) return [];
  
  try {
    return JSON.parse(txData);
  } catch (error) {
    console.error('Error parsing transactions:', error);
    return [];
  }
}

/**
 * Add a new transaction
 */
export function addTransaction(tx: Omit<Transaction, 'id' | 'timestamp' | 'amountUSD' | 'amountPHP'>): Transaction {
  if (typeof window === 'undefined') {
    throw new Error('Cannot add transaction on server side');
  }
  
  const transactions = getTransactions();
  
  const newTx: Transaction = {
    ...tx,
    id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }),
    amountUSD: `$${ethToUSD(tx.amountETH)}`,
    amountPHP: `₱${ethToPHP(tx.amountETH)}`,
  };
  
  transactions.unshift(newTx);
  
  // Keep only last 100 transactions
  if (transactions.length > 100) {
    transactions.splice(100);
  }
  
  sessionStorage.setItem('transactions', JSON.stringify(transactions));
  
  return newTx;
}

/**
 * Generate random wallet address
 */
export function generateWalletAddress(): string {
  const chars = '0123456789abcdef';
  let address = '0x';
  for (let i = 0; i < 40; i++) {
    address += chars[Math.floor(Math.random() * chars.length)];
  }
  return address;
}

/**
 * Truncate wallet address for display
 */
export function truncateAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Generate transaction hash
 */
export function generateTxHash(): string {
  const chars = '0123456789abcdef';
  let hash = '0x';
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}

/**
 * Simulate wallet connection
 */
export async function simulateWalletConnection(walletType: string): Promise<WalletData> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));
  
  const address = generateWalletAddress();
  const balance = (Math.random() * 10 + 5).toFixed(4); // Random balance between 5-15 ETH
  
  const wallet: WalletData = {
    connected: true,
    address: truncateAddress(address),
    type: walletType,
    balance: balance,
    network: 'Ethereum',
  };
  
  saveWalletData(wallet);
  
  return wallet;
}

/**
 * Disconnect wallet
 */
export function disconnectWallet(): void {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('wallet');
  sessionStorage.removeItem('wallet');
  sessionStorage.removeItem('walletBalance');
}

/**
 * Calculate gas fee (simulated)
 */
export function calculateGasFee(transactionType: 'donation' | 'withdrawal' | 'campaign_creation'): number {
  switch (transactionType) {
    case 'donation':
      return 0.002;
    case 'withdrawal':
      return 0.003;
    case 'campaign_creation':
      return 0.005;
    default:
      return 0.002;
  }
}

/**
 * Process donation (simulate blockchain transaction)
 */
export async function processDonation(
  amount: number,
  campaignId: string,
  campaignTitle: string,
  campaignAddress: string
): Promise<Transaction> {
  const wallet = getWalletData();
  if (!wallet || !wallet.connected) {
    throw new Error('Wallet not connected');
  }
  
  const gasFee = calculateGasFee('donation');
  const totalCost = amount + gasFee;
  
  if (totalCost > parseFloat(wallet.balance)) {
    throw new Error('Insufficient balance');
  }
  
  // Simulate blockchain delay
  await new Promise((resolve) => setTimeout(resolve, 2500));
  
  // Update balance
  const newBalance = (parseFloat(wallet.balance) - totalCost).toFixed(4);
  updateWalletBalance(newBalance);
  
  // Create transaction
  const tx = addTransaction({
    type: 'donation',
    amount: `${amount} ETH`,
    amountETH: amount,
    from: wallet.address,
    to: campaignAddress,
    campaign: campaignTitle,
    txHash: generateTxHash(),
    status: 'success',
    gasFee: gasFee,
  });
  
  // Update campaign raised amount
  updateCampaignRaised(campaignId, amount);
  
  return tx;
}

/**
 * Process withdrawal (simulate blockchain transaction)
 */
export async function processWithdrawal(
  amount: number,
  campaignId: string,
  campaignTitle: string,
  campaignAddress: string
): Promise<Transaction> {
  const wallet = getWalletData();
  if (!wallet || !wallet.connected) {
    throw new Error('Wallet not connected');
  }
  
  // Simulate blockchain delay
  await new Promise((resolve) => setTimeout(resolve, 2500));
  
  // Update balance
  const newBalance = (parseFloat(wallet.balance) + amount).toFixed(4);
  updateWalletBalance(newBalance);
  
  // Create transaction
  const tx = addTransaction({
    type: 'withdrawal',
    amount: `${amount} ETH`,
    amountETH: amount,
    from: campaignAddress,
    to: wallet.address,
    campaign: campaignTitle,
    txHash: generateTxHash(),
    status: 'success',
    gasFee: calculateGasFee('withdrawal'),
  });
  
  return tx;
}

/**
 * Update campaign raised amount
 */
function updateCampaignRaised(campaignId: string, additionalAmount: number): void {
  if (typeof window === 'undefined') return;
  
  const campaignsData = sessionStorage.getItem('userCampaigns');
  if (!campaignsData) return;
  
  try {
    const campaigns = JSON.parse(campaignsData);
    const campaignIndex = campaigns.findIndex((c: any) => c.id === campaignId);
    
    if (campaignIndex !== -1) {
      const campaign = campaigns[campaignIndex];
      const currentRaised = parseFloat(campaign.raised.replace(' ETH', '')) || 0;
      const newRaised = currentRaised + additionalAmount;
      const goal = parseFloat(campaign.goal.replace(' ETH', '')) || 100;
      
      campaigns[campaignIndex] = {
        ...campaign,
        raised: `${newRaised.toFixed(1)} ETH`,
        percentage: Math.min(100, Math.round((newRaised / goal) * 100)),
        donors: (campaign.donors || 0) + 1,
      };
      
      sessionStorage.setItem('userCampaigns', JSON.stringify(campaigns));
    }
  } catch (error) {
    console.error('Error updating campaign:', error);
  }
}

/**
 * Get current ETH price info
 */
export function getETHPriceInfo() {
  return {
    usd: ETH_PRICE.USD,
    php: ETH_PRICE.PHP,
    formatted: {
      usd: `$${ETH_PRICE.USD.toLocaleString()}`,
      php: `₱${ETH_PRICE.PHP.toLocaleString()}`,
    },
  };
}

