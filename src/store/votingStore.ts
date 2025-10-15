/**
 * Voting Store - Client-side state management for voting functionality
 * This provides consistent voting state management across the app
 */

import {
  VotingProposal,
  Vote,
  VotingResults,
  VotingStats,
} from "@/types/voting";

export interface VotingState {
  proposals: VotingProposal[];
  userVotes: Vote[];
  stats: VotingStats | null;
  loading: boolean;
  error: string | null;
}

export interface VotingFilters {
  status?: string[];
  category?: string[];
  location?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  role?: string[];
}

/**
 * Get voting proposals from storage
 */
export function getVotingProposals(): VotingProposal[] {
  if (typeof window === "undefined") return [];

  const proposalsData = sessionStorage.getItem("votingProposals");
  if (!proposalsData) return [];

  try {
    return JSON.parse(proposalsData);
  } catch (error) {
    console.error("Error parsing voting proposals:", error);
    return [];
  }
}

/**
 * Save voting proposals to storage
 */
export function saveVotingProposals(proposals: VotingProposal[]): void {
  if (typeof window === "undefined") return;

  sessionStorage.setItem("votingProposals", JSON.stringify(proposals));
}

/**
 * Get user votes from storage
 */
export function getUserVotes(): Vote[] {
  if (typeof window === "undefined") return [];

  const votesData = sessionStorage.getItem("userVotes");
  if (!votesData) return [];

  try {
    return JSON.parse(votesData);
  } catch (error) {
    console.error("Error parsing user votes:", error);
    return [];
  }
}

/**
 * Save user vote to storage
 */
export function saveUserVote(vote: Vote): void {
  if (typeof window === "undefined") return;

  const votes = getUserVotes();
  votes.push(vote);
  sessionStorage.setItem("userVotes", JSON.stringify(votes));
}

/**
 * Check if user has voted on a proposal
 */
export function hasUserVoted(proposalId: string): boolean {
  const votes = getUserVotes();
  return votes.some((vote) => vote.proposalId === proposalId);
}

/**
 * Get user's vote for a specific proposal
 */
export function getUserVote(proposalId: string): Vote | null {
  const votes = getUserVotes();
  return votes.find((vote) => vote.proposalId === proposalId) || null;
}

/**
 * Get voting statistics
 */
export function getVotingStats(): VotingStats {
  const proposals = getVotingProposals();
  const votes = getUserVotes();

  const totalProposals = proposals.length;
  const activeProposals = proposals.filter((p) => p.status === "active").length;
  const completedProposals = proposals.filter(
    (p) => p.status === "completed"
  ).length;
  const totalVotes = votes.length;
  const totalVoters = new Set(votes.map((v) => v.voterAddress)).size;

  // Calculate average participation rate
  const participationRates = proposals
    .filter((p) => p.results)
    .map((p) => p.results!.participationRate);
  const averageParticipation =
    participationRates.length > 0
      ? participationRates.reduce((sum, rate) => sum + rate, 0) /
        participationRates.length
      : 0;

  // Calculate top categories
  const categoryCounts = proposals.reduce((acc, proposal) => {
    acc[proposal.category] = (acc[proposal.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topCategories = Object.entries(categoryCounts)
    .map(([category, count]) => ({
      category,
      count,
      percentage: (count / totalProposals) * 100,
    }))
    .sort((a, b) => b.count - a.count);

  // Generate recent activity
  const recentActivity = proposals.slice(0, 5).map((proposal) => ({
    proposalId: proposal.id,
    title: proposal.title,
    action: (proposal.status === "completed" ? "completed" : "created") as
      | "created"
      | "voted"
      | "completed",
    timestamp: proposal.updatedAt,
    user: proposal.createdBy.name,
  }));

  return {
    totalProposals,
    activeProposals,
    completedProposals,
    totalVotes,
    totalVoters,
    averageParticipation,
    topCategories,
    recentActivity,
  };
}

/**
 * Filter proposals based on criteria
 */
export function filterProposals(
  proposals: VotingProposal[],
  filters: VotingFilters
): VotingProposal[] {
  return proposals.filter((proposal) => {
    // Filter by status
    if (filters.status && filters.status.length > 0) {
      if (!filters.status.includes(proposal.status)) return false;
    }

    // Filter by category
    if (filters.category && filters.category.length > 0) {
      if (!filters.category.includes(proposal.category)) return false;
    }

    // Filter by location
    if (filters.location && filters.location.length > 0) {
      const proposalLocation = `${proposal.location.barangay}, ${proposal.location.city}`;
      if (!filters.location.some((loc) => proposalLocation.includes(loc)))
        return false;
    }

    // Filter by date range
    if (filters.dateRange) {
      const proposalDate = new Date(proposal.createdAt);
      const startDate = new Date(filters.dateRange.start);
      const endDate = new Date(filters.dateRange.end);
      if (proposalDate < startDate || proposalDate > endDate) return false;
    }

    // Filter by role
    if (filters.role && filters.role.length > 0) {
      if (!filters.role.includes(proposal.createdBy.role)) return false;
    }

    return true;
  });
}

/**
 * Search proposals
 */
export function searchProposals(
  proposals: VotingProposal[],
  query: string
): VotingProposal[] {
  if (!query.trim()) return proposals;

  const searchLower = query.toLowerCase();
  return proposals.filter(
    (proposal) =>
      proposal.title.toLowerCase().includes(searchLower) ||
      proposal.description.toLowerCase().includes(searchLower) ||
      proposal.createdBy.name.toLowerCase().includes(searchLower) ||
      proposal.location.barangay.toLowerCase().includes(searchLower) ||
      proposal.location.city.toLowerCase().includes(searchLower)
  );
}

/**
 * Sort proposals
 */
export function sortProposals(
  proposals: VotingProposal[],
  sortBy: "newest" | "oldest" | "title" | "status"
): VotingProposal[] {
  return [...proposals].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "oldest":
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case "title":
        return a.title.localeCompare(b.title);
      case "status":
        return a.status.localeCompare(b.status);
      default:
        return 0;
    }
  });
}

/**
 * Get proposals by status
 */
export function getProposalsByStatus(
  proposals: VotingProposal[],
  status: string
): VotingProposal[] {
  return proposals.filter((proposal) => proposal.status === status);
}

/**
 * Get proposals by category
 */
export function getProposalsByCategory(
  proposals: VotingProposal[],
  category: string
): VotingProposal[] {
  return proposals.filter((proposal) => proposal.category === category);
}

/**
 * Get proposals by location
 */
export function getProposalsByLocation(
  proposals: VotingProposal[],
  location: string
): VotingProposal[] {
  return proposals.filter(
    (proposal) =>
      proposal.location.barangay
        .toLowerCase()
        .includes(location.toLowerCase()) ||
      proposal.location.city.toLowerCase().includes(location.toLowerCase()) ||
      proposal.location.region.toLowerCase().includes(location.toLowerCase())
  );
}

/**
 * Get user's voting history
 */
export function getUserVotingHistory(): Array<{
  proposal: VotingProposal;
  vote: Vote;
}> {
  const proposals = getVotingProposals();
  const votes = getUserVotes();

  return votes
    .map((vote) => {
      const proposal = proposals.find((p) => p.id === vote.proposalId);
      return {
        proposal: proposal!,
        vote,
      };
    })
    .filter((item) => item.proposal);
}

/**
 * Get voting participation rate for a proposal
 */
export function getParticipationRate(proposal: VotingProposal): number {
  if (!proposal.results) return 0;
  return proposal.results.participationRate;
}

/**
 * Get winning option for a proposal
 */
export function getWinningOption(proposal: VotingProposal): string | null {
  if (!proposal.results || !proposal.results.winner) return null;
  return proposal.results.winner.title;
}

/**
 * Check if voting period is active
 */
export function isVotingActive(proposal: VotingProposal): boolean {
  const now = new Date();
  const startDate = new Date(proposal.votingPeriod.startDate);
  const endDate = new Date(proposal.votingPeriod.endDate);
  return now >= startDate && now <= endDate && proposal.status === "active";
}

/**
 * Get time remaining for voting
 */
export function getTimeRemaining(proposal: VotingProposal): {
  days: number;
  hours: number;
  minutes: number;
  expired: boolean;
} {
  const now = new Date();
  const endDate = new Date(proposal.votingPeriod.endDate);
  const timeDiff = endDate.getTime() - now.getTime();

  if (timeDiff <= 0) {
    return { days: 0, hours: 0, minutes: 0, expired: true };
  }

  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

  return { days, hours, minutes, expired: false };
}

/**
 * Initialize default voting data
 */
export function initializeDefaultVotingData(): void {
  if (typeof window === "undefined") return;

  // Check if voting data already exists
  const existingProposals = sessionStorage.getItem("votingProposals");
  if (existingProposals) return;

  // Initialize with empty arrays
  sessionStorage.setItem("votingProposals", JSON.stringify([]));
  sessionStorage.setItem("userVotes", JSON.stringify([]));
}
