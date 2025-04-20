"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

interface PlanetProps {
  size?: number;
  position?: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
  color?: string;
  orbitDuration?: number;
  delay?: number;
  className?: string;
}

export function Planet({
  size = 80,
  position = { top: "20%", right: "10%" },
  color = "bg-chart-1",
  orbitDuration = 120,
  delay = 0,
  className,
}: PlanetProps) {
  const [hover, setHover] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div
      className={cn("absolute z-0", className, theme === 'dark' ? 'opacity-70' : 'opacity-50')}
      style={{
        ...position,
      }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.6 }}
        transition={{
          delay: delay,
          duration: 2,
          ease: "easeOut",
        }}
        className="relative"
        style={{
          width: `${size}px`,
          height: `${size}px`,
        }}
      >
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: orbitDuration,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute inset-0 rounded-full"
          style={{
            boxShadow: `0 0 ${size * 0.4}px rgba(var(--primary), 0.5)`,
            border: `1px solid rgba(var(--primary), 0.3)`,
          }}
        />
        {/* Add orbital ring for futuristic effect */}
        <motion.div
          animate={{
            rotate: -180,
          }}
          transition={{
            duration: orbitDuration * 1.5,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute rounded-full"
          style={{
            width: `${size * 1.2}px`,
            height: `${size * 1.2}px`,
            left: `${-size * 0.1}px`,
            top: `${-size * 0.1}px`,
            border: `1px solid rgba(var(--primary), 0.15)`,
            boxShadow: `0 0 ${size * 0.2}px rgba(var(--primary), 0.1) inset`,
          }}
        />
        <motion.div
          className={cn("absolute inset-0 rounded-full", color)}
          whileHover={{ scale: 1.1 }}
          onHoverStart={() => setHover(true)}
          onHoverEnd={() => setHover(false)}
        >
          {/* Planet surface details */}
          <div
            className="absolute inset-0 rounded-full overflow-hidden"
            style={{
              background: `radial-gradient(circle at 30% 30%,
                rgba(var(--primary), 0.8) 0%,
                rgba(var(--primary), 0.4) 40%,
                rgba(var(--primary), 0.2) 60%,
                rgba(var(--primary), 0.1) 100%
              )`,
            }}
          />

          {/* Enhanced hover effect */}
          {hover && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 rounded-full"
              style={{
                boxShadow: `
                  0 0 ${size * 0.6}px rgba(var(--primary), 0.8),
                  0 0 ${size * 0.3}px rgba(var(--primary), 0.6) inset
                `,
                zIndex: -1,
              }}
            />
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}