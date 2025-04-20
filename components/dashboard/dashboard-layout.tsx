"use client";

import { ReactNode, useState } from "react";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { usePathname } from "next/navigation";
import { SpaceBackground } from "@/components/space-background";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr]">
      <SpaceBackground />
      <DashboardNav isOpen={isOpen} setIsOpen={setIsOpen} pathname={pathname} />
      <div className="flex flex-col">
        <DashboardHeader setIsOpen={setIsOpen} />
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="mx-auto max-w-5xl space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
}