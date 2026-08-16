"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Play } from "lucide-react";
import { useVideo } from "@/components/video/VideoContext";
import type { PortfolioItem } from "@/lib/constants";

interface PortfolioCardProps {
  item: PortfolioItem;
  onOpen: (item: PortfolioItem) => void;
}

/**
 * Premium portfolio card — 9:16 video frame, no native controls ever.
 * Muted autoplay preview on hover (only one preview plays at a time via VideoContext).
 * Metadata (Client + Project Type) sits BELOW the card, never burned into the video.
 */
export default function PortfolioCard({ item, onOpen }: PortfolioCardProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [mounted, setMounted] = useState(false);
  const [hovering, setHovering] = useState(false);
  const { register, notifyPlay, notifyPause } = useVideo();

  const isVideo = Boolean(item.video);
  const previewId = `portfolio-preview-${item.id}`;

  // Lazy-mount the <video> when the card approaches the viewport
  useEffect(() => {
    const el = frameRef.current;
    if (!el || !isVideo) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setMounted(true);
          io.disconnect();
        }
      },
      { rootMargin: "600px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [isVideo]);

  // Register with VideoContext so only ONE preview plays at any time
  useEffect(() => {
    if (!isVideo) return;
    const unregister = register(previewId, () => {
      const v = videoRef.current;
      if (v && !v.paused) {
        v.pause();
        v.currentTime = 0;
      }
    });
    return unregister;
  }, [isVideo, previewId, register]);

  const playPreview = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    notifyPlay(previewId);
    v.muted = true;
    v.currentTime = 0;
    v.play().catch(() => {});
  }, [previewId, notifyPlay]);

  const stopPreview = useCallback(() => {
    const v = videoRef.current;
    if (v) {
      v.pause();
      v.currentTime = 0;
    }
    notifyPause(previewId);
  }, [previewId, notifyPause]);

  const handleEnter = useCallback(() => {
    if (!isVideo) return;
    setHovering(true);
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    // Tiny delay prevents flicker when sweeping across several cards
    hoverTimer.current = setTimeout(playPreview, 90);
  }, [isVideo, playPreview]);

  const handleLeave = useCallback(() => {
    setHovering(false);
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    stopPreview();
  }, [stopPreview]);

  useEffect(
    () => () => {
      if (hoverTimer.current) clearTimeout(hoverTimer.current);
    },
    []
  );

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="group"
      data-portfolio-card
    >
      {/* ── Video / Image frame (shared layout element for the lightbox transition) ── */}
      <motion.div
        ref={frameRef}
        layoutId={`portfolio-frame-${item.id}`}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full"
      >
        <div className="relative w-full aspect-[9/16] rounded-[20px] overflow-hidden bg-[#130D22] cursor-pointer transition-all duration-500 ease-out will-change-transform group-hover:scale-[1.02] group-hover:shadow-[0_24px_70px_rgba(0,0,0,0.55),0_0_0_1px_rgba(139,92,246,0.12)]">
          {isVideo ? (
            mounted ? (
              <video
                ref={videoRef}
                src={item.video}
                poster={item.thumbnail}
                preload="metadata"
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
                onMouseEnter={handleEnter}
                onMouseLeave={handleLeave}
              />
            ) : (
              <Image
                src={item.thumbnail}
                alt={item.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover"
              />
            )
          ) : (
            <Image
              src={item.thumbnail}
              alt={item.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              loading="lazy"
              className="object-cover"
            />
          )}

          {isVideo && (
            <>
              {/* Subtle play affordance — fades out once hover preview starts */}
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-500"
                style={{ opacity: hovering ? 0 : 1 }}
              >
                <div className="w-[52px] h-[52px] rounded-full bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
                  <Play size={16} className="fill-white text-white ml-0.5" />
                </div>
              </div>

              {/* Click to open lightbox */}
              <button
                type="button"
                aria-label={`Open ${item.title}`}
                onClick={() => {
                  stopPreview();
                  onOpen(item);
                }}
                onMouseEnter={handleEnter}
                onMouseLeave={handleLeave}
                className="absolute inset-0 z-10 w-full h-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]/70"
              />
            </>
          )}
        </div>
      </motion.div>

      {/* ── Metadata below the card ── */}
      <div className="mt-3.5 px-0.5">
        <p className="font-sora font-semibold text-white text-sm leading-tight">
          {item.client}
        </p>
        <p className="font-inter text-white/40 text-xs mt-1">{item.category}</p>
      </div>
    </motion.div>
  );
}
