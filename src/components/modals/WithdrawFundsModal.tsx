"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Check, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/toast";

interface WithdrawFundsModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: {
    id: string;
    title: string;
    raised: string;
    chain: string;
  };
}

export default function WithdrawFundsModal({
  isOpen,
  onClose,
  campaign,
}: WithdrawFundsModalProps) {
  const { showToast } = useToast();
  const [amount, setAmount] = useState("");
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);
  const [txHash, setTxHash] = useState("");

  const availableAmount = parseFloat(campaign.raised.replace(" ETH", "")) || 0;

  const handleWithdraw = async () => {
    const withdrawAmount = parseFloat(amount);
    if (withdrawAmount > availableAmount) {
      showToast("Insufficient funds", "error");
      return;
    }

    setIsWithdrawing(true);
    // Simulate blockchain transaction
    await new Promise((resolve) => setTimeout(resolve, 2500));

    const randomHex = () =>
      Math.floor(Math.random() * 0xffffffff)
        .toString(16)
        .padStart(8, "0");
    const generatedTxHash = `0x${randomHex()}${randomHex()}${randomHex()}${randomHex()}${randomHex()}${randomHex()}${randomHex()}${randomHex()}`;

    setTxHash(generatedTxHash);
    setIsWithdrawing(false);
    setWithdrawSuccess(true);
    showToast("Withdrawal successful!", "success");
  };

  const handleClose = () => {
    setAmount("");
    setWithdrawSuccess(false);
    setTxHash("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md"
        >
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>
                    {withdrawSuccess
                      ? "Withdrawal Successful!"
                      : "Withdraw Funds"}
                  </CardTitle>
                  <CardDescription>
                    {withdrawSuccess
                      ? "Your funds have been transferred to your wallet"
                      : `From: ${campaign.title}`}
                  </CardDescription>
                </div>
                <button
                  onClick={handleClose}
                  className="rounded-full p-1 hover:bg-muted transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {!withdrawSuccess ? (
                <>
                  <div className="bg-muted p-4 rounded-lg space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Available Balance
                      </span>
                      <span className="font-semibold">{campaign.raised}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Network</span>
                      <span className="font-semibold">{campaign.chain}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="withdraw-amount">
                      Withdrawal Amount (ETH)
                    </Label>
                    <Input
                      id="withdraw-amount"
                      type="number"
                      placeholder="0.0"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      max={availableAmount}
                      disabled={isWithdrawing}
                    />
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">
                        Max: {availableAmount} ETH
                      </span>
                      {amount && (
                        <button
                          onClick={() => setAmount(availableAmount.toString())}
                          className="text-primary hover:underline"
                        >
                          Use Max
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="bg-amber-500/10 border border-amber-500/50 rounded-lg p-3">
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-amber-700 dark:text-amber-400">
                        Withdrawals are subject to gas fees. Make sure you have
                        enough ETH in your wallet to cover transaction costs.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={handleClose}
                      disabled={isWithdrawing}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={handleWithdraw}
                      disabled={
                        !amount ||
                        parseFloat(amount) <= 0 ||
                        parseFloat(amount) > availableAmount ||
                        isWithdrawing
                      }
                    >
                      {isWithdrawing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Withdraw"
                      )}
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex flex-col items-center justify-center py-6">
                    <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
                      <Check className="h-8 w-8 text-green-500" />
                    </div>
                    <p className="text-2xl font-bold text-primary mb-2">
                      {amount} ETH
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Successfully withdrawn
                    </p>
                  </div>

                  <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Transaction Hash</p>
                      <code className="text-xs font-mono break-all">
                        {txHash}
                      </code>
                    </div>
                  </div>

                  <Button className="w-full" onClick={handleClose}>
                    Close
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
