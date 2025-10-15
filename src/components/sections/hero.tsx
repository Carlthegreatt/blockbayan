"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Sparkles } from "lucide-react"
import TextType from '../TextType';
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

export default function Hero() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleTour = () => {
    const driverObj = driver({
      showProgress: true,
      animate: true,
      smoothScroll: false, // Disable native smooth scrolling
      onHighlightStarted: (element) => {
        if (element) {
          const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = elementPosition - 120; // Adjust for sticky header

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }
        driverObj.refresh();
      },
      steps: [
        {
          element: "#main-title",
          popover: {
            title: "Welcome to Blockbayan",
            description: "Transparency meets Bayanihan. Our mission is to bring trust and collaboration to the forefront.",
          },
        },
        {
          element: "#features",
          popover: {
            title: "Features",
            description: "Discover the powerful features that make Blockbayan unique.",
          },
        },
        {
          element: "#testimonials",
          popover: {
            title: "Testimonials",
            description: "See what our users have to say about their experience.",
          },
        },
        {
          element: "#faq",
          popover: {
            title: "FAQs",
            description: "Have questions? We have the answers for you right here.",
          },
        },
      ],
    });

    driverObj.drive();
  };

  if (!mounted) {
    return null
  }

  return (
    <>
      <section className="relative overflow-hidden min-h-screen flex flex-col">
        <div className="container mx-auto px-4 py-24 sm:py-32 relative z-10 flex-1 flex flex-col">
          <div className="mx-auto max-w-4xl text-center flex-1 flex flex-col justify-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
          
            </motion.div>

            {/* Main Heading */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-8"
            >
              <h1 id="main-title" className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
                Transparency <strong className="">meets</strong> <span className="bold">Bayanihan</span> <br />
              </h1>
            </motion.div>

              {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mx-auto mb-12 max-w-2xl text-lg text-muted-foreground h-20" // Added h-20 for space
            >
              <TextType 
                text={[
                  "Transparent tools, built for collaboration and trust.",
                  "Share, improve, and grow together through open innovation.",
                  "Let’s build the future, side by side."
                ]}
                typingSpeed={75}
                pauseDuration={1500}
                showCursor={true}
                cursorCharacter="|"
                className="text-lg text-muted-foreground"
              />
            </motion.div>
          </div>

            {/* Get started button and decorative elements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="absolute bottom-60 left-1/2 -translate-x-1/2"
            >
              {/* Get started button */}
              <div className="flex items-center justify-center gap-4">
                <a href="/docs/components/theme-toggle-animations">
                  <div className="group cursor-pointer border border-border bg-card gap-2 h-[60px] flex items-center p-[10px] rounded-full">
                    <div className="border border-border bg-primary h-[40px] rounded-full flex items-center justify-center text-primary-foreground">
                      <p className="font-medium tracking-tight mr-3 ml-3 flex items-center gap-2 justify-center text-base">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-globe animate-spin"
                        >
                          <circle cx="12" cy="12" r="10"></circle>
                          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
                          <path d="M2 12h20"></path>
                        </svg>
                        Get started
                      </p>
                    </div>
                    <div className="text-muted-foreground group-hover:ml-4 ease-in-out transition-all size-[24px] flex items-center justify-center rounded-full border-2 border-border">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-arrow-right group-hover:rotate-180 ease-in-out transition-all"
                      >
                        <path d="M5 12h14"></path>
                        <path d="m12 5 7 7-7 7"></path>
                      </svg>
                    </div>
                  </div>
                </a>
                <button onClick={handleTour} className="group cursor-pointer border border-border bg-card gap-2 h-[60px] flex items-center p-[10px] rounded-full">
                  <div className="h-[40px] rounded-full flex items-center justify-center text-foreground">
                    <p className="font-medium tracking-tight mr-3 ml-3 flex items-center gap-2 justify-center text-base">
                      Take a Tour
                    </p>
                  </div>
                </button>
              </div>
            </motion.div>

            {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-auto pb-8"
          >
            <div className="text-center">
              <div className="flex items-center justify-center gap-8">
                {/* Bitcoin Logo */}
                <div className="opacity-60 grayscale hover:opacity-100 hover:grayscale-0 hover:drop-shadow-[0_0_8px_rgba(242,169,0,0.5)] transition-all duration-300">
                  <img
                    src="/bitcoin.png"
                    alt="Bitcoin"
                    className="h-8 w-8 object-contain"
                  />
                </div>

                {/* Ethereum Logo */}
                <div className="opacity-60 grayscale hover:opacity-100 hover:grayscale-0 hover:drop-shadow-[0_0_8px_rgba(99,125,229,0.5)] transition-all duration-300">
                  <img
                    src="/ethereum.png"
                    alt="Ethereum"
                    className="h-8 w-8 object-contain"
                  />
                </div>

                {/* Solana Logo */}
                <div className="opacity-60 grayscale hover:opacity-100 hover:grayscale-0 hover:drop-shadow-[0_0_8px_rgba(153,69,255,0.5)] transition-all duration-300">
                  <img
                    src="/solana.png"
                    alt="Solana"
                    className="h-8 w-8 object-contain"
                  />
                </div>

                {/* Cardano Logo */}
                <div className="opacity-60 grayscale hover:opacity-100 hover:grayscale-0 hover:drop-shadow-[0_0_8px_rgba(0,51,173,0.5)] transition-all duration-300">
                  <img
                    src="/cardano.png"
                    alt="Cardano"
                    className="h-8 w-8 object-contain"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
