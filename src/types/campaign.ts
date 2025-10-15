export interface Campaign {
  id: string;
  title: string;
  description?: string;
  goal: string;
  raised: string;
  chain: string;
  category?: string;
  status?: "active" | "completed" | "closed";
  startDate?: string;
  endDate?: string;
  image?: string;
  organizerAddress?: string;
  backers?: number;
}

export interface CampaignStats {
  totalCampaigns: number;
  totalRaised: string;
  totalBackers: number;
  successRate?: number;
}
