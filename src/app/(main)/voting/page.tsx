"use client";

import { useState, useEffect } from "react";
import DashboardHeader from "@/components/layout/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Filter,
  Vote,
  Clock,
  MapPin,
  Users,
  Shield,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Calendar,
  User,
  Plus,
  BarChart3,
} from "lucide-react";
import Link from "next/link";
import VotingModal from "@/components/features/modals/VotingModal";
import VotingResultsModal from "@/components/features/modals/VotingResultsModal";
import { VotingProposal, VotingResults, VotingStats } from "@/types/voting";

// Mock data for voting proposals
const mockProposals: VotingProposal[] = [
  {
    id: "prop-1",
    title: "Emergency Food Distribution Priority",
    description:
      "Determine the priority areas for emergency food distribution in Barangay San Antonio. This proposal will help allocate resources to the most affected families during the recent typhoon.",
    category: "aid_allocation",
    status: "active",
    createdBy: {
      name: "Maria Santos",
      address: "0x8e3b...A1d9",
      role: "barangay_council",
      verified: true,
    },
    location: {
      barangay: "San Antonio",
      city: "Quezon City",
      region: "NCR",
      coordinates: { lat: 14.676, lng: 121.0437 },
    },
    votingPeriod: {
      startDate: "2025-01-15T00:00:00Z",
      endDate: "2025-01-22T23:59:59Z",
      duration: 7,
    },
    eligibility: {
      minAge: 18,
      residencyRequirement: true,
      verificationRequired: true,
      roles: ["barangay_council", "volunteer", "resident"],
    },
    options: [
      {
        id: "opt-1",
        title: "Priority to Families with Children",
        description:
          "Focus on families with children under 12 years old and pregnant women",
        budget: {
          amount: 50000,
          currency: "PHP",
          allocation: "Food packages for 200 families",
        },
        impact: {
          beneficiaries: 200,
          timeframe: "2 weeks",
          priority: "high",
        },
        resources: {
          materials: ["Rice", "Canned goods", "Milk", "Baby formula"],
          personnel: ["Social workers", "Volunteers"],
          equipment: ["Delivery trucks", "Storage facilities"],
        },
      },
      {
        id: "opt-2",
        title: "Equal Distribution to All Affected",
        description:
          "Distribute food equally among all affected families regardless of composition",
        budget: {
          amount: 50000,
          currency: "PHP",
          allocation: "Food packages for 300 families",
        },
        impact: {
          beneficiaries: 300,
          timeframe: "3 weeks",
          priority: "medium",
        },
        resources: {
          materials: ["Rice", "Canned goods", "Vegetables"],
          personnel: ["Barangay officials", "Volunteers"],
          equipment: ["Distribution centers"],
        },
      },
    ],
    blockchain: {
      network: "Ethereum",
      contractAddress: "0x1234...5678",
    },
    createdAt: "2025-01-15T00:00:00Z",
    updatedAt: "2025-01-15T00:00:00Z",
  },
  {
    id: "prop-2",
    title: "Medical Equipment Allocation",
    description:
      "Decide on the allocation of medical equipment between the barangay health center and the local clinic. Both facilities serve the community but have different needs.",
    category: "resource_distribution",
    status: "active",
    createdBy: {
      name: "Dr. Juan Dela Cruz",
      address: "0x2c4d...F8a1",
      role: "ngo_representative",
      verified: true,
    },
    location: {
      barangay: "San Antonio",
      city: "Quezon City",
      region: "NCR",
    },
    votingPeriod: {
      startDate: "2025-01-16T00:00:00Z",
      endDate: "2025-01-23T23:59:59Z",
      duration: 7,
    },
    eligibility: {
      minAge: 18,
      residencyRequirement: true,
      verificationRequired: true,
      roles: [
        "barangay_council",
        "volunteer",
        "resident",
        "ngo_representative",
      ],
    },
    options: [
      {
        id: "opt-3",
        title: "Focus on Health Center",
        description:
          "Allocate 70% of equipment to the barangay health center for primary care",
        budget: {
          amount: 100000,
          currency: "PHP",
          allocation: "Medical equipment for health center",
        },
        impact: {
          beneficiaries: 500,
          timeframe: "1 month",
          priority: "high",
        },
      },
      {
        id: "opt-4",
        title: "Split Between Facilities",
        description:
          "Divide equipment equally between health center and clinic",
        budget: {
          amount: 100000,
          currency: "PHP",
          allocation: "Medical equipment for both facilities",
        },
        impact: {
          beneficiaries: 400,
          timeframe: "2 months",
          priority: "medium",
        },
      },
    ],
    blockchain: {
      network: "Ethereum",
      contractAddress: "0x1234...5678",
    },
    createdAt: "2025-01-16T00:00:00Z",
    updatedAt: "2025-01-16T00:00:00Z",
  },
  {
    id: "prop-3",
    title: "School Infrastructure Priority",
    description:
      "Vote on which school infrastructure project should be prioritized: new classrooms or computer laboratory upgrade.",
    category: "priority_setting",
    status: "completed",
    createdBy: {
      name: "Ana Rodriguez",
      address: "0x5a8c...D9f2",
      role: "volunteer",
      verified: true,
    },
    location: {
      barangay: "San Antonio",
      city: "Quezon City",
      region: "NCR",
    },
    votingPeriod: {
      startDate: "2025-01-10T00:00:00Z",
      endDate: "2025-01-17T23:59:59Z",
      duration: 7,
    },
    eligibility: {
      minAge: 18,
      residencyRequirement: true,
      verificationRequired: true,
      roles: ["barangay_council", "volunteer", "resident"],
    },
    options: [
      {
        id: "opt-5",
        title: "New Classrooms",
        description:
          "Build 2 new classrooms to accommodate growing student population",
        budget: {
          amount: 200000,
          currency: "PHP",
          allocation: "Construction materials and labor",
        },
        impact: {
          beneficiaries: 100,
          timeframe: "6 months",
          priority: "high",
        },
      },
      {
        id: "opt-6",
        title: "Computer Laboratory",
        description:
          "Upgrade computer laboratory with new equipment and internet connection",
        budget: {
          amount: 200000,
          currency: "PHP",
          allocation: "Computers and networking equipment",
        },
        impact: {
          beneficiaries: 200,
          timeframe: "3 months",
          priority: "medium",
        },
      },
    ],
    results: {
      totalVotes: 156,
      eligibleVoters: 200,
      participationRate: 78,
      options: [
        {
          optionId: "opt-5",
          votes: 98,
          percentage: 62.8,
          voters: [],
        },
        {
          optionId: "opt-6",
          votes: 58,
          percentage: 37.2,
          voters: [],
        },
      ],
      winner: {
        optionId: "opt-5",
        title: "New Classrooms",
        votes: 98,
        percentage: 62.8,
      },
      blockchain: {
        txHash: "0xabc123...def456",
        contractAddress: "0x1234...5678",
        network: "Ethereum",
        blockNumber: 18500000,
        timestamp: "2025-01-17T23:59:59Z",
      },
      finalizedAt: "2025-01-17T23:59:59Z",
    },
    blockchain: {
      network: "Ethereum",
      contractAddress: "0x1234...5678",
      txHash: "0xabc123...def456",
    },
    createdAt: "2025-01-10T00:00:00Z",
    updatedAt: "2025-01-17T23:59:59Z",
  },
];

