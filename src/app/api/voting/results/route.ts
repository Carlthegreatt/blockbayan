import { NextRequest, NextResponse } from "next/server";
import { VotingResults } from "@/types/voting";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const proposalId = searchParams.get("proposalId");

    if (!proposalId) {
      return NextResponse.json(
        { success: false, error: "Proposal ID is required" },
        { status: 400 }
      );
    }

    // In a real implementation, this would fetch results from the blockchain
    // and calculate the final results based on all votes cast

    // Mock results for demonstration
    const mockResults: VotingResults = {
      totalVotes: 156,
      eligibleVoters: 200,
      participationRate: 78,
      options: [
        {
          optionId: "opt-1",
          votes: 98,
          percentage: 62.8,
          voters: [], // In a real implementation, this would contain voter addresses
        },
        {
          optionId: "opt-2",
          votes: 58,
          percentage: 37.2,
          voters: [],
        },
      ],
      winner: {
        optionId: "opt-1",
        title: "Priority to Families with Children",
        votes: 98,
        percentage: 62.8,
      },
      blockchain: {
        txHash: "0xabc123...def456",
        contractAddress: "0x1234...5678",
        network: "Ethereum",
        blockNumber: 18500000,
        timestamp: new Date().toISOString(),
      },
      finalizedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: mockResults,
    });
  } catch (error) {
    console.error("Error fetching results:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch results" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { proposalId } = body;

    if (!proposalId) {
      return NextResponse.json(
        { success: false, error: "Proposal ID is required" },
        { status: 400 }
      );
    }

    // In a real implementation, this would:
    // 1. Check if the voting period has ended
    // 2. Calculate final results from all votes
    // 3. Submit results to the blockchain
    // 4. Update the proposal status to "completed"
    // 5. Trigger any automated actions based on the winning option

    // Simulate finalization process
    await new Promise((resolve) => setTimeout(resolve, 3000));

    return NextResponse.json({
      success: true,
      message: "Results finalized successfully",
      data: {
        proposalId,
        finalizedAt: new Date().toISOString(),
        txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      },
    });
  } catch (error) {
    console.error("Error finalizing results:", error);
    return NextResponse.json(
      { success: false, error: "Failed to finalize results" },
      { status: 500 }
    );
  }
}
