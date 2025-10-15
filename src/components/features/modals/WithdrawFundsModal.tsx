"use client";

import { useState, useEffect } from "react";
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
import {
  X,
  Loader2,
  Check,
  AlertCircle,
  ArrowRight,
  Wallet,
  Lock,
  ExternalLink,
  Download,
  Info,
  CheckCircle2,
} from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { processWithdrawal, getWalletData } from "@/store/walletStore";
import { generateReceipt } from "@/lib/receipt-utils";

type WithdrawalStep = "input" | "review" | "confirm" | "processing" | "success";

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
  const [step, setStep] = useState<WithdrawalStep>("input");
  const [amount, setAmount] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [gasEstimate, setGasEstimate] = useState("0.0023");
  const [processingStage, setProcessingStage] = useState(0);
  const [txHash, setTxHash] = useState("");
  const [blockNumber, setBlockNumber] = useState(0);
  const [securityCode, setSecurityCode] = useState("");

  const availableAmount = parseFloat(campaign.raised.replace(" ETH", "")) || 0;

  // Load user's wallet address
  useEffect(() => {
    if (isOpen) {
      const walletData = getWalletData();
      if (walletData && walletData.connected && walletData.address) {
        setRecipientAddress(walletData.address);
      }
    }
  }, [isOpen]);

  // Simulate gas estimation when amount changes
  useEffect(() => {
    if (amount && parseFloat(amount) > 0) {
      // Simulate gas estimation (higher amounts = slightly higher gas)
      const baseGas = 0.0021;
      const variableGas = parseFloat(amount) * 0.0001;
      setGasEstimate((baseGas + variableGas).toFixed(4));
    }
  }, [amount]);

  // Simulate processing stages
  useEffect(() => {
    if (step === "processing") {
      const stages = [
        "Initiating withdrawal...",
        "Verifying campaign balance...",
        "Preparing transaction...",
        "Broadcasting to blockchain...",
        "Waiting for confirmation...",
        "Transaction confirmed!",
      ];

      let currentStage = 0;
      const interval = setInterval(() => {
        currentStage++;
        setProcessingStage(currentStage);

        if (currentStage >= stages.length) {
          clearInterval(interval);
          // Generate transaction hash and block number
          const hash = `0x${Math.random().toString(16).substring(2, 66)}`;
          const block = Math.floor(Math.random() * 1000000) + 18000000;
          setTxHash(hash);
          setBlockNumber(block);
          setTimeout(() => setStep("success"), 500);
        }
      }, 1500);

      return () => clearInterval(interval);
    }
  }, [step]);

  const handleContinue = () => {
    const withdrawAmount = parseFloat(amount);
    if (!withdrawAmount || withdrawAmount <= 0) {
      showToast("Please enter a valid amount");
      return;
    }

    if (withdrawAmount > availableAmount) {
      showToast("Insufficient funds");
      return;
    }

    if (!recipientAddress || recipientAddress.length < 10) {
      showToast("Please enter a valid wallet address");
      return;
    }

    setStep("review");
  };

  const handleConfirm = () => {
    // Generate random 6-digit security code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setSecurityCode(code);
    setStep("confirm");
  };

  const handleProcessWithdrawal = async () => {
    setStep("processing");
    setProcessingStage(0);

    try {
      // Process withdrawal using wallet store
      await processWithdrawal(
        parseFloat(amount),
        campaign.id,
        campaign.title,
        recipientAddress
      );
    } catch (error: any) {
      showToast(error.message || "Withdrawal failed");
      setStep("input");
    }
  };

  const handleDownloadReceipt = () => {
    generateReceipt({
      campaign: `Withdrawal from ${campaign.title}`,
      amount: `${amount} ETH`,
      txHash: txHash,
      date: new Date().toLocaleString(),
    });
    showToast("Receipt downloaded!");
  };

  const handleClose = () => {
    setStep("input");
    setAmount("");
    setRecipientAddress("");
    setSecurityCode("");
    setTxHash("");
    setBlockNumber(0);
    setProcessingStage(0);
    onClose();
  };

  const getStepTitle = () => {
    switch (step) {
      case "input":
        return "Withdraw Funds";
      case "review":
        return "Review Withdrawal";
      case "confirm":
        return "Confirm Transaction";
      case "processing":
        return "Processing Withdrawal";
      case "success":
        return "Withdrawal Successful!";
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case "input":
        return `From: ${campaign.title}`;
      case "review":
        return "Please review the details carefully";
      case "confirm":
        return "Authorize this transaction";
      case "processing":
        return "Do not close this window";
      case "success":
        return "Your funds have been transferred";
    }
  };

  const processingStages = [
    "Initiating withdrawal...",
    "Verifying campaign balance...",
    "Preparing transaction...",
    "Broadcasting to blockchain...",
    "Waiting for confirmation...",
    "Transaction confirmed!",
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        onClick={step !== "processing" ? handleClose : undefined}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-lg"
        >
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{getStepTitle()}</CardTitle>
                  <CardDescription>{getStepDescription()}</CardDescription>
                </div>
                {step !== "processing" && (
                  <button
                    onClick={handleClose}
                    className="rounded-full p-1 hover:bg-muted transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Progress Indicator */}
              {step !== "success" && (
                <div className="flex items-center gap-2 mt-4">
                  {["input", "review", "confirm", "processing"].map(
                    (s, index) => (
                      <div
                        key={s}
                        className={`flex-1 h-1 rounded-full transition-colors ${
                          ["input", "review", "confirm", "processing"].indexOf(
                            step
                          ) >= index
                            ? "bg-primary"
                            : "bg-muted"
                        }`}
                      />
                    )
                  )}
                </div>
              )}
            </CardHeader>

            <CardContent className="space-y-4">
              <AnimatePresence mode="wait">
                {/* Step 1: Input */}
                {step === "input" && (
                  <motion.div
                    key="input"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
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
                      <div className="relative">
                        <Input
                          id="withdraw-amount"
                          type="number"
                          placeholder="0.0"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          max={availableAmount}
                          step="0.001"
                        />
                        <button
                          onClick={() => setAmount(availableAmount.toString())}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-primary hover:underline"
                        >
                          MAX
                        </button>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Maximum: {availableAmount} ETH available
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="recipient-address">
                        Recipient Wallet Address
                      </Label>
                      <div className="relative">
                        <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="recipient-address"
                          placeholder="0x..."
                          value={recipientAddress}
                          onChange={(e) => setRecipientAddress(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Your connected wallet address will be used by default
                      </div>
                    </div>

                    {amount && parseFloat(amount) > 0 && (
                      <div className="bg-muted p-3 rounded-lg space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Estimated Gas Fee
                          </span>
                          <span className="font-medium">{gasEstimate} ETH</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Total Deducted
                          </span>
                          <span className="font-semibold">
                            {(
                              parseFloat(amount) + parseFloat(gasEstimate)
                            ).toFixed(4)}{" "}
                            ETH
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-3">
                      <div className="flex items-start space-x-2">
                        <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-blue-700 dark:text-blue-400">
                          Funds will be sent to your specified wallet address.
                          This transaction cannot be reversed once confirmed.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={handleClose}
                      >
                        Cancel
                      </Button>
                      <Button
                        className="flex-1"
                        onClick={handleContinue}
                        disabled={
                          !amount ||
                          parseFloat(amount) <= 0 ||
                          parseFloat(amount) > availableAmount ||
                          !recipientAddress
                        }
                      >
                        Continue
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Review */}
                {step === "review" && (
                  <motion.div
                    key="review"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="bg-muted p-4 rounded-lg space-y-3">
                      <div className="text-center pb-3 border-b border-border">
                        <p className="text-sm text-muted-foreground mb-1">
                          Withdrawal Amount
                        </p>
                        <p className="text-3xl font-bold text-primary">
                          {amount} ETH
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">From</span>
                          <span className="font-medium text-right max-w-[60%]">
                            {campaign.title}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">To</span>
                          <span className="font-mono text-xs">
                            {recipientAddress.slice(0, 10)}...
                            {recipientAddress.slice(-8)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Network</span>
                          <span className="font-medium">{campaign.chain}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-muted p-3 rounded-lg space-y-2">
                      <p className="text-sm font-medium">Transaction Fees</p>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Network Fee (Gas)
                        </span>
                        <span>{gasEstimate} ETH</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Platform Fee
                        </span>
                        <span className="text-green-500">Free</span>
                      </div>
                      <div className="pt-2 border-t border-border flex justify-between text-sm font-semibold">
                        <span>Total Cost</span>
                        <span>
                          {(
                            parseFloat(amount) + parseFloat(gasEstimate)
                          ).toFixed(4)}{" "}
                          ETH
                        </span>
                      </div>
                    </div>

                    <div className="bg-amber-500/10 border border-amber-500/50 rounded-lg p-3">
                      <div className="flex items-start space-x-2">
                        <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                        <div className="text-xs text-amber-700 dark:text-amber-400">
                          <p className="font-medium mb-1">Important:</p>
                          <ul className="list-disc list-inside space-y-1">
                            <li>Double-check the recipient address</li>
                            <li>This transaction cannot be reversed</li>
                            <li>Ensure sufficient balance for gas fees</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => setStep("input")}
                      >
                        Back
                      </Button>
                      <Button className="flex-1" onClick={handleConfirm}>
                        Confirm
                        <Lock className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Security Confirmation */}
                {step === "confirm" && (
                  <motion.div
                    key="confirm"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="text-center py-4">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">
                        Authorize Transaction
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Click the button below to authorize this withdrawal
                      </p>
                    </div>

                    <div className="bg-muted p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">
                          Security Code
                        </span>
                        <span className="text-xs text-green-500 flex items-center">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Verified
                        </span>
                      </div>
                      <div className="bg-background p-3 rounded border border-border">
                        <p className="text-2xl font-mono font-bold text-center tracking-wider">
                          {securityCode}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2 text-center">
                        Save this code for your records
                      </p>
                    </div>

                    <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-3">
                      <div className="flex items-start space-x-2">
                        <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-blue-700 dark:text-blue-400">
                          By proceeding, you authorize the withdrawal of{" "}
                          {amount} ETH from {campaign.title} to your wallet
                          address.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => setStep("review")}
                      >
                        Back
                      </Button>
                      <Button
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={handleProcessWithdrawal}
                      >
                        Authorize & Withdraw
                        <CheckCircle2 className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Processing */}
                {step === "processing" && (
                  <motion.div
                    key="processing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6 py-4"
                  >
                    <div className="flex flex-col items-center">
                      <div className="relative w-20 h-20 mb-4">
                        <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
                        <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                        <Wallet className="absolute inset-0 m-auto h-8 w-8 text-primary" />
                      </div>
                      <p className="text-lg font-semibold mb-1">
                        Processing Transaction
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Please wait while we process your withdrawal
                      </p>
                    </div>

                    <div className="space-y-3">
                      {processingStages.map((stage, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{
                            opacity: index <= processingStage ? 1 : 0.3,
                            x: 0,
                          }}
                          className="flex items-center space-x-3"
                        >
                          {index < processingStage ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                          ) : index === processingStage ? (
                            <Loader2 className="h-5 w-5 text-primary animate-spin flex-shrink-0" />
                          ) : (
                            <div className="h-5 w-5 border-2 border-muted rounded-full flex-shrink-0" />
                          )}
                          <span
                            className={`text-sm ${
                              index <= processingStage
                                ? "text-foreground"
                                : "text-muted-foreground"
                            }`}
                          >
                            {stage}
                          </span>
                        </motion.div>
                      ))}
                    </div>

                    <div className="bg-amber-500/10 border border-amber-500/50 rounded-lg p-3">
                      <div className="flex items-start space-x-2">
                        <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-amber-700 dark:text-amber-400">
                          Do not close this window or refresh the page. The
                          transaction is being processed on the blockchain.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 5: Success */}
                {step === "success" && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-4"
                  >
                    <div className="flex flex-col items-center justify-center py-6">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 200,
                          damping: 15,
                        }}
                        className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-4"
                      >
                        <Check className="h-10 w-10 text-green-500" />
                      </motion.div>
                      <h3 className="text-2xl font-bold mb-2">
                        Withdrawal Complete!
                      </h3>
                      <p className="text-3xl font-bold text-primary mb-2">
                        {amount} ETH
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Successfully withdrawn to your wallet
                      </p>
                    </div>

                    <div className="bg-muted p-4 rounded-lg space-y-3">
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground">
                          Transaction Hash
                        </p>
                        <div className="flex items-center justify-between bg-background p-2 rounded border border-border">
                          <code className="text-xs font-mono truncate">
                            {txHash.slice(0, 20)}...{txHash.slice(-10)}
                          </code>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(txHash);
                              showToast("Copied to clipboard!");
                            }}
                            className="ml-2 text-primary hover:text-primary/80"
                          >
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">
                            Block Number
                          </p>
                          <p className="text-sm font-semibold">
                            #{blockNumber.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">
                            Status
                          </p>
                          <span className="inline-flex items-center text-sm font-semibold text-green-500">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Confirmed
                          </span>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Timestamp
                        </p>
                        <p className="text-sm">{new Date().toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          window.open(
                            `https://etherscan.io/tx/${txHash}`,
                            "_blank"
                          );
                        }}
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View on Explorer
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={handleDownloadReceipt}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download Receipt
                      </Button>
                    </div>

                    <Button className="w-full" onClick={handleClose}>
                      Done
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
