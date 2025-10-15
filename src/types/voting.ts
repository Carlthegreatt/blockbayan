export interface VotingProposal {
  id: string;
  title: string;
  description: string;
  category:
    | "aid_allocation"
    | "priority_setting"
    | "resource_distribution"
    | "emergency_response";
  status: "active" | "completed" | "cancelled" | "pending_approval";
  createdBy: {
    name: string;
    address: string;
    role: "barangay_council" | "volunteer" | "resident" | "ngo_representative";
    verified: boolean;
  };
  location: {
    barangay: string;
    city: string;
    region: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  votingPeriod: {
    startDate: string;
    endDate: string;
    duration: number; // in days
  };
  eligibility: {
    minAge: number;
    residencyRequirement: boolean;
    verificationRequired: boolean;
    roles: string[];
  };
  options: VotingOption[];
  results?: VotingResults;
  blockchain: {
    txHash?: string;
    contractAddress?: string;
    network: string;
    gasUsed?: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface VotingOption {
  id: string;
  title: string;
  description: string;
  budget?: {
    amount: number;
    currency: string;
    allocation: string;
  };
  impact: {
    beneficiaries: number;
    timeframe: string;
    priority: "high" | "medium" | "low";
  };
  resources?: {
    materials: string[];
    personnel: string[];
    equipment: string[];
  };
}

export interface VotingResults {
  totalVotes: number;
  eligibleVoters: number;
  participationRate: number;
  options: {
    optionId: string;
    votes: number;
    percentage: number;
    voters: string[]; // wallet addresses
  }[];
  winner?: {
    optionId: string;
    title: string;
    votes: number;
    percentage: number;
  };
  blockchain: {
    txHash: string;
    contractAddress: string;
    network: string;
    blockNumber: number;
    timestamp: string;
  };
  finalizedAt: string;
}

export interface Vote {
  id: string;
  proposalId: string;
  voterAddress: string;
  voterInfo: {
    name: string;
    role: string;
    verified: boolean;
    location: string;
  };
  selectedOptionId: string;
  weight: number; // voting weight based on role/verification
  timestamp: string;
  blockchain: {
    txHash: string;
    gasUsed: number;
    network: string;
  };
  signature: string; // cryptographic signature
}

export interface VoterEligibility {
  address: string;
  eligible: boolean;
  reason?: string;
  verificationStatus: {
    identity: boolean;
    residency: boolean;
    age: boolean;
    role: boolean;
  };
  votingWeight: number;
  canVote: boolean;
}

export interface VotingCampaign {
  id: string;
  title: string;
  description: string;
  proposals: VotingProposal[];
  status: "active" | "completed" | "paused";
  totalParticipants: number;
  totalProposals: number;
  activeProposals: number;
  completedProposals: number;
  createdAt: string;
  updatedAt: string;
}

export interface VotingStats {
  totalProposals: number;
  activeProposals: number;
  completedProposals: number;
  totalVotes: number;
  totalVoters: number;
  averageParticipation: number;
  topCategories: {
    category: string;
    count: number;
    percentage: number;
  }[];
  recentActivity: {
    proposalId: string;
    title: string;
    action: "created" | "voted" | "completed";
    timestamp: string;
    user: string;
  }[];
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

export interface VotingNotification {
  id: string;
  type:
    | "proposal_created"
    | "voting_started"
    | "voting_ended"
    | "results_available";
  title: string;
  message: string;
  proposalId?: string;
  read: boolean;
  timestamp: string;
  priority: "low" | "medium" | "high";
}
