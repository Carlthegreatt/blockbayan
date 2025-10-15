"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import DashboardHeader from "@/components/layout/DashboardHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Heart,
  Calendar,
  MapPin,
  Star,
  User,
  ChevronLeft,
  Trophy,
} from "lucide-react";
import Link from "next/link";

// Generate random reputation for campaign creators
const generateCreatorReputation = (seed: string) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash = hash & hash;
  }
  const random = Math.abs(hash) / 2147483647;
  
  return {
    rating: (3.5 + random * 1.5).toFixed(1),
    totalReviews: Math.floor(random * 150) + 10,
    campaignsCreated: Math.floor(random * 20) + 1,
    totalRaised: (random * 500 + 50).toFixed(1),
    responseTime: Math.floor(random * 48) + 1,
    successRate: (85 + random * 15).toFixed(0),
    verified: random > 0.5,
  };
};

// Mock user profiles database
const userProfiles: { [key: string]: any } = {
  "0x8e3b...A1d9": {
    name: "Maria Santos",
    avatar: "MS",
    address: "0x8e3b...A1d9",
    bio: "Community organizer and education advocate with 10+ years of experience.",
    location: "Mindanao, Philippines",
    joinedDate: "2023-06-15",
  },
  "0x2c4d...F8a1": {
    name: "Red Cross PH",
    avatar: "RC",
    address: "0x2c4d...F8a1",
    bio: "Official Philippine Red Cross disaster relief initiatives.",
    location: "Philippines",
    joinedDate: "2022-01-10",
  },
  "0x5a8c...D9f2": {
    name: "Juan Dela Cruz",
    avatar: "JD",
    address: "0x5a8c...D9f2",
    bio: "Civil engineer dedicated to improving rural infrastructure.",
    location: "Luzon, Philippines",
    joinedDate: "2023-09-01",
  },
  "0x3d2f...A7b9": {
    name: "Apo Foundation",
    avatar: "AF",
    address: "0x3d2f...A7b9",
    bio: "Non-profit supporting indigenous communities in the Cordillera region.",
    location: "Cordillera, Philippines",
    joinedDate: "2023-10-01",
  },
};

// Mock campaigns by user
const campaignsByUser: { [key: string]: any[] } = {
  "0x8e3b...A1d9": [
    {
      id: "1",
      title: "Support Local Schools in Mindanao",
      description: "Help provide educational materials and technology for underprivileged schools.",
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
    },
  ],
  "0x2c4d...F8a1": [
    {
      id: "2",
      title: "Medical Aid for Typhoon Victims",
      description: "Emergency medical supplies and healthcare support for communities affected by recent typhoons.",
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
    },
  ],
  "0x5a8c...D9f2": [
    {
      id: "3",
      title: "Community Water Project",
      description: "Building sustainable water infrastructure for rural communities lacking clean water access.",
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
    },
  ],
  "0x3d2f...A7b9": [
    {
      id: "4",
      title: "Indigenous Youth Education Fund",
      description: "Scholarships and educational programs for indigenous youth to access quality education.",
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
    },
  ],
};

