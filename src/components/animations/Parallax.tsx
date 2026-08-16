"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ParallaxProps {
  children: React.ReactNode;
  className?: string;
  speed?: number;
  direction?: "up" | "down" | "left" | "right";
  offset?: string[];
}

export default function Parallax({
  children,
  className = "",
  speed = 0.3, // reduced from 0.5 — gentler parallax = less paint area
  direction = "up",
  offset = ["start end", "end start"],
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: offset as ["start end", "end start"],
  });

  // Use a gentler range to avoid clipping at section boundaries
  const range = 60 * speed;
  const transformations = {
    up: useTransform(scrollYProgress, [0, 1], [range, -range]),
    down: useTransform(scrollYProgress, [0, 1], [-range, range]),
    left: useTransform(scrollYProgress, [0, 1], [range, -range]),
    right: useTransform(scrollYProgress, [0, 1], [-range, range]),
  };

  const value = transformations[direction];
  const isHorizontal = direction === "left" || direction === "right";

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        x: isHorizontal ? value : 0,
        y: !isHorizontal ? value : 0,
        willChange: "transform",
      }}
    >
      {children}
    </motion.div>
  );
}
