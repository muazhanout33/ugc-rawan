"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown, Play, MapPin, Star } from "lucide-react";
import { HERO_TITLES } from "@/lib/constants";
import Image from "next/image";

const FLOATING_BADGES = [
  { icon: MapPin, text: "Shebeen El-Kom, Egypt", color: "#C4B5FD" },
  { icon: Star, text: "Premium UGC", color: "#E9D5FF" },
  { icon: Play, text: "~400 Reels", color: "#C4B5FD" },
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
  const starsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTitleIndex((prev) => (prev + 1) % HERO_TITLES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Pause star animations when Hero is off-screen to save GPU compositor work
  useEffect(() => {
    const section = ref.current;
    const stars = starsRef.current;
    if (!section || !stars) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        stars.dataset.paused = entry.isIntersecting ? "0" : "1";
      },
      { rootMargin: "100px 0px" }
    );
    io.observe(section);
    return () => io.disconnect();
  }, []);

  const scrollToAbout = useCallback(() => {
    window.location.href = "/about";
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
      className="relative min-h-screen flex items-center overflow-hidden bg-[#0F0A19]"
      style={{ contain: "layout style" }}
    >
      {/* Background layers — shared across split */}
      <div
        className="absolute inset-0 z-0 pointer-events-none bg-cover bg-center opacity-30 mix-blend-luminosity"
        style={{ backgroundImage: "url('/assets/hero-poster.jpg')" }}
      />
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, rgba(15,10,25,0.45) 0%, rgba(15,10,25,0.85) 100%)",
        }}
      />
        <div
          className="absolute inset-0 z-0 pointer-events-none mix-blend-overlay"
          style={{
            background:
              "linear-gradient(135deg, rgba(196,181,253,0.3) 0%, transparent 50%, rgba(233,213,255,0.25) 100%)",
          }}
        />
      <div className="absolute inset-0 grid-pattern opacity-30 z-0 pointer-events-none mix-blend-overlay" />

      {/* Glow orbs */}
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

      {/* Stars */}
      <div ref={starsRef} className="absolute inset-0 pointer-events-none" aria-hidden="true" style={{ contain: "strict" }}>
        {starsHtml.map((style, i) => (
          <div
            key={i}
            className="star absolute rounded-full"
            style={{ ...parseStyleString(style), willChange: "opacity" }}
          />
        ))}
      </div>

      {/* Split-screen container */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center py-28 md:py-20">

        {/* LEFT — Visual Area */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex justify-center lg:justify-end order-2 lg:order-1"
        >
          <div className="relative w-full max-w-[480px]">
            {/* Main portrait frame */}
            <div className="relative rounded-[28px] overflow-hidden bg-[#1A0A2E] border border-[rgba(196,181,253,0.15)]">
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src="/assets/rewanphoto.jpeg"
                  alt="Rewan Abdrabou — UGC Creator & Videographer"
                  fill
                  sizes="(max-width: 1024px) 80vw, 40vw"
                  className="object-cover object-top"
                  priority
                />
                {/* Bottom gradient fade */}
                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[#0F0A19] via-[#0F0A19]/60 to-transparent" />
                {/* Top-left glow */}
                <div className="absolute top-0 left-0 w-40 h-40 bg-[#C4B5FD] rounded-full blur-[70px] opacity-20 pointer-events-none" />
                {/* Bottom-right glow */}
                <div className="absolute bottom-12 right-0 w-28 h-28 bg-[#E9D5FF] rounded-full blur-[55px] opacity-20 pointer-events-none" />
              </div>
            </div>

            {/* Floating accent — camera icon */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="absolute -top-4 -right-4 w-16 h-16 rounded-2xl bg-gradient-to-br from-[#C4B5FD]/30 to-[#E9D5FF]/20 backdrop-blur-md border border-[rgba(196,181,253,0.3)] flex items-center justify-center z-20 shadow-[0_8px_32px_rgba(196,181,253,0.3)]"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-white/80">
                <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
                <circle cx="12" cy="13" r="3"/>
              </svg>
            </motion.div>

            {/* Floating accent — decorative circle */}
            <div className="absolute -bottom-3 -left-3 w-12 h-12 rounded-full bg-gradient-to-br from-[#E9D5FF]/40 to-[#C4B5FD]/30 backdrop-blur-md border border-[rgba(233,213,255,0.3)] z-20 shadow-[0_4px_20px_rgba(233,213,255,0.3)]" />

            {/* Thin ring accent */}
            <div className="absolute top-1/4 -right-5 w-14 h-14 rounded-full border-2 border-[rgba(196,181,253,0.15)] z-10" />

            {/* Small dot accent */}
            <div className="absolute bottom-1/3 -left-3 w-2.5 h-2.5 rounded-full bg-[#C4B5FD] opacity-40 z-10" />

            {/* Film-strip inspired decorative element */}
            <div className="absolute -left-6 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-1.5 opacity-30">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-3 h-2 rounded-[2px] border border-[rgba(196,181,253,0.4)]" />
              ))}
            </div>

            {/* Timeline-inspired decorative element at bottom */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex items-center gap-1 opacity-25">
              <div className="w-8 h-px bg-[rgba(196,181,253,0.5)]" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#C4B5FD]" />
              <div className="w-16 h-px bg-[rgba(196,181,253,0.5)]" />
              <div className="w-1 h-1 rounded-full bg-[#E9D5FF]" />
              <div className="w-12 h-px bg-[rgba(196,181,253,0.5)]" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#C4B5FD]" />
              <div className="w-6 h-px bg-[rgba(196,181,253,0.5)]" />
            </div>
          </div>
        </motion.div>

        {/* RIGHT — Information / Copy Area */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col order-1 lg:order-2 text-center lg:text-left"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="badge mb-6 self-center lg:self-start"
          >
            <span className="w-2 h-2 rounded-full bg-[#C4B5FD] animate-pulse" />
            Available for new projects
          </motion.div>

          {/* Name */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="font-inter text-white/50 text-base md:text-lg tracking-[0.18em] uppercase mb-4 font-medium"
          >
            Rewan Abdrabou
          </motion.p>

          {/* Headline — Serif, editorial, animated titles */}
          <div
            className="w-full mb-6"
            style={{ minHeight: "clamp(60px, 10vw, 120px)" }}
          >
            <AnimatePresence mode="wait">
              <motion.h1
                key={titleIndex}
                initial={{ y: 20, opacity: 0.9 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="font-serif text-balance"
                style={{
                  fontSize: "clamp(40px, 7vw, 96px)",
                  lineHeight: 1.05,
                  letterSpacing: "-0.02em",
                  fontWeight: 700,
                  color: "#FFFFFF",
                  willChange: "transform, opacity",
                }}
              >
                {HERO_TITLES[titleIndex]}
              </motion.h1>
            </AnimatePresence>
          </div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5 }}
            className="font-inter text-white/55 text-base sm:text-lg md:text-xl max-w-lg leading-relaxed mb-8 text-pretty self-center lg:self-start"
          >
            Crafting cinematic stories for{" "}
            <span className="text-white/80 font-medium">
              medical clinics, healthcare centers,{" "}
            </span>
            and premium brands across Egypt.
          </motion.p>

          {/* CTA — Learn more pill button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 w-full sm:w-auto self-center lg:self-start"
          >
            <button
              onClick={scrollToAbout}
              className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white/[0.08] border border-white/[0.12] text-white/90 font-inter text-[15px] font-medium transition-all duration-300 hover:bg-white/[0.14] hover:border-white/[0.2] hover:shadow-[0_0_30px_rgba(196,181,253,0.15)] cursor-pointer"
            >
              Learn more
              <ArrowDown size={14} className="transition-transform duration-300 group-hover:translate-y-0.5" />
            </button>
          </motion.div>

          {/* Original CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 w-full sm:w-auto self-center lg:self-start"
          >
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
          </motion.div>

          {/* Stats Badges */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.5 }}
            className="flex flex-wrap justify-center lg:justify-start gap-2 sm:gap-3"
          >
            {FLOATING_BADGES.map(({ icon: Icon, text, color }) => (
              <div
                key={text}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[rgba(27,18,48,0.75)] border border-[rgba(196,181,253,0.18)]"
              >
                <Icon size={14} style={{ color }} />
                <span className="font-inter text-white/70 text-sm font-medium whitespace-nowrap">
                  {text}
                </span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={scrollToAbout}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-white/30 hover:text-white/60 transition-colors cursor-pointer group"
        aria-label="Scroll down"
      >
        <span className="font-inter text-[11px] tracking-widest uppercase">
          Scroll
        </span>
        <span
          className="inline-block p-2 rounded-full border border-white/15 group-hover:border-[rgba(196,181,253,0.4)] transition-colors"
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
