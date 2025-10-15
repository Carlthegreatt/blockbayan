"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  X,
  Trophy,
  Users,
  TrendingUp,
  Shield,
  ExternalLink,
  CheckCircle,
  BarChart3,
  Calendar,
  MapPin,
} from "lucide-react";
import { VotingProposal, VotingResults } from "@/types/voting";

interface VotingResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  proposal: VotingProposal;
  results: VotingResults;
}

export default function VotingResultsModal({
  isOpen,
  onClose,
  proposal,
  results,
}: VotingResultsModalProps) {
  const [selectedTab, setSelectedTab] = useState<
    "overview" | "breakdown" | "blockchain"
  >("overview");

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  const getParticipationColor = (rate: number) => {
    if (rate >= 70) return "text-green-500";
    if (rate >= 50) return "text-yellow-500";
    return "text-red-500";
  };

  const getOptionColor = (index: number) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-orange-500",
      "bg-pink-500",
      "bg-indigo-500",
    ];
    return colors[index % colors.length];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-background rounded-lg shadow-xl border border-border">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Trophy className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Voting Results</h2>
              <p className="text-sm text-muted-foreground">{proposal.title}</p>
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
          {/* Tabs */}
          <div className="flex space-x-1 bg-muted/30 p-1 rounded-lg mb-4">
            <button
              onClick={() => setSelectedTab("overview")}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                selectedTab === "overview"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setSelectedTab("breakdown")}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                selectedTab === "breakdown"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Breakdown
            </button>
            <button
              onClick={() => setSelectedTab("blockchain")}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                selectedTab === "blockchain"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Blockchain
            </button>
          </div>

          {/* Overview Tab */}
          {selectedTab === "overview" && (
            <div className="space-y-6">
              {/* Winner Announcement */}
              {results.winner && (
                <Card className="border-green-500/20 bg-green-500/5">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Trophy className="h-6 w-6 text-green-500" />
                      <div>
                        <CardTitle className="text-green-500">
                          Winning Option
                        </CardTitle>
                        <CardDescription>
                          The community has decided on the following option
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 bg-background rounded-lg border border-green-500/20">
                      <h3 className="font-semibold text-lg">
                        {results.winner.title}
                      </h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span>{formatNumber(results.winner.votes)} votes</span>
                        <span>{results.winner.percentage.toFixed(1)}%</span>
                        <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                          Winner
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Voting Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500/10 rounded-lg">
                        <Users className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">
                          {formatNumber(results.totalVotes)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Total Votes
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-500/10 rounded-lg">
                        <TrendingUp className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <p
                          className={`text-2xl font-bold ${getParticipationColor(
                            results.participationRate
                          )}`}
                        >
                          {results.participationRate.toFixed(1)}%
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Participation
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-500/10 rounded-lg">
                        <Shield className="h-5 w-5 text-purple-500" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">
                          {formatNumber(results.eligibleVoters)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Eligible Voters
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Finalization Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Voting Finalized</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Finalized on {formatDate(results.finalizedAt)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Breakdown Tab */}
          {selectedTab === "breakdown" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Vote Breakdown</h3>
              <div className="space-y-3">
                {results.options.map((option, index) => {
                  const optionData = proposal.options.find(
                    (opt) => opt.id === option.optionId
                  );
                  return (
                    <Card key={option.optionId}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-medium">
                              {optionData?.title || "Unknown Option"}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {optionData?.description}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold">
                              {formatNumber(option.votes)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {option.percentage.toFixed(1)}%
                            </p>
                          </div>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full transition-all duration-500 ${getOptionColor(
                              index
                            )}`}
                            style={{ width: `${option.percentage}%` }}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Blockchain Tab */}
          {selectedTab === "blockchain" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Blockchain Verification</h3>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    Transaction Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-muted-foreground">
                        Transaction Hash
                      </Label>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                          {results.blockchain.txHash}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            window.open(
                              `https://etherscan.io/tx/${results.blockchain.txHash}`,
                              "_blank"
                            )
                          }
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">
                        Contract Address
                      </Label>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                          {results.blockchain.contractAddress}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            window.open(
                              `https://etherscan.io/address/${results.blockchain.contractAddress}`,
                              "_blank"
                            )
                          }
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">
                        Network
                      </Label>
                      <p className="text-sm font-medium mt-1">
                        {results.blockchain.network}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">
                        Block Number
                      </Label>
                      <p className="text-sm font-medium mt-1">
                        {formatNumber(results.blockchain.blockNumber)}
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-green-500/5 border border-green-500/20 rounded-lg">
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        Votes verified on blockchain
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      All votes have been cryptographically verified and
                      recorded on the blockchain
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end pt-4 border-t border-border">
            <Button onClick={onClose}>Close</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
