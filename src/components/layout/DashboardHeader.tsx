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
import WalletConnectModal from "@/components/modals/WalletConnectModal";
import SettingsModal from "@/components/modals/SettingsModal";

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

export default function DashboardHeader() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isWalletDropdownOpen, setIsWalletDropdownOpen] = useState(false);
  const [isLedgerDropdownOpen, setIsLedgerDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false); // Wallet connection state
  const [walletAddress, setWalletAddress] = useState<string>(""); // Connected wallet address
  const [walletType, setWalletType] = useState<string>(""); // Type of wallet connected
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

    // Load wallet connection data from sessionStorage
    const walletData = sessionStorage.getItem("wallet");
    if (walletData) {
      const { connected, address, type } = JSON.parse(walletData);
      setIsConnected(connected);
      setWalletAddress(address);
      setWalletType(type);

      // Get or generate wallet balance for demonstration
      let balance = sessionStorage.getItem("walletBalance");
      if (!balance) {
        // Generate initial balance (between 5 and 15 ETH)
        balance = (Math.random() * 10 + 5).toFixed(4);
        sessionStorage.setItem("walletBalance", balance);
      }
      setWalletBalance(balance);
    }
  }, []);

  const handleWalletConnect = (walletId: string, address: string) => {
    setIsConnected(true);
    setWalletAddress(address);
    setWalletType(walletId);
    setIsWalletModalOpen(false);

    // Generate initial wallet balance if not exists
    let balance = sessionStorage.getItem("walletBalance");
    if (!balance) {
      balance = (Math.random() * 10 + 5).toFixed(4);
      sessionStorage.setItem("walletBalance", balance);
    }
    setWalletBalance(balance);

    // Save wallet connection to sessionStorage
    sessionStorage.setItem(
      "wallet",
      JSON.stringify({
        connected: true,
        address: address,
        type: walletId,
      })
    );
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setWalletAddress("");
    setWalletType("");
    setWalletBalance("0.00");
    setIsWalletDropdownOpen(false);

    // Clear wallet connection from sessionStorage
    sessionStorage.removeItem("wallet");
    // Keep balance in sessionStorage for when they reconnect

    // Stay on current page - no redirect needed
    // User can still browse but features requiring wallet will be disabled
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
          <Link href="/dashboard" className="flex items-center space-x-2">
            <img
              src="/logo.svg"
              alt="BlockBayan Logo"
              className="h-8 w-8 rounded-full"
            />
            <span className="text-xl font-bold text-foreground">
              BlockBayan
            </span>
          </Link>

          {/* Centered Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
            <Link
              href="/explore"
              className="text-sm font-medium text-muted-foreground hover:text-foreground px-3 py-2 rounded-md hover:bg-accent transition-colors"
            >
              Explore
            </Link>
            <Link
              href="/dashboard"
              className="text-sm font-medium text-muted-foreground hover:text-foreground px-3 py-2 rounded-md hover:bg-accent transition-colors"
            >
              Dashboard
            </Link>

            <Link
              href="/create-campaign"
              className="text-sm font-medium text-primary hover:text-primary/80 px-3 py-2 rounded-md hover:bg-primary/10 transition-colors"
            >
              Start Campaign
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Global Ledger Dropdown */}

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

            {/* Wallet Connection */}
            {isConnected ? (
              <div className="relative">
                <button
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={isWalletDropdownOpen}
                  onClick={() => setIsWalletDropdownOpen(!isWalletDropdownOpen)}
                  className="flex min-w-0 items-center space-x-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 rounded-lg transition-all border border-primary/20 outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] hover:shadow-xs"
                >
                  <Wallet className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium font-mono truncate max-w-[120px]">
                    {walletAddress}
                  </span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </button>

                {isWalletDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-background border border-border rounded-lg shadow-lg overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-border">
                      <p className="text-xs text-muted-foreground">
                        Connected Wallet
                      </p>
                      <p className="text-sm font-mono font-semibold">
                        {walletAddress}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 capitalize">
                        via {walletType}
                      </p>
                    </div>
                    <div className="px-4 py-3 border-b border-border bg-muted/30">
                      <p className="text-xs text-muted-foreground mb-1">
                        Balance
                      </p>
                      <p className="text-lg font-bold text-primary">
                        {walletBalance} ETH
                      </p>
                      <p className="text-xs text-muted-foreground">
                        ≈ ₱
                        {(parseFloat(walletBalance) * 135000).toLocaleString()}{" "}
                        PHP
                      </p>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={handleDisconnect}
                        className="flex items-center w-full px-4 py-2 text-sm text-destructive hover:bg-muted transition-colors"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Disconnect Wallet
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Button
                onClick={() => setIsWalletModalOpen(true)}
                className="bg-primary hover:bg-primary/90"
              >
                <Wallet className="mr-2 h-4 w-4" />
                Connect Wallet
              </Button>
            )}
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
                {isConnected ? (
                  <>
                    <div className="px-4 py-3 bg-muted/50 rounded-lg mb-2">
                      <p className="text-xs text-muted-foreground mb-1">
                        Wallet Balance
                      </p>
                      <p className="text-sm font-bold text-primary">
                        {walletBalance} ETH
                      </p>
                      <p className="text-xs text-muted-foreground font-mono mt-1">
                        {walletAddress}
                      </p>
                    </div>
                    <button
                      onClick={handleDisconnect}
                      className="w-full text-left px-4 py-2 text-sm text-destructive rounded-lg hover:bg-accent transition-colors mb-2"
                    >
                      <div className="flex items-center">
                        <LogOut className="mr-2 h-4 w-4" />
                        Disconnect Wallet
                      </div>
                    </button>
                  </>
                ) : (
                  <Button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsWalletModalOpen(true);
                    }}
                    className="w-full bg-primary hover:bg-primary/90 mb-2"
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
