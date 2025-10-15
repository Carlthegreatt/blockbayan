"use client";

import { useEffect, useState } from "react";
import { DollarSign } from "lucide-react";
import { getETHPriceInfo } from "@/store/walletStore";

export default function ETHPriceTicker() {
  const [priceInfo, setPriceInfo] = useState(getETHPriceInfo());

  useEffect(() => {
    // Update price info periodically
    const interval = setInterval(() => {
      setPriceInfo(getETHPriceInfo());
    }, 30000); // Update every 30 seconds instead of 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg border border-border">
      <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
        <DollarSign className="h-3.5 w-3.5 text-primary" />
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
          ETH
        </span>
        <span className="text-xs font-bold whitespace-nowrap">
          {priceInfo.formatted.usd}
        </span>
      </div>
    </div>
  );
}
