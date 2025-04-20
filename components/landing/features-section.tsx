"use client";

import {
  ArrowUpRight,
  BrainCircuit,
  ClipboardCheck,
  HeartHandshake,
  LayoutGrid,
  MessagesSquare,
  Sparkles,
  Stars
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
  delay?: number;
}

function FeatureCard({ icon, title, description, className, delay = 0 }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.2, duration: 0.5 }}
      viewport={{ once: true, margin: "-100px" }}
      className={cn(
        "group relative rounded-xl p-6 backdrop-blur-md bg-card/40 border border-border/50 hover:border-primary/50 transition-all duration-300",
        className
      )}
    >
      <div className="absolute -inset-px bg-gradient-to-r from-primary/10 to-chart-1/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative">
        <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-primary/10 p-2 text-primary">
          {icon}
        </div>
        <h3 className="mb-2 text-xl font-bold">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </motion.div>
  );
}

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 relative">
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
            <span>Features</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold tracking-tight mb-4"
          >
            How Promptoid AI Elevates Your AI Experience
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            viewport={{ once: true }}
            className="text-xl text-muted-foreground max-w-3xl mx-auto"
          >
            Our intelligent prompt engineering system helps you get better results from AI tools
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <FeatureCard
            icon={<BrainCircuit className="h-6 w-6" />}
            title="Intelligent Prompt Refinement"
            description="Our system analyzes your initial prompt and asks targeted questions to understand your intent better."
            delay={0}
          />
          <FeatureCard
            icon={<MessagesSquare className="h-6 w-6" />}
            title="Guided Conversation"
            description="Simple multiple-choice questions help refine your ideas without requiring complex prompt engineering skills."
            delay={1}
          />
          <FeatureCard
            icon={<ClipboardCheck className="h-6 w-6" />}
            title="One-Click Copy"
            description="Copy your refined prompts with a single click and paste them directly into ChatGPT or other AI tools."
            delay={2}
          />
          <FeatureCard
            icon={<LayoutGrid className="h-6 w-6" />}
            title="Prompt Library"
            description="Save your favorite prompts for reuse and build a personal library of effective AI instructions."
            delay={3}
          />
          <FeatureCard
            icon={<Sparkles className="h-6 w-6" />}
            title="AI-Optimized Output"
            description="Get prompts specifically formatted for optimal results with popular AI models like ChatGPT."
            delay={4}
          />
          <FeatureCard
            icon={<HeartHandshake className="h-6 w-6" />}
            title="Beginner Friendly"
            description="No prior knowledge of prompt engineering required - perfect for both beginners and experts."
            delay={5}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <a
            href="/signup"
            className="inline-flex items-center text-primary hover:text-primary/80 font-medium"
          >
            <span>Start creating better prompts today</span>
            <ArrowUpRight className="ml-1 h-4 w-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}