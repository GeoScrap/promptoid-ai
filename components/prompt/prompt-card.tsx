"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Clipboard, ExternalLink, Heart, Loader2, Star, Trash } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { motion } from "framer-motion";

interface PromptCardProps {
  id: string;
  originalPrompt: string;
  refinedPrompt: string;
  isFavorite: boolean;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string, isFavorite: boolean) => void;
}

export function PromptCard({
  id,
  originalPrompt,
  refinedPrompt,
  isFavorite,
  onDelete,
  onToggleFavorite,
}: PromptCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(refinedPrompt).then(
      () => {
        toast.success("Prompt copied to clipboard!");
      },
      (err) => {
        toast.error("Failed to copy prompt. Please try again.");
        console.error(err);
      }
    );
  };

  const openInChatGPT = () => {
    window.open(
      `https://chat.openai.com/?prompt=${encodeURIComponent(refinedPrompt)}`,
      "_blank"
    );
  };

  const handleToggleFavorite = async () => {
    if (isTogglingFavorite) return; // Prevent multiple clicks

    try {
      setIsTogglingFavorite(true);

      // Call the parent component's toggle function
      await onToggleFavorite(id, !isFavorite);

      // Show success message
      toast.success(
        isFavorite
          ? "Removed from favorites"
          : "Added to favorites",
        {
          icon: isFavorite ? "💔" : "❤️",
        }
      );
    } catch (error) {
      console.error("Error toggling favorite status:", error);
      toast.error("Failed to update favorite status. Please try again.");
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  const handleDelete = async () => {
    if (isDeleting) return; // Prevent multiple clicks

    try {
      setIsDeleting(true);

      // Show a loading toast
      const loadingToast = toast.loading("Deleting prompt...");

      // Call the parent component's delete function
      await onDelete(id);

      // Dismiss the loading toast
      toast.dismiss(loadingToast);

      // Show success message
      toast.success("Prompt deleted successfully");
    } catch (error) {
      console.error("Error deleting prompt:", error);
      toast.error("Failed to delete prompt. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Card className="h-full backdrop-blur-md bg-card/30 border border-border/50 hover:border-primary/50 transition-all duration-300">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Original Prompt:</h3>
              <p className="text-foreground line-clamp-2">{originalPrompt}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Refined Prompt:</h3>
              <p
                className={`text-foreground ${isExpanded ? "" : "line-clamp-3"}`}
                onClick={toggleExpand}
              >
                {refinedPrompt}
              </p>
              {refinedPrompt.length > 150 && (
                <Button variant="link" size="sm" onClick={toggleExpand} className="p-0 h-auto mt-1">
                  {isExpanded ? "Show less" : "Show more"}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="px-6 pb-6 pt-0 flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={copyToClipboard}>
            <Clipboard className="h-4 w-4 mr-1" />
            Copy
          </Button>
          <Button variant="outline" size="sm" onClick={openInChatGPT}>
            <ExternalLink className="h-4 w-4 mr-1" />
            Use
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleFavorite}
            disabled={isTogglingFavorite}
            className={`transition-all duration-300 ${isFavorite ? "bg-primary/10 text-primary border-primary/50" : "hover:border-primary/50 hover:text-primary"}`}
          >
            {isTogglingFavorite ? (
              <>
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <motion.div
                  initial={{ scale: 1 }}
                  animate={{ scale: isFavorite ? [1, 1.3, 1] : 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {isFavorite ? (
                    <Star className="h-4 w-4 mr-1 fill-primary" />
                  ) : (
                    <Heart className="h-4 w-4 mr-1" />
                  )}
                </motion.div>
                {isFavorite ? "Favorited" : "Favorite"}
              </>
            )}
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10">
                <Trash className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete this prompt from your account.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive" disabled={isDeleting}>
                  {isDeleting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
    </motion.div>
  );
}