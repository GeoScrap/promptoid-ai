"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { AuthDebug } from "@/components/auth/auth-debug";

export default function AuthDebugPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const resetTestUser = async () => {
    if (!email) {
      toast.error("Please enter an email address");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/reset-test-user", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to reset test user");
      }

      toast.success(`User ${email} deleted successfully`);
      setEmail("");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Auth Debug Tools</h1>
      
      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Reset Test User</CardTitle>
            <CardDescription>
              Delete a test user from the database to retry signup
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                type="email"
                placeholder="test@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button onClick={resetTestUser} disabled={isLoading}>
                {isLoading ? "Deleting..." : "Delete User"}
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground">
              This tool is only available in development mode
            </p>
          </CardFooter>
        </Card>
      </div>

      {/* Include the AuthDebug component */}
      <div className="mt-8">
        <AuthDebug />
      </div>
    </div>
  );
}
