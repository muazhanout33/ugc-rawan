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
        className="relative w-full aspect-[9/16] rounded-[18px] sm:rounded-[22px] overflow-hidden bg-[#130D22] border border-[rgba(196,181,253,0.12)] text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C4B5FD] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F0A19] cursor-pointer transition-all duration-400 ease-out group-hover:border-[rgba(196,181,253,0.35)] group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.65),0_0_30px_rgba(196,181,253,0.14)] group-hover:-translate-y-1"
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
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F0A19]/85 via-transparent to-black/25 pointer-events-none transition-opacity duration-300 group-hover:opacity-75" />

        {/* Top-left: ID Tag */}
        <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-10">
          <span className="inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-mono font-medium tracking-wider text-white/80 bg-black/70 border border-white/10 shadow-sm">
            {item.id}
          </span>
        </div>

        {/* Top-right: 9:16 Aspect Tag */}
        <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-10 opacity-70 group-hover:opacity-100 transition-opacity">
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-mono text-white/70 bg-black/60 border border-white/10">
            {item.aspectRatio}
          </span>
        </div>

        {/* Center: Play Button */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="relative flex items-center justify-center">
            {/* Glow on hover */}
            <div className="absolute w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#C4B5FD]/0 group-hover:bg-[#C4B5FD]/25 blur-xl transition-all duration-400" />
            
            {/* Play Button Icon */}
            <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-black/60 border border-white/25 flex items-center justify-center text-white shadow-[0_8px_24px_rgba(0,0,0,0.5)] transition-all duration-300 group-hover:scale-110 group-hover:bg-white group-hover:text-[#0F0A19] group-hover:border-white group-hover:shadow-[0_0_30px_rgba(196,181,253,0.7)]">
              <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current ml-0.5 transition-transform duration-300 group-hover:scale-105" />
            </div>
          </div>
        </div>

        {/* Bottom Watch prompt */}
        <div className="absolute bottom-2.5 inset-x-2.5 sm:bottom-3 sm:inset-x-3 z-10 flex items-center justify-between pointer-events-none">
          <span className="text-[10px] sm:text-[11px] font-inter font-medium text-white/70 group-hover:text-white transition-colors flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C4B5FD]" />
            Watch Video
          </span>
        </div>
      </button>

      {/* ── Metadata below the card ── */}
      <div className="mt-2.5 sm:mt-3 px-1">
        <h3 className="font-sora font-semibold text-white/90 text-xs sm:text-sm tracking-tight group-hover:text-white transition-colors">
          {item.title}
        </h3>
      </div>
    </motion.div>
  );
});

export default PortfolioCard;
