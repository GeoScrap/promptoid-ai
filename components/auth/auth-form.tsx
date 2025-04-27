"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSearchParams } from "next/navigation";
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
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideLoader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useSupabaseAuth } from "@/components/providers/supabase-auth-provider";

const authFormSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long.",
  }),
});

type AuthFormValues = z.infer<typeof authFormSchema>;

interface AuthFormProps {
  mode: "login" | "signup";
}

export function AuthForm({ mode }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [redirectPath, setRedirectPath] = useState("/dashboard");
  const searchParams = useSearchParams();
  const { signIn, signUp } = useSupabaseAuth();

  // Get the redirectTo parameter from the URL
  useEffect(() => {
    const redirectTo = searchParams.get("redirectTo");
    if (redirectTo) {
      // Decode the URL parameter to handle encoded slashes
      setRedirectPath(decodeURIComponent(redirectTo));
      console.log("Auth form - decoded redirectTo parameter:", decodeURIComponent(redirectTo));
    }
  }, [searchParams]);

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(authFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: AuthFormValues) {
    setIsLoading(true);
  
    try {
      if (mode === "login") {
        // Sign in with Supabase
        console.log("Attempting to sign in with email:", data.email);
        const { data: authData, error } = await signIn(data.email, data.password);
  
        if (error) {
          console.error("Login error:", error);
          toast.error("Invalid email or password");
          setIsLoading(false);
          return;
        }
  
        console.log("Login successful, session:", !!authData?.session);
        console.log("Login successful, user:", !!authData?.user);
  
        // Show success toast
        toast.success("Welcome back!");
        console.log("Redirecting to:", redirectPath);
  
        // Make sure the path starts with a slash
        const normalizedPath = redirectPath.startsWith('/') ? redirectPath : `/${redirectPath}`;
        
        // Force a hard navigation to the dashboard
        window.location.replace(normalizedPath);
      } else {
        // Sign up with Supabase
        console.log("Attempting to sign up with email:", data.email);
        const { data: authData, error } = await signUp(data.email, data.password);
  
        if (error) {
          // Check for specific errors
          if (error.message.includes("already registered")) {
            toast.error("This email is already registered. Try signing in instead.");
            setIsLoading(false);
            return;
          }
  
          throw error;
        }
  
        console.log("Signup successful, user:", !!authData?.user);
  
        // Show success message
        toast.success("Account created successfully! Please check your email to confirm your account.");
        console.log("Redirecting to:", redirectPath);
  
        // Use a small delay to ensure the session is properly set
        setTimeout(() => {
          window.location.href = redirectPath;
        }, 500);
      }
    } catch (error) {
      console.error(`${mode === "login" ? "Sign in" : "Sign up"} error:`, error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(`Failed to ${mode === "login" ? "sign in" : "create account"}`);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-md mx-auto backdrop-blur-lg bg-card/80 border border-border/50">
        <CardHeader>
          <CardTitle className="text-2xl">
            {mode === "login" ? "Welcome back" : "Create an account"}
          </CardTitle>
          <CardDescription>
            {mode === "login"
              ? "Enter your credentials to access your account"
              : "Enter your details to create a new account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <LucideLoader2 className="mr-2 h-4 w-4 animate-spin" />
                    {mode === "login" ? "Signing in..." : "Creating account..."}
                  </>
                ) : mode === "login" ? (
                  "Sign in"
                ) : (
                  "Create account"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/50"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              setIsLoading(true);
              // Use direct API route for Google OAuth
              window.location.href = `/api/auth/google?redirectTo=${encodeURIComponent(redirectPath)}`;
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <LucideLoader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <svg
                className="mr-2 h-4 w-4"
                aria-hidden="true"
                focusable="false"
                data-prefix="fab"
                data-icon="google"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 488 512"
              >
                <path
                  fill="currentColor"
                  d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                ></path>
              </svg>
            )}
            {isLoading ? "Connecting..." : "Google"}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}