"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type AccountType = "personal" | "organization" | null
type SignupStep = "account-type" | "credentials" | "id-upload" | "face-verification" | "complete"

export default function SignupPage() {
  const [currentStep, setCurrentStep] = useState<SignupStep>("account-type")
  const [accountType, setAccountType] = useState<AccountType>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Form data
  const [formData, setFormData] = useState({
    // Personal/Org info
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    organizationName: "",
    organizationAddress: "",
    // Terms
    acceptedTerms: false,
    // IDs
    validIdFront: null as File | null,
    validIdBack: null as File | null,
    // Verification
    faceVerified: false,
  })

  const handleAccountTypeSelect = (type: AccountType) => {
    setAccountType(type)
    setCurrentStep("credentials")
  }

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!")
      return
    }
    if (!formData.acceptedTerms) {
      alert("Please accept the terms and conditions")
      return
    }
    setCurrentStep("id-upload")
  }

  const handleIdUpload = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.validIdFront || !formData.validIdBack) {
      alert("Please upload both front and back of your valid ID")
      return
    }
    setCurrentStep("face-verification")
  }

  const handleFaceVerification = async () => {
    setIsLoading(true)
    // Simulate face verification process
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setFormData({ ...formData, faceVerified: true })
    setIsLoading(false)
    setCurrentStep("complete")
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: "validIdFront" | "validIdBack") => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, [field]: e.target.files[0] })
    }
  }

  const stepVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Link
        href="/"
        className="absolute top-6 left-6 z-20 text-zinc-400 hover:text-[#e78a53] transition-colors duration-200 flex items-center space-x-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Back to Home</span>
      </Link>

      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-black to-zinc-900" />

      {/* Decorative elements */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-[#e78a53]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#e78a53]/5 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-2xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <div className="flex items-center justify-center space-x-2">
              <svg
                fill="currentColor"
                viewBox="0 0 147 70"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                className="text-[#e78a53] rounded-full size-8 w-8"
              >
                <path d="M56 50.2031V14H70V60.1562C70 65.5928 65.5928 70 60.1562 70C57.5605 70 54.9982 68.9992 53.1562 67.1573L0 14H19.7969L56 50.2031Z"></path>
                <path d="M147 56H133V23.9531L100.953 56H133V70H96.6875C85.8144 70 77 61.1856 77 50.3125V14H91V46.1562L123.156 14H91V0H127.312C138.186 0 147 8.81439 147 19.6875V56Z"></path>
              </svg>
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Create your account</h1>
          <p className="text-zinc-400">Join BlockBayan and start your blockchain journey</p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-xl mx-auto">
            {[
              { id: "account-type", label: "Account Type" },
              { id: "credentials", label: "Credentials" },
              { id: "id-upload", label: "ID Upload" },
              { id: "face-verification", label: "Verification" },
              { id: "complete", label: "Complete" },
            ].map((step, index, arr) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      currentStep === step.id
                        ? "bg-[#e78a53] text-white"
                        : arr.findIndex((s) => s.id === currentStep) > index
                          ? "bg-[#e78a53]/50 text-white"
                          : "bg-zinc-800 text-zinc-500"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span className="text-xs text-zinc-500 mt-1 hidden md:block">{step.label}</span>
                </div>
                {index < arr.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 ${
                      arr.findIndex((s) => s.id === currentStep) > index ? "bg-[#e78a53]/50" : "bg-zinc-800"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl p-8"
        >
          <AnimatePresence mode="wait">
            {/* Step 1: Account Type Selection */}
            {currentStep === "account-type" && (
              <motion.div
                key="account-type"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">Choose Account Type</h2>
                  <p className="text-zinc-400">Select the type of account you want to create</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <button
                    onClick={() => handleAccountTypeSelect("personal")}
                    className="group p-6 bg-zinc-800/50 hover:bg-zinc-800 border-2 border-zinc-700 hover:border-[#e78a53] rounded-xl transition-all duration-200 text-left"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-[#e78a53]/10 rounded-lg flex items-center justify-center group-hover:bg-[#e78a53]/20 transition-colors">
                        <svg
                          className="w-6 h-6 text-[#e78a53]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">Personal Account</h3>
                        <p className="text-sm text-zinc-400">For individual users</p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleAccountTypeSelect("organization")}
                    className="group p-6 bg-zinc-800/50 hover:bg-zinc-800 border-2 border-zinc-700 hover:border-[#e78a53] rounded-xl transition-all duration-200 text-left"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-[#e78a53]/10 rounded-lg flex items-center justify-center group-hover:bg-[#e78a53]/20 transition-colors">
                        <svg
                          className="w-6 h-6 text-[#e78a53]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">Organization Account</h3>
                        <p className="text-sm text-zinc-400">For businesses & orgs</p>
                      </div>
                    </div>
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Credentials & Terms */}
            {currentStep === "credentials" && (
              <motion.div
                key="credentials"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {accountType === "organization" ? "Organization" : "Personal"} Information
                  </h2>
                  <p className="text-zinc-400">Enter your details and accept our terms</p>
                </div>

                <form onSubmit={handleCredentialsSubmit} className="space-y-4">
                  {accountType === "organization" && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="organizationName" className="text-white">
                          Organization Name
                        </Label>
                        <Input
                          id="organizationName"
                          type="text"
                          placeholder="Enter organization name"
                          value={formData.organizationName}
                          onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                          className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-[#e78a53] focus:ring-[#e78a53]/20"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="organizationAddress" className="text-white">
                          Organization Address
                        </Label>
                        <Input
                          id="organizationAddress"
                          type="text"
                          placeholder="Enter organization address"
                          value={formData.organizationAddress}
                          onChange={(e) => setFormData({ ...formData, organizationAddress: e.target.value })}
                          className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-[#e78a53] focus:ring-[#e78a53]/20"
                          required
                        />
                      </div>
                    </>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white">
                      {accountType === "organization" ? "Contact Person Name" : "Full Name"}
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-[#e78a53] focus:ring-[#e78a53]/20"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-[#e78a53] focus:ring-[#e78a53]/20"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-[#e78a53] focus:ring-[#e78a53]/20"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-white">
                      Confirm Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-[#e78a53] focus:ring-[#e78a53]/20"
                      required
                    />
                  </div>

                  <div className="pt-4 space-y-3">
                    <label className="flex items-start space-x-3 text-sm">
                      <input
                        type="checkbox"
                        checked={formData.acceptedTerms}
                        onChange={(e) => setFormData({ ...formData, acceptedTerms: e.target.checked })}
                        className="mt-1 rounded border-zinc-700 bg-zinc-800 text-[#e78a53] focus:ring-[#e78a53]/20"
                        required
                      />
                      <span className="text-zinc-300">
                        I agree to the{" "}
                        <Link href="#" className="text-[#e78a53] hover:text-[#e78a53]/80">
                          Terms and Conditions
                        </Link>{" "}
                        and{" "}
                        <Link href="#" className="text-[#e78a53] hover:text-[#e78a53]/80">
                          Privacy Policy
                        </Link>
                      </span>
                    </label>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <Button
                      type="button"
                      onClick={() => setCurrentStep("account-type")}
                      variant="outline"
                      className="flex-1 bg-zinc-800/50 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-[#e78a53] hover:bg-[#e78a53]/90 text-white font-medium"
                    >
                      Continue
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Step 3: ID Upload */}
            {currentStep === "id-upload" && (
              <motion.div
                key="id-upload"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">Upload Valid ID</h2>
                  <p className="text-zinc-400">Please upload both sides of your government-issued ID</p>
                </div>

                <form onSubmit={handleIdUpload} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="idFront" className="text-white">
                        ID Front Side
                      </Label>
                      <div className="relative">
                        <input
                          id="idFront"
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, "validIdFront")}
                          className="hidden"
                          required
                        />
                        <label
                          htmlFor="idFront"
                          className="flex flex-col items-center justify-center w-full h-32 bg-zinc-800/50 border-2 border-dashed border-zinc-700 rounded-xl cursor-pointer hover:bg-zinc-800 hover:border-[#e78a53] transition-all"
                        >
                          {formData.validIdFront ? (
                            <div className="text-center">
                              <svg
                                className="w-8 h-8 mx-auto mb-2 text-[#e78a53]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                              <p className="text-sm text-zinc-300">{formData.validIdFront.name}</p>
                            </div>
                          ) : (
                            <div className="text-center">
                              <svg
                                className="w-8 h-8 mx-auto mb-2 text-zinc-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                />
                              </svg>
                              <p className="text-sm text-zinc-400">Click to upload front side</p>
                            </div>
                          )}
                        </label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="idBack" className="text-white">
                        ID Back Side
                      </Label>
                      <div className="relative">
                        <input
                          id="idBack"
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, "validIdBack")}
                          className="hidden"
                          required
                        />
                        <label
                          htmlFor="idBack"
                          className="flex flex-col items-center justify-center w-full h-32 bg-zinc-800/50 border-2 border-dashed border-zinc-700 rounded-xl cursor-pointer hover:bg-zinc-800 hover:border-[#e78a53] transition-all"
                        >
                          {formData.validIdBack ? (
                            <div className="text-center">
                              <svg
                                className="w-8 h-8 mx-auto mb-2 text-[#e78a53]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                              <p className="text-sm text-zinc-300">{formData.validIdBack.name}</p>
                            </div>
                          ) : (
                            <div className="text-center">
                              <svg
                                className="w-8 h-8 mx-auto mb-2 text-zinc-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                />
                              </svg>
                              <p className="text-sm text-zinc-400">Click to upload back side</p>
                            </div>
                          )}
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="bg-zinc-800/30 border border-zinc-700 rounded-lg p-4">
                    <p className="text-xs text-zinc-400">
                      <strong className="text-zinc-300">Accepted IDs:</strong> Passport, Driver's License, National
                      ID, or any government-issued identification document
                    </p>
                  </div>

                  <div className="flex space-x-3">
                    <Button
                      type="button"
                      onClick={() => setCurrentStep("credentials")}
                      variant="outline"
                      className="flex-1 bg-zinc-800/50 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-[#e78a53] hover:bg-[#e78a53]/90 text-white font-medium"
                    >
                      Continue
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Step 4: Face Verification */}
            {currentStep === "face-verification" && (
              <motion.div
                key="face-verification"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">Face Verification</h2>
                  <p className="text-zinc-400">We need to verify your identity to complete registration</p>
                </div>

                <div className="mb-8">
                  <div className="w-48 h-48 mx-auto bg-zinc-800/50 border-2 border-dashed border-zinc-700 rounded-full flex items-center justify-center">
                    <svg
                      className="w-20 h-20 text-zinc-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </div>
                </div>

                <div className="bg-zinc-800/30 border border-zinc-700 rounded-lg p-4 mb-6 text-left">
                  <p className="text-sm text-zinc-400 mb-2">
                    <strong className="text-zinc-300">Instructions:</strong>
                  </p>
                  <ul className="text-xs text-zinc-400 space-y-1 list-disc list-inside">
                    <li>Position your face within the frame</li>
                    <li>Ensure good lighting conditions</li>
                    <li>Remove any accessories that cover your face</li>
                    <li>Look directly at the camera</li>
                  </ul>
                </div>

                <div className="flex space-x-3">
                  <Button
                    onClick={() => setCurrentStep("id-upload")}
                    variant="outline"
                    className="flex-1 bg-zinc-800/50 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                    disabled={isLoading}
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleFaceVerification}
                    className="flex-1 bg-[#e78a53] hover:bg-[#e78a53]/90 text-white font-medium"
                    disabled={isLoading}
                  >
                    {isLoading ? "Verifying..." : "Start Verification"}
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 5: Complete */}
            {currentStep === "complete" && (
              <motion.div
                key="complete"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="text-center py-8"
              >
                <div className="w-20 h-20 mx-auto mb-6 bg-[#e78a53]/10 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-[#e78a53]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>

                <h2 className="text-3xl font-bold text-white mb-2">Account Created!</h2>
                <p className="text-zinc-400 mb-8">
                  Your {accountType} account has been successfully created and verified
                </p>

                <div className="bg-zinc-800/30 border border-zinc-700 rounded-lg p-6 mb-8 text-left">
                  <h3 className="text-sm font-semibold text-white mb-4">Account Summary:</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Account Type:</span>
                      <span className="text-white capitalize">{accountType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Email:</span>
                      <span className="text-white">{formData.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Name:</span>
                      <span className="text-white">{formData.name}</span>
                    </div>
                    {accountType === "organization" && (
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Organization:</span>
                        <span className="text-white">{formData.organizationName}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Status:</span>
                      <span className="text-[#e78a53]">✓ Verified</span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => (window.location.href = "/login")}
                  className="w-full bg-[#e78a53] hover:bg-[#e78a53]/90 text-white font-medium py-3 rounded-xl"
                >
                  Go to Login
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Login Link */}
        {currentStep === "account-type" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-center"
          >
            <p className="text-zinc-400">
              Already have an account?{" "}
              <Link href="/login" className="text-[#e78a53] hover:text-[#e78a53]/80 font-medium">
                Sign in
              </Link>
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
