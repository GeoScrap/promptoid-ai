"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { TestLogin } from "@/components/auth/test-login";

export default function AuthDebugPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    async function getSession() {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Error getting session:", error);
        } else {
          console.log("Session data:", data);
          setSession(data.session);
          setUser(data.session?.user || null);
        }
      } catch (error) {
        console.error("Error in getSession:", error);
      } finally {
        setAuthLoading(false);
      }
    }

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event);
        setSession(session);
        setUser(session?.user || null);
        setAuthLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      window.location.href = "/login";
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleGoToDashboard = () => {
    window.location.href = "/dashboard";
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Auth Debug Tools</h1>

      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Status</CardTitle>
            <CardDescription>
              Current authentication state from Supabase
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold">Session Status</h2>
                <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-40 dark:bg-gray-800">
                  {authLoading
                    ? "Loading..."
                    : JSON.stringify({ session: session, user: user }, null, 2)}
                </pre>
              </div>

              <div className="flex gap-4">
                {user ? (
                  <>
                    <Button onClick={handleSignOut}>Sign Out</Button>
                    <Button onClick={handleGoToDashboard}>Go to Dashboard</Button>
                  </>
                ) : (
                  <Button onClick={() => (window.location.href = "/login")}>
                    Go to Login
                  </Button>
                )}
              </div>

              <div>
                <h2 className="text-lg font-semibold mt-4">Environment Variables</h2>
                <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-40 dark:bg-gray-800">
                  {`NEXT_PUBLIC_SUPABASE_URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL ? "Set" : "Not set"}
NEXT_PUBLIC_SUPABASE_ANON_KEY: ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Set" : "Not set"}`}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8">
          <TestLogin />
        </div>
      </div>
    </div>
  );
}
