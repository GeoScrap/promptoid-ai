"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Clipboard, ExternalLink, Heart, Loader2, Send, Sparkles, Star } from "lucide-react";
import { motion } from "framer-motion";

const promptFormSchema = z.object({
  originalPrompt: z.string().min(2, {
    message: "Prompt must be at least 2 characters long.",
  }),
});

type PromptFormValues = z.infer<typeof promptFormSchema>;

interface Question {
  question: string;
  options: string[];
}

interface PromptFormProps {
  onPromptSaved?: () => void;
}

export function PromptForm({ onPromptSaved }: PromptFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [step, setStep] = useState<"input" | "questions" | "result">("input");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [refinedPrompt, setRefinedPrompt] = useState("");

  const form = useForm<PromptFormValues>({
    resolver: zodResolver(promptFormSchema),
    defaultValues: {
      originalPrompt: "",
    },
  });

  async function onSubmit(data: PromptFormValues) {
    try {
      setIsLoading(true);

      // Show a loading toast
      const loadingToast = toast.loading("Analyzing your prompt and generating questions...");

      // Get follow-up questions from the API
      const response = await fetch("/api/refine", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          originalPrompt: data.originalPrompt,
        }),
      });

      // Dismiss the loading toast
      toast.dismiss(loadingToast);

      if (!response.ok) {
        throw new Error("Failed to get follow-up questions");
      }

      const questionsData = await response.json();
      setQuestions(questionsData.questions || []);
      setStep("questions");

      // Show success toast
      toast.success("Questions generated! Please answer them to refine your prompt.");
    } catch (error) {
      toast.error("Failed to generate questions. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleAnswerSelect = (questionIndex: number, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: answer,
    }));
  };

  const handleQuestionsSubmit = async () => {
    try {
      setIsLoading(true);

      // Check if all questions have been answered
      if (Object.keys(answers).length !== questions.length) {
        toast.error("Please answer all questions before proceeding.");
        return;
      }

      // Show a loading toast with a creative message
      const loadingToast = toast.loading(
        "Crafting your refined prompt with AI magic...",
        { duration: 10000 } // Set a longer duration as this might take time
      );

      // Get refined prompt from the API
      const response = await fetch("/api/refine", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          originalPrompt: form.getValues("originalPrompt"),
          answers,
        }),
      });

      // Dismiss the loading toast
      toast.dismiss(loadingToast);

      const data = await response.json();

      if (!response.ok) {
        // If we have a refinedPrompt in the error response, use it
        if (data.refinedPrompt) {
          setRefinedPrompt(data.refinedPrompt);
          setStep("result");
        } else {
          throw new Error(data.message || "Failed to generate refined prompt");
        }
      } else {
        // Success case
        setRefinedPrompt(data.refinedPrompt);
        setStep("result");
        toast.success("Your refined prompt is ready!");
      }
    } catch (error) {
      toast.error("Failed to generate refined prompt. Please try again.");
      console.error(error);
      // Set a fallback error message
      setRefinedPrompt(`I couldn't refine your prompt due to a technical issue. Please try again later.\n\nOriginal prompt: ${form.getValues("originalPrompt")}`);
      setStep("result");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePrompt = async () => {
    try {
      setIsSaving(true);

      // Show a loading toast
      const loadingToast = toast.loading("Saving your prompt...");

      // Save the refined prompt to the database
      const response = await fetch("/api/prompts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          originalPrompt: form.getValues("originalPrompt"),
          refinedPrompt: refinedPrompt,
        }),
      });

      // Dismiss the loading toast
      toast.dismiss(loadingToast);

      if (!response.ok) {
        throw new Error("Failed to save prompt");
      }

      // Call the callback if provided to update counts in the parent component
      if (onPromptSaved) {
        onPromptSaved();
      }

      // Reset the form and state
      form.reset();
      setStep("input");
      setQuestions([]);
      setAnswers({});
      setRefinedPrompt("");

      toast.success("Prompt saved successfully!");
    } catch (error) {
      toast.error("Failed to save prompt. Please try again.");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
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

  const startOver = () => {
    setStep("input");
    setQuestions([]);
    setAnswers({});
    setRefinedPrompt("");
  };

  return (
    <div className="space-y-6">
      {step === "input" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="backdrop-blur-md bg-card/30 border border-border/50">
            <CardHeader>
              <CardTitle className="text-2xl">Create a New Prompt</CardTitle>
              <CardDescription>
                Enter your initial idea and we'll help you refine it into a powerful AI prompt.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="originalPrompt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>What would you like the AI to do?</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="e.g., Write an email to my boss, Create a marketing strategy, Design a database schema..."
                            className="min-h-[120px] resize-none bg-background/50"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Continue
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {step === "questions" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="backdrop-blur-md bg-card/30 border border-border/50">
            <CardHeader>
              <CardTitle className="text-2xl">Refine Your Prompt</CardTitle>
              <CardDescription>
                Answer these questions to help us create a more effective prompt.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {questions.map((q, index) => (
                <div key={index} className="space-y-4">
                  <h3 className="text-lg font-medium">{q.question}</h3>
                  <RadioGroup
                    onValueChange={(value) => handleAnswerSelect(index, value)}
                    value={answers[index]}
                  >
                    {q.options.map((option, optionIndex) => (
                      <div
                        key={optionIndex}
                        className={`flex items-center space-x-2 rounded-lg border p-4 transition-colors ${
                          answers[index] === option
                            ? "border-primary/50 bg-primary/10"
                            : "border-border"
                        }`}
                      >
                        <RadioGroupItem value={option} id={`q${index}-o${optionIndex}`} />
                        <label
                          htmlFor={`q${index}-o${optionIndex}`}
                          className="flex-grow cursor-pointer"
                        >
                          {option}
                        </label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              ))}
              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={startOver}>
                  Start Over
                </Button>
                <Button onClick={handleQuestionsSubmit} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Refined Prompt
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {step === "result" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="backdrop-blur-md bg-card/30 border border-border/50">
            <CardHeader>
              <CardTitle className="text-2xl">Your Refined Prompt</CardTitle>
              <CardDescription>
                {refinedPrompt.includes("technical issue") || refinedPrompt.includes("API configuration")
                  ? refinedPrompt.includes("insufficient balance") || refinedPrompt.includes("Insufficient Balance")
                    ? "The AI service account has insufficient balance. Please add credits or configure an alternative API."
                    : "There was an issue with the AI service. Please try again later."
                  : "Here's your improved prompt, ready to use with AI tools like ChatGPT."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Display the selected answers if available */}
              {Object.keys(answers).length > 0 && !refinedPrompt.includes("technical issue") && !refinedPrompt.includes("API configuration") && (
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 mb-4">
                  <h4 className="text-sm font-medium mb-2">Your selections:</h4>
                  <ul className="space-y-1 text-sm">
                    {Object.entries(answers).map(([index, answer]) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="text-primary">•</span>
                        <span>{answer}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className={`rounded-lg border ${refinedPrompt.includes("technical issue") || refinedPrompt.includes("API configuration") ? "bg-destructive/10 border-destructive/30" : "bg-background/60"} p-4`}>
                <p className="whitespace-pre-wrap">{refinedPrompt}</p>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Disable buttons if there was an error */}
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={copyToClipboard}
                    disabled={refinedPrompt.includes("technical issue") || refinedPrompt.includes("API configuration")}
                  >
                    <Clipboard className="mr-2 h-4 w-4" />
                    Copy to Clipboard
                  </Button>
                  <Button
                    variant="secondary"
                    className="flex-1"
                    onClick={() => {
                      window.open(
                        `https://chat.openai.com/?prompt=${encodeURIComponent(
                          refinedPrompt
                        )}`,
                        "_blank"
                      );
                    }}
                    disabled={refinedPrompt.includes("technical issue") || refinedPrompt.includes("API configuration")}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Use with ChatGPT
                  </Button>
                </div>

                {/* Save button - more prominent */}
                <Button
                  variant="default"
                  className="w-full bg-primary hover:bg-primary/90"
                  onClick={handleSavePrompt}
                  disabled={isSaving || refinedPrompt.includes("technical issue") || refinedPrompt.includes("API configuration")}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving Prompt...
                    </>
                  ) : (
                    <>
                      <Star className="mr-2 h-4 w-4" />
                      Save Prompt
                    </>
                  )}
                </Button>
              </div>
              {refinedPrompt.includes("technical issue") || refinedPrompt.includes("API configuration") ? (
                <Button variant="default" onClick={handleQuestionsSubmit} className="w-full">
                  Try Again
                </Button>
              ) : (
                <Button variant="ghost" onClick={startOver} className="w-full">
                  Create Another Prompt
                </Button>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}