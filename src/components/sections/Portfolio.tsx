"use client";

import { useCallback, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Sparkles, Film } from "lucide-react";
import { PORTFOLIO_VIDEOS, type PortfolioVideo } from "@/lib/constants";
import { ScrollReveal } from "@/components/animations";
import PortfolioCard from "@/components/video/PortfolioCard";
import dynamic from "next/dynamic";

const Lightbox = dynamic(
  () => import("@/components/video/Lightbox"),
  { ssr: false, loading: () => null }
);

export default function Portfolio() {
  const [openItem, setOpenItem] = useState<PortfolioVideo | null>(null);

  const handleOpen = useCallback((item: PortfolioVideo) => {
    setOpenItem(item);
  }, []);

  const handleClose = useCallback(() => {
    setOpenItem(null);
  }, []);

  const initialIndex = openItem
    ? PORTFOLIO_VIDEOS.findIndex((i) => i.id === openItem.id)
    : 0;

  return (
    <section
      id="portfolio"
      className="relative section-padding bg-[#0F0A19] overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 gradient-line" />

      {/* Subtle ambient background glow */}
      <div
        className="glow-orb glow-orb-primary w-[380px] h-[380px] -top-32 -right-32 opacity-20 pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="glow-orb glow-orb-accent w-[340px] h-[340px] -bottom-24 -left-24 opacity-15 pointer-events-none"
        aria-hidden="true"
      />

      <div className="section-container relative z-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 sm:mb-14">
          <ScrollReveal animation="fadeRight" className="max-w-2xl">
            <div className="section-label">
              <Sparkles size={14} className="text-[#E9D5FF]" />
              Video Portfolio
            </div>
            <h2 className="font-heading text-section text-balance">
              Selected <span className="text-gradient-primary">work</span>.
            </h2>
          </ScrollReveal>

          {/* Project count indicator badge */}
          <ScrollReveal animation="fadeLeft" delay={0.1}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[rgba(27,18,48,0.7)] border border-[rgba(196,181,253,0.18)] shadow-sm">
              <Film size={13} className="text-[#C4B5FD]" />
              <span className="font-inter text-xs text-white/70 font-medium">
                {PORTFOLIO_VIDEOS.length} Featured Projects
              </span>
            </div>
          </ScrollReveal>
        </div>

        {/* ── Fully Responsive Video Grid ── */}
        <div className="grid grid-cols-1 min-[360px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3.5 sm:gap-5 md:gap-6 lg:gap-7">
          {PORTFOLIO_VIDEOS.map((item, index) => (
            <PortfolioCard
              key={item.id}
              item={item}
              index={index}
              onOpen={handleOpen}
            />
          ))}
        </div>
      </div>

      {/* ── Single-Instance Video Lightbox ── */}
      <AnimatePresence>
        {openItem && (
          <Lightbox
            items={PORTFOLIO_VIDEOS}
            openedId={openItem.id}
            initialIndex={initialIndex >= 0 ? initialIndex : 0}
            onClose={handleClose}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
