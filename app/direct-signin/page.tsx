"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function DirectSignInPage() {
  const [redirectUris, setRedirectUris] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRedirectInfo() {
      try {
        const response = await fetch('/api/auth/debug-redirect');
        if (!response.ok) {
          throw new Error('Failed to fetch redirect information');
        }
        const data = await response.json();
        setRedirectUris(data.expectedCallbackUrls || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchRedirectInfo();
  }, []);

  const handleDirectSignIn = () => {
    // Direct link to Google OAuth
    window.location.href = "/api/auth/signin/google";
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Direct Sign-in</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Google Sign-in</CardTitle>
          <CardDescription>
            Use this page to directly sign in with Google, bypassing the regular flow
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="p-4 border rounded-md mb-4">
            <h3 className="font-medium mb-2">Instructions</h3>
            <p className="mb-4">
              This page provides a direct link to Google sign-in, bypassing the client-side NextAuth flow.
              If you're having issues with the regular sign-in, this might help identify the problem.
            </p>
            <Button 
              onClick={handleDirectSignIn}
              className="w-full"
            >
              Sign in with Google (Direct)
            </Button>
          </div>

          {!loading && redirectUris.length > 0 && (
            <div className="p-4 border rounded-md">
              <h3 className="font-medium mb-2">Expected Redirect URIs</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Make sure these URIs are added to your Google OAuth Authorized redirect URIs in Google Cloud Console:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                {redirectUris.map((uri, index) => (
                  <li key={index} className="text-sm font-mono break-all">
                    {uri}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            After signing in, you should be redirected to your dashboard or home page.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
