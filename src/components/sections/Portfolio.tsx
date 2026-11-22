"use client";

import { useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Film } from "lucide-react";
import {
  PORTFOLIO_VIDEOS,
  PORTFOLIO_CATEGORIES,
  type PortfolioCategory,
  type PortfolioVideo,
} from "@/lib/constants";
import { ScrollReveal } from "@/components/animations";
import PortfolioCard from "@/components/video/PortfolioCard";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

const Lightbox = dynamic(
  () => import("@/components/video/Lightbox"),
  { ssr: false, loading: () => null }
);

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState<PortfolioCategory>("All");
  const [openItem, setOpenItem] = useState<PortfolioVideo | null>(null);

  const filteredVideos = useMemo(() => {
    if (activeCategory === "All") return PORTFOLIO_VIDEOS;
    return PORTFOLIO_VIDEOS.filter((v) => v.category === activeCategory);
  }, [activeCategory]);

  const handleOpen = useCallback((item: PortfolioVideo) => {
    setOpenItem(item);
  }, []);

  const handleClose = useCallback(() => {
    setOpenItem(null);
  }, []);

  const initialIndex = openItem
    ? filteredVideos.findIndex((i) => i.id === openItem.id)
    : 0;

  return (
    <section
      id="portfolio"
      className="relative section-padding bg-[#141112] overflow-hidden border-t border-[#443337]"
    >
      {/* Understated ambient background illumination */}
      <div
        className="absolute rounded-full w-[460px] h-[460px] -top-32 -right-32 pointer-events-none opacity-20"
        style={{ background: "radial-gradient(circle, rgba(135,83,95,0.15) 0%, transparent 70%)" }}
        aria-hidden="true"
      />
      <div
        className="absolute rounded-full w-[380px] h-[380px] -bottom-24 -left-24 pointer-events-none opacity-15"
        style={{ background: "radial-gradient(circle, rgba(183,125,137,0.12) 0%, transparent 70%)" }}
        aria-hidden="true"
      />

      <div className="section-container relative z-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8 sm:mb-10">
          <ScrollReveal animation="fadeRight" className="max-w-2xl">
            <div className="section-label">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B77D89]" />
              Selected Work
            </div>
            <h2 className="font-serif text-section text-[#F4EDE8] font-normal text-balance">
              Recent Video <span className="italic font-light text-[#F4EDE8]/90">Films</span>.
            </h2>
            <p className="font-inter text-[#B9ADAA] text-sm sm:text-base leading-relaxed mt-2.5 text-pretty max-w-xl">
              Commercial reels, patient transformations, and creator campaigns produced across Egypt.
            </p>
          </ScrollReveal>

          {/* Project count indicator badge */}
          <ScrollReveal animation="fadeLeft" delay={0.1}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1C1719] border border-[#443337] shadow-sm">
              <Film size={13} className="text-[#B77D89]" />
              <span className="font-inter text-xs text-[#B9ADAA] font-medium">
                {filteredVideos.length} Commercial Films
              </span>
            </div>
          </ScrollReveal>
        </div>

        {/* ── Visible Category Filter Buttons ── */}
        <div
          className="flex flex-wrap items-center gap-2.5 sm:gap-3 mb-8 sm:mb-12"
          role="tablist"
          aria-label="Filter videos by category"
        >
          {PORTFOLIO_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            const count =
              cat === "All"
                ? PORTFOLIO_VIDEOS.length
                : PORTFOLIO_VIDEOS.filter((v) => v.category === cat).length;

            return (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={isActive}
                data-category={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs sm:text-sm font-inter transition-all duration-200 flex items-center gap-2.5 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B77D89]",
                  isActive
                    ? "bg-[#F4EDE8] text-[#141112] font-semibold shadow-[0_2px_16px_rgba(244,237,232,0.18)] border border-[#F4EDE8]"
                    : "bg-[#1C1719] text-[#B9ADAA] hover:text-[#F4EDE8] hover:bg-[#261E22] border border-[#443337] font-medium"
                )}
              >
                <span>{cat}</span>
                <span
                  className={cn(
                    "px-2 py-0.5 rounded-full text-[11px] font-mono leading-none transition-colors",
                    isActive
                      ? "bg-[#141112] text-[#F4EDE8] font-bold"
                      : "bg-[#141112] text-[#B9ADAA] border border-[#443337]"
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Fully Responsive Video Grid ── */}
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
          className="grid grid-cols-1 min-[360px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3.5 sm:gap-5 md:gap-6 lg:gap-7"
        >
          {filteredVideos.map((item, index) => (
            <PortfolioCard
              key={item.id}
              item={item}
              index={index}
              onOpen={handleOpen}
            />
          ))}
        </motion.div>
      </div>

      {/* ── Single-Instance Video Lightbox ── */}
      <AnimatePresence>
        {openItem && (
          <Lightbox
            items={filteredVideos}
            openedId={openItem.id}
            initialIndex={initialIndex >= 0 ? initialIndex : 0}
            onClose={handleClose}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
