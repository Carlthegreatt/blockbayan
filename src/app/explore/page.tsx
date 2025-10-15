"use client";

import { useState, useEffect } from "react";
import DashboardHeader from "@/components/layout/DashboardHeader";
import { openInExplorer } from "@/lib/receipt-utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  TrendingUp,
  Calendar,
  MapPin,
  ExternalLink,
  Heart,
  Grid,
  List,
  Download,
} from "lucide-react";
import Link from "next/link";
import { ethToPHP } from "@/store/walletStore";

// Mock campaigns data
const mockCampaigns = [
  {
    id: "1",
    title: "Support Local Schools in Mindanao",
    description:
      "Help provide educational materials and technology for underprivileged schools in Mindanao region.",
    category: "Education",
    goal: "50 ETH",
    raised: "32.5 ETH",
    percentage: 65,
    donors: 124,
    verified: true,
    status: "active",
    deadline: "2025-11-30",
    chain: "Ethereum",
    location: "Mindanao, Philippines",
    image:
      "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&q=80",
  },
  {
    id: "2",
    title: "Medical Aid for Typhoon Victims",
    description:
      "Emergency medical supplies and healthcare support for communities affected by recent typhoons.",
    category: "Healthcare",
    goal: "100 ETH",
    raised: "87.2 ETH",
    percentage: 87,
    donors: 340,
    verified: true,
    status: "active",
    deadline: "2025-12-15",
    chain: "Polygon",
    location: "Visayas, Philippines",
    image:
      "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&q=80",
  },
  {
    id: "3",
    title: "Community Water Project",
    description:
      "Building sustainable water infrastructure for rural communities lacking clean water access.",
    category: "Infrastructure",
    goal: "75 ETH",
    raised: "45.8 ETH",
    percentage: 61,
    donors: 189,
    verified: true,
    status: "active",
    deadline: "2025-12-30",
    chain: "Ethereum",
    location: "Luzon, Philippines",
    image:
      "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80",
  },
  {
    id: "4",
    title: "Indigenous Youth Education Fund",
    description:
      "Scholarships and educational programs for indigenous youth to access quality education.",
    category: "Education",
    goal: "40 ETH",
    raised: "28.3 ETH",
    percentage: 71,
    donors: 95,
    verified: false,
    status: "active",
    deadline: "2026-01-15",
    chain: "Base",
    location: "Cordillera, Philippines",
    image:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80",
  },
];

// Mock transactions data
const mockTransactions = [
  {
    id: "1",
    timestamp: "2025-10-14 14:30:22",
    status: "success",
    type: "donation",
    from: "0x742d...C2f4",
    to: "0x8e3b...A1d9",
    amount: "5 ETH",
    amountPHP: "₱675,000",
    txHash: "0xabc123...def456",
    campaign: "Support Local Schools",
    chain: "Ethereum",
  },
  {
    id: "2",
    timestamp: "2025-10-14 13:15:45",
    status: "success",
    type: "donation",
    from: "0x9f1a...B3e7",
    to: "0x2c4d...F8a1",
    amount: "10 ETH",
    amountPHP: "₱1,350,000",
    txHash: "0x789ghi...jkl012",
    campaign: "Medical Aid Fund",
    chain: "Polygon",
  },
  {
    id: "3",
    timestamp: "2025-10-14 12:45:10",
    status: "success",
    type: "withdrawal",
    from: "0x8e3b...A1d9",
    to: "0x742d...C2f4",
    amount: "20 ETH",
    amountPHP: "₱2,700,000",
    txHash: "0x345mno...pqr678",
    campaign: "Medical Aid Fund",
    chain: "Ethereum",
  },
  {
    id: "4",
    timestamp: "2025-10-14 11:20:33",
    status: "success",
    type: "donation",
    from: "0x5a8c...D9f2",
    to: "0x7b4e...C1a8",
    amount: "2.5 ETH",
    amountPHP: "₱337,500",
    txHash: "0x901stu...vwx234",
    campaign: "Community Water Project",
    chain: "Ethereum",
  },
  {
    id: "5",
    timestamp: "2025-10-14 10:05:18",
    status: "pending",
    type: "donation",
    from: "0x3d2f...A7b9",
    to: "0x6c8e...E2d4",
    amount: "7.5 ETH",
    amountPHP: "₱1,012,500",
    txHash: "0x567yza...bcd890",
    campaign: "Indigenous Youth Fund",
    chain: "Base",
  },
];

