"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { PromptForm } from "@/components/prompt/prompt-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSupabaseAuth } from "@/components/providers/supabase-auth-provider";
import { redirect } from "next/navigation";
import { toast } from "sonner";

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useSupabaseAuth();
  const [promptCount, setPromptCount] = useState(0);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Authentication is disabled, no need to redirect
  useEffect(() => {
    console.log("Dashboard - Authentication disabled, no redirect needed");
  }, []);

  // Fetch prompt counts
  useEffect(() => {
    const fetchCounts = async () => {
      if (user) {
        try {
          setIsLoading(true);
          // Fetch total prompts count
          const totalResponse = await fetch('/api/prompts/count');
          if (totalResponse.ok) {
            const { count } = await totalResponse.json();
            setPromptCount(count);
          }

          // Fetch favorite prompts count
          const favoritesResponse = await fetch('/api/prompts/count?favorite=true');
          if (favoritesResponse.ok) {
            const { count } = await favoritesResponse.json();
            setFavoriteCount(count);
          }
        } catch (error) {
          console.error('Error fetching prompt counts:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchCounts();
  }, [user]);

  // Function to handle prompt refresh
  const handlePromptRefresh = () => {
    const fetchCounts = async () => {
      try {
        setIsLoading(true);

        // Show a subtle toast
        const loadingToast = toast.loading("Updating dashboard...", { duration: 2000 });

        // Fetch total prompts count
        const totalResponse = await fetch('/api/prompts/count');
        if (totalResponse.ok) {
          const { count } = await totalResponse.json();
          setPromptCount(count);
        }

        // Fetch favorite prompts count
        const favoritesResponse = await fetch('/api/prompts/count?favorite=true');
        if (favoritesResponse.ok) {
          const { count } = await favoritesResponse.json();
          setFavoriteCount(count);
        }

        // Dismiss the loading toast after a short delay
        setTimeout(() => {
          toast.dismiss(loadingToast);
          toast.success("Dashboard updated", { duration: 2000 });
        }, 1000);
      } catch (error) {
        console.error('Error refreshing prompt counts:', error);
        toast.error("Failed to update dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCounts();
  };

  // Log authentication state for debugging
  console.log("Dashboard - Auth loading:", authLoading);
  console.log("Dashboard - User:", user ? user.email : "No user");

  // If still loading auth, show a loading state
  if (authLoading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col gap-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Loading your dashboard...
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="h-24 rounded-lg animate-pulse bg-card/50" />
            <div className="h-24 rounded-lg animate-pulse bg-card/50" />
          </div>
          <div className="h-96 rounded-lg animate-pulse bg-card/50" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Create, refine, and manage your AI prompts.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="backdrop-blur-md bg-card/30 border border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Prompts
              </CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? '...' : promptCount}</div>
              <p className="text-xs text-muted-foreground pt-1">
                Prompts created
              </p>
            </CardContent>
          </Card>
          <Card className="backdrop-blur-md bg-card/30 border border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Favorites
              </CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? '...' : favoriteCount}</div>
              <p className="text-xs text-muted-foreground pt-1">
                Saved as favorites
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="backdrop-blur-md bg-card/30 border border-border/50">
          <CardHeader>
            <CardTitle>Prompt Creator</CardTitle>
            <CardDescription>
              Enter your rough idea and we'll help refine it into an effective prompt.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full">
              <PromptForm
                onPromptSaved={handlePromptRefresh}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}