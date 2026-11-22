"use client";

import { memo } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { motion } from "framer-motion";
import type { PortfolioVideo } from "@/lib/constants";

interface PortfolioCardProps {
  item: PortfolioVideo;
  index: number;
  onOpen: (item: PortfolioVideo) => void;
}

const PortfolioCard = memo(function PortfolioCard({
  item,
  index,
  onOpen,
}: PortfolioCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{
        duration: 0.45,
        delay: Math.min(index * 0.04, 0.25),
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative flex flex-col w-full"
      data-portfolio-card
    >
      {/* ── Video Frame & Button ── */}
      <button
        type="button"
        onClick={() => onOpen(item)}
        aria-label={`Play ${item.title}`}
        className="relative w-full aspect-[9/16] rounded-[16px] sm:rounded-[20px] overflow-hidden bg-[#1C1719] border border-[#443337] text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B77D89] focus-visible:ring-offset-2 focus-visible:ring-offset-[#141112] cursor-pointer transition-all duration-400 ease-out group-hover:border-[#87535F] group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.7),0_0_30px_rgba(135,83,95,0.15)] group-hover:-translate-y-1"
      >
        {/* Mux Thumbnail */}
        <Image
          src={item.thumbnailUrl}
          alt={item.title}
          fill
          sizes="(max-width: 360px) 100vw, (max-width: 768px) 50vw, (max-width: 1200px) 33vw, 380px"
          priority={index < 2}
          loading={index < 2 ? undefined : "lazy"}
          className="object-cover transition-transform duration-600 ease-out group-hover:scale-105"
        />

        {/* Ambient Gradient Overlays for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#141112]/90 via-transparent to-black/30 pointer-events-none transition-opacity duration-300 group-hover:opacity-75" />

        {/* Top-left: ID Tag */}
        <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-10">
          <span className="inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-mono font-medium tracking-wider text-[#F4EDE8] bg-[#141112]/85 border border-[#443337] shadow-sm">
            {item.id}
          </span>
        </div>

        {/* Top-right: 9:16 Aspect Tag */}
        <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-10 opacity-70 group-hover:opacity-100 transition-opacity">
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-mono text-[#B9ADAA] bg-[#141112]/80 border border-[#443337]">
            {item.aspectRatio}
          </span>
        </div>

        {/* Center: Play Button */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="relative flex items-center justify-center">
            {/* Play Button Icon */}
            <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-[#141112]/80 border border-[#443337] flex items-center justify-center text-[#F4EDE8] shadow-[0_8px_24px_rgba(0,0,0,0.6)] transition-all duration-300 group-hover:scale-110 group-hover:bg-[#F4EDE8] group-hover:text-[#141112] group-hover:border-white">
              <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current ml-0.5 transition-transform duration-300 group-hover:scale-105" />
            </div>
          </div>
        </div>

        {/* Bottom Watch prompt */}
        <div className="absolute bottom-2.5 inset-x-2.5 sm:bottom-3 sm:inset-x-3 z-10 flex items-center justify-between pointer-events-none">
          <span className="text-[10px] sm:text-[11px] font-inter font-medium text-[#B9ADAA] group-hover:text-[#F4EDE8] transition-colors flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B77D89]" />
            Watch Film
          </span>
        </div>
      </button>

      {/* ── Metadata below the card ── */}
      <div className="mt-2.5 sm:mt-3 px-1 flex items-baseline justify-between gap-2">
        <h3 className="font-sora font-semibold text-[#F4EDE8] text-xs sm:text-sm tracking-tight group-hover:text-white transition-colors truncate">
          {item.title}
        </h3>
        <span className="text-[11px] font-inter text-[#B77D89] font-medium shrink-0">
          {item.personOrBrand}
        </span>
      </div>
    </motion.div>
  );
});

export default PortfolioCard;
