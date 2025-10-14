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
  const [isConnected, setIsConnected] = useState(true); // Simulated wallet connection
  const [user, setUser] = useState<{
    email: string;
    name: string;
    type: string;
  } | null>(null);

  const walletAddress = "0x742d...C2f4"; // Simulated wallet address

  useEffect(() => {
    // Load user data from localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleDisconnect = () => {
    setIsConnected(false);
    setIsWalletDropdownOpen(false);
    // In real app, would disconnect wallet and redirect
    window.location.href = "/";
  };

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem("user");
    setUser(null);
    // Redirect to home page
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 max-w-7xl">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center space-x-2">
          <img
            src="/logo.svg"
            alt="BlockBayan Logo"
            className="h-8 w-8 rounded-full"
          />
          <span className="text-xl font-bold text-foreground">BlockBayan</span>
        </Link>

        {/* Centered Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/explore"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Explore
          </Link>
          <Link
            href="/create-campaign"
            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Start Campaign
          </Link>
        </nav>

        {/* Right Side Actions */}
        <div className="hidden md:flex items-center space-x-3">
          {/* Global Ledger Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsLedgerDropdownOpen(!isLedgerDropdownOpen)}
              className="flex items-center space-x-2 px-3 py-2 hover:bg-accent rounded-lg transition-colors relative"
              title="Global Blockchain Ledger"
            >
              <List className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary rounded-full text-[10px] font-bold text-primary-foreground flex items-center justify-center">
                {recentTransactions.length}
              </span>
            </button>

            {isLedgerDropdownOpen && (
              <div className="absolute right-0 mt-2 w-96 bg-background border border-border rounded-lg shadow-lg overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-border bg-muted/50">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold">
                      Recent Blockchain Activity
                    </h3>
                    <Link
                      href="/explore?tab=transactions"
                      className="text-xs text-primary hover:underline"
                      onClick={() => setIsLedgerDropdownOpen(false)}
                    >
                      View All
                    </Link>
                  </div>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {recentTransactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="px-4 py-3 border-b border-border last:border-0 hover:bg-accent transition-colors"
                    >
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                                tx.type === "donation"
                                  ? "bg-blue-500/10 text-blue-500"
                                  : "bg-amber-500/10 text-amber-500"
                              }`}
                            >
                              {tx.type}
                            </span>
                            <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-green-500/10 text-green-500">
                              {tx.status}
                            </span>
                          </div>
                          <p className="text-sm font-medium line-clamp-1">
                            {tx.to}
                          </p>
                          <p className="text-xs text-muted-foreground font-mono">
                            {tx.from}
                          </p>
                        </div>
                        <div className="text-right ml-2">
                          <p className="text-sm font-bold">{tx.amount}</p>
                          <p className="text-xs text-muted-foreground">
                            {tx.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-3 border-t border-border bg-muted/50">
                  <Link
                    href="/explore?tab=transactions"
                    onClick={() => setIsLedgerDropdownOpen(false)}
                    className="flex items-center justify-center text-sm text-primary hover:underline font-medium"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Full Ledger
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center space-x-2 px-3 py-2 hover:bg-accent rounded-lg transition-colors"
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
                  <button className="flex items-center w-full px-4 py-2 text-sm hover:bg-accent transition-colors">
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
                onClick={() => setIsWalletDropdownOpen(!isWalletDropdownOpen)}
                className="flex items-center space-x-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors border border-primary/20"
              >
                <Wallet className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{walletAddress}</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </button>

              {isWalletDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-background border border-border rounded-lg shadow-lg overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-border">
                    <p className="text-xs text-muted-foreground">
                      Connected Wallet
                    </p>
                    <p className="text-sm font-mono font-semibold">
                      {walletAddress}
                    </p>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={handleDisconnect}
                      className="flex items-center w-full px-4 py-2 text-sm text-destructive hover:bg-accent transition-colors"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Disconnect Wallet
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Button className="bg-primary hover:bg-primary/90">
              <Wallet className="mr-2 h-4 w-4" />
              Connect Wallet
            </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors"
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
              <button className="flex items-center w-full px-4 py-2 text-sm rounded-lg hover:bg-accent transition-colors">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </button>
            </div>

            <div className="border-t border-border pt-3 mt-3">
              {isConnected ? (
                <>
                  <div className="px-4 py-2 text-xs text-muted-foreground mb-2">
                    Wallet:{" "}
                    <span className="font-mono font-semibold">
                      {walletAddress}
                    </span>
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
                <Button className="w-full bg-primary hover:bg-primary/90 mb-2">
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
  );
}
