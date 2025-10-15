"use client";

import { useEffect, useState } from "react";
import { TrendingUp, DollarSign } from "lucide-react";
import { getETHPriceInfo } from "@/store/walletStore";
import { motion } from "framer-motion";

export default function ETHPriceTicker() {
  const [priceInfo, setPriceInfo] = useState(getETHPriceInfo());
  const [priceChange, setPriceChange] = useState(0);

  useEffect(() => {
    // Simulate small price fluctuations for presentation
    const interval = setInterval(() => {
      const change = (Math.random() - 0.5) * 0.5; // -0.25% to +0.25%
      setPriceChange(change);

      // Update price info periodically
      setPriceInfo(getETHPriceInfo());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const isPositive = priceChange >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg border border-border"
    >
      <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
        <DollarSign className="h-3.5 w-3.5 text-primary" />
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
          ETH
        </span>
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold whitespace-nowrap">
            {priceInfo.formatted.usd}
          </span>
          {priceChange !== 0 && (
            <div
              className={`flex items-center gap-0.5 text-[10px] ${
                isPositive ? "text-green-500" : "text-red-500"
              }`}
            >
              <TrendingUp
                className={`h-2.5 w-2.5 ${!isPositive ? "rotate-180" : ""}`}
              />
              <span>
                {isPositive ? "+" : ""}
                {priceChange.toFixed(1)}%
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
