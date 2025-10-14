/**
 * Generate and download a receipt for a donation
 */
export function generateReceipt(donation: {
  campaign: string;
  amount: string;
  txHash: string;
  date: string;
  from?: string;
  to?: string;
}) {
  // Create receipt content
  const receiptContent = `
╔════════════════════════════════════════════════════════════════╗
║                      DONATION RECEIPT                          ║
║                        BlockBayan                              ║
╚════════════════════════════════════════════════════════════════╝

Campaign:        ${donation.campaign}
Amount:          ${donation.amount}
Date:            ${donation.date}

Transaction Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
From:            ${donation.from || "N/A"}
To:              ${donation.to || "N/A"}
TX Hash:         ${donation.txHash}

This receipt confirms your donation on the blockchain.
All transactions are permanent and verifiable.

Thank you for your contribution!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Generated: ${new Date().toLocaleString()}
BlockBayan - Transparent Blockchain Fundraising
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

  // Create a blob from the receipt content
  const blob = new Blob([receiptContent], { type: "text/plain" });
  const url = window.URL.createObjectURL(blob);

  // Create a temporary link element and trigger download
  const link = document.createElement("a");
  link.href = url;
  link.download = `receipt-${donation.txHash.slice(0, 10)}-${Date.now()}.txt`;
  document.body.appendChild(link);
  link.click();

  // Clean up
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/**
 * Get blockchain explorer URL for a transaction
 */
export function getExplorerUrl(
  txHash: string,
  chain: string = "Ethereum"
): string {
  const explorers: { [key: string]: string } = {
    Ethereum: `https://etherscan.io/tx/${txHash}`,
    Polygon: `https://polygonscan.com/tx/${txHash}`,
    Base: `https://basescan.org/tx/${txHash}`,
    Sepolia: `https://sepolia.etherscan.io/tx/${txHash}`,
  };

  return explorers[chain] || explorers["Ethereum"];
}

/**
 * Open transaction in blockchain explorer
 */
export function openInExplorer(txHash: string, chain: string = "Ethereum") {
  const url = getExplorerUrl(txHash, chain);
  window.open(url, "_blank", "noopener,noreferrer");
}
