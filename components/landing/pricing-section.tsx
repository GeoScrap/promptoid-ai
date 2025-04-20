"use client";

import { Check, Stars } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 relative">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="inline-flex items-center rounded-full border border-border/50 bg-background/50 backdrop-blur-sm px-3 py-1 text-sm font-medium text-muted-foreground mb-4"
          >
            <Stars className="mr-1 h-3.5 w-3.5 text-primary" />
            <span>Pricing</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold tracking-tight mb-4"
          >
            Simple, Transparent Pricing
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            viewport={{ once: true }}
            className="text-xl text-muted-foreground max-w-3xl mx-auto"
          >
            Start for free and upgrade as you grow
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            viewport={{ once: true }}
            className="relative rounded-xl backdrop-blur-md bg-card/40 border border-border/50 overflow-hidden"
          >
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">Free</h3>
              <p className="text-muted-foreground mb-6">Perfect for getting started</p>
              <div className="flex items-baseline mb-6">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-muted-foreground ml-2">/month</span>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-chart-2 mr-2 shrink-0" />
                  <span>10 prompt refinements per day</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-chart-2 mr-2 shrink-0" />
                  <span>Save up to 20 prompts</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-chart-2 mr-2 shrink-0" />
                  <span>Basic prompt refinement</span>
                </li>
              </ul>
              <Link href="/signup">
                <Button variant="outline" className="w-full">
                  Get Started
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            viewport={{ once: true }}
            className="relative rounded-xl backdrop-blur-md bg-card/40 border border-chart-1/30 overflow-hidden"
          >
            <div className="absolute inset-px rounded-[11px] bg-gradient-to-b from-chart-1/10 to-transparent" />
            <div className="relative p-6">
              <div className="absolute top-0 right-0">
                <div className="bg-chart-1 text-white text-xs font-medium px-3 py-1 rounded-bl-lg rounded-tr-lg">
                  Popular
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">Pro</h3>
              <p className="text-muted-foreground mb-6">For individuals and small teams</p>
              <div className="flex items-baseline mb-6">
                <span className="text-4xl font-bold">$9</span>
                <span className="text-muted-foreground ml-2">/month</span>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-chart-1 mr-2 shrink-0" />
                  <span>Unlimited prompt refinements</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-chart-1 mr-2 shrink-0" />
                  <span>Save unlimited prompts</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-chart-1 mr-2 shrink-0" />
                  <span>Advanced refinement algorithm</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-chart-1 mr-2 shrink-0" />
                  <span>Prompt categories and tags</span>
                </li>
              </ul>
              <Link href="/signup">
                <Button className="w-full bg-chart-1 hover:bg-chart-1/90">
                  Get Started
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            viewport={{ once: true }}
            className="relative rounded-xl backdrop-blur-md bg-card/40 border border-border/50 overflow-hidden"
          >
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">Enterprise</h3>
              <p className="text-muted-foreground mb-6">For organizations and large teams</p>
              <div className="flex items-baseline mb-6">
                <span className="text-4xl font-bold">$29</span>
                <span className="text-muted-foreground ml-2">/month</span>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-chart-2 mr-2 shrink-0" />
                  <span>Everything in Pro</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-chart-2 mr-2 shrink-0" />
                  <span>Team collaboration features</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-chart-2 mr-2 shrink-0" />
                  <span>Custom prompt templates</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-chart-2 mr-2 shrink-0" />
                  <span>Priority support</span>
                </li>
              </ul>
              <Link href="/signup">
                <Button variant="outline" className="w-full">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}