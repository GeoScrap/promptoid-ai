"use client";

import { useEffect, useState } from "react";
import { AuthDebug } from "@/components/auth/auth-debug";

export function AuthDebugWrapper({ children }: { children: React.ReactNode }) {
  const [showDebug, setShowDebug] = useState(false);

  useEffect(() => {
    // Show debug in development or if explicitly enabled via URL param
    const shouldShowDebug =
      process.env.NODE_ENV === "development" ||
      window.location.search.includes("debug=true");

    setShowDebug(shouldShowDebug);
  }, []);

  return (
    <>
      {children}
      {showDebug && <AuthDebug />}
    </>
  );
}
