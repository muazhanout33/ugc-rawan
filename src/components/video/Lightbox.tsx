"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { motion } from "framer-motion";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useVideo, formatTime } from "./VideoContext";
import type { PortfolioItem } from "@/lib/constants";

interface LightboxProps {
  items: PortfolioItem[];
  /** id of the item whose card was clicked — drives the shared-element transition */
  openedId: number;
  initialIndex: number;
  onClose: () => void;
}

/**
 * Custom in-page lightbox with its own controls (no native controls anywhere).
 * Uses a stable layoutId based on `openedId` so Prev/Next navigation never
 * re-triggers the shared-element scale animation.
 */
export default function Lightbox({
  items,
  openedId,
  initialIndex,
  onClose,
}: LightboxProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const seekBarRef = useRef<HTMLDivElement>(null);
  const volBarRef = useRef<HTMLDivElement>(null);
  const controlsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef(0);
  const seekDraggingRef = useRef(false);
  const volumeDraggingRef = useRef(false);
  const touchStartXRef = useRef<number | null>(null);

  const [index, setIndex] = useState(initialIndex);
  const item = items[index];

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolumeState] = useState(1);

  const { register, notifyPlay, notifyPause } = useVideo();

  // Pause card previews while the lightbox video plays
  useEffect(() => {
    const unregister = register(`lightbox-${openedId}`, () => {
      const el = videoRef.current;
      if (el && !el.paused) {
        el.pause();
      }
    });
    return unregister;
  }, [openedId, register]);

  // Smooth 60 FPS playback clock
  useEffect(() => {
    if (!isPlaying) {
      cancelAnimationFrame(rafRef.current);
      return;
    }
    const loop = () => {
      const el = videoRef.current;
      if (el && !el.paused) {
        setCurrentTime(el.currentTime);
        rafRef.current = requestAnimationFrame(loop);
      }
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isPlaying]);

  // Lock body scroll while open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Keyboard navigation
  const goNext = useCallback(() => {
    setIndex((i) => (i + 1) % items.length);
  }, [items.length]);
  const goPrev = useCallback(() => {
    setIndex((i) => (i - 1 + items.length) % items.length);
  }, [items.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
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
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, goNext, goPrev]);

  // Cleanup timers on unmount
  useEffect(
    () => () => {
      if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
      cancelAnimationFrame(rafRef.current);
    },
    []
  );

  /* ── Controls ── */

  const scheduleHideControls = useCallback(() => {
    if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    controlsTimerRef.current = setTimeout(() => {
      if (!seekDraggingRef.current && !volumeDraggingRef.current) {
        setShowControls(false);
      }
    }, 3500);
  }, []);

  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    if (isPlaying) scheduleHideControls();
  }, [isPlaying, scheduleHideControls]);

  const togglePlay = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) {
      el.play().catch(() => {});
    } else {
      el.pause();
    }
  }, []);

  const toggleMute = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    const next = !el.muted;
    el.muted = next;
    setIsMuted(next);
  }, []);

  const setVolume = useCallback((v: number) => {
    const el = videoRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(1, v));
    el.volume = clamped;
    el.muted = clamped === 0;
    setVolumeState(clamped);
    setIsMuted(clamped === 0);
  }, []);

  const seekTo = useCallback(
    (timeSeconds: number) => {
      const el = videoRef.current;
      if (!el) return;
      const valid = duration > 0 ? duration : el.duration;
      const target = valid && isFinite(valid) && valid > 0
        ? Math.max(0, Math.min(valid, timeSeconds))
        : Math.max(0, timeSeconds);
      el.currentTime = target;
      setCurrentTime(target);
      if (el.paused && isPlaying) el.play().catch(() => {});
    },
    [duration, isPlaying]
  );

  const getSeekPct = useCallback((clientX: number): number => {
    const bar = seekBarRef.current;
    if (!bar) return 0;
    const rect = bar.getBoundingClientRect();
    if (rect.width <= 0) return 0;
    return Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  }, []);

  const handleSeekMouseDown = useCallback(
    (e: ReactMouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      seekDraggingRef.current = true;
      const valid = duration > 0 ? duration : 0;
      const onMove = (me: MouseEvent) => {
        if (valid > 0) setCurrentTime(getSeekPct(me.clientX) * valid);
      };
      const onUp = (me: MouseEvent) => {
        seekDraggingRef.current = false;
        if (valid > 0) seekTo(getSeekPct(me.clientX) * valid);
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [duration, getSeekPct, seekTo]
  );

  const getVolPct = useCallback((clientX: number): number => {
    const bar = volBarRef.current;
    if (!bar) return 0;
    const rect = bar.getBoundingClientRect();
    if (rect.width <= 0) return 0;
    return Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  }, []);

  const handleVolMouseDown = useCallback(
    (e: ReactMouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      volumeDraggingRef.current = true;
      setVolume(getVolPct(e.clientX));
      const onMove = (me: MouseEvent) => setVolume(getVolPct(me.clientX));
      const onUp = (me: MouseEvent) => {
        volumeDraggingRef.current = false;
        setVolume(getVolPct(me.clientX));
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [getVolPct, setVolume]
  );

  /* ── Video native handlers ── */

  const handlePlayEvent = useCallback(() => {
    setIsPlaying(true);
    notifyPlay(`lightbox-${openedId}`);
    scheduleHideControls();
  }, [openedId, notifyPlay, scheduleHideControls]);

  const handlePauseEvent = useCallback(() => {
    setIsPlaying(false);
    notifyPause(`lightbox-${openedId}`);
    setShowControls(true);
  }, [openedId, notifyPause]);

  const handleEndedEvent = useCallback(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    notifyPause(`lightbox-${openedId}`);
    setShowControls(true);
  }, [openedId, notifyPause]);

  const handleLoadedMetadata = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    if (el.duration && isFinite(el.duration) && el.duration > 0) {
      setDuration(el.duration);
    }
    setIsLoading(false);
    setCurrentTime(0);
    el.play().catch(() => {});
  }, []);

  /* ── Swipe navigation (mobile) ── */

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const startX = touchStartXRef.current;
      if (startX === null) return;
      touchStartXRef.current = null;
      const delta = e.changedTouches[0].clientX - startX;
      if (Math.abs(delta) > 60) {
        if (delta < 0) goNext();
        else goPrev();
      }
    },
    [goNext, goPrev]
  );

  /* ── Derived ── */

  const controlsVisible = showControls || !isPlaying;
  const progress =
    duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center overflow-y-auto bg-[rgba(5,5,8,0.88)] backdrop-blur-md select-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Portfolio video lightbox"
    >
      <div
        ref={contentRef}
        className="relative flex flex-col lg:flex-row items-center lg:items-center justify-center gap-7 lg:gap-12 w-full max-w-5xl px-4 py-8 lg:py-12 my-auto"
        onClick={(e) => e.stopPropagation()}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{ touchAction: "pan-y" }}
      >
        {/* ── Shared-element frame ── */}
        <motion.div
          layoutId={`portfolio-frame-${openedId}`}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-[420px] sm:max-w-[380px] lg:w-auto lg:max-w-none lg:h-[78vh] aspect-[9/16] shrink-0 rounded-[20px] overflow-hidden bg-black shadow-[0_40px_120px_rgba(0,0,0,0.7)]"
        >
          <video
            key={item.id}
            ref={videoRef}
            src={item.video}
            poster={item.thumbnail}
            preload="auto"
            playsInline
            muted={isMuted}
            className="absolute inset-0 w-full h-full object-cover"
            onPlay={handlePlayEvent}
            onPause={handlePauseEvent}
            onEnded={handleEndedEvent}
            onLoadedMetadata={handleLoadedMetadata}
            onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime ?? 0)}
            onWaiting={() => setIsLoading(true)}
            onCanPlay={() => setIsLoading(false)}
            onPlaying={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setError(true);
            }}
          />

          {/* Cinematic vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.55)_100%)] pointer-events-none" />

          {/* Loading spinner */}
          {isLoading && (
            <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
              <div className="relative w-14 h-14">
                <div className="absolute inset-0 rounded-full border-2 border-white/10" />
                <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-white animate-spin" />
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-white/70 text-sm font-inter">Failed to load video</p>
            </div>
          )}

          {/* Close button */}
          <div
            className={`absolute top-0 left-0 right-0 z-40 flex items-center justify-end px-3 pt-3 pb-12 bg-gradient-to-b from-black/70 to-transparent pointer-events-none transition-opacity duration-300 ${
              controlsVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            <button
              onClick={onClose}
              className="pointer-events-auto w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/25 active:scale-95 transition-all duration-150 shadow-lg"
              aria-label="Close video"
            >
              <X size={18} />
            </button>
          </div>

          {/* Center play overlay (paused) */}
          {!isPlaying && !isLoading && !error && (
            <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
              <button
                onClick={togglePlay}
                className="w-20 h-20 rounded-full bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center shadow-[0_0_60px_rgba(139,92,246,0.5)] transition-all duration-300 hover:scale-110 hover:bg-white/25 cursor-pointer pointer-events-auto"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                <Play className="fill-white text-white ml-1.5" size={30} />
              </button>
            </div>
          )}

          {/* ── Controls bottom bar ── */}
          <div
            className={`absolute bottom-0 left-0 right-0 z-40 pointer-events-none transition-opacity duration-300 ${
              controlsVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />
            <div className="relative px-4 pt-8 pb-4">
              {/* Seek bar */}
              <div
                ref={seekBarRef}
                className="relative w-full cursor-pointer group/seek mb-3 pointer-events-auto"
                style={{ height: "20px", display: "flex", alignItems: "center" }}
                onMouseDown={handleSeekMouseDown}
                role="slider"
                aria-label="Seek"
                aria-valuemin={0}
                aria-valuemax={duration}
                aria-valuenow={currentTime}
              >
                <div className="absolute inset-x-0 h-[4px] group-hover/seek:h-[6px] transition-all duration-150 rounded-full overflow-hidden bg-white/20">
                  <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] rounded-full transition-none"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg opacity-0 group-hover/seek:opacity-100 transition-opacity pointer-events-none"
                  style={{ left: `calc(${progress}% - 8px)` }}
                />
              </div>

              {/* Bottom row */}
              <div className="flex items-center justify-between gap-3 pointer-events-auto">
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePlay();
                    }}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white hover:bg-white/20 active:scale-95 transition-all duration-150"
                    aria-label={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? (
                      <Pause size={20} className="fill-white" />
                    ) : (
                      <Play size={20} className="fill-white ml-0.5" />
                    )}
                  </button>

                  {/* Volume */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMute();
                      }}
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 active:scale-95 transition-all duration-150"
                      aria-label={isMuted ? "Unmute" : "Mute"}
                    >
                      {isMuted || volume === 0 ? (
                        <VolumeX size={18} />
                      ) : (
                        <Volume2 size={18} />
                      )}
                    </button>
                    <div
                      ref={volBarRef}
                      className="relative w-20 cursor-pointer group/vol"
                      style={{ height: "20px", display: "flex", alignItems: "center" }}
                      onMouseDown={handleVolMouseDown}
                    >
                      <div className="absolute inset-x-0 h-[4px] group-hover/vol:h-[5px] transition-all rounded-full overflow-hidden bg-white/20">
                        <div
                          className="absolute top-0 left-0 h-full bg-white rounded-full"
                          style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <span className="text-sm text-white/80 font-mono tabular-nums ml-1">
                    {formatTime(currentTime)}{" "}
                    <span className="text-white/40">/</span>{" "}
                    {formatTime(duration)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Info panel + navigation ── */}
        <div className="w-full lg:w-72 shrink-0 text-left">
          <p className="font-inter text-white/40 text-[11px] uppercase tracking-[0.2em] mb-1.5">
            Client
          </p>
          <p className="font-sora font-semibold text-white text-lg leading-snug">
            {item.client}
          </p>

          <div className="mt-5">
            <p className="font-inter text-white/40 text-[11px] uppercase tracking-[0.2em] mb-1.5">
              Project
            </p>
            <p className="font-inter text-white/80 text-sm leading-relaxed">
              {item.title}
            </p>
          </div>

          <div className="mt-5">
            <p className="font-inter text-white/40 text-[11px] uppercase tracking-[0.2em] mb-1.5">
              Project Type
            </p>
            <p className="font-inter text-white/80 text-sm">{item.category}</p>
          </div>

          <div className="mt-7 flex items-center gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/25 transition-all duration-200 text-xs font-inter font-medium"
            >
              <ChevronLeft size={15} /> Previous
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/25 transition-all duration-200 text-xs font-inter font-medium"
            >
              Next <ChevronRight size={15} />
            </button>
          </div>

          <p className="mt-5 font-inter text-white/30 text-[11px] hidden lg:block">
            <span className="font-mono">←</span> /{" "}
            <span className="font-mono">→</span> navigate &nbsp;·&nbsp;{" "}
            <span className="font-mono">Esc</span> close
          </p>
        </div>
      </div>
    </motion.div>
  );
}
