"use client";

import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, ArrowLeft } from "lucide-react";
import { PORTFOLIO_ITEMS, PORTFOLIO_FILTERS, type PortfolioItem } from "@/lib/constants";
import { ScrollReveal } from "@/components/animations";
import PortfolioCard from "@/components/video/PortfolioCard";
import dynamic from "next/dynamic";

const Lightbox = dynamic(
  () => import("@/components/video/Lightbox"),
  { ssr: false, loading: () => null }
);

/* ───────── Main Component ───────── */

export default function Portfolio() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [viewAll, setViewAll] = useState(false);
  const [openItem, setOpenItem] = useState<PortfolioItem | null>(null);

  const filteredItems = PORTFOLIO_ITEMS.filter(
    (item) => activeFilter === "All" || item.category === activeFilter
  );

  const displayedItems = viewAll ? PORTFOLIO_ITEMS : filteredItems;

  const handleOpen = useCallback((item: PortfolioItem) => {
    setOpenItem(item);
  }, []);

  const handleClose = useCallback(() => {
    setOpenItem(null);
  }, []);

  const initialIndex = openItem
    ? PORTFOLIO_ITEMS.findIndex((i) => i.id === openItem.id)
    : 0;

  return (
    <section
      id="portfolio"
      className="relative section-padding bg-[#0F0A19]"
    >
      <div className="absolute top-0 left-0 right-0 gradient-line" />

      <div className="section-container relative z-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16">
          <ScrollReveal animation="fadeRight" className="max-w-2xl">
            <div className="section-label">
              <Sparkles size={14} className="text-[#E9D5FF]" />
              {viewAll ? "Complete Portfolio" : "Selected Work"}
            </div>
            <h2 className="font-heading text-section text-balance">
              Stories that{" "}
              <span className="text-gradient-primary">stop the scroll</span>.
            </h2>
          </ScrollReveal>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 lg:gap-6">
            {/* View All Videos CTA */}
            <ScrollReveal
              animation="fadeLeft"
              delay={0.1}
              className="flex justify-start"
            >
              <button
                onClick={() => setViewAll((v) => !v)}
                className="group inline-flex items-center gap-2.5 font-inter text-sm font-medium text-white/80 hover:text-white transition-colors duration-250"
                aria-pressed={viewAll}
              >
                <span className="w-px h-4 bg-[#C4B5FD] transition-all duration-300 group-hover:w-4 group-hover:bg-gradient-to-r group-hover:from-[#C4B5FD] group-hover:to-[#DDD6FE]" />
                {viewAll ? (
                  <>
                    Selected Work
                    <ArrowLeft
                      size={15}
                      className="transition-transform duration-300 group-hover:-translate-x-0.5"
                    />
                  </>
                ) : (
                  <>
                    See All Work
                    <ArrowRight
                      size={15}
                      className="transition-transform duration-300 group-hover:translate-x-0.5"
                    />
                  </>
                )}
              </button>
            </ScrollReveal>

            {/* Filter pills — only in Selected Work view */}
            {!viewAll && (
              <ScrollReveal
                animation="fadeLeft"
                delay={0.15}
                className="flex flex-wrap items-center gap-2"
              >
                {PORTFOLIO_FILTERS.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-4 py-2 rounded-full font-inter text-sm font-medium transition-all duration-250 ${
                      activeFilter === filter
                        ? "bg-[#C4B5FD] text-white shadow-[0_0_20px_rgba(196,181,253,0.35)]"
                        : "bg-[rgba(27,18,48,0.6)] text-white/50 border border-[rgba(196,181,253,0.15)] hover:text-white hover:border-[rgba(196,181,253,0.4)]"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </ScrollReveal>
            )}
          </div>
        </div>

        {/* Mobile: horizontal carousel | sm+: grid */}
        <motion.div
          layout
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-7 lg:overflow-visible lg:snap-none lg:pb-0"
        >
          <AnimatePresence mode="popLayout">
            {displayedItems.map((item) => (
              <div key={item.id} className="shrink-0 w-[75vw] sm:w-auto">
                <PortfolioCard item={item} onOpen={handleOpen} />
              </div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Custom Lightbox */}
      <AnimatePresence>
        {openItem && openItem.video && (
          <Lightbox
            items={PORTFOLIO_ITEMS}
            openedId={openItem.id}
            initialIndex={initialIndex}
            onClose={handleClose}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
