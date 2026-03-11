"use client";

import { useEffect } from "react";

const GA_MEASUREMENT_ID = "AW-18006725804";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function PurchaseConversion() {
  useEffect(() => {
    const label = process.env.NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_CONVERSION_LABEL;
    if (!label || typeof window.gtag !== "function") return;
    window.gtag("event", "conversion", {
      send_to: `${GA_MEASUREMENT_ID}/${label}`,
    });
  }, []);

  return null;
}
