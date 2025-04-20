"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

interface StarFieldProps {
  numberOfStars?: number;
  depth?: number;
}

export function StarField({ numberOfStars = 150, depth = 300 }: StarFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions to window size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // Initialize canvas size
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Create stars
    interface Star {
      x: number;
      y: number;
      z: number;
      size: number;
      color: string;
    }

    // Create stars with theme-appropriate colors
    const getStarColors = () => {
      if (theme === 'dark') {
        return [
          `rgba(200, 200, 220, ${Math.random() * 0.5 + 0.1})`, // Dim white
          `rgba(80, 120, 180, ${Math.random() * 0.4 + 0.1})`, // Dim blue
          `rgba(180, 120, 100, ${Math.random() * 0.3 + 0.1})`, // Dim orange
          `rgba(120, 80, 160, ${Math.random() * 0.3 + 0.1})`, // Dim purple
          `rgba(80, 160, 120, ${Math.random() * 0.3 + 0.1})`, // Dim cyan
        ];
      } else {
        return [
          `rgba(50, 50, 80, ${Math.random() * 0.3 + 0.1})`, // Dark blue
          `rgba(70, 40, 120, ${Math.random() * 0.25 + 0.1})`, // Dark purple
          `rgba(100, 50, 50, ${Math.random() * 0.25 + 0.1})`, // Dark red
          `rgba(40, 80, 100, ${Math.random() * 0.25 + 0.1})`, // Dark teal
          `rgba(60, 60, 90, ${Math.random() * 0.25 + 0.1})`, // Dark slate
        ];
      }
    };

    const stars: Star[] = Array.from({ length: numberOfStars }, () => {
      const colors = getStarColors();

      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * depth,
        size: Math.random() * 1.8,
        color: colors[Math.floor(Math.random() * colors.length)],
      };
    });

    // Animation frame
    let animationFrameId: number;

    // Star movement parameters
    const speed = 0.2;
    let mouseX = 0;
    let mouseY = 0;

    // Track mouse position for parallax effect
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX - window.innerWidth / 2) * 0.01;
      mouseY = (e.clientY - window.innerHeight / 2) * 0.01;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Animation loop
    const animate = () => {
      // Create a theme-appropriate background with gradient
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width
      );

      // Adjust gradient based on theme
      if (theme === 'dark') {
        gradient.addColorStop(0, "rgba(8, 12, 25, 0.3)");
        gradient.addColorStop(0.5, "rgba(5, 8, 18, 0.3)");
        gradient.addColorStop(1, "rgba(2, 4, 12, 0.3)");
      } else {
        gradient.addColorStop(0, "rgba(220, 230, 245, 0.3)");
        gradient.addColorStop(0.5, "rgba(210, 225, 240, 0.3)");
        gradient.addColorStop(1, "rgba(200, 220, 235, 0.3)");
      }

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star, i) => {
        // Update z position (moving toward screen)
        star.z -= speed;

        // Reset star when it reaches the screen
        if (star.z <= 0) {
          stars[i].x = Math.random() * canvas.width;
          stars[i].y = Math.random() * canvas.height;
          stars[i].z = depth;
          stars[i].size = Math.random() * 1.5;
        }

        // Calculate star position with perspective
        const x = (star.x - canvas.width / 2) * (depth / star.z) + canvas.width / 2 + mouseX * (depth / star.z);
        const y = (star.y - canvas.height / 2) * (depth / star.z) + canvas.height / 2 + mouseY * (depth / star.z);
        const s = star.size * (depth / star.z);

        // Only draw stars that are in the canvas
        if (x > 0 && x < canvas.width && y > 0 && y < canvas.height) {
          ctx.fillStyle = star.color;
          ctx.beginPath();
          ctx.arc(x, y, s, 0, Math.PI * 2);
          ctx.fill();

          // Subtle glow effect for stars
          if (s > 0.8) {
            // Create a more subtle glow effect
            const glowSize = s * (2 + Math.random() * 1.5);
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, glowSize);

            // Extract color components for the glow
            const baseColor = star.color.replace(/[^\d,]/g, '').split(',');
            const r = baseColor[0] || 200;
            const g = baseColor[1] || 200;
            const b = baseColor[2] || 220;

            gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.15)`);
            gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(x, y, glowSize, 0, Math.PI * 2);
            ctx.fill();

            // Add a very subtle lens flare only for the brightest stars
            if (s > 1.3) {
              ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.08)`;
              ctx.lineWidth = 0.3;
              ctx.beginPath();
              ctx.moveTo(x - glowSize * 1.2, y);
              ctx.lineTo(x + glowSize * 1.2, y);
              ctx.moveTo(x, y - glowSize * 1.2);
              ctx.lineTo(x, y + glowSize * 1.2);
              ctx.stroke();
            }

            // Reset for next star
            ctx.fillStyle = star.color;
          }
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [numberOfStars, depth, theme]);

  return (
    <motion.canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none -z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    />
  );
}