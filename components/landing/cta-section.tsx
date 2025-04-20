"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

export function CTASection() {
  return (
    <section className="py-20 relative">
      <div className="container px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-xl backdrop-blur-lg bg-card/40 border border-border/50 p-8 md:p-12 max-w-6xl mx-auto"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-chart-1/10 via-transparent to-chart-2/10" />
          <div className="relative z-10 flex flex-col items-center text-center space-y-6">
            <div className="inline-flex items-center justify-center rounded-full bg-primary/10 p-2 text-primary">
              <Sparkles className="h-6 w-6" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight max-w-2xl">
              Ready to transform your AI interactions?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl">
              Join Promptoid AI today and start creating powerful, effective prompts that get better results from AI tools.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/signup">
                <Button size="lg" className="group">
                  Start for Free
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg">
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}