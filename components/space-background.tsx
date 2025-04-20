"use client";

import { motion } from "framer-motion";
import { StarField } from "@/components/ui/star-field";
import { Planet } from "@/components/ui/planet";
import { useTheme } from "next-themes";

export function SpaceBackground() {
  const { theme } = useTheme();
  const starCount = theme === 'dark' ? 120 : 80;

  return (
    <>
      <StarField numberOfStars={starCount} depth={500} />
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        {/* Main planet */}
        <Planet
          size={120}
          position={{ top: "15%", right: "8%" }}
          color={`bg-primary/${theme === 'dark' ? '60' : '40'}`}
          orbitDuration={180}
          delay={0.5}
        />
        {/* Secondary planet */}
        <Planet
          size={70}
          position={{ bottom: "25%", left: "10%" }}
          color={`bg-chart-2/${theme === 'dark' ? '60' : '40'}`}
          orbitDuration={120}
          delay={1}
        />
        {/* Tertiary planet */}
        <Planet
          size={50}
          position={{ top: "60%", right: "18%" }}
          color={`bg-chart-3/${theme === 'dark' ? '60' : '40'}`}
          orbitDuration={150}
          delay={1.5}
        />

        {/* Nebula effect */}
        <motion.div
          className="absolute top-1/4 left-1/3 w-1/2 h-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle at center, rgba(var(--primary), 0.08) 0%, rgba(var(--chart-3), 0.05) 40%, rgba(var(--chart-4), 0) 70%)",
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Additional nebula for depth */}
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-1/3 h-1/3 rounded-full"
          style={{
            background:
              "radial-gradient(circle at center, rgba(var(--chart-2), 0.06) 0%, rgba(var(--chart-3), 0.03) 50%, rgba(var(--chart-4), 0) 70%)",
          }}
          animate={{
            scale: [1.1, 0.9, 1.1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    </>
  );
}