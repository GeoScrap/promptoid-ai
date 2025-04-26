"use client";

import { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function AuthDebugTestPage() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn("google", { callbackUrl: "/auth-debug-test" });
    } catch (error) {
      console.error("Google sign-in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Auth Debug Test</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Authentication Status</CardTitle>
          <CardDescription>Current session and authentication state</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 border rounded-md">
            <h3 className="font-medium mb-2">Status: {status}</h3>
            {session ? (
              <div>
                <p>Signed in as: {session.user?.email}</p>
                <p>User ID: {session.user?.id}</p>
                <p>Name: {session.user?.name}</p>
              </div>
            ) : (
              <p>Not signed in</p>
            )}
          </div>

          <div className="mt-4 p-4 border rounded-md">
            <h3 className="font-medium mb-2">Environment Info</h3>
            <p>Window Location: {typeof window !== 'undefined' ? window.location.href : 'Server-side rendering'}</p>
            <p>Node Env: {process.env.NODE_ENV}</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          {status === "unauthenticated" ? (
            <div className="space-x-4">
              <Button onClick={handleGoogleSignIn} disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in with Google (Test)"}
              </Button>
              <Button onClick={() => signIn()} variant="outline">
                Sign in (Default)
              </Button>
            </div>
          ) : (
            <Button onClick={() => signOut({ callbackUrl: "/auth-debug-test" })} variant="destructive">
              Sign out
            </Button>
          )}
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Direct Provider Links</CardTitle>
          <CardDescription>Test direct provider links</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>These links bypass the client-side signIn() function and directly call the NextAuth endpoints:</p>
            
            <div className="p-4 border rounded-md">
              <h3 className="font-medium mb-2">Direct API Routes</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <a href="/api/auth/signin/google" className="text-blue-600 hover:underline">
                    /api/auth/signin/google (Direct API route)
                  </a>
                </li>
                <li>
                  <a href="/api/auth/signin" className="text-blue-600 hover:underline">
                    /api/auth/signin (Sign-in page)
                  </a>
                </li>
                <li>
                  <a href="/api/auth/providers" className="text-blue-600 hover:underline">
                    /api/auth/providers (Available providers)
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
