"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Wallet, CheckCircle2, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { WALLET_OPTIONS } from "@/config/wallets";

interface WalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (walletId: string, address: string) => void;
}

export default function WalletConnectModal({
  isOpen,
  onClose,
  onConnect,
}: WalletConnectModalProps) {
  const [connecting, setConnecting] = useState<string | null>(null);
  const [error, setError] = useState<string>("");

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

      onConnect(walletId, truncatedAddress);
      setConnecting(null);
    } catch (err) {
      setError("Failed to connect wallet. Please try again.");
      setConnecting(null);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={onClose}
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
              onClick={onClose}
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

                {WALLET_OPTIONS.map((wallet, index) => (
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
                      <div className="relative h-10 w-10 flex-shrink-0">
                        <Image
                          src={wallet.icon}
                          alt={wallet.name}
                          fill
                          className="object-contain"
                        />
                      </div>
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
  );
}
