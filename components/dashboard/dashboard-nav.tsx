"use client";

import { Button } from "@/components/ui/button";
import {
  BookMarked,
  FileText,
  Home,
  LogOut,
  Settings,
  X,
  Rocket,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { motion } from "framer-motion";

interface DashboardNavProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  pathname: string;
}

export function DashboardNav({ isOpen, setIsOpen, pathname }: DashboardNavProps) {
  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: Home,
    },
    {
      title: "Saved Prompts",
      href: "/dashboard/prompts",
      icon: BookMarked,
    },
    {
      title: "Profile",
      href: "/dashboard/profile",
      icon: Settings,
    },
  ];

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="left" className="w-72 sm:max-w-none p-0">
          <MobileNav pathname={pathname} setIsOpen={setIsOpen} />
        </SheetContent>
      </Sheet>

      <div className="hidden border-r bg-background/60 backdrop-blur-md md:block">
        <div className="flex h-full flex-col gap-2">
          <div className="flex h-16 items-center border-b px-6">
            <Link href="/" className="flex items-center gap-2 font-bold">
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
                <Rocket className="h-6 w-6 text-primary" />
              </motion.div>
              <span className="text-xl font-bold text-primary">Promptoid AI</span>
            </Link>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid items-start px-4 text-sm font-medium">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                    pathname === item.href
                      ? "bg-accent text-primary"
                      : "transparent text-muted-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </Link>
              ))}
              <Button
                variant="ghost"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all justify-start font-normal text-sm hover:text-primary"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}

function MobileNav({
  pathname,
  setIsOpen,
}: {
  pathname: string;
  setIsOpen: (open: boolean) => void;
}) {
  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: Home,
    },
    {
      title: "Saved Prompts",
      href: "/dashboard/prompts",
      icon: FileText,
    },
    {
      title: "Profile",
      href: "/dashboard/profile",
      icon: Settings,
    },
  ];

  return (
    <div className="flex h-full flex-col gap-2">
      <div className="flex h-16 items-center justify-between border-b px-6">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <Rocket className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold text-primary">AICess</span>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(false)}
          className="border rounded-full"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-4 text-sm font-medium">
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                pathname === item.href
                  ? "bg-accent text-primary"
                  : "transparent text-muted-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          ))}
          <Button
            variant="ghost"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all justify-start font-normal text-sm hover:text-primary"
            onClick={() => {
              setIsOpen(false);
              signOut({ callbackUrl: "/" });
            }}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </nav>
      </div>
    </div>
  );
}