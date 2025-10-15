"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  X,
  Vote,
  Clock,
  MapPin,
  Users,
  Shield,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Calendar,
  User,
} from "lucide-react";
import {
  VotingProposal,
  Vote as VoteType,
  VoterEligibility,
} from "@/types/voting";
import { getWalletData } from "@/store/walletStore";

interface VotingModalProps {
  isOpen: boolean;
  onClose: () => void;
  proposal: VotingProposal;
  onVote: (proposalId: string, optionId: string) => Promise<void>;
}

export default function VotingModal({
  isOpen,
  onClose,
  proposal,
  onVote,
}: VotingModalProps) {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [isVoting, setIsVoting] = useState(false);
  const [voterEligibility, setVoterEligibility] =
    useState<VoterEligibility | null>(null);
  const [walletConnected, setWalletConnected] = useState(false);

  useEffect(() => {
    if (isOpen) {
      checkVoterEligibility();
      checkWalletConnection();
    }
  }, [isOpen, proposal]);

  const checkWalletConnection = () => {
    const wallet = getWalletData();
    setWalletConnected(!!(wallet && wallet.connected));
  };

  const checkVoterEligibility = async () => {
    const wallet = getWalletData();
    if (!wallet || !wallet.connected) {
      setVoterEligibility({
        address: "",
        eligible: false,
        reason: "Wallet not connected",
        verificationStatus: {
          identity: false,
          residency: false,
          age: false,
          role: false,
        },
        votingWeight: 0,
        canVote: false,
      });
      return;
    }

    // Simulate eligibility check
    const isEligible = Math.random() > 0.3; // 70% chance of being eligible
    setVoterEligibility({
      address: wallet.address,
      eligible: isEligible,
      reason: isEligible ? undefined : "Residency verification required",
      verificationStatus: {
        identity: true,
        residency: isEligible,
        age: true,
        role: true,
      },
      votingWeight: isEligible ? 1 : 0,
      canVote: isEligible,
    });
  };

  const handleVote = async () => {
    if (!selectedOption || !voterEligibility?.canVote) return;

    setIsVoting(true);
    try {
      await onVote(proposal.id, selectedOption);
      onClose();
    } catch (error) {
      console.error("Voting failed:", error);
    } finally {
      setIsVoting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "completed":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "cancelled":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "barangay_council":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "volunteer":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "resident":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "ngo_representative":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-background rounded-lg shadow-xl border border-border">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Vote className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Community Voting</h2>
              <p className="text-sm text-muted-foreground">
                Participate in decentralized decision making
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Proposal Info */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="text-lg">{proposal.title}</CardTitle>
                  <CardDescription className="mt-2">
                    {proposal.description}
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(proposal.status)}>
                  {proposal.status.replace("_", " ").toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              {/* Creator Info */}
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {proposal.createdBy.name}
                    </span>
                    <Badge className={getRoleColor(proposal.createdBy.role)}>
                      {proposal.createdBy.role.replace("_", " ")}
                    </Badge>
                    {proposal.createdBy.verified && (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {proposal.location.barangay}, {proposal.location.city}
                  </p>
                </div>
              </div>

              {/* Voting Period */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Voting Period:</span>
                  <span className="font-medium">
                    {formatDate(proposal.votingPeriod.startDate)} -{" "}
                    {formatDate(proposal.votingPeriod.endDate)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Location:</span>
                  <span className="font-medium">
                    {proposal.location.barangay}, {proposal.location.region}
                  </span>
                </div>
              </div>

              {/* Eligibility Requirements */}
              <div className="p-3 bg-muted/30 rounded-lg">
                <h4 className="font-medium mb-2">Eligibility Requirements</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="h-3 w-3" />
                    <span>Min Age: {proposal.eligibility.minAge}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-3 w-3" />
                    <span>
                      Verification:{" "}
                      {proposal.eligibility.verificationRequired
                        ? "Required"
                        : "Not Required"}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Voter Eligibility Status */}
          {voterEligibility && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Your Voting Status</CardTitle>
              </CardHeader>
              <CardContent>
                {voterEligibility.eligible ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">
                      You are eligible to vote
                    </span>
                    <Badge variant="outline" className="ml-auto">
                      Weight: {voterEligibility.votingWeight}
                    </Badge>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-600">
                    <AlertCircle className="h-5 w-5" />
                    <div>
                      <span className="font-medium">Not eligible to vote</span>
                      {voterEligibility.reason && (
                        <p className="text-sm text-muted-foreground">
                          {voterEligibility.reason}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Voting Options */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Voting Options</CardTitle>
              <CardDescription>
                Select your preferred option for this proposal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              {proposal.options.map((option) => (
                <div
                  key={option.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedOption === option.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedOption(option.id)}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="voting-option"
                      value={option.id}
                      checked={selectedOption === option.id}
                      onChange={() => setSelectedOption(option.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{option.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {option.description}
                      </p>
                      {option.budget && (
                        <div className="mt-2 flex items-center gap-4 text-sm">
                          <span className="text-primary font-medium">
                            {option.budget.amount} {option.budget.currency}
                          </span>
                          <span className="text-muted-foreground">
                            {option.budget.allocation}
                          </span>
                        </div>
                      )}
                      <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                        <span>
                          Beneficiaries: {option.impact.beneficiaries}
                        </span>
                        <span>Timeframe: {option.impact.timeframe}</span>
                        <Badge
                          variant="outline"
                          className={
                            option.impact.priority === "high"
                              ? "text-red-500 border-red-500/20"
                              : option.impact.priority === "medium"
                              ? "text-yellow-500 border-yellow-500/20"
                              : "text-green-500 border-green-500/20"
                          }
                        >
                          {option.impact.priority} priority
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="text-sm text-muted-foreground">
              {!walletConnected && "Connect your wallet to vote"}
              {walletConnected &&
                !voterEligibility?.canVote &&
                "You are not eligible to vote"}
              {walletConnected &&
                voterEligibility?.canVote &&
                "Ready to cast your vote"}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={handleVote}
                disabled={
                  !selectedOption || !voterEligibility?.canVote || isVoting
                }
                className="bg-primary hover:bg-primary/90"
              >
                {isVoting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Casting Vote...
                  </>
                ) : (
                  <>
                    <Vote className="h-4 w-4 mr-2" />
                    Cast Vote
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
