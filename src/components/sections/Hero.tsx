"use client";

import { useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowDown, Play, MapPin } from "lucide-react";
import { SITE_META } from "@/lib/constants";
import Image from "next/image";

const InstagramIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-4 h-4 flex-shrink-0 text-[#B77D89]"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export default function Hero() {
  const scrollToAbout = useCallback(() => {
    const el = document.querySelector("#about");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = "/about";
    }
  }, []);

  const scrollToWork = useCallback(() => {
    document.querySelector("#portfolio")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col justify-between bg-[#141112] overflow-hidden pt-24 pb-12 lg:pt-0 lg:pb-0"
    >
      {/* ── Desktop Left Photography Layer (Full-Bleed Editorial Composition) ── */}
      <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-[53%] xl:w-[50%] z-0 overflow-hidden pointer-events-none select-none">
        <Image
          src="/assets/hero-rewan-clean@2x.jpg"
          alt="Rewan Abdrabou — Videographer & Visual Storyteller"
          fill
          priority
          sizes="55vw"
          className="object-cover object-left-top"
        />
        {/* Soft edge feathering into dark background */}
        <div className="absolute inset-y-0 right-0 w-32 xl:w-44 bg-gradient-to-r from-transparent to-[#141112]" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#141112] to-transparent" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#141112]/60 to-transparent" />
      </div>

      {/* ── Cinematic Atmosphere Textures on Right Side ── */}
      {/* Right camera lens detail */}
      <div className="absolute right-0 top-[18%] w-[260px] sm:w-[340px] lg:w-[420px] h-[480px] pointer-events-none opacity-20 lg:opacity-30 z-0">
        <Image
          src="/assets/hero-camera-lens.png"
          alt=""
          fill
          className="object-contain object-right"
          priority
        />
      </div>

      {/* Bottom right burgundy drapery */}
      <div className="absolute right-0 bottom-0 w-[280px] sm:w-[380px] lg:w-[480px] h-[220px] sm:h-[280px] pointer-events-none opacity-45 lg:opacity-55 z-0">
        <Image
          src="/assets/hero-burgundy-corner.png"
          alt=""
          fill
          className="object-contain object-right-bottom"
          priority
        />
      </div>

      {/* ── Main Content Grid ── */}
      <div className="section-container relative z-10 w-full max-w-[1400px] mx-auto my-auto py-8 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center min-h-[600px] lg:min-h-[700px]">

          {/* ── Mobile / Tablet Photography (Visible on < lg screens) ── */}
          <div className="lg:hidden w-full max-w-[480px] mx-auto relative rounded-2xl overflow-hidden bg-[#1C1719] border border-[#443337] shadow-[0_20px_50px_rgba(0,0,0,0.8)] aspect-[4/3] sm:aspect-[16/11]">
            <Image
              src="/assets/hero-rewan-clean@2x.jpg"
              alt="Rewan Abdrabou — Videographer & Visual Storyteller"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 480px"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#141112]/80 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Spacer on Desktop so Content aligns on Right half */}
          <div className="hidden lg:block lg:col-span-6 xl:col-span-6 pointer-events-none" aria-hidden="true" />

          {/* ── Right Column — Typography & Editorial Content ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6 xl:col-span-6 flex flex-col text-left lg:pl-6 xl:pl-10"
          >
            {/* Meta Row: Availability badge with extending fine line */}
            <div className="flex items-center gap-3.5 mb-5 sm:mb-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1C1719]/90 border border-[#443337] shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#B77D89] animate-pulse" />
                <span className="font-inter text-xs font-medium text-[#F4EDE8]/90">
                  Available for new projects
                </span>
              </div>
              <div className="hidden sm:block flex-1 h-px bg-[#443337] max-w-[150px]" />
            </div>

            {/* Subtitle Name with fine line */}
            <div className="flex items-center gap-3.5 mb-3 sm:mb-4">
              <p className="font-inter text-[#B9ADAA] text-xs sm:text-[13px] font-semibold tracking-[0.24em] uppercase">
                REWAN ABDRABOU
              </p>
              <div className="hidden sm:block flex-1 h-px bg-[#443337] max-w-[100px]" />
            </div>

            {/* Main Editorial Headline */}
            <div className="relative mb-2 sm:mb-3">
              <h1 className="font-serif text-[#F4EDE8] font-normal tracking-tight text-[52px] sm:text-[72px] lg:text-[86px] xl:text-[96px] leading-[1.02]">
                Videographer
              </h1>
              {/* Delicate Rose Stroke Underline matching reference */}
              <svg
                viewBox="0 0 240 12"
                fill="none"
                className="w-[180px] sm:w-[230px] lg:w-[270px] h-auto mt-0.5 mb-5 sm:mb-6 text-[#B77D89]"
                aria-hidden="true"
              >
                <path
                  d="M2 9C55 3 150 2 238 8C175 4 80 5 2 11"
                  fill="currentColor"
                  opacity="0.9"
                />
              </svg>
            </div>

            {/* Description */}
            <p className="font-inter text-[#B9ADAA] text-base sm:text-[17px] leading-relaxed max-w-xl mb-8 sm:mb-10 text-pretty">
              Creating engaging visual content for medical clinics, beauty and laser centers, bloggers, influencers, and brands across Egypt.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-3.5 w-full sm:w-auto">
              {/* Primary CTA — Learn More */}
              <button
                type="button"
                onClick={scrollToAbout}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#F4EDE8] text-[#141112] font-inter text-sm font-semibold hover:bg-white transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg active:scale-98"
              >
                <span>Learn more</span>
                <ArrowDown size={14} className="stroke-[2.5]" />
              </button>

              {/* Secondary CTA — View My Work */}
              <button
                type="button"
                onClick={scrollToWork}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#1C1719]/70 hover:bg-[#241D20] border border-[#443337] hover:border-[#B77D89]/60 text-[#F4EDE8] font-inter text-sm font-medium transition-all duration-200 cursor-pointer active:scale-98"
              >
                <Play size={13} className="fill-[#F4EDE8] text-[#F4EDE8]" />
                <span>View My Work</span>
              </button>

              {/* Tertiary CTA — DM on Instagram */}
              <a
                href={SITE_META.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#1C1719]/70 hover:bg-[#241D20] border border-[#443337] hover:border-[#B77D89]/60 text-[#F4EDE8] font-inter text-sm font-medium transition-all duration-200 active:scale-98"
              >
                <InstagramIcon />
                <span>DM on Instagram</span>
              </a>
            </div>
          </motion.div>

        </div>
      </div>

      {/* ── Bottom Bar: Supporting Stats (Left) & Scroll Prompt (Center) ── */}
      <div className="section-container relative z-10 w-full max-w-[1400px] mx-auto pb-6 sm:pb-8 flex items-center justify-between">
        {/* Left: Location & Stats */}
        <div className="flex items-center gap-3.5 sm:gap-5 text-xs font-inter text-[#B9ADAA]">
          <div className="flex items-center gap-1.5">
            <MapPin size={13} className="text-[#B77D89] flex-shrink-0" />
            <span>Shebeen El-Kom, Egypt</span>
          </div>
          <span className="w-px h-3.5 bg-[#443337]" />
          <div className="flex items-center gap-1.5">
            <Play size={11} className="fill-[#B77D89] text-[#B77D89] flex-shrink-0" />
            <span className="font-medium text-[#F4EDE8]">~400 Reels</span>
          </div>
        </div>

        {/* Center: Scroll Mouse Pill (Desktop only) */}
        <button
          type="button"
          onClick={scrollToWork}
          className="hidden lg:flex flex-col items-center gap-1.5 absolute left-1/2 -translate-x-1/2 text-[#B9ADAA]/60 hover:text-[#B9ADAA] transition-colors cursor-pointer group"
          aria-label="Scroll to portfolio"
        >
          <span className="text-[10px] font-inter uppercase tracking-[0.24em] text-[#B9ADAA]/75 group-hover:text-[#F4EDE8]">
            Scroll
          </span>
          <div className="w-5 h-8 rounded-full border border-[#443337] group-hover:border-[#B77D89] flex justify-center pt-1.5 transition-colors">
            <motion.span
              animate={{ y: [0, 8, 0], opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              className="w-1 h-1.5 rounded-full bg-[#B77D89]"
            />
          </div>
          <div className="w-px h-4 bg-gradient-to-b from-[#443337] to-transparent" />
        </button>

        {/* Empty right placeholder for balance */}
        <div className="hidden sm:block w-24" aria-hidden="true" />
      </div>
    </section>
  );
}