export default function ExplorePage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [campaigns, setCampaigns] = useState(mockCampaigns);
  const [selectedCategory, setSelectedCategory] =
    useState<string>("All Categories");

  useEffect(() => {
    // Load user campaigns from sessionStorage and merge with mock campaigns
    const storedCampaigns = sessionStorage.getItem("userCampaigns");
    if (storedCampaigns) {
      try {
        const userCampaigns = JSON.parse(storedCampaigns);
        // Map user campaigns to match explore page format
        const formattedUserCampaigns = userCampaigns.map((c: any) => ({
          ...c,
          description: c.description || "No description provided",
          donors: c.donors || 0,
          verified: c.verified || false,
          location: c.location || "Philippines",
          image: c.image || "/ethereum.png",
        }));
        setCampaigns([...formattedUserCampaigns, ...mockCampaigns]);
      } catch (error) {
        console.error("Error loading campaigns:", error);
        setCampaigns(mockCampaigns);
      }
    }
  }, []);

  // Filter campaigns based on search and category
  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch = searchQuery
      ? campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        campaign.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    const matchesCategory =
      selectedCategory === "All Categories" ||
      campaign.category === selectedCategory ||
      (selectedCategory === "Verified Only" && campaign.verified);

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Explore</h1>
          <p className="text-muted-foreground">
            Discover campaigns and track global blockchain activity
          </p>
        </div>

        <Tabs defaultValue="campaigns" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:inline-grid">
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>

          {/* Campaigns Tab */}
          <TabsContent value="campaigns" className="space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search campaigns..."
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
                <div className="flex border border-border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 transition-colors ${
                      viewMode === "grid"
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent"
                    }`}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 transition-colors ${
                      viewMode === "list"
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent"
                    }`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Filter Tags */}
            <div className="flex flex-wrap gap-2">
              {[
                "All Categories",
                "Education",
                "Healthcare",
                "Infrastructure",
                "Verified Only",
              ].map((category) => (
                <Badge
                  key={category}
                  variant={
                    selectedCategory === category ? "secondary" : "outline"
                  }
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>

            {/* Campaign Cards */}
            {viewMode === "grid" ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredCampaigns.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <p className="text-muted-foreground">
                      No campaigns found matching your criteria.
                    </p>
                  </div>
                ) : null}
                {filteredCampaigns.map((campaign) => (
                  <Card
                    key={campaign.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="aspect-video relative bg-muted">
                      <img
                        src={campaign.image}
                        alt={campaign.title}
                        className="object-cover w-full h-full opacity-80"
                      />
                      {campaign.verified && (
                        <Badge className="absolute top-3 right-3 bg-green-500 hover:bg-green-600">
                          ✓ Verified
                        </Badge>
                      )}
                    </div>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-lg line-clamp-2">
                          {campaign.title}
                        </CardTitle>
                      </div>
                      <CardDescription className="line-clamp-2">
                        {campaign.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Badge variant="outline">{campaign.category}</Badge>
                        <span>•</span>
                        <MapPin className="h-3 w-3" />
                        <span>{campaign.location}</span>
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="font-semibold text-primary">
                            {campaign.raised}
                          </span>
                          <span className="text-muted-foreground">
                            of {campaign.goal}
                          </span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-primary h-full transition-all duration-300"
                            style={{ width: `${campaign.percentage}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Heart className="h-4 w-4" />
                          <span>{campaign.donors} donors</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {new Date(campaign.deadline).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <Link href={`/campaign/${campaign.id}`}>
                        <Button className="w-full">View Campaign</Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredCampaigns.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">
                      No campaigns found matching your criteria.
                    </p>
                  </div>
                ) : null}
                {filteredCampaigns.map((campaign) => (
                  <Card
                    key={campaign.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-48 aspect-video relative bg-muted">
                        <img
                          src={campaign.image}
                          alt={campaign.title}
                          className="object-cover w-full h-full opacity-80"
                        />
                      </div>
                      <div className="flex-1 p-6">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-xl font-bold">
                                {campaign.title}
                              </h3>
                              {campaign.verified && (
                                <Badge className="bg-green-500 hover:bg-green-600">
                                  ✓ Verified
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                              {campaign.description}
                            </p>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
                              <Badge variant="outline">
                                {campaign.category}
                              </Badge>
                              <span>•</span>
                              <MapPin className="h-3 w-3" />
                              <span>{campaign.location}</span>
                              <span>•</span>
                              <Heart className="h-4 w-4" />
                              <span>{campaign.donors} donors</span>
                            </div>
                          </div>
                          <Link href={`/campaign/${campaign.id}`}>
                            <Button>Donate Now</Button>
                          </Link>
                        </div>
                        <div>
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="font-semibold text-primary">
                              {campaign.raised}
                            </span>
                            <span className="text-muted-foreground">
                              of {campaign.goal} • {campaign.percentage}%
                            </span>
                          </div>
                          <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-primary h-full transition-all duration-300"
                              style={{ width: `${campaign.percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by wallet, campaign, or tx hash..."
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Export CSV
                </Button>
              </div>
            </div>

            {/* Filter Tags */}
            <div className="flex flex-wrap gap-2">
              <Badge
                variant="secondary"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
              >
                All Transactions
              </Badge>
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
              >
                Donations
              </Badge>
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
              >
                Withdrawals
              </Badge>
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
              >
                Success Only
              </Badge>
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
              >
                Ethereum
              </Badge>
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
              >
                Last 24 Hours
              </Badge>
            </div>

            {/* Transactions Table */}
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-border bg-muted/50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold">
                          Timestamp
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">
                          Type
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">
                          From
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">
                          To
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">
                          Amount
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">
                          Campaign
                        </th>
                        <th className="px-6 py-4 text-right text-sm font-semibold">
                          Tx Hash
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {mockTransactions.map((tx) => (
                        <tr
                          key={tx.id}
                          className="hover:bg-muted/50 transition-colors"
                        >
                          <td className="px-6 py-4 text-sm text-muted-foreground whitespace-nowrap">
                            {tx.timestamp}
                          </td>
                          <td className="px-6 py-4">
                            <Badge
                              variant={
                                tx.status === "success"
                                  ? "default"
                                  : "secondary"
                              }
                              className={
                                tx.status === "success"
                                  ? "bg-green-500/10 text-green-500 hover:bg-green-500/20"
                                  : "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20"
                              }
                            >
                              {tx.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <Badge
                              variant="outline"
                              className={
                                tx.type === "donation"
                                  ? "border-blue-500/50 text-blue-500"
                                  : "border-amber-500/50 text-amber-500"
                              }
                            >
                              {tx.type}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 font-mono text-sm">
                            {tx.from}
                          </td>
                          <td className="px-6 py-4 font-mono text-sm">
                            {tx.to}
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              <p className="font-semibold">{tx.amount}</p>
                              <p className="text-xs text-muted-foreground">
                                {tx.amountPHP}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Link
                              href={`/campaign/${tx.id}`}
                              className="text-primary hover:underline"
                            >
                              {tx.campaign}
                            </Link>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() =>
                                openInExplorer(tx.txHash, tx.chain)
                              }
                              className="flex items-center justify-end w-full font-mono text-sm text-primary hover:underline"
                            >
                              {tx.txHash}
                              <ExternalLink className="ml-1 h-3 w-3" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Load More */}
            <div className="flex justify-center">
              <Button variant="outline">Load More Transactions</Button>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
