"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import type { PortfolioVideo } from "@/lib/constants";

interface LightboxProps {
  items: PortfolioVideo[];
  openedId: string;
  initialIndex: number;
  onClose: () => void;
}

export default function Lightbox({
  items,
  openedId: _openedId,
  initialIndex,
  onClose,
}: LightboxProps) {
  const [index, setIndex] = useState(initialIndex);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const touchStartXRef = useRef<number | null>(null);

  const item = items[index] || items[0];

  // Lock body scroll while lightbox is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const goNext = useCallback(() => {
    setIsLoading(true);
    setHasError(false);
    setIndex((i) => (i + 1) % items.length);
  }, [items.length]);

  const goPrev = useCallback(() => {
    setIsLoading(true);
    setHasError(false);
    setIndex((i) => (i - 1 + items.length) % items.length);
  }, [items.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, goNext, goPrev]);

  // Touch swipe support for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const startX = touchStartXRef.current;
      if (startX === null) return;
      touchStartXRef.current = null;
      const deltaX = e.changedTouches[0].clientX - startX;
      if (Math.abs(deltaX) > 60) {
        if (deltaX < 0) {
          goNext();
        } else {
          goPrev();
        }
      }
    },
    [goNext, goPrev]
  );

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center select-none overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label={`Video player for ${item.title}`}
      onClick={onClose}
    >
      {/* ── Backdrop ── */}
      <div className="absolute inset-0 bg-[#07040D]/90 backdrop-blur-xl" />

      {/* ── Top Header Controls Bar ── */}
      <div
        className="relative z-10 w-full max-w-4xl px-4 sm:px-6 pt-4 pb-2 flex items-center justify-between pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Project Info Pill */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15">
            <Sparkles size={13} className="text-[#C4B5FD]" />
            <span className="font-sora text-xs sm:text-sm font-semibold text-white tracking-tight">
              {item.title}
            </span>
            <span className="text-white/30 text-xs">|</span>
            <span className="font-mono text-[11px] text-[#C4B5FD] font-medium">
              {item.id} / 0{items.length}
            </span>
          </div>
        </div>

        {/* Top-Right: Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 border border-white/20 flex items-center justify-center text-white/90 hover:text-white transition-all duration-200 shadow-lg cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C4B5FD]"
          aria-label="Close video player"
        >
          <X size={19} />
        </button>
      </div>

      {/* ── Center Stage: Video Container & Navigation ── */}
      <div
        className="relative z-10 flex items-center justify-center w-full px-4 py-2 my-auto"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Previous Button (Desktop) */}
        <button
          type="button"
          onClick={goPrev}
          className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 active:scale-90 border border-white/15 text-white/80 hover:text-white transition-all duration-200 mr-4 lg:mr-8 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C4B5FD] shadow-xl"
          aria-label="Previous video"
        >
          <ChevronLeft size={22} />
        </button>

        {/* 9:16 Video Frame */}
        <motion.div
          key={item.id}
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.96, opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-[340px] sm:max-w-[380px] lg:max-w-[410px] aspect-[9/16] max-h-[76vh] sm:max-h-[78vh] rounded-[20px] sm:rounded-[24px] overflow-hidden bg-black shadow-[0_25px_80px_rgba(0,0,0,0.85),0_0_40px_rgba(196,181,253,0.18)] border border-[rgba(196,181,253,0.2)]"
        >
          {/* Loading Spinner */}
          {isLoading && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-none">
              <div className="relative w-12 h-12 mb-3">
                <div className="absolute inset-0 rounded-full border-2 border-white/15" />
                <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#C4B5FD] animate-spin" />
              </div>
              <span className="text-xs font-inter text-white/60">Loading Mux stream...</span>
            </div>
          )}

          {/* Error Message */}
          {hasError && (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 text-center bg-black/90">
              <p className="text-sm font-inter text-white/80 mb-4">
                Video playback could not load directly.
              </p>
              <a
                href={item.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#C4B5FD] text-[#0F0A19] text-xs font-semibold hover:bg-white transition-colors"
              >
                Watch on Mux <ExternalLink size={13} />
              </a>
            </div>
          )}

          {/* Mux Hosted Player Embed */}
          <iframe
            src={`${item.videoUrl}?autoplay=muted`}
            title={`Video: ${item.title}`}
            allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0 block bg-black"
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setHasError(true);
            }}
          />
        </motion.div>

        {/* Next Button (Desktop) */}
        <button
          type="button"
          onClick={goNext}
          className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 active:scale-90 border border-white/15 text-white/80 hover:text-white transition-all duration-200 ml-4 lg:ml-8 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C4B5FD] shadow-xl"
          aria-label="Next video"
        >
          <ChevronRight size={22} />
        </button>
      </div>

      {/* ── Bottom Controls (Mobile prev/next buttons + hint) ── */}
      <div
        className="relative z-10 w-full max-w-sm px-4 pt-2 pb-4 flex flex-col items-center gap-2 pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Navigation Buttons */}
        <div className="flex md:hidden items-center justify-center gap-3 w-full">
          <button
            type="button"
            onClick={goPrev}
            className="flex-1 py-2.5 px-4 rounded-full bg-white/10 active:bg-white/20 border border-white/15 text-white text-xs font-inter font-medium flex items-center justify-center gap-1.5 shadow"
          >
            <ChevronLeft size={16} /> Prev Video
          </button>
          <button
            type="button"
            onClick={goNext}
            className="flex-1 py-2.5 px-4 rounded-full bg-white/10 active:bg-white/20 border border-white/15 text-white text-xs font-inter font-medium flex items-center justify-center gap-1.5 shadow"
          >
            Next Video <ChevronRight size={16} />
          </button>
        </div>

        {/* Keyboard / Swipe tip */}
        <p className="font-inter text-white/30 text-[11px] text-center hidden md:block">
          Use <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-[10px] text-white/60">←</kbd>{" "}
          <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-[10px] text-white/60">→</kbd> to navigate ·{" "}
          <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-[10px] text-white/60">Esc</kbd> to close
        </p>
      </div>
    </motion.div>,
    document.body
  );
}
