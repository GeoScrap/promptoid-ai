"use client";

import { AuthForm } from "@/components/auth/auth-form";
import { SpaceBackground } from "@/components/space-background";
import { MainNav } from "@/components/navigation/main-nav";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const searchParams = useSearchParams();

  // Get redirectTo parameter if it exists
  useEffect(() => {
    const redirectTo = searchParams.get("redirectTo");
  }, [searchParams]);

  return (
    <div className="min-h-screen flex flex-col">
      <SpaceBackground />
      <MainNav />
      <main className="flex-grow flex items-center justify-center py-12">
        <div className="w-full max-w-md px-4">
          <div className="mb-6">
            <Link href="/">
              <Button variant="ghost" size="sm" className="mb-6">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to home
              </Button>
            </Link>
          </div>
          <AuthForm mode="login" />
          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}