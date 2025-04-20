"use client";

import { AuthDebug } from "@/components/auth/auth-debug";

export function AuthDebugWrapper({ children }: { children: React.ReactNode }) {
  // Only show the debug component in development
  const isDevelopment = process.env.NODE_ENV === "development";

  return (
    <>
      {children}
      {isDevelopment && <AuthDebug />}
    </>
  );
}
