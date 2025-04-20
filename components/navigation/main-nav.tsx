"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { LogOut, Rocket } from "lucide-react";
import { signOut } from "next-auth/react";
import { motion } from "framer-motion";

interface MainNavProps {
  isLoggedIn?: boolean;
}

export function MainNav({ isLoggedIn }: MainNavProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/70 border-b">
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <Link href="/" className="flex items-center space-x-2">
          <motion.div
            initial={{ rotate: -10 }}
            animate={{ rotate: 10 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          >
            <Rocket className="w-6 h-6 text-primary" />
          </motion.div>
          <span className="text-xl font-bold text-primary">Promptoid-AI</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className={cn(
              "text-sm transition-colors hover:text-primary",
              pathname === "/" ? "text-primary font-medium" : "text-muted-foreground"
            )}
          >
            Home
          </Link>
          <Link
            href="/#features"
            className={cn(
              "text-sm transition-colors hover:text-primary",
              pathname === "/#features" ? "text-primary font-medium" : "text-muted-foreground"
            )}
          >
            Features
          </Link>
          <Link
            href="/#pricing"
            className={cn(
              "text-sm transition-colors hover:text-primary",
              pathname === "/#pricing" ? "text-primary font-medium" : "text-muted-foreground"
            )}
          >
            Pricing
          </Link>
          <Link
            href="/#about"
            className={cn(
              "text-sm transition-colors hover:text-primary",
              pathname === "/#about" ? "text-primary font-medium" : "text-muted-foreground"
            )}
          >
            About
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {isLoggedIn ? (
            <>
              <Link href="/dashboard">
                <Button variant="default" size="sm">
                  Dashboard
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => signOut({ callbackUrl: "/" })}
                aria-label="Sign out"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="default" size="sm">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}