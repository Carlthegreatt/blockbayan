"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import DashboardHeader from "@/components/layout/DashboardHeader";
import WithdrawFundsModal from "@/components/modals/WithdrawFundsModal";
import { generateReceipt, openInExplorer } from "@/lib/receipt-utils";
import { useToast } from "@/components/ui/toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowUpRight,
  TrendingUp,
  Heart,
  DollarSign,
  Calendar,
  ExternalLink,
  Download,
  X,
  Wallet,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

// Wallet options data
interface WalletOption {
  id: string;
  name: string;
  icon: string;
  description: string;
  installed?: boolean;
}

const walletOptions: WalletOption[] = [
  {
    id: "metamask",
    name: "MetaMask",
    icon: "🦊",
    description: "Connect with MetaMask browser extension",
    installed: true,
  },
  {
    id: "walletconnect",
    name: "WalletConnect",
    icon: "📱",
    description: "Scan QR code with your mobile wallet",
    installed: true,
  },
  {
    id: "coinbase",
    name: "Coinbase Wallet",
    icon: "🔵",
    description: "Connect with Coinbase Wallet",
    installed: true,
  },
  {
    id: "trustwallet",
    name: "Trust Wallet",
    icon: "🛡️",
    description: "Connect with Trust Wallet",
    installed: false,
  },
  {
    id: "phantom",
    name: "Phantom",
    icon: "👻",
    description: "Connect with Phantom wallet",
    installed: false,
  },
  {
    id: "rainbow",
    name: "Rainbow",
    icon: "🌈",
    description: "Connect with Rainbow wallet",
    installed: false,
  },
];

// Mock data
const mockCampaigns = [
  {
    id: "1",
    title: "Support Local Schools in Mindanao",
    goal: "50 ETH",
    raised: "32.5 ETH",
    percentage: 65,
    status: "active",
    deadline: "2025-11-30",
    chain: "Ethereum",
  },
  {
    id: "2",
    title: "Medical Aid for Typhoon Victims",
    goal: "100 ETH",
    raised: "87.2 ETH",
    percentage: 87,
    status: "active",
    deadline: "2025-12-15",
    chain: "Polygon",
  },
];

const mockDonations = [
  {
    id: "1",
    campaign: "Community Water Project",
    amount: "5 ETH",
    date: "2025-10-10",
    txHash: "0xabc123...def456",
    status: "success",
  },
  {
    id: "2",
    campaign: "Education Fund for Indigenous Youth",
    amount: "2.5 ETH",
    date: "2025-10-08",
    txHash: "0x789ghi...jkl012",
    status: "success",
  },
  {
    id: "3",
    campaign: "Disaster Relief Fund",
    amount: "10 ETH",
    date: "2025-10-05",
    txHash: "0x345mno...pqr678",
    status: "success",
  },
];

const mockTransactions = [
  {
    id: "1",
    type: "donation",
    campaign: "Support Local Schools",
    from: "0x742d...C2f4",
    to: "0x8e3b...A1d9",
    amount: "5 ETH",
    status: "success",
    timestamp: "2025-10-14 14:30:22",
    txHash: "0xabc123...def456",
  },
  {
    id: "2",
    type: "withdrawal",
    campaign: "Medical Aid Fund",
    from: "0x8e3b...A1d9",
    to: "0x742d...C2f4",
    amount: "20 ETH",
    status: "success",
    timestamp: "2025-10-13 10:15:45",
    txHash: "0x789ghi...jkl012",
  },
];

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showToast } = useToast();
  const tabParam = searchParams.get("tab") || "overview";
  const [activeTab, setActiveTab] = useState(tabParam);
  const [userCampaigns, setUserCampaigns] = useState<typeof mockCampaigns>([]);
  const [selectedCampaignForWithdraw, setSelectedCampaignForWithdraw] =
    useState<(typeof mockCampaigns)[0] | null>(null);

  // Wallet connection state
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [connectedWallet, setConnectedWallet] = useState<string>("");
  const [connectedAddress, setConnectedAddress] = useState<string>("");
  const [connecting, setConnecting] = useState<string | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    // Load user campaigns from sessionStorage
    const storedCampaigns = sessionStorage.getItem("userCampaigns");
    if (storedCampaigns) {
      try {
        const campaigns = JSON.parse(storedCampaigns);
        setUserCampaigns(campaigns);
      } catch (error) {
        console.error("Error loading campaigns:", error);
      }
    }

    // Load wallet connection data from localStorage
    const walletData = localStorage.getItem("wallet");
    if (walletData) {
      try {
        const { connected, address, type } = JSON.parse(walletData);
        setWalletConnected(connected);
        setConnectedAddress(address);
        setConnectedWallet(type);
      } catch (error) {
        console.error("Error loading wallet data:", error);
      }
    }
  }, []);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    router.push(`/dashboard?tab=${value}`);
  };

  const handleWalletConnect = async (walletId: string) => {
    setConnecting(walletId);
    setError("");

    try {
      // Simulate wallet connection
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Generate a mock wallet address
      const mockAddresses = [
        "0x742d35Cc6634C0532925a3b844Bc9e7595C2f4",
        "0x8e3b5A1d9F2c7B4e6D3f8A9c1E5b7D2F4A6C8E0",
        "0x9f1a2B3c4D5e6F7a8B9c0D1e2F3a4B5c6D7e8F9",
        "0x5a8c6D9f2E4b7A1c3F5e8B0d2A4c6E8f1B3d5A7",
      ];

      const randomAddress =
        mockAddresses[Math.floor(Math.random() * mockAddresses.length)];

      // Truncate address for display
      const truncatedAddress = `${randomAddress.slice(
        0,
        6
      )}...${randomAddress.slice(-4)}`;

      setConnectedWallet(walletId);
      setConnectedAddress(truncatedAddress);
      setWalletConnected(true);
      setIsWalletModalOpen(false);
      setConnecting(null);

      // Save wallet connection to localStorage
      localStorage.setItem(
        "wallet",
        JSON.stringify({
          connected: true,
          address: truncatedAddress,
          type: walletId,
        })
      );
    } catch (err) {
      setError("Failed to connect wallet. Please try again.");
      setConnecting(null);
    }
  };

  const handleDisconnect = () => {
    setWalletConnected(false);
    setConnectedWallet("");
    setConnectedAddress("");
    localStorage.removeItem("wallet");
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader
        onOpenWalletModal={() => setIsWalletModalOpen(true)}
        isConnected={walletConnected}
        walletAddress={connectedAddress}
        walletType={connectedWallet}
        onDisconnect={handleDisconnect}
      />

      {/* Wallet Connect Modal */}
      <AnimatePresence>
        {isWalletModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            onClick={() => setIsWalletModalOpen(false)}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative z-10 w-full max-w-md"
            >
              {/* Close Button - Top Right */}
              <button
                onClick={() => setIsWalletModalOpen(false)}
                className="absolute -top-12 right-0 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="h-6 w-6" />
              </button>

              <div className="bg-background border border-border rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="text-center p-8 pb-6 border-b border-border">
                  <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Wallet className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Connect Wallet</h2>
                  <p className="text-sm text-muted-foreground">
                    Choose your preferred wallet to continue
                  </p>
                </div>

                {/* Wallet Options */}
                <div className="p-6 space-y-3 max-h-[50vh] overflow-y-auto">
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive"
                    >
                      {error}
                    </motion.div>
                  )}

                  {walletOptions.map((wallet, index) => (
                    <motion.button
                      key={wallet.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleWalletConnect(wallet.id)}
                      disabled={connecting !== null}
                      className={`w-full flex items-center justify-between p-4 border border-border rounded-xl transition-all hover:border-primary hover:bg-primary/5 hover:shadow-md group ${
                        connecting === wallet.id
                          ? "border-primary bg-primary/5 shadow-md"
                          : ""
                      } ${!wallet.installed ? "opacity-60" : ""}`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="text-4xl">{wallet.icon}</div>
                        <div className="text-left">
                          <div className="flex items-center space-x-2">
                            <p className="font-semibold text-base">
                              {wallet.name}
                            </p>
                            {!wallet.installed && (
                              <span className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground">
                                Not Installed
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {wallet.description}
                          </p>
                        </div>
                      </div>

                      {connecting === wallet.id ? (
                        <Loader2 className="h-5 w-5 text-primary animate-spin flex-shrink-0" />
                      ) : wallet.installed ? (
                        <CheckCircle2 className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                      ) : null}
                    </motion.button>
                  ))}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-border bg-muted/30">
                  <p className="text-xs text-center text-muted-foreground">
                    By connecting your wallet, you agree to our{" "}
                    <a href="#" className="text-primary hover:underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-primary hover:underline">
                      Privacy Policy
                    </a>
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's your blockchain giving overview.
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="my_campaigns">My Campaigns</TabsTrigger>
            <TabsTrigger value="my_donations">My Donations</TabsTrigger>
            <TabsTrigger value="ledger">Ledger</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Donated
                  </CardTitle>
                  <Heart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">17.5 ETH</div>
                  <p className="text-xs text-muted-foreground">
                    ≈ ₱2,362,500 PHP
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Raised
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {userCampaigns
                      .reduce((total, campaign) => {
                        const raised =
                          parseFloat(campaign.raised.replace(" ETH", "")) || 0;
                        return total + raised;
                      }, 0)
                      .toFixed(1)}{" "}
                    ETH
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Across {userCampaigns.length} campaigns
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Campaigns
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {userCampaigns.filter((c) => c.status === "active").length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {userCampaigns.length > 0
                      ? `${
                          userCampaigns.length -
                          userCampaigns.filter((c) => c.status === "active")
                            .length
                        } completed`
                      : "Create your first campaign"}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity Feed */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Your latest blockchain transactions and campaign updates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockTransactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0"
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-medium">
                          {tx.type === "donation"
                            ? "Donated to"
                            : "Withdrew from"}{" "}
                          {tx.campaign}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {tx.timestamp}
                        </p>
                      </div>
                      <div className="text-right space-y-1">
                        <p className="text-sm font-bold">{tx.amount}</p>
                        <div className="flex items-center justify-end space-x-2">
                          <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-green-500/10 text-green-500">
                            {tx.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* My Campaigns Tab */}
          <TabsContent value="my_campaigns" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">My Campaigns</h2>
                <p className="text-muted-foreground">
                  Manage and track your fundraising campaigns
                </p>
              </div>
              <Link href="/create-campaign">
                <Button className="bg-primary hover:bg-primary/90">
                  Create New Campaign
                </Button>
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {userCampaigns.map((campaign) => (
                <Card key={campaign.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">
                          {campaign.title}
                        </CardTitle>
                        <CardDescription>{campaign.chain}</CardDescription>
                      </div>
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-green-500/10 text-green-500">
                        {campaign.status}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-semibold">
                          {campaign.percentage}%
                        </span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-primary h-full transition-all duration-300"
                          style={{ width: `${campaign.percentage}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <p className="text-muted-foreground">Raised</p>
                        <p className="font-bold text-lg">{campaign.raised}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-muted-foreground">Goal</p>
                        <p className="font-bold text-lg">{campaign.goal}</p>
                      </div>
                    </div>

                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="mr-2 h-4 w-4" />
                      Ends: {new Date(campaign.deadline).toLocaleDateString()}
                    </div>

                    <div className="flex space-x-2 pt-2">
                      <Link
                        href={`/campaign/${campaign.id}`}
                        className="flex-1"
                      >
                        <Button variant="outline" className="w-full">
                          View Details
                        </Button>
                      </Link>
                      <Button
                        variant="default"
                        className="flex-1"
                        onClick={() => setSelectedCampaignForWithdraw(campaign)}
                      >
                        Withdraw Funds
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {userCampaigns.length === 0 && (
              <Card className="p-12">
                <div className="text-center space-y-3">
                  <h3 className="text-xl font-semibold">No campaigns yet</h3>
                  <p className="text-muted-foreground">
                    Launch your first campaign in minutes
                  </p>
                  <Link href="/create-campaign">
                    <Button className="mt-4">Create Campaign</Button>
                  </Link>
                </div>
              </Card>
            )}
          </TabsContent>

          {/* My Donations Tab */}
          <TabsContent value="my_donations" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">My Donations</h2>
              <p className="text-muted-foreground">
                Track your contribution history on the blockchain
              </p>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-border bg-muted/50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold">
                          Campaign
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">
                          Amount
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">
                          Date
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">
                          Status
                        </th>
                        <th className="px-6 py-4 text-right text-sm font-semibold">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {mockDonations.map((donation) => (
                        <tr
                          key={donation.id}
                          className="hover:bg-muted/50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <p className="font-medium">{donation.campaign}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-semibold">{donation.amount}</p>
                          </td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">
                            {new Date(donation.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-green-500/10 text-green-500">
                              {donation.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8"
                                onClick={() =>
                                  openInExplorer(donation.txHash, "Ethereum")
                                }
                              >
                                <ExternalLink className="h-4 w-4 mr-1" />
                                Explorer
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8"
                                onClick={() => {
                                  generateReceipt({
                                    campaign: donation.campaign,
                                    amount: donation.amount,
                                    txHash: donation.txHash,
                                    date: donation.date,
                                  });
                                  showToast("Receipt downloaded!");
                                }}
                              >
                                <Download className="h-4 w-4 mr-1" />
                                Receipt
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Ledger Tab */}
          <TabsContent value="ledger" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Blockchain Ledger</h2>
              <p className="text-muted-foreground">
                Complete transaction history across all your activities
              </p>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-border bg-muted/50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold">
                          Timestamp
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">
                          Type
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">
                          From
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">
                          To
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">
                          Amount
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">
                          Status
                        </th>
                        <th className="px-6 py-4 text-right text-sm font-semibold">
                          Tx Hash
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {mockTransactions.map((tx) => (
                        <tr
                          key={tx.id}
                          className="hover:bg-muted/50 transition-colors"
                        >
                          <td className="px-6 py-4 text-sm text-muted-foreground">
                            {tx.timestamp}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                tx.type === "donation"
                                  ? "bg-blue-500/10 text-blue-500"
                                  : "bg-amber-500/10 text-amber-500"
                              }`}
                            >
                              {tx.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-mono text-sm">
                            {tx.from}
                          </td>
                          <td className="px-6 py-4 font-mono text-sm">
                            {tx.to}
                          </td>
                          <td className="px-6 py-4 font-semibold">
                            {tx.amount}
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-green-500/10 text-green-500">
                              {tx.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() =>
                                openInExplorer(tx.txHash, "Ethereum")
                              }
                              className="flex items-center justify-end w-full font-mono text-sm text-primary hover:underline"
                            >
                              {tx.txHash}
                              <ExternalLink className="ml-1 h-3 w-3" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Withdraw Funds Modal */}
      {selectedCampaignForWithdraw && (
        <WithdrawFundsModal
          isOpen={true}
          onClose={() => setSelectedCampaignForWithdraw(null)}
          campaign={selectedCampaignForWithdraw}
        />
      )}
    </div>
  );
}
