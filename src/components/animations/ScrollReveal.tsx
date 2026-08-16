"use client";

import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";

type AnimationType = "fadeUp" | "fadeDown" | "fadeLeft" | "fadeRight" | "scaleUp" | "scaleDown" | "blur" | "rotateLeft" | "rotateRight";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  animation?: AnimationType;
  delay?: number;
  duration?: number;
  once?: boolean;
  margin?: string;
}

const animations: Record<AnimationType, Variants> = {
  fadeUp: {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  },
  fadeDown: {
    hidden: { opacity: 0, y: -30 },
    visible: { opacity: 1, y: 0 },
  },
  fadeLeft: {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0 },
  },
  fadeRight: {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0 },
  },
  scaleUp: {
    hidden: { opacity: 0, scale: 0.88 },
    visible: { opacity: 1, scale: 1 },
  },
  scaleDown: {
    hidden: { opacity: 0, scale: 1.1 },
    visible: { opacity: 1, scale: 1 },
  },
  blur: {
    hidden: { opacity: 0, filter: "blur(8px)" },
    visible: { opacity: 1, filter: "blur(0px)" },
  },
  rotateLeft: {
    hidden: { opacity: 0, rotate: -6, scale: 0.95 },
    visible: { opacity: 1, rotate: 0, scale: 1 },
  },
  rotateRight: {
    hidden: { opacity: 0, rotate: 6, scale: 0.95 },
    visible: { opacity: 1, rotate: 0, scale: 1 },
  },
};

export default function ScrollReveal({
  children,
  className = "",
  animation = "fadeUp",
  delay = 0,
  duration = 0.6,
  once = true,
  margin = "-80px",
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: margin as `${number}px` });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={animations[animation]}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
