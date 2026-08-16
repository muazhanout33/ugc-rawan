"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown, Play, MapPin, Star } from "lucide-react";
import { HERO_TITLES } from "@/lib/constants";

const FLOATING_BADGES = [
  { icon: MapPin, text: "Shebeen El-Kom, Egypt", color: "#8B5CF6" },
  { icon: Star, text: "Premium UGC", color: "#F472B6" },
  { icon: Play, text: "~400 Reels", color: "#8B5CF6" },
];

interface StarData {
  left: string;
  top: string;
  animationDelay: string;
  animationDuration: string;
  opacity: number;
  size: string;
}

function generateStars(): StarData[] {
  return Array.from({ length: 24 }, (_, i) => {
    const seed = i * 9301 + 49297;
    const r1 = (seed % 100) / 100;
    const r2 = ((seed * 7) % 100) / 100;
    const r3 = ((seed * 13) % 100) / 100;
    const r4 = ((seed * 17) % 100) / 100;
    const r5 = ((seed * 23) % 100) / 100;
    const r6 = ((seed * 29) % 100) / 100;

    return {
      left: `${r1 * 100}%`,
      top: `${r2 * 100}%`,
      animationDelay: `${r3 * 4}s`,
      animationDuration: `${2 + r4 * 3}s`,
      opacity: r5 * 0.4 + 0.1,
      size: r6 > 0.8 ? "3px" : "2px",
    };
  });
}

const STARS: StarData[] = generateStars();

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

export default function Hero() {
  const [titleIndex, setTitleIndex] = useState(0);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTitleIndex((prev) => (prev + 1) % HERO_TITLES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const scrollToWork = useCallback(() => {
    document.querySelector("#portfolio")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const starsHtml = useMemo(
    () =>
      STARS.map(
        (s) =>
          `left:${s.left};top:${s.top};animationDelay:${s.animationDelay};animationDuration:${s.animationDuration};opacity:${s.opacity};width:${s.size};height:${s.size}`
      ),
    []
  );

  return (
    <section
      id="home"
      ref={ref}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#0F0A19] pb-20 md:pb-12"
      style={{ contain: "layout style" }}
    >
      {/* Hero Poster Image */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none bg-cover bg-center opacity-30 mix-blend-luminosity"
        style={{ backgroundImage: "url('/assets/hero-poster.jpg')" }}
      />

      {/* Cinematic Vignette */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, rgba(15,10,25,0.45) 0%, rgba(15,10,25,0.85) 100%)",
        }}
      />

      {/* Purple Gradient Overlay */}
      <div
        className="absolute inset-0 z-0 pointer-events-none mix-blend-overlay"
        style={{
          background:
            "linear-gradient(135deg, rgba(139,92,246,0.3) 0%, transparent 50%, rgba(244,114,182,0.25) 100%)",
        }}
      />

      {/* Bottom fade */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, transparent 60%, #0F0A19 100%)",
        }}
      />

      {/* Grid Pattern */}
      <div className="absolute inset-0 grid-pattern opacity-30 z-0 pointer-events-none mix-blend-overlay" />

      {/* Glow orbs — pure CSS, no JS animation */}
      <div
        className="glow-orb glow-orb-primary pointer-events-none"
        style={{ width: 600, height: 600, top: "-15%", left: "-12%", opacity: 0.16, willChange: "transform" }}
        aria-hidden="true"
      />
      <div
        className="glow-orb glow-orb-accent pointer-events-none"
        style={{ width: 450, height: 450, bottom: "-8%", right: "-8%", opacity: 0.13, willChange: "transform" }}
        aria-hidden="true"
      />
      <div
        className="glow-orb glow-orb-secondary pointer-events-none"
        style={{ width: 300, height: 300, top: "35%", right: "8%", opacity: 0.1, willChange: "transform" }}
        aria-hidden="true"
      />

      {/* Stars — CSS-only, will-change for GPU */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true" style={{ contain: "strict" }}>
        {starsHtml.map((style, i) => (
          <div
            key={i}
            className="star absolute rounded-full"
            style={{ ...parseStyleString(style), willChange: "opacity" }}
          />
        ))}
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-5 sm:px-8 max-w-5xl mx-auto w-full">
        {/* "Available" badge */}
        <div className="badge mb-7">
          <span className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-pulse" />
          Available for new projects
        </div>

        {/* Sub-name */}
        <h1 className="font-inter text-white/50 text-base md:text-lg tracking-[0.18em] uppercase mb-4 font-medium">
          Rewan Abdrabou
        </h1>

        {/* Animated title — fixed height container to prevent layout shift */}
        <div
          className="w-full mb-6"
          style={{ minHeight: "clamp(56px, 10vw, 120px)" }}
        >
          <AnimatePresence mode="wait">
            <motion.h2
              key={titleIndex}
              initial={{ y: 20, opacity: 0.9 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-gradient-primary text-balance"
              style={{
                fontSize: "clamp(38px, 7.5vw, 100px)",
                lineHeight: 1.1,
                letterSpacing: "-0.03em",
                willChange: "transform, opacity",
              }}
            >
              {HERO_TITLES[titleIndex]}
            </motion.h2>
          </AnimatePresence>
        </div>

        {/* Subtitle — Instant paint for LCP */}
        <p className="font-inter text-white/55 text-base sm:text-lg md:text-xl max-w-lg leading-relaxed mb-9 text-pretty">
          Crafting cinematic stories for{" "}
          <span className="text-white/80 font-medium">
            medical clinics, healthcare centers,{" "}
          </span>
          and premium brands across Egypt.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-10 w-full sm:w-auto">
          <a
            href="#portfolio"
            onClick={(e) => { e.preventDefault(); scrollToWork(); }}
            className="btn-primary text-base px-8 py-4 w-full sm:w-auto justify-center"
          >
            <Play size={17} className="fill-current flex-shrink-0" />
            View My Work
          </a>
          <a
            href="https://www.instagram.com/rewan__reel__ugc_creator/?hl=en"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline text-base px-8 py-4 w-full sm:w-auto justify-center"
          >
            <InstagramIcon />
            DM on Instagram
          </a>
        </div>

        {/* Floating Stats Badges */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
          {FLOATING_BADGES.map(({ icon: Icon, text, color }) => (
            <div
              key={text}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[rgba(27,18,48,0.75)] border border-[rgba(139,92,246,0.18)]"
            >
              <Icon size={14} style={{ color }} />
              <span className="font-inter text-white/70 text-sm font-medium whitespace-nowrap">
                {text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator — CSS animation only */}
      <button
        onClick={scrollToWork}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-white/30 hover:text-white/60 transition-colors cursor-pointer group"
        aria-label="Scroll down"
      >
        <span className="font-inter text-[11px] tracking-widest uppercase">
          Scroll
        </span>
        <span
          className="inline-block p-2 rounded-full border border-white/15 group-hover:border-[rgba(139,92,246,0.4)] transition-colors"
          style={{ animation: "float 1.8s ease-in-out infinite" }}
        >
          <ArrowDown size={13} />
        </span>
      </button>
    </section>
  );
}

function parseStyleString(styleStr: string): React.CSSProperties {
  const result: Record<string, string> = {};
  styleStr.split(";").forEach((part) => {
    const [key, val] = part.split(":");
    if (key && val) result[key.trim()] = val.trim();
  });
  return result as React.CSSProperties;
}
