"use client";

import React from 'react';
import { useTheme } from "next-themes";

export function RoughIdea() {
  const { theme } = useTheme();

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium text-muted-foreground text-center">Your rough idea</div>
      <div className="p-4 rounded-lg bg-background/60 border border-border/60 min-h-[60px] flex items-center justify-center">
        <div className="w-full max-w-md mx-auto">
          <div className={`text-center font-bold text-xl p-4 rounded-md border shadow-lg ${theme === 'dark'
            ? 'text-white bg-primary/20 border-primary/40'
            : 'text-primary bg-primary/10 border-primary/30'}`}
          >
            Write an email to my boss
          </div>
        </div>
      </div>
    </div>
  );
}