const mockStats: VotingStats = {
  totalProposals: 12,
  activeProposals: 2,
  completedProposals: 10,
  totalVotes: 1247,
  totalVoters: 456,
  averageParticipation: 73.2,
  topCategories: [
    { category: "aid_allocation", count: 5, percentage: 41.7 },
    { category: "resource_distribution", count: 4, percentage: 33.3 },
    { category: "priority_setting", count: 2, percentage: 16.7 },
    { category: "emergency_response", count: 1, percentage: 8.3 },
  ],
  recentActivity: [
    {
      proposalId: "prop-1",
      title: "Emergency Food Distribution Priority",
      action: "created",
      timestamp: "2025-01-15T10:30:00Z",
      user: "Maria Santos",
    },
    {
      proposalId: "prop-2",
      title: "Medical Equipment Allocation",
      action: "voted",
      timestamp: "2025-01-16T14:20:00Z",
      user: "Juan Dela Cruz",
    },
    {
      proposalId: "prop-3",
      title: "School Infrastructure Priority",
      action: "completed",
      timestamp: "2025-01-17T23:59:59Z",
      user: "System",
    },
  ],
};

export default function VotingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<string>("All Categories");
  const [proposals, setProposals] = useState<VotingProposal[]>(mockProposals);
  const [selectedProposal, setSelectedProposal] =
    useState<VotingProposal | null>(null);
  const [isVotingModalOpen, setIsVotingModalOpen] = useState(false);
  const [isResultsModalOpen, setIsResultsModalOpen] = useState(false);
  const [selectedResults, setSelectedResults] = useState<VotingResults | null>(
    null
  );

  // Filter proposals based on search and category
  const filteredProposals = proposals.filter((proposal) => {
    const matchesSearch = searchQuery
      ? proposal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proposal.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    const matchesCategory =
      selectedCategory === "All Categories" ||
      proposal.category === selectedCategory ||
      (selectedCategory === "Active Only" && proposal.status === "active") ||
      (selectedCategory === "Completed Only" &&
        proposal.status === "completed");

    return matchesSearch && matchesCategory;
  });

  const handleVote = async (proposalId: string, optionId: string) => {
    // Simulate voting process
    console.log(`Voting on proposal ${proposalId} with option ${optionId}`);
    // In a real implementation, this would interact with the blockchain
  };

  const handleViewResults = (proposal: VotingProposal) => {
    if (proposal.results) {
      setSelectedResults(proposal.results);
      setIsResultsModalOpen(true);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "aid_allocation":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "resource_distribution":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "priority_setting":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      case "emergency_response":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Community Voting
          </h1>
          <p className="text-muted-foreground">
            Participate in decentralized decision making for your community
          </p>
        </div>

        <Tabs defaultValue="proposals" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
            <TabsTrigger value="proposals" className="text-sm">
              Proposals
            </TabsTrigger>
            <TabsTrigger value="stats" className="text-sm">
              Statistics
            </TabsTrigger>
            <TabsTrigger value="activity" className="text-sm">
              Activity
            </TabsTrigger>
          </TabsList>

          {/* Proposals Tab */}
          <TabsContent value="proposals" className="space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search proposals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Create Proposal
                </Button>
              </div>
            </div>

            {/* Filter Tags */}
            <div className="flex flex-wrap gap-2">
              {[
                "All Categories",
                "aid_allocation",
                "resource_distribution",
                "priority_setting",
                "emergency_response",
                "Active Only",
                "Completed Only",
              ].map((category) => (
                <Badge
                  key={category}
                  variant={
                    selectedCategory === category ? "secondary" : "outline"
                  }
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category.replace("_", " ").toUpperCase()}
                </Badge>
              ))}
            </div>

            {/* Proposals Grid */}
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredProposals.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">
                    No proposals found matching your criteria.
                  </p>
                </div>
              ) : null}
              {filteredProposals.map((proposal) => (
                <Card
                  key={proposal.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-lg line-clamp-2">
                        {proposal.title}
                      </CardTitle>
                      <Badge className={getStatusColor(proposal.status)}>
                        {proposal.status.toUpperCase()}
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-3">
                      {proposal.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Creator Info */}
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {proposal.createdBy.name}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            className={getCategoryColor(proposal.category)}
                          >
                            {proposal.createdBy.role.replace("_", " ")}
                          </Badge>
                          {proposal.createdBy.verified && (
                            <CheckCircle className="h-3 w-3 text-green-500" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Location and Category */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Badge className={getCategoryColor(proposal.category)}>
                        {proposal.category.replace("_", " ").toUpperCase()}
                      </Badge>
                      <span>•</span>
                      <MapPin className="h-3 w-3" />
                      <span>{proposal.location.barangay}</span>
                    </div>

                    {/* Voting Period */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>
                        {formatDate(proposal.votingPeriod.startDate)} -{" "}
                        {formatDate(proposal.votingPeriod.endDate)}
                      </span>
                    </div>

                    {/* Options Count */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Vote className="h-4 w-4" />
                      <span>{proposal.options.length} options</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      {proposal.status === "active" ? (
                        <Button
                          className="flex-1"
                          onClick={() => {
                            setSelectedProposal(proposal);
                            setIsVotingModalOpen(true);
                          }}
                        >
                          <Vote className="h-4 w-4 mr-2" />
                          Vote
                        </Button>
                      ) : proposal.status === "completed" &&
                        proposal.results ? (
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => handleViewResults(proposal)}
                        >
                          <BarChart3 className="h-4 w-4 mr-2" />
                          View Results
                        </Button>
                      ) : (
                        <Button variant="outline" className="flex-1" disabled>
                          {proposal.status === "cancelled"
                            ? "Cancelled"
                            : "Pending"}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Statistics Tab */}
          <TabsContent value="stats" className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <Vote className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {mockStats.totalProposals}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Total Proposals
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500/10 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {mockStats.activeProposals}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Active Proposals
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                      <Users className="h-5 w-5 text-purple-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {mockStats.totalVotes}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Total Votes
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-500/10 rounded-lg">
                      <BarChart3 className="h-5 w-5 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {mockStats.averageParticipation.toFixed(1)}%
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Avg Participation
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Category Breakdown */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle>Proposals by Category</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  {mockStats.topCategories.map((category) => (
                    <div
                      key={category.category}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <Badge className={getCategoryColor(category.category)}>
                          {category.category.replace("_", " ").toUpperCase()}
                        </Badge>
                        <span className="text-sm">
                          {category.count} proposals
                        </span>
                      </div>
                      <span className="text-sm font-medium">
                        {category.percentage.toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  {mockStats.recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        {activity.action === "created" && (
                          <Plus className="h-4 w-4 text-primary" />
                        )}
                        {activity.action === "voted" && (
                          <Vote className="h-4 w-4 text-primary" />
                        )}
                        {activity.action === "completed" && (
                          <CheckCircle className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {activity.action} by {activity.user} •{" "}
                          {formatDate(activity.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Voting Modal */}
      {selectedProposal && (
        <VotingModal
          isOpen={isVotingModalOpen}
          onClose={() => {
            setIsVotingModalOpen(false);
            setSelectedProposal(null);
          }}
          proposal={selectedProposal}
          onVote={handleVote}
        />
      )}

      {/* Results Modal */}
      {selectedResults && (
        <VotingResultsModal
          isOpen={isResultsModalOpen}
          onClose={() => {
            setIsResultsModalOpen(false);
            setSelectedResults(null);
          }}
          proposal={selectedProposal!}
          results={selectedResults}
        />
      )}
    </div>
  );
}
