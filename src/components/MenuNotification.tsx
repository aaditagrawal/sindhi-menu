"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

export function MenuNotification() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    console.log("MenuNotification component mounted - showing toast");

    // Add a small delay to ensure everything is ready
    const timer = setTimeout(() => {
      console.log("Attempting to show toast...");

      // Try different toast methods
      toast(
        "Data as put on the Sindhi Mess banner.",
        {
          duration: 1500,
        },
      );
    }, 1000);

    return () => clearTimeout(timer);
  }, [mounted]);

  return null; // This component doesn't render anything
}
