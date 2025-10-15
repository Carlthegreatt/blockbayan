import { NextRequest, NextResponse } from "next/server";
import { VotingProposal } from "@/types/voting";

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
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    let filteredProposals = [...mockProposals];

    // Filter by category
    if (category && category !== "all") {
      filteredProposals = filteredProposals.filter(
        (proposal) => proposal.category === category
      );
    }

    // Filter by status
    if (status && status !== "all") {
      filteredProposals = filteredProposals.filter(
        (proposal) => proposal.status === status
      );
    }

    // Filter by search query
    if (search) {
      const searchLower = search.toLowerCase();
      filteredProposals = filteredProposals.filter(
        (proposal) =>
          proposal.title.toLowerCase().includes(searchLower) ||
          proposal.description.toLowerCase().includes(searchLower)
      );
    }

    return NextResponse.json({
      success: true,
      data: filteredProposals,
      total: filteredProposals.length,
    });
  } catch (error) {
    console.error("Error fetching proposals:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch proposals" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      category,
      location,
      votingPeriod,
      eligibility,
      options,
      createdBy,
    } = body;

    // Validate required fields
    if (!title || !description || !category || !options || !createdBy) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create new proposal
    const newProposal: VotingProposal = {
      id: `prop-${Date.now()}`,
      title,
      description,
      category,
      status: "pending_approval",
      createdBy,
      location,
      votingPeriod,
      eligibility,
      options,
      blockchain: {
        network: "Ethereum",
        contractAddress: "0x1234...5678",
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // In a real implementation, this would be saved to a database
    // and the blockchain transaction would be initiated

    return NextResponse.json({
      success: true,
      data: newProposal,
      message: "Proposal created successfully",
    });
  } catch (error) {
    console.error("Error creating proposal:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create proposal" },
      { status: 500 }
    );
  }
}
