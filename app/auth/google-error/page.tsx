"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

export default function GoogleErrorPage() {
  return (
    <div className="container flex items-center justify-center min-h-screen py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-red-600">Google Authentication Error</CardTitle>
          <CardDescription>
            There was a problem with Google sign-in
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Authentication Failed</AlertTitle>
            <AlertDescription>
              We encountered an issue with Google authentication. This is likely due to a configuration problem.
            </AlertDescription>
          </Alert>

          <div className="space-y-6">
            <div className="p-4 border rounded-md">
              <h3 className="font-medium mb-2">Possible Causes</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>The Google OAuth configuration may not be set up correctly</li>
                <li>The redirect URI in Google Cloud Console might not match the one used by the application</li>
                <li>There might be an issue with cookies or browser settings</li>
                <li>The Google account you're using might not have access to this application</li>
              </ul>
            </div>

            <div className="p-4 border rounded-md">
              <h3 className="font-medium mb-2">Try These Solutions</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Use our <Link href="/direct-signin" className="text-blue-600 hover:underline">Direct Sign-in Page</Link> which provides more information</li>
                <li>Clear your browser cookies and cache</li>
                <li>Try using an incognito/private browser window</li>
                <li>Try signing in with email and password instead</li>
                <li>Contact the site administrator if the problem persists</li>
              </ul>
            </div>
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
