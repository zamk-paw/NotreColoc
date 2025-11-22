"use client";

import { useEffect } from "react";

export function PWAProvider() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/service-worker.js").catch((error) => {
        console.error("SW registration failed", error);
      });
    }
  }, []);
  return null;
}
