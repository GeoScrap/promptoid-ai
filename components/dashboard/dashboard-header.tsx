"use client";

import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserMenu } from "@/components/dashboard/user-menu";
import { useSession } from "next-auth/react";

interface DashboardHeaderProps {
  setIsOpen: (open: boolean) => void;
}

export function DashboardHeader({ setIsOpen }: DashboardHeaderProps) {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsOpen(true)}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
        <div className="hidden md:block" />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <UserMenu
            user={{
              name: session?.user?.name || "User",
              email: session?.user?.email || "",
              image: session?.user?.image,
            }}
          />
        </div>
      </div>
    </header>
  );
}