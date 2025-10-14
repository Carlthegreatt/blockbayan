"use client"

import { useState } from "react"
import DashboardHeader from "@/components/layout/DashboardHeader"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Upload, Check, Loader2, ExternalLink, Copy } from "lucide-react"
import Link from "next/link"

type CampaignStep = "basic-info" | "funding-details" | "media" | "preview" | "deploy" | "success"

const categories = [
  "Education",
  "Healthcare",
  "Infrastructure",
  "Environment",
  "Community Development",
  "Disaster Relief",
  "Arts & Culture",
  "Technology",
]

const chains = [
  { name: "Ethereum", logo: "/ethereum.png" },
  { name: "Polygon", logo: "/cardano.png" },
  { name: "Base", logo: "/bitcoin.png" },
]

export default function CreateCampaignPage() {
  const [currentStep, setCurrentStep] = useState<CampaignStep>("basic-info")
  const [isDeploying, setIsDeploying] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    goal: "",
    endDate: "",
    chain: "Ethereum",
    image: null as File | null,
    video: null as File | null,
    // Deployed contract info
    contractAddress: "",
    transactionHash: "",
    chainId: "",
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: "image" | "video") => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, [field]: e.target.files[0] })
    }
  }

  const handleDeploy = async () => {
    setIsDeploying(true)
    // Simulate blockchain deployment
    await new Promise((resolve) => setTimeout(resolve, 3000))
    setFormData({
      ...formData,
      contractAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595C2f4",
      transactionHash: "0xabc123def456ghi789jkl012mno345pqr678stu901vwx234yz",
      chainId: "1",
    })
    setIsDeploying(false)
    setCurrentStep("success")
  }

  const nextStep = () => {
    const steps: CampaignStep[] = ["basic-info", "funding-details", "media", "preview", "deploy", "success"]
    const currentIndex = steps.indexOf(currentStep)
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1])
    }
  }

  const prevStep = () => {
    const steps: CampaignStep[] = ["basic-info", "funding-details", "media", "preview", "deploy", "success"]
    const currentIndex = steps.indexOf(currentStep)
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1])
    }
  }

  const stepVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  }

  const steps = [
    { id: "basic-info", label: "Basic Info" },
    { id: "funding-details", label: "Funding" },
    { id: "media", label: "Media" },
    { id: "preview", label: "Preview" },
    { id: "deploy", label: "Deploy" },
  ]

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep)

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-foreground mb-2">Launch Your Campaign</h1>
          <p className="text-muted-foreground">Create a transparent, blockchain-powered fundraising campaign</p>
        </div>

        {/* Progress Indicator */}
        {currentStep !== "success" && (
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index, arr) => (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                        currentStepIndex >= index
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {currentStepIndex > index ? <Check className="h-5 w-5" /> : index + 1}
                    </div>
                    <span className="text-xs text-muted-foreground mt-2 hidden md:block">{step.label}</span>
                  </div>
                  {index < arr.length - 1 && (
                    <div
                      className={`h-1 flex-1 transition-colors ${
                        currentStepIndex > index ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Form Steps */}
        <Card className="overflow-hidden">
          <CardContent className="p-8">
            <AnimatePresence mode="wait">
              {/* Step 1: Basic Info */}
              {currentStep === "basic-info" && (
                <motion.div
                  key="basic-info"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Basic Information</h2>
                    <p className="text-muted-foreground">Tell us about your campaign</p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Campaign Title *</Label>
                      <Input
                        id="title"
                        placeholder="e.g., Support Local Schools in Mindanao"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description *</Label>
                      <textarea
                        id="description"
                        placeholder="Describe your campaign, its goals, and how the funds will be used..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full min-h-[150px] px-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <select
                        id="category"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        required
                      >
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        placeholder="e.g., Manila, Philippines"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button onClick={nextStep} disabled={!formData.title || !formData.description || !formData.category}>
                      Continue
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Funding Details */}
              {currentStep === "funding-details" && (
                <motion.div
                  key="funding-details"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Funding Details</h2>
                    <p className="text-muted-foreground">Set your fundraising goal and timeline</p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="goal">Funding Goal (ETH) *</Label>
                      <Input
                        id="goal"
                        type="number"
                        placeholder="e.g., 50"
                        value={formData.goal}
                        onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                        required
                      />
                      {formData.goal && (
                        <p className="text-xs text-muted-foreground">≈ ${(parseFloat(formData.goal) * 2420).toLocaleString()} USD</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="endDate">Campaign End Date *</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        min={new Date().toISOString().split("T")[0]}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Blockchain Network *</Label>
                      <div className="grid grid-cols-3 gap-3">
                        {chains.map((chain) => (
                          <button
                            key={chain.name}
                            type="button"
                            onClick={() => setFormData({ ...formData, chain: chain.name })}
                            className={`p-4 rounded-lg border-2 transition-all ${
                              formData.chain === chain.name
                                ? "border-primary bg-primary/10"
                                : "border-border hover:border-primary/50"
                            }`}
                          >
                            <img src={chain.logo} alt={chain.name} className="h-8 w-8 mx-auto mb-2 opacity-80" />
                            <p className="text-sm font-medium">{chain.name}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={prevStep}>
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button onClick={nextStep} disabled={!formData.goal || !formData.endDate}>
                      Continue
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Media Upload */}
              {currentStep === "media" && (
                <motion.div
                  key="media"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Campaign Media</h2>
                    <p className="text-muted-foreground">Upload images and videos to showcase your campaign</p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="image">Campaign Image *</Label>
                      <input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, "image")}
                        className="hidden"
                      />
                      <label
                        htmlFor="image"
                        className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary hover:bg-accent transition-all"
                      >
                        {formData.image ? (
                          <div className="text-center">
                            <Check className="h-8 w-8 mx-auto mb-2 text-primary" />
                            <p className="text-sm font-medium">{formData.image.name}</p>
                            <p className="text-xs text-muted-foreground mt-1">Click to change</p>
                          </div>
                        ) : (
                          <div className="text-center">
                            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-sm font-medium">Click to upload image</p>
                            <p className="text-xs text-muted-foreground mt-1">PNG, JPG, or GIF (max 5MB)</p>
                          </div>
                        )}
                      </label>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="video">Campaign Video (Optional)</Label>
                      <input
                        id="video"
                        type="file"
                        accept="video/*"
                        onChange={(e) => handleFileChange(e, "video")}
                        className="hidden"
                      />
                      <label
                        htmlFor="video"
                        className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary hover:bg-accent transition-all"
                      >
                        {formData.video ? (
                          <div className="text-center">
                            <Check className="h-8 w-8 mx-auto mb-2 text-primary" />
                            <p className="text-sm font-medium">{formData.video.name}</p>
                            <p className="text-xs text-muted-foreground mt-1">Click to change</p>
                          </div>
                        ) : (
                          <div className="text-center">
                            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-sm font-medium">Click to upload video</p>
                            <p className="text-xs text-muted-foreground mt-1">MP4, WebM (max 50MB)</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={prevStep}>
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button onClick={nextStep} disabled={!formData.image}>
                      Continue
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Preview */}
              {currentStep === "preview" && (
                <motion.div
                  key="preview"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Preview Your Campaign</h2>
                    <p className="text-muted-foreground">Review all details before deploying to the blockchain</p>
                  </div>

                  <Card className="border-2">
                    <div className="aspect-video bg-muted relative overflow-hidden">
                      {formData.image && (
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 flex items-center justify-center">
                          <Upload className="h-12 w-12 text-white/50" />
                        </div>
                      )}
                    </div>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <CardTitle className="text-2xl">{formData.title}</CardTitle>
                          <div className="flex items-center gap-2">
                            <Badge>{formData.category}</Badge>
                            {formData.location && <Badge variant="outline">{formData.location}</Badge>}
                          </div>
                        </div>
                        <Badge className="bg-green-500">✓ Verified</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground">{formData.description}</p>

                      <div>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="font-semibold">Goal: {formData.goal} ETH</span>
                          <span className="text-muted-foreground">on {formData.chain}</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div className="bg-primary h-full w-0" />
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Ends: {new Date(formData.endDate).toLocaleDateString()}</span>
                        <span>0 donors</span>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={prevStep}>
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button onClick={nextStep}>
                      Continue to Deploy
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 5: Deploy */}
              {currentStep === "deploy" && (
                <motion.div
                  key="deploy"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="space-y-6 text-center py-8"
                >
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Deploy Smart Contract</h2>
                    <p className="text-muted-foreground">Your campaign will be deployed to the {formData.chain} blockchain</p>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-8 space-y-4">
                    <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                      <img src={chains.find((c) => c.name === formData.chain)?.logo} alt={formData.chain} className="h-12 w-12 opacity-80" />
                    </div>
                    <div className="space-y-2">
                      <p className="font-semibold">Network: {formData.chain}</p>
                      <p className="text-sm text-muted-foreground">Estimated gas fee: ~0.005 ETH</p>
                    </div>
                  </div>

                  <div className="bg-amber-500/10 border border-amber-500/50 rounded-lg p-4 text-left">
                    <p className="text-sm text-amber-700 dark:text-amber-400">
                      <strong>Important:</strong> Once deployed, your campaign cannot be deleted. You will need to confirm this transaction in your wallet.
                    </p>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={prevStep} disabled={isDeploying}>
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button onClick={handleDeploy} disabled={isDeploying} className="min-w-[180px]">
                      {isDeploying ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Deploying...
                        </>
                      ) : (
                        "Deploy Campaign"
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Success Step */}
              {currentStep === "success" && (
                <motion.div
                  key="success"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="space-y-6 text-center py-8"
                >
                  <div className="w-20 h-20 mx-auto bg-green-500/10 rounded-full flex items-center justify-center">
                    <Check className="h-10 w-10 text-green-500" />
                  </div>

                  <div>
                    <h2 className="text-3xl font-bold mb-2">Campaign Deployed!</h2>
                    <p className="text-muted-foreground">Your campaign has been successfully deployed on the blockchain</p>
                  </div>

                  <Card className="border-2 border-green-500/20 text-left">
                    <CardHeader>
                      <CardTitle className="text-lg">Deployment Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Campaign Title</p>
                        <p className="font-semibold">{formData.title}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Contract Address</p>
                        <div className="flex items-center gap-2">
                          <code className="text-sm font-mono bg-muted px-2 py-1 rounded">{formData.contractAddress}</code>
                          <Button variant="ghost" size="sm">
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Transaction Hash</p>
                        <div className="flex items-center gap-2">
                          <code className="text-sm font-mono bg-muted px-2 py-1 rounded truncate">{formData.transactionHash}</code>
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Network</p>
                        <p className="font-semibold">{formData.chain}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex gap-3">
                    <Link href="/dashboard" className="flex-1">
                      <Button variant="outline" className="w-full">
                        Go to Dashboard
                      </Button>
                    </Link>
                    <Link href={`/campaign/${formData.contractAddress}`} className="flex-1">
                      <Button className="w-full">
                        View Campaign
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

