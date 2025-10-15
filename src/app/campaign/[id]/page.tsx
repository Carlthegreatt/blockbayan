"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import DashboardHeader from "@/components/layout/DashboardHeader";
import { useToast } from "@/components/ui/toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Heart,
  Share2,
  Calendar,
  MapPin,
  TrendingUp,
  ExternalLink,
  Copy,
  ChevronLeft,
  Check,
  Loader2,
  Download,
  Wallet,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { generateReceipt, openInExplorer } from "@/lib/receipt-utils";
import { getWalletData, processDonation, ethToPHP, ethToUSD } from "@/store/walletStore";

// Mock campaigns database
const mockCampaignsData: { [key: string]: any } = {
  "1": {
    id: "1",
    title: "Support Local Schools in Mindanao",
    description:
      "Help provide educational materials, technology, and infrastructure support for underprivileged schools in the Mindanao region. Your donation will directly fund classroom renovations, computer labs, libraries, and teacher training programs. Every contribution makes a lasting impact on children's futures.",
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
    image: "https://mindanews.com/wp-content/uploads/2020/07/28haran11.jpg",
    contractAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595C2f4",
    creator: "0x8e3b...A1d9",
    createdAt: "2025-09-15",
  },
  "2": {
    id: "2",
    title: "Medical Aid for Typhoon Victims",
    description:
      "Emergency medical supplies and healthcare support for communities affected by recent typhoons. This campaign aims to provide critical medical aid, temporary shelters, and essential supplies to families devastated by natural disasters. Your support will help save lives and rebuild communities.",
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
    image: "https://files01.pna.gov.ph/category-list/2024/10/01/batac-flooding.jpg",
    contractAddress: "0x9f1a35Dd7845D1643936b4c955Bc8f9a7685B3e7",
    creator: "0x2c4d...F8a1",
    createdAt: "2025-08-20",
  },
  "3": {
    id: "3",
    title: "Community Water Project",
    description:
      "Building sustainable water infrastructure for rural communities lacking clean water access. This initiative will construct wells, water filtration systems, and distribution networks to ensure safe drinking water for thousands of families. Clean water is a fundamental right, and your contribution helps make it a reality.",
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
    image: "https://cdn.prod.website-files.com/6287850a0485ea045a5e0ce2/632899ca01c83a6de49e07b2_WATER%20FOR%20WATERLESS.jpg",
    contractAddress: "0x7b4e28Ff9123E5789abcd4f655Cc91a8D3e2C1a8",
    creator: "0x5a8c...D9f2",
    createdAt: "2025-09-01",
  },
  "4": {
    id: "4",
    title: "Indigenous Youth Education Fund",
    description:
      "Scholarships and educational programs for indigenous youth to access quality education. This fund supports students from indigenous communities with tuition, school supplies, transportation, and mentorship programs. Education empowers communities and preserves cultural heritage while opening doors to opportunities.",
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
    image: "https://www.scout.org/sites/default/files/styles/social_media/public/d7/news_pictures/3_344.jpg.webp?itok=qBWXYAuF",
    contractAddress: "0x6c8e91Ba2456C7890defg1h234Ee56f7E2d4A8b9",
    creator: "0x3d2f...A7b9",
    createdAt: "2025-10-01",
  },
};

const mockDonations = [
  {
    id: "1",
    donor: "0x742d...C2f4",
    amount: "5 ETH",
    amountUSD: "₱675,000",
    timestamp: "2025-10-14 14:30:22",
    txHash: "0xabc123...def456",
  },
  {
    id: "2",
    donor: "0x9f1a...B3e7",
    amount: "10 ETH",
    amountUSD: "₱1,350,000",
    timestamp: "2025-10-13 10:15:45",
    txHash: "0x789ghi...jkl012",
  },
  {
    id: "3",
    donor: "0x5a8c...D9f2",
    amount: "2.5 ETH",
    amountUSD: "₱337,500",
    timestamp: "2025-10-12 16:45:10",
    txHash: "0x345mno...pqr678",
  },
];

