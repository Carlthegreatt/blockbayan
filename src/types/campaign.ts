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
  deadline?: string;
  image?: string;
  organizerAddress?: string;
  backers?: number;
  donors?: number;
  percentage?: number;
  verified?: boolean;
  location?: string;
  creator?: {
    name: string;
    address: string;
    avatar: string;
  };
}

export interface CampaignStats {
  totalCampaigns: number;
  totalRaised: string;
  totalBackers: number;
  successRate?: number;
}