export default function UserDashboardPage() {
  const params = useParams();
  const userId = params.userId as string;
  const [userProfile, setUserProfile] = useState<any>(null);
  const [userCampaigns, setUserCampaigns] = useState<any[]>([]);
  const [reputation, setReputation] = useState<any>(null);

  useEffect(() => {
    // Load user profile
    const profile = userProfiles[userId];
    if (profile) {
      setUserProfile(profile);
      setReputation(generateCreatorReputation(profile.address));
    }

    // Load user campaigns
    const campaigns = campaignsByUser[userId] || [];
    setUserCampaigns(campaigns);
  }, [userId]);

  if (!userProfile) {
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
          <Card className="p-12">
            <div className="text-center space-y-3">
              <User className="h-16 w-16 mx-auto text-muted-foreground" />
              <h3 className="text-xl font-semibold">User Not Found</h3>
              <p className="text-muted-foreground">
                This user profile does not exist.
              </p>
            </div>
          </Card>
        </main>
      </div>
    );
  }

  const totalRaised = userCampaigns.reduce((sum, campaign) => {
    return sum + parseFloat(campaign.raised.replace(" ETH", ""));
  }, 0);

  const totalDonors = userCampaigns.reduce((sum, campaign) => {
    return sum + campaign.donors;
  }, 0);

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

        {/* User Profile Header */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-4xl font-semibold text-primary">
                    {userProfile.avatar}
                  </span>
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 space-y-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold">{userProfile.name}</h1>
                    {reputation?.verified && (
                      <Badge className="bg-green-500 hover:bg-green-600">
                        ✓ Verified
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground font-mono">
                    {userProfile.address}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(parseFloat(reputation?.rating || "0"))
                            ? "fill-amber-400 text-amber-400"
                            : "text-muted-foreground"
                        }`}
                      />
                    ))}
                    <span className="text-sm text-muted-foreground ml-2">
                      {reputation?.rating} ({reputation?.totalReviews} reviews)
                    </span>
                  </div>
                </div>

                {userProfile.bio && (
                  <p className="text-muted-foreground">{userProfile.bio}</p>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Campaigns</p>
                    <p className="text-2xl font-bold">
                      {reputation?.campaignsCreated || userCampaigns.length}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Total Raised</p>
                    <p className="text-2xl font-bold">
                      {reputation?.totalRaised || totalRaised.toFixed(1)} ETH
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Success Rate</p>
                    <p className="text-2xl font-bold">{reputation?.successRate}%</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Total Backers</p>
                    <p className="text-2xl font-bold">{totalDonors}</p>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground pt-2">
                  {userProfile.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{userProfile.location}</span>
                    </div>
                  )}
                  {userProfile.joinedDate && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Joined {new Date(userProfile.joinedDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Trophy className="h-4 w-4" />
                    <span>~{reputation?.responseTime}h response time</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Section */}
        <Tabs defaultValue="campaigns" className="space-y-6">
          <TabsList>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>

          {/* Campaigns Tab */}
          <TabsContent value="campaigns" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Active Campaigns</h2>
              <p className="text-muted-foreground">
                Campaigns created by {userProfile.name}
              </p>
            </div>

            {userCampaigns.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {userCampaigns.map((campaign) => (
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
              <Card className="p-12">
                <div className="text-center space-y-3">
                  <h3 className="text-xl font-semibold">No campaigns yet</h3>
                  <p className="text-muted-foreground">
                    {userProfile.name} hasn't created any campaigns yet.
                  </p>
                </div>
              </Card>
            )}
          </TabsContent>

          {/* About Tab */}
          <TabsContent value="about" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About {userProfile.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {userProfile.bio && (
                  <div>
                    <h3 className="font-semibold mb-2">Bio</h3>
                    <p className="text-muted-foreground">{userProfile.bio}</p>
                  </div>
                )}

                <div className="space-y-3">
                  <h3 className="font-semibold">Creator Stats</h3>
                  <div className="grid gap-3">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm text-muted-foreground">
                        Total Campaigns Created
                      </span>
                      <span className="font-semibold">
                        {reputation?.campaignsCreated}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm text-muted-foreground">
                        Total Funds Raised
                      </span>
                      <span className="font-semibold">
                        {reputation?.totalRaised} ETH
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm text-muted-foreground">
                        Success Rate
                      </span>
                      <span className="font-semibold">
                        {reputation?.successRate}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm text-muted-foreground">
                        Average Response Time
                      </span>
                      <span className="font-semibold">
                        ~{reputation?.responseTime} hours
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm text-muted-foreground">
                        Member Since
                      </span>
                      <span className="font-semibold">
                        {new Date(userProfile.joinedDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
