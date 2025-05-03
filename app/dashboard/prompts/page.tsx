"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { PromptCard } from "@/components/prompt/prompt-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Heart, RefreshCw, Search } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Prompt {
  id: string;
  originalPrompt: string;
  refinedPrompt: string;
  isFavorite: boolean;
}

export default function PromptsPage() {
  // Mock prompts data since authentication is disabled
  const mockPrompts: Prompt[] = [
    {
      id: "1",
      originalPrompt: "Write an email to my boss",
      refinedPrompt: "Write a professional email to my boss requesting time off for a family event, emphasizing my commitment to complete all pending tasks before leaving and arranging for coverage during my absence.",
      isFavorite: true
    },
    {
      id: "2",
      originalPrompt: "Create a product description",
      refinedPrompt: "Create a compelling product description for a new eco-friendly water bottle that highlights its sustainable materials, temperature retention capabilities, and sleek design, targeting environmentally conscious consumers aged 25-40.",
      isFavorite: false
    },
    {
      id: "3",
      originalPrompt: "Help me write a blog post",
      refinedPrompt: "Write a comprehensive 1500-word blog post about the impact of artificial intelligence on content creation, including current applications, ethical considerations, and future trends, with a balanced perspective suitable for a tech-savvy audience.",
      isFavorite: true
    }
  ];

  const [prompts, setPrompts] = useState<Prompt[]>(mockPrompts);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [view, setView] = useState<"all" | "favorites">("all");

  // Mock fetch function that simulates API call
  const fetchPrompts = async () => {
    try {
      setIsLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Use mock data
      setPrompts(mockPrompts);
    } catch (error) {
      console.error("Error fetching prompts:", error);
      toast.error("Failed to load prompts. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh prompts when the component mounts and when the view changes
  useEffect(() => {
    fetchPrompts();
  }, [view]);

  // Add a function to manually refresh prompts
  const refreshPrompts = () => {
    fetchPrompts();
  };

  const handleDelete = async (id: string): Promise<void> => {
    try {
      // Update the UI by removing the prompt with the given id
      setPrompts((prevPrompts) => prevPrompts.filter((prompt) => prompt.id !== id));

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Show success message
      toast.success("Prompt deleted successfully");
    } catch (error) {
      console.error("Error deleting prompt:", error);
      toast.error("Failed to delete prompt. Please try again.");
      throw error;
    }
  };

  const handleToggleFavorite = async (id: string, isFavorite: boolean) => {
    try {
      // Update the UI by toggling the favorite status
      setPrompts((prevPrompts) =>
        prevPrompts.map((prompt) =>
          prompt.id === id ? { ...prompt, isFavorite } : prompt
        )
      );

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      // Show success message
      toast.success(`Prompt ${isFavorite ? 'added to' : 'removed from'} favorites`);
    } catch (error) {
      console.error("Error updating prompt:", error);
      toast.error("Failed to update favorite status. Please try again.");
      throw error;
    }
  };

  const filteredPrompts = prompts
    .filter((prompt) => {
      // First apply the view filter
      if (view === "favorites" && !prompt.isFavorite) {
        return false;
      }

      // Then apply the search filter
      if (searchTerm === "") {
        return true;
      }

      return (
        prompt.originalPrompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prompt.refinedPrompt.toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    .sort((a, b) => {
      // Sort favorites first if in "all" view
      if (view === "all" && a.isFavorite !== b.isFavorite) {
        return a.isFavorite ? -1 : 1;
      }
      return 0;
    });

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Saved Prompts</h1>
          <p className="text-muted-foreground">
            View, manage, and reuse your saved prompts.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex gap-2 w-full sm:w-auto flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search prompts..."
                className="pl-10 bg-background/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                refreshPrompts();
                toast.success("Prompts refreshed");
              }}
              className="bg-background/50"
              title="Refresh prompts"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
          <Tabs
            defaultValue="all"
            className="w-full sm:w-auto"
            value={view}
            onValueChange={(value) => setView(value as "all" | "favorites")}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="all">All Prompts</TabsTrigger>
              <TabsTrigger value="favorites" className="flex items-center gap-1">
                <Heart className="h-4 w-4" />
                Favorites
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="h-64 rounded-lg animate-pulse bg-card/50"
              />
            ))}
          </div>
        ) : filteredPrompts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPrompts.map((prompt) => (
              <PromptCard
                key={prompt.id}
                id={prompt.id}
                originalPrompt={prompt.originalPrompt}
                refinedPrompt={prompt.refinedPrompt}
                isFavorite={prompt.isFavorite}
                onDelete={handleDelete}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">No prompts found</h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm
                ? "No prompts match your search criteria"
                : view === "favorites"
                ? "You haven't added any prompts to your favorites yet"
                : "You haven't created any prompts yet"}
            </p>
            <Button
              onClick={() => {
                if (searchTerm) {
                  setSearchTerm("");
                } else if (view === "favorites") {
                  setView("all");
                } else {
                  window.location.href = "/dashboard";
                }
              }}
            >
              {searchTerm
                ? "Clear Search"
                : view === "favorites"
                ? "View All Prompts"
                : "Create a Prompt"}
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}