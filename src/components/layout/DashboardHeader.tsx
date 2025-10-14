"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, Wallet, ChevronDown, LogOut, User, Settings } from "lucide-react"

export default function DashboardHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isWalletDropdownOpen, setIsWalletDropdownOpen] = useState(false)
  const [isConnected, setIsConnected] = useState(true) // Simulated wallet connection

  const walletAddress = "0x742d...C2f4" // Simulated wallet address

  const handleDisconnect = () => {
    setIsConnected(false)
    setIsWalletDropdownOpen(false)
    // In real app, would disconnect wallet and redirect
    window.location.href = "/"
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center space-x-2">
          <img src="/logo.svg" alt="BlockBayan Logo" className="h-8 w-8 rounded-full" />
          <span className="text-xl font-bold text-foreground">BlockBayan</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
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

        {/* Wallet & User Actions */}
        <div className="hidden md:flex items-center space-x-3">
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
                <div className="absolute right-0 mt-2 w-56 bg-background border border-border rounded-lg shadow-lg overflow-hidden">
                  <div className="px-4 py-3 border-b border-border">
                    <p className="text-xs text-muted-foreground">Connected Wallet</p>
                    <p className="text-sm font-mono font-semibold">{walletAddress}</p>
                  </div>
                  <div className="py-1">
                    <Link
                      href="/dashboard?tab=overview"
                      className="flex items-center px-4 py-2 text-sm hover:bg-accent transition-colors"
                    >
                      <User className="mr-2 h-4 w-4" />
                      My Profile
                    </Link>
                    <button
                      onClick={handleDisconnect}
                      className="flex items-center w-full px-4 py-2 text-sm text-destructive hover:bg-accent transition-colors"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Disconnect
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
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="container px-4 py-4 space-y-3">
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
              href="/create-campaign"
              className="block px-4 py-2 text-sm font-medium text-primary rounded-lg hover:bg-accent transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Start Campaign
            </Link>
            <div className="border-t border-border pt-3 mt-3">
              {isConnected ? (
                <>
                  <div className="px-4 py-2 text-xs text-muted-foreground">
                    Connected: <span className="font-mono font-semibold">{walletAddress}</span>
                  </div>
                  <button
                    onClick={handleDisconnect}
                    className="w-full text-left px-4 py-2 text-sm text-destructive rounded-lg hover:bg-accent transition-colors"
                  >
                    Disconnect Wallet
                  </button>
                </>
              ) : (
                <Button className="w-full bg-primary hover:bg-primary/90">
                  <Wallet className="mr-2 h-4 w-4" />
                  Connect Wallet
                </Button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