export default function CampaignDetailsPage() {
  const params = useParams();
  const { showToast } = useToast();
  const [donationAmount, setDonationAmount] = useState("");
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [isDonating, setIsDonating] = useState(false);
  const [donationSuccess, setDonationSuccess] = useState(false);
  const [donationTxHash, setDonationTxHash] = useState("");
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletBalance, setWalletBalance] = useState<string>("0.00");
  const [campaignData, setCampaignData] = useState(
    mockCampaignsData["1"] || mockCampaignsData["1"]
  );

  useEffect(() => {
    // Load the correct campaign based on ID
    if (params.id && mockCampaignsData[params.id as string]) {
      setCampaignData(mockCampaignsData[params.id as string]);
    }

    // Check if wallet is connected
    const walletData = sessionStorage.getItem("wallet");
    if (walletData) {
      const { connected } = JSON.parse(walletData);
      setIsWalletConnected(connected);

      // Get wallet balance from sessionStorage
      const balance = sessionStorage.getItem("walletBalance");
      if (balance) {
        setWalletBalance(balance);
      }
    }

    // Load campaign from sessionStorage if it exists
    const storedCampaigns = sessionStorage.getItem("userCampaigns");
    if (storedCampaigns && params.id) {
      try {
        const campaigns = JSON.parse(storedCampaigns);
        const foundCampaign = campaigns.find((c: any) => c.id === params.id);
        if (foundCampaign) {
          // Map the stored campaign to the expected format
          setCampaignData({
            ...mockCampaignsData["1"],
            id: foundCampaign.id,
            title: foundCampaign.title,
            description: foundCampaign.description,
            category: foundCampaign.category,
            location: foundCampaign.location || "Philippines",
            goal: foundCampaign.goal,
            raised: foundCampaign.raised,
            percentage: foundCampaign.percentage,
            deadline: foundCampaign.deadline,
            chain: foundCampaign.chain,
            contractAddress:
              foundCampaign.contractAddress || mockCampaignsData["1"].contractAddress,
            createdAt: foundCampaign.createdAt || new Date().toISOString(),
            status: foundCampaign.status,
            image: foundCampaign.image || mockCampaignsData["1"].image,
            donors: foundCampaign.donors || mockCampaignsData["1"].donors,
            verified: foundCampaign.verified || false,
          });
        }
      } catch (error) {
        console.error("Error loading campaign:", error);
      }
    }
  }, [params.id]);

  const handleDonateClick = () => {
    if (!isWalletConnected) {
      // Show modal to prompt wallet connection
      setShowDonateModal(true);
    } else {
      setShowDonateModal(true);
    }
  };

  const handleDonate = async () => {
    if (!isWalletConnected) {
      return;
    }

    const amount = parseFloat(donationAmount);
    if (!amount || amount <= 0) {
      showToast("Invalid donation amount", "error");
      return;
    }

    setIsDonating(true);

    try {
      // Process donation using wallet store (includes balance check and transaction creation)
      const tx = await processDonation(
        amount,
        campaignData.id,
        campaignData.title,
        campaignData.contractAddress
      );

      setDonationTxHash(tx.txHash);

      // Update local wallet balance
      const wallet = getWalletData();
      if (wallet) {
        setWalletBalance(wallet.balance);
      }

      // Reload campaign data to show updated raised amount
      const storedCampaigns = sessionStorage.getItem("userCampaigns");
      if (storedCampaigns && params.id) {
        const campaigns = JSON.parse(storedCampaigns);
        const foundCampaign = campaigns.find((c: any) => c.id === params.id);
        if (foundCampaign) {
          setCampaignData({
            ...campaignData,
            raised: foundCampaign.raised,
            percentage: foundCampaign.percentage,
            donors: foundCampaign.donors,
          });
        }
      }

      setIsDonating(false);
      setDonationSuccess(true);
      showToast("Donation successful!", "success");
    } catch (error: any) {
      setIsDonating(false);
      showToast(error.message || "Failed to process donation", "error");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast("Copied to clipboard!");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: campaignData.title,
        text: campaignData.description,
        url: window.location.href,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <Link
          href="/explore"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Explore
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Campaign Image */}
            <Card className="overflow-hidden">
              <div className="aspect-video bg-muted relative">
                {campaignData.image ? (
                  <img
                    src={campaignData.image}
                    alt={campaignData.title}
                    className="object-cover w-full h-full opacity-80"
                    onError={(e) => {
                      // Fallback to placeholder if image fails to load
                      e.currentTarget.src = "/ethereum.png";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                    <div className="text-center">
                      <div className="text-6xl mb-2">📋</div>
                      <p className="text-sm text-muted-foreground">
                        Campaign Image
                      </p>
                    </div>
                  </div>
                )}
                {campaignData.verified && (
                  <Badge className="absolute top-4 right-4 bg-green-500 hover:bg-green-600">
                    ✓ Verified
                  </Badge>
                )}
              </div>
            </Card>

            {/* Campaign Info */}
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h1 className="text-4xl font-bold mb-3">
                    {campaignData.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <Badge>{campaignData.category}</Badge>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{campaignData.location}</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Ends{" "}
                        {new Date(campaignData.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>

              <p className="text-lg leading-relaxed">
                {campaignData.description}
              </p>
            </div>

            {/* Tabs Section */}
            <Tabs defaultValue="donations" className="space-y-6">
              <TabsList>
                <TabsTrigger value="donations">Donation History</TabsTrigger>
                <TabsTrigger value="updates">Updates</TabsTrigger>
                <TabsTrigger value="contract">Smart Contract</TabsTrigger>
              </TabsList>

              <TabsContent value="donations">
                <Card>
                  <CardHeader>
                    <CardTitle>Donation History</CardTitle>
                    <CardDescription>
                      All contributions to this campaign on the blockchain
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="border-b border-border bg-muted/50">
                          <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold">
                              Donor
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold">
                              Amount
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold">
                              Timestamp
                            </th>
                            <th className="px-6 py-4 text-right text-sm font-semibold">
                              Tx Hash
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {mockDonations.map((donation) => (
                            <tr
                              key={donation.id}
                              className="hover:bg-muted/50 transition-colors"
                            >
                              <td className="px-6 py-4 font-mono text-sm">
                                {donation.donor}
                              </td>
                              <td className="px-6 py-4">
                                <div className="space-y-1">
                                  <p className="font-semibold">
                                    {donation.amount}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {donation.amountUSD}
                                  </p>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-sm text-muted-foreground">
                                {donation.timestamp}
                              </td>
                              <td className="px-6 py-4">
                                <button className="flex items-center justify-end w-full font-mono text-sm text-primary hover:underline">
                                  {donation.txHash}
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
              </TabsContent>

              <TabsContent value="updates">
                <Card>
                  <CardHeader>
                    <CardTitle>Campaign Updates</CardTitle>
                    <CardDescription>
                      Latest news and progress from the campaign creator
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border-l-2 border-primary pl-4 py-2">
                      <p className="text-sm text-muted-foreground mb-1">
                        October 10, 2025
                      </p>
                      <h4 className="font-semibold mb-2">
                        65% Funded - Thank You!
                      </h4>
                      <p className="text-sm">
                        We're thrilled to have reached 65% of our goal! The
                        funds received so far have already been used to renovate
                        two classrooms and purchase 30 new laptops for the
                        computer lab.
                      </p>
                    </div>
                    <div className="border-l-2 border-muted-foreground pl-4 py-2">
                      <p className="text-sm text-muted-foreground mb-1">
                        September 25, 2025
                      </p>
                      <h4 className="font-semibold mb-2">Campaign Launch</h4>
                      <p className="text-sm">
                        We've officially launched our campaign to support local
                        schools in Mindanao. Thank you to all our early
                        supporters!
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="contract">
                <Card>
                  <CardHeader>
                    <CardTitle>Smart Contract Information</CardTitle>
                    <CardDescription>
                      Blockchain details and contract verification
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">
                            Contract Address
                          </p>
                          <code className="text-sm font-mono">
                            {campaignData.contractAddress}
                          </code>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            copyToClipboard(campaignData.contractAddress)
                          }
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">
                            Network
                          </p>
                          <p className="font-semibold">{campaignData.chain}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">
                            Campaign Creator
                          </p>
                          <code className="text-sm font-mono">
                            {campaignData.creator}
                          </code>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(campaignData.creator)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">
                            Created On
                          </p>
                          <p className="font-semibold">
                            {new Date(
                              campaignData.createdAt
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View on Etherscan
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Donation Card */}
            <Card className="sticky top-24">
              <CardHeader>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="font-semibold text-2xl text-primary">
                        {campaignData.raised}
                      </span>
                      <span className="text-muted-foreground">
                        of {campaignData.goal}
                      </span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-primary h-full transition-all duration-300"
                        style={{ width: `${campaignData.percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {campaignData.percentage}% funded
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-4 border-y border-border">
                    <div className="space-y-1">
                      <p className="text-2xl font-bold">
                        {campaignData.donors}
                      </p>
                      <p className="text-xs text-muted-foreground">Donors</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-2xl font-bold">
                        {Math.ceil(
                          (new Date(campaignData.deadline).getTime() -
                            Date.now()) /
                            (1000 * 60 * 60 * 24)
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">Days Left</p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleDonateClick}
                >
                  <Heart className="mr-2 h-5 w-5" />
                  Donate Now
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleShare}
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Campaign
                </Button>
              </CardContent>
            </Card>

            {/* Campaign Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Campaign Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    Average Donation
                  </span>
                  <span className="font-semibold">0.26 ETH</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Top Donation</span>
                  <span className="font-semibold">10 ETH</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    Total Transactions
                  </span>
                  <span className="font-semibold">124</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    Verification Status
                  </span>
                  <Badge className="bg-green-500">✓ Verified</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Donate Modal */}
      <AnimatePresence>
        {showDonateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() =>
              !isDonating && !donationSuccess && setShowDonateModal(false)
            }
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md"
            >
              <Card>
                <CardHeader>
                  <CardTitle>
                    {!isWalletConnected
                      ? "Wallet Connection Required"
                      : donationSuccess
                      ? "Donation Successful!"
                      : "Make a Donation"}
                  </CardTitle>
                  <CardDescription>
                    {!isWalletConnected
                      ? "Please connect your wallet to make a donation"
                      : donationSuccess
                      ? "Your contribution has been recorded on the blockchain"
                      : `Support ${campaignData.title}`}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!isWalletConnected ? (
                    <>
                      <div className="flex flex-col items-center justify-center py-6">
                        <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
                          <AlertCircle className="h-8 w-8 text-destructive" />
                        </div>
                        <p className="text-center text-muted-foreground mb-4">
                          You need to connect your wallet to donate to this
                          campaign. Donations are processed securely through the
                          blockchain.
                        </p>
                      </div>

                      <div className="bg-muted/50 p-4 rounded-lg">
                        <div className="flex items-start space-x-3">
                          <Wallet className="h-5 w-5 text-primary mt-0.5" />
                          <div className="flex-1 space-y-1">
                            <p className="text-sm font-semibold">
                              Why connect a wallet?
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Your wallet enables secure, transparent donations
                              directly to the campaign's smart contract. All
                              transactions are recorded on the blockchain.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => setShowDonateModal(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          className="flex-1"
                          onClick={() => {
                            setShowDonateModal(false);
                            // The header component will handle showing the wallet modal
                            window.location.href = "/dashboard";
                          }}
                        >
                          <Wallet className="mr-2 h-4 w-4" />
                          Connect Wallet
                        </Button>
                      </div>
                    </>
                  ) : !donationSuccess ? (
                    <>
                      {/* Campaign Info */}
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        {campaignData.image ? (
                          <img
                            src={campaignData.image}
                            alt={campaignData.title}
                            className="w-12 h-12 rounded object-cover flex-shrink-0"
                            onError={(e) => {
                              e.currentTarget.src = "/ethereum.png";
                            }}
                          />
                        ) : (
                          <div className="w-12 h-12 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <span className="text-xl">📋</span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate">
                            {campaignData.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {campaignData.category}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="amount">Donation Amount (ETH)</Label>
                        <Input
                          id="amount"
                          type="number"
                          placeholder="0.0"
                          value={donationAmount}
                          onChange={(e) => setDonationAmount(e.target.value)}
                          disabled={isDonating}
                        />
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">
                            {donationAmount &&
                              `≈ $${ethToUSD(donationAmount)} USD / ₱${ethToPHP(donationAmount)} PHP`}
                          </span>
                          <span className="text-muted-foreground">
                            Balance: {walletBalance} ETH
                          </span>
                        </div>
                      </div>

                      <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Network</span>
                          <span className="font-semibold">
                            {campaignData.chain}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Gas Fee (est.)
                          </span>
                          <span className="font-semibold">~0.002 ETH</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Total Cost
                          </span>
                          <span className="font-semibold">
                            {donationAmount
                              ? (parseFloat(donationAmount) + 0.002).toFixed(4)
                              : "0.002"}{" "}
                            ETH
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => setShowDonateModal(false)}
                          disabled={isDonating}
                        >
                          Cancel
                        </Button>
                        <Button
                          className="flex-1"
                          onClick={handleDonate}
                          disabled={
                            !donationAmount ||
                            parseFloat(donationAmount) <= 0 ||
                            isDonating
                          }
                        >
                          {isDonating ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            "Confirm Donation"
                          )}
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex flex-col items-center justify-center py-6">
                        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
                          <Check className="h-8 w-8 text-green-500" />
                        </div>
                        <p className="text-lg font-semibold mb-2">
                          Thank you for your donation!
                        </p>
                        <p className="text-2xl font-bold text-primary">
                          {donationAmount} ETH
                        </p>
                      </div>

                      <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
                        <div className="space-y-1">
                          <p className="text-muted-foreground">
                            Transaction Hash
                          </p>
                          <div className="flex items-center gap-2">
                            <code className="text-xs font-mono truncate">
                              {donationTxHash}
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(donationTxHash)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => {
                            generateReceipt({
                              campaign: campaignData.title,
                              amount: donationAmount + " ETH",
                              txHash: donationTxHash,
                              date: new Date().toLocaleString(),
                              to: campaignData.contractAddress,
                            });
                            showToast("Receipt downloaded!");
                          }}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Receipt
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() =>
                            openInExplorer(donationTxHash, campaignData.chain)
                          }
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Explorer
                        </Button>
                      </div>

                      <Button
                        className="w-full"
                        onClick={() => {
                          setShowDonateModal(false);
                          setDonationSuccess(false);
                          setDonationAmount("");
                        }}
                      >
                        Close
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
