"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const getErrorMessage = (errorCode: string | null) => {
    switch (errorCode) {
      case "Callback":
        return "There was a problem with the authentication callback. This usually happens when the callback URL doesn't match what's configured in your OAuth provider.";
      case "OAuthSignin":
        return "Error starting the OAuth sign-in flow. Please try again.";
      case "OAuthCallback":
        return "Error completing the OAuth sign-in flow. Please try again.";
      case "OAuthCreateAccount":
        return "Error creating a user account with your OAuth provider. Please try again.";
      case "EmailCreateAccount":
        return "Error creating a user account with your email. Please try again.";
      case "OAuthAccountNotLinked":
        return "This email is already associated with another account. Please sign in using the original provider.";
      case "EmailSignin":
        return "Error sending the email sign-in link. Please try again.";
      case "CredentialsSignin":
        return "The sign in credentials were incorrect. Please try again.";
      case "SessionRequired":
        return "You must be signed in to access this page.";
      default:
        return "An unknown error occurred during authentication. Please try again.";
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-screen py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-red-600">Authentication Error</CardTitle>
          <CardDescription>
            There was a problem signing you in
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 border border-red-200 rounded-md bg-red-50">
            <h3 className="font-medium mb-2">Error: {error}</h3>
            <p>{getErrorMessage(error)}</p>
          </div>

          <div className="mt-6 space-y-4">
            <h3 className="font-medium">Troubleshooting Steps:</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Make sure you're using the correct account</li>
              <li>Clear your browser cookies and cache</li>
              <li>Try using an incognito/private browser window</li>
              <li>Check that your Google account has access to the application</li>
              <li>Verify that you're allowing third-party cookies in your browser</li>
              <li>If the problem persists, please contact support</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button asChild variant="default">
            <Link href="/login">
              Return to Login
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">
              Go to Homepage
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
