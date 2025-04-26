"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { signIn, signOut } from "next-auth/react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

// Safe stringify function to handle circular references
function safeStringify(obj: any, indent = 2) {
  const cache = new Set();
  return JSON.stringify(
    obj,
    (key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (cache.has(value)) {
          return '[Circular Reference]';
        }
        cache.add(value);
      }
      return value;
    },
    indent
  );
}

export default function AuthTestPage() {
  const { data: session, status } = useSession();
  const [envVars, setEnvVars] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only fetch in development
    if (process.env.NODE_ENV === 'development') {
      fetch('/api/debug')
        .then(res => res.json())
        .then(data => {
          setEnvVars(data);
        })
        .catch(err => {
          setError('Failed to fetch environment variables');
          console.error(err);
        });
    }
  }, []);

  return (
    <div className="container mx-auto py-10">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Authentication Test Page</CardTitle>
          <CardDescription>
            Use this page to test your authentication setup
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 border rounded-md">
            <h3 className="font-medium mb-2">Session Status: {status}</h3>
            {status === 'loading' && <p>Loading session...</p>}
            {status === 'authenticated' && (
              <div>
                <p className="text-green-600">✓ Authenticated</p>
                <pre className="mt-4 p-4 bg-gray-100 rounded overflow-auto text-xs">
                  {safeStringify(session)}
                </pre>
              </div>
            )}
            {status === 'unauthenticated' && (
              <p className="text-red-600">✗ Not authenticated</p>
            )}
          </div>

          {process.env.NODE_ENV === 'development' && envVars && (
            <div className="p-4 border rounded-md">
              <h3 className="font-medium mb-2">Environment Variables</h3>
              <pre className="p-4 bg-gray-100 rounded overflow-auto text-xs">
                {safeStringify(envVars)}
              </pre>
            </div>
          )}

          {error && (
            <div className="p-4 border border-red-300 bg-red-50 rounded-md">
              <h3 className="font-medium text-red-700 mb-2">Error</h3>
              <p>{error}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          {status === 'unauthenticated' ? (
            <Button onClick={() => signIn('google', { callbackUrl: '/auth-test' })}>
              Sign in with Google
            </Button>
          ) : (
            <Button variant="destructive" onClick={() => signOut({ callbackUrl: '/auth-test' })}>
              Sign out
            </Button>
          )}
          <Button variant="outline" onClick={() => window.location.reload()}>
            Refresh Page
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
