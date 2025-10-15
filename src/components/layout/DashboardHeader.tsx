"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  Wallet,
  ChevronDown,
  LogOut,
  User,
  Settings,
  List,
  ExternalLink,
  Bell,
} from "lucide-react";
import WalletConnectModal from "@/components/features/modals/WalletConnectModal";
import SettingsModal from "@/components/features/modals/SettingsModal";
import ETHPriceTicker from "@/components/shared/ETHPriceTicker";
import {
  getWalletData,
  saveWalletData,
  disconnectWallet,
  ethToPHP,
} from "@/store/walletStore";

// Mock recent transactions data
const recentTransactions = [
  {
    id: "1",
    type: "donation",
    from: "0x742d...C2f4",
    to: "Support Local Schools",
    amount: "5 ETH",
    time: "2 min ago",
    status: "success",
  },
  {
    id: "2",
    type: "donation",
    from: "0x9f1a...B3e7",
    to: "Medical Aid Fund",
    amount: "10 ETH",
    time: "15 min ago",
    status: "success",
  },
  {
    id: "3",
    type: "withdrawal",
    from: "0x8e3b...A1d9",
    to: "0x742d...C2f4",
    amount: "20 ETH",
    time: "1 hour ago",
    status: "success",
  },
];

interface DashboardHeaderProps {
  onOpenWalletModal?: () => void;
  isConnected?: boolean;
  walletAddress?: string;
  walletType?: string;
  onDisconnect?: () => void;
}

