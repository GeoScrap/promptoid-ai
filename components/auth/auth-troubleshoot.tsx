"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export function AuthTroubleshoot() {
  return (
    <Card className="mt-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <AlertCircle className="h-5 w-5 mr-2 text-amber-500" />
          Having trouble signing in?
        </CardTitle>
        <CardDescription>
          If you're experiencing issues with Google sign-in, try these alternatives
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Alternative sign-in methods:</h3>
          <div className="flex flex-col space-y-2">
            <Button asChild variant="outline" size="sm">
              <Link href="/direct-signin">
                Try Direct Sign-in Page
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/api/auth/signin/google">
                Direct Google OAuth Link
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
