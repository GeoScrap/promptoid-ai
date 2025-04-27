"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function VerifyRequestPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  
  // If there's a Google error, redirect to our custom error page
  if (error === "google") {
    if (typeof window !== "undefined") {
      window.location.href = "/auth/google-error";
    }
    return null;
  }
  
  return (
    <div className="container flex items-center justify-center min-h-screen py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Check your email</CardTitle>
          <CardDescription>
            A sign in link has been sent to your email address
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 border rounded-md">
            <p className="mb-4">
              If you don't see it in your inbox, please check your spam folder.
              The link will expire after 24 hours.
            </p>
            <p>
              If you're having trouble signing in, you can try alternative methods:
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button asChild variant="default">
            <Link href="/login">
              Return to Login
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/direct-signin">
              Try Direct Sign-in
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