export default function DashboardHeader({
  onOpenWalletModal,
  isConnected: externalIsConnected,
  walletAddress: externalWalletAddress,
  walletType: externalWalletType,
  onDisconnect: externalOnDisconnect,
}: DashboardHeaderProps = {}) {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(externalIsConnected || false);
  const [walletAddress, setWalletAddress] = useState<string>(
    externalWalletAddress || ""
  );
  const [walletType, setWalletType] = useState<string>(
    externalWalletType || ""
  );
  const [walletBalance, setWalletBalance] = useState<string>("0.00");
  const [user, setUser] = useState<{
    email: string;
    name: string;
    type: string;
  } | null>(null);

  useEffect(() => {
    // Load user data from sessionStorage
    const userData = sessionStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Load wallet connection data using wallet store
    const wallet = getWalletData();
    if (wallet && wallet.connected) {
      setIsConnected(wallet.connected);
      setWalletAddress(wallet.address);
      setWalletType(wallet.type);
      setWalletBalance(wallet.balance);
    }

    // Also check localStorage if not provided via props
    if (!externalIsConnected && !wallet) {
      const walletData = localStorage.getItem("wallet");
      if (walletData) {
        const { connected, address, type } = JSON.parse(walletData);
        setIsConnected(connected);
        setWalletAddress(address);
        setWalletType(type);
      }
    }
  }, [externalIsConnected]);

  const handleWalletConnect = (walletId: string, address: string) => {
    setIsConnected(true);
    setWalletAddress(address);
    setWalletType(walletId);
    setIsWalletModalOpen(false);

    // Generate initial wallet balance if not exists
    let balance = sessionStorage.getItem("walletBalance");
    if (!balance) {
      balance = (Math.random() * 10 + 5).toFixed(4);
    }
    setWalletBalance(balance);

    // Save wallet connection using wallet store
    saveWalletData({
      connected: true,
      address: address,
      type: walletId,
      balance: balance,
      network: "Ethereum",
    });
  };

  // Sync with external props
  useEffect(() => {
    if (externalIsConnected !== undefined) {
      setIsConnected(externalIsConnected);
    }
    if (externalWalletAddress !== undefined) {
      setWalletAddress(externalWalletAddress);
    }
    if (externalWalletType !== undefined) {
      setWalletType(externalWalletType);
    }
  }, [externalIsConnected, externalWalletAddress, externalWalletType]);

  const handleDisconnect = () => {
    if (externalOnDisconnect) {
      externalOnDisconnect();
    } else {
      setIsConnected(false);
      setWalletAddress("");
      setWalletType("");
      setWalletBalance("0.00");

      // Disconnect wallet using wallet store
      disconnectWallet();
    }
  };

  const handleLogout = () => {
    // Clear user data from sessionStorage
    sessionStorage.removeItem("user");
    setUser(null);
    // Redirect to home page
    router.push("/");
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 max-w-7xl">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center space-x-2 flex-shrink-0">
            <img
              src="/logo.svg"
              alt="BlockBayan Logo"
              className="h-8 w-8 rounded-full"
            />
            <span className="text-xl font-bold text-foreground">
              BlockBayan
            </span>
          </Link>

          {/* Medium Screen Navigation */}
          <nav className="hidden md:flex lg:hidden items-center space-x-3 absolute left-1/2 transform -translate-x-1/2">
            <Link
              href="/explore"
              className="text-sm font-medium text-muted-foreground hover:text-foreground px-2 py-2 rounded-md hover:bg-accent transition-colors"
            >
              Explore
            </Link>
            <Link
              href="/dashboard"
              className="text-sm font-medium text-muted-foreground hover:text-foreground px-2 py-2 rounded-md hover:bg-accent transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/voting"
              className="text-sm font-medium text-muted-foreground hover:text-foreground px-2 py-2 rounded-md hover:bg-accent transition-colors"
            >
              Voting
            </Link>
            <Link
              href="/create-campaign"
              className="text-sm font-medium text-primary hover:text-primary/80 px-2 py-2 rounded-md hover:bg-primary/10 transition-colors"
            >
              Start
            </Link>
          </nav>

          {/* Large Screen Navigation */}
          <nav className="hidden lg:flex items-center space-x-4 absolute left-1/2 transform -translate-x-1/2">
            <Link
              href="/explore"
              className="text-sm font-medium text-muted-foreground hover:text-foreground px-3 py-2 rounded-md hover:bg-accent transition-colors whitespace-nowrap"
            >
              Explore
            </Link>
            <Link
              href="/dashboard"
              className="text-sm font-medium text-muted-foreground hover:text-foreground px-3 py-2 rounded-md hover:bg-accent transition-colors whitespace-nowrap"
            >
              Dashboard
            </Link>
            <Link
              href="/voting"
              className="text-sm font-medium text-muted-foreground hover:text-foreground px-3 py-2 rounded-md hover:bg-accent transition-colors whitespace-nowrap"
            >
              Community Voting
            </Link>
            <Link
              href="/create-campaign"
              className="text-sm font-medium text-primary hover:text-primary/80 px-3 py-2 rounded-md hover:bg-primary/10 transition-colors whitespace-nowrap"
            >
              Start Campaign
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-3">
            {/* ETH Price Ticker - Hidden on md, shown on lg */}
            <div className="hidden lg:block">
              <ETHPriceTicker />
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={isProfileDropdownOpen}
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg border border-transparent hover:bg-muted hover:border-border transition-all outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px]"
              >
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <div className="text-left hidden lg:block">
                  <p className="text-sm font-medium">
                    {user?.name || "Guest User"}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {user?.type || "user"}
                  </p>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </button>

              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-background border border-border rounded-lg shadow-lg overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-border">
                    <p className="text-sm font-semibold">
                      {user?.name || "Guest User"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user?.email || "guest@blockbayan.com"}
                    </p>
                  </div>
                  <div className="py-1">
                    <Link
                      href="/dashboard?tab=overview"
                      className="flex items-center px-4 py-2 text-sm hover:bg-accent transition-colors"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <User className="mr-2 h-4 w-4" />
                      My Profile
                    </Link>
                    <Link
                      href="/dashboard?tab=my_campaigns"
                      className="flex items-center px-4 py-2 text-sm hover:bg-accent transition-colors"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <List className="mr-2 h-4 w-4" />
                      My Campaigns
                    </Link>
                    <Link
                      href="/dashboard?tab=my_donations"
                      className="flex items-center px-4 py-2 text-sm hover:bg-accent transition-colors"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <Wallet className="mr-2 h-4 w-4" />
                      My Donations
                    </Link>
                    <button
                      className="flex items-center w-full px-4 py-2 text-sm hover:bg-accent transition-colors"
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        setIsSettingsModalOpen(true);
                      }}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </button>
                  </div>
                  <div className="border-t border-border py-1">
                    {/* Wallet Section */}
                    {isConnected ? (
                      <div className="px-4 py-3 bg-muted/30">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs text-muted-foreground">
                            Wallet Connected
                          </p>
                          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                        </div>
                        <p className="text-xs font-mono font-semibold truncate">
                          {walletAddress}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 capitalize">
                          via {walletType}
                        </p>
                        <div className="mt-3 pt-3 border-t border-border">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              Balance
                            </span>
                            <span className="text-sm font-bold text-primary">
                              {walletBalance} ETH
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            ≈ ₱{ethToPHP(walletBalance)} PHP
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setIsProfileDropdownOpen(false);
                            handleDisconnect();
                          }}
                          className="flex items-center justify-center w-full px-3 py-2 mt-3 text-xs text-destructive hover:bg-destructive/10 rounded-md transition-colors border border-destructive/20"
                        >
                          <LogOut className="mr-2 h-3 w-3" />
                          Disconnect Wallet
                        </button>
                      </div>
                    ) : (
                      <div className="px-4 py-3">
                        <button
                          onClick={() => {
                            setIsProfileDropdownOpen(false);
                            setIsWalletModalOpen(true);
                          }}
                          className="flex items-center justify-center w-full px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md transition-colors text-sm font-medium"
                        >
                          <Wallet className="mr-2 h-4 w-4" />
                          Connect Wallet
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-border py-1">
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-destructive hover:bg-accent transition-colors"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-all outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px]"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background">
            <nav className="container px-4 py-4 space-y-3">
              {/* User Profile Section */}
              <div className="px-4 py-3 bg-muted/50 rounded-lg mb-3">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">
                      {user?.name || "Guest User"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user?.email || "guest@blockbayan.com"}
                    </p>
                  </div>
                </div>
              </div>

              <Link
                href="/dashboard"
                className="block px-4 py-2 text-sm font-medium rounded-lg hover:bg-accent transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/explore"
                className="block px-4 py-2 text-sm font-medium rounded-lg hover:bg-accent transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Explore
              </Link>
              <Link
                href="/voting"
                className="block px-4 py-2 text-sm font-medium rounded-lg hover:bg-accent transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Community Voting
              </Link>
              <Link
                href="/explore?tab=transactions"
                className="block px-4 py-2 text-sm font-medium rounded-lg hover:bg-accent transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center justify-between">
                  <span>Global Ledger</span>
                  <span className="px-2 py-0.5 bg-primary rounded-full text-xs font-bold text-primary-foreground">
                    {recentTransactions.length}
                  </span>
                </div>
              </Link>
              <Link
                href="/create-campaign"
                className="block px-4 py-2 text-sm font-medium text-primary rounded-lg hover:bg-accent transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Start Campaign
              </Link>

              <div className="border-t border-border pt-3 mt-3 space-y-2">
                <Link
                  href="/dashboard?tab=my_campaigns"
                  className="flex items-center px-4 py-2 text-sm rounded-lg hover:bg-accent transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <List className="mr-2 h-4 w-4" />
                  My Campaigns
                </Link>
                <Link
                  href="/dashboard?tab=my_donations"
                  className="flex items-center px-4 py-2 text-sm rounded-lg hover:bg-accent transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Wallet className="mr-2 h-4 w-4" />
                  My Donations
                </Link>
                <button
                  className="flex items-center w-full px-4 py-2 text-sm rounded-lg hover:bg-accent transition-colors"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsSettingsModalOpen(true);
                  }}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </button>
              </div>

              <div className="border-t border-border pt-3 mt-3">
                {/* Wallet Section - Mobile */}
                {isConnected ? (
                  <div className="px-4 py-3 bg-muted/50 rounded-lg mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-muted-foreground">
                        Wallet Connected
                      </p>
                      <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    </div>
                    <p className="text-xs font-bold text-primary mb-1">
                      {walletBalance} ETH
                    </p>
                    <p className="text-xs text-muted-foreground font-mono">
                      {walletAddress}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      ≈ ₱{ethToPHP(walletBalance)} PHP
                    </p>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        handleDisconnect();
                      }}
                      className="w-full text-left px-3 py-2 mt-3 text-sm text-destructive rounded-lg hover:bg-destructive/10 transition-colors border border-destructive/20"
                    >
                      <div className="flex items-center justify-center">
                        <LogOut className="mr-2 h-4 w-4" />
                        Disconnect Wallet
                      </div>
                    </button>
                  </div>
                ) : (
                  <Button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsWalletModalOpen(true);
                    }}
                    className="w-full bg-primary hover:bg-primary/90 mb-3"
                  >
                    <Wallet className="mr-2 h-4 w-4" />
                    Connect Wallet
                  </Button>
                )}

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-destructive rounded-lg hover:bg-accent transition-colors font-semibold"
                >
                  <div className="flex items-center">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </div>
                </button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Wallet Connect Modal - Rendered outside header for proper centering */}
      <WalletConnectModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        onConnect={handleWalletConnect}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />
    </>
  );
}
