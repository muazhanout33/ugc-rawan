"use client";

import {
  useRef,
  useCallback,
  useEffect,
  useState,
  type MouseEvent as ReactMouseEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  X,
  Settings,
} from "lucide-react";
import { motion } from "framer-motion";
import { useVideo, formatTime } from "./VideoContext";

/* ───────── Speed Menu ───────── */

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

function SpeedMenu({
  current,
  onSelect,
  onClose,
}: {
  current: number;
  onSelect: (s: number) => void;
  onClose: () => void;
}) {
  return (
    <div className="absolute bottom-full right-0 mb-2 bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl min-w-[110px]">
      {SPEEDS.map((s) => (
        <button
          key={s}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(s);
            onClose();
          }}
          className={`w-full px-4 py-2.5 text-left text-xs font-mono font-medium transition-colors ${
            s === current
              ? "text-[#C4B5FD] bg-[#C4B5FD]/15"
              : "text-white/60 hover:text-white hover:bg-white/10"
          }`}
        >
          {s === 1 ? "Normal" : `${s}×`}
        </button>
      ))}
    </div>
  );
}

/* ───────── Fullscreen Video Player ───────── */

interface FullscreenPlayerProps {
  id: string;
  src: string;
  poster?: string;
  /** Playback position (seconds) at which to resume */
  startTime?: number;
  onClose: () => void;
}

export default function FullscreenPlayer({
  id,
  src,
  poster,
  startTime = 0,
  onClose,
}: FullscreenPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const seekBarRef = useRef<HTMLDivElement>(null);
  const volBarRef = useRef<HTMLDivElement>(null);
  const controlsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number>(0);
  const seekDraggingRef = useRef(false);
  const volumeDraggingRef = useRef(false);
  const wasJustSeekingRef = useRef(false);
  const startedRef = useRef(false);

  // ── Isolated Local State ──
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(startTime);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showControls, setShowControls] = useState(true);
  const [showSpeed, setShowSpeed] = useState(false);
  const [playbackRate, setPlaybackRateState] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolumeState] = useState(1);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [localSeekProgress, setLocalSeekProgress] = useState<number | null>(null);

  const { register, notifyPlay, notifyPause } = useVideo();

  // Register with VideoContext (automatically pauses any other active video)
  useEffect(() => {
    const unregister = register(`fullscreen-${id}`, () => {
      if (videoRef.current && !videoRef.current.paused) {
        videoRef.current.pause();
      }
    });
    return unregister;
  }, [id, register]);

  // Smooth 60 FPS update loop while playing
  useEffect(() => {
    if (!isPlaying) {
      cancelAnimationFrame(rafRef.current);
      return;
    }

    const updateLoop = () => {
      const el = videoRef.current;
      if (el && !el.paused) {
        setCurrentTime(el.currentTime);
        const dur = el.duration;
        if (dur && isFinite(dur) && dur > 0) {
          setDuration(dur);
          if (el.buffered.length > 0) {
            setBuffered(el.buffered.end(el.buffered.length - 1) / dur);
          }
        }
        rafRef.current = requestAnimationFrame(updateLoop);
      }
    };

    rafRef.current = requestAnimationFrame(updateLoop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isPlaying]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Focus container for keyboard shortcuts
  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  // Seek to startTime & autoplay on loaded metadata
  useEffect(() => {
    const el = videoRef.current;
    if (!el || startedRef.current) return;

    const startPlayback = () => {
      startedRef.current = true;
      if (startTime > 0 && isFinite(startTime)) {
        el.currentTime = startTime;
        setCurrentTime(startTime);
      }
      el.play().catch(() => {});
    };

    if (el.readyState >= 1) {
      startPlayback();
    } else {
      el.addEventListener("loadedmetadata", startPlayback, { once: true });
      return () => el.removeEventListener("loadedmetadata", startPlayback);
    }
  }, [startTime]);

  // Auto-hide controls
  const scheduleHideControls = useCallback(() => {
    if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    controlsTimerRef.current = setTimeout(() => {
      if (!showSpeed && !seekDraggingRef.current && !volumeDraggingRef.current) {
        setShowControls(false);
      }
    }, 3500);
  }, [showSpeed]);

  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    if (isPlaying) scheduleHideControls();
  }, [isPlaying, scheduleHideControls]);

  useEffect(() => {
    if (!isPlaying) {
      setShowControls(true);
      if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    }
    return () => {
      if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    };
  }, [isPlaying]);

  // Toggle Play / Pause
  const togglePlay = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) {
      el.play().catch(() => {});
    } else {
      el.pause();
    }
  }, []);

  const handleContainerClick = useCallback(() => {
    if (wasJustSeekingRef.current) {
      wasJustSeekingRef.current = false;
      return;
    }
    togglePlay();
  }, [togglePlay]);

  // Native Video Handlers
  const handlePlayEvent = useCallback(() => {
    setIsPlaying(true);
    notifyPlay(`fullscreen-${id}`);
    scheduleHideControls();
  }, [id, notifyPlay, scheduleHideControls]);

  const handlePauseEvent = useCallback(() => {
    setIsPlaying(false);
    notifyPause(`fullscreen-${id}`);
    setShowControls(true);
  }, [id, notifyPause]);

  const handleEndedEvent = useCallback(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    notifyPause(`fullscreen-${id}`);
    setShowControls(true);
  }, [id, notifyPause]);

  const handleTimeUpdate = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    setCurrentTime(el.currentTime);
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    if (el.duration && isFinite(el.duration) && el.duration > 0) {
      setDuration(el.duration);
    }
    setIsLoading(false);
  }, []);

  const handleProgress = useCallback(() => {
    const el = videoRef.current;
    if (!el || !el.duration || !isFinite(el.duration)) return;
    if (el.buffered.length > 0) {
      setBuffered(el.buffered.end(el.buffered.length - 1) / el.duration);
    }
  }, []);

  // Mute & Volume
  const toggleMute = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    const newMuted = !el.muted;
    el.muted = newMuted;
    setIsMuted(newMuted);
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

  const setPlaybackRate = useCallback((rate: number) => {
    const el = videoRef.current;
    if (!el) return;
    el.playbackRate = rate;
    setPlaybackRateState(rate);
  }, []);

  const seekTo = useCallback(
    (timeSeconds: number) => {
      const el = videoRef.current;
      if (!el) return;
      const validDuration = (el.duration && isFinite(el.duration) && el.duration > 0)
        ? el.duration
        : duration;

      const targetTime = validDuration > 0
        ? Math.max(0, Math.min(validDuration, timeSeconds))
        : Math.max(0, timeSeconds);

      const wasPlaying = !el.paused || isPlaying;

      el.currentTime = targetTime;
      setCurrentTime(targetTime);

      if (wasPlaying && el.paused) {
        el.play().catch(() => {});
      }
    },
    [duration, isPlaying]
  );

  // Seek bar drag logic
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
      wasJustSeekingRef.current = true;

      const el = videoRef.current;
      const validDur = (el && el.duration && isFinite(el.duration) && el.duration > 0)
        ? el.duration
        : duration;

      const pct = getSeekPct(e.clientX);
      setLocalSeekProgress(pct * 100);

      const onMove = (me: MouseEvent) => {
        const p = getSeekPct(me.clientX);
        setLocalSeekProgress(p * 100);
        if (validDur > 0) {
          setHoverTime(p * validDur);
        }
      };

      const onUp = (me: MouseEvent) => {
        seekDraggingRef.current = false;
        const finalPct = getSeekPct(me.clientX);
        setLocalSeekProgress(null);
        setHoverTime(null);
        if (validDur > 0) {
          seekTo(finalPct * validDur);
        }
        setTimeout(() => {
          wasJustSeekingRef.current = false;
        }, 150);
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };

      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [getSeekPct, seekTo, duration]
  );

  const handleSeekHover = useCallback(
    (e: ReactMouseEvent) => {
      const el = videoRef.current;
      const validDur = (el && el.duration && isFinite(el.duration) && el.duration > 0)
        ? el.duration
        : duration;

      if (!seekDraggingRef.current && validDur > 0) {
        const pct = getSeekPct(e.clientX);
        setHoverTime(pct * validDur);
      }
    },
    [getSeekPct, duration]
  );

  // Volume bar drag logic
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
      wasJustSeekingRef.current = true;
      setVolume(getVolPct(e.clientX));

      const onMove = (me: MouseEvent) => setVolume(getVolPct(me.clientX));
      const onUp = (me: MouseEvent) => {
        volumeDraggingRef.current = false;
        setVolume(getVolPct(me.clientX));
        setTimeout(() => {
          wasJustSeekingRef.current = false;
        }, 150);
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };

      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [getVolPct, setVolume]
  );

  // Keyboard Shortcuts
  const handleKeyDown = useCallback(
    (e: ReactKeyboardEvent) => {
      const el = videoRef.current;
      if (!el) return;

      switch (e.key) {
        case "Escape":
          e.preventDefault();
          onClose();
          break;
        case " ":
        case "k":
          e.preventDefault();
          togglePlay();
          break;
        case "f":
          e.preventDefault();
          onClose();
          break;
        case "m":
          e.preventDefault();
          toggleMute();
          break;
        case "ArrowLeft":
          e.preventDefault();
          seekTo(Math.max(0, el.currentTime - 5));
          break;
        case "ArrowRight":
          e.preventDefault();
          seekTo(Math.min(el.duration || 0, el.currentTime + 5));
          break;
        case "ArrowUp":
          e.preventDefault();
          setVolume(Math.min(1, volume + 0.1));
          break;
        case "ArrowDown":
          e.preventDefault();
          setVolume(Math.max(0, volume - 0.1));
          break;
        case "j":
          e.preventDefault();
          seekTo(Math.max(0, el.currentTime - 10));
          break;
        case "l":
          e.preventDefault();
          seekTo(Math.min(el.duration || 0, el.currentTime + 10));
          break;
      }
    },
    [togglePlay, onClose, toggleMute, seekTo, setVolume, volume]
  );

  const effectiveDuration = (videoRef.current?.duration && isFinite(videoRef.current.duration) && videoRef.current.duration > 0)
    ? videoRef.current.duration
    : duration;

  const actualProgress = effectiveDuration > 0 ? (currentTime / effectiveDuration) * 100 : 0;
  const displayProgress = localSeekProgress !== null ? localSeekProgress : actualProgress;
  const bufferProgress = effectiveDuration > 0 ? buffered * 100 : 0;

  return (
    <motion.div
      ref={containerRef}
      className="fixed inset-0 z-[200] bg-black flex items-center justify-center outline-none select-none cursor-pointer"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      tabIndex={0}
      role="dialog"
      aria-label="Fullscreen video player"
      aria-modal="true"
      onClick={handleContainerClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        if (isPlaying) setShowControls(false);
        setHoverTime(null);
      }}
      onKeyDown={handleKeyDown}
      style={{ cursor: showControls ? "default" : "none" }}
    >
      {/* Cinematic radial vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(0,0,0,0.7)_100%)] pointer-events-none z-10" />

      {/* ── Video Element ── */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        preload="auto"
        playsInline
        muted={isMuted}
        className="w-full h-full object-contain"
        onPlay={handlePlayEvent}
        onPause={handlePauseEvent}
        onEnded={handleEndedEvent}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onProgress={handleProgress}
        onWaiting={() => setIsLoading(true)}
        onCanPlay={() => setIsLoading(false)}
        onPlaying={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setError("Failed to load video");
        }}
        style={{ maxHeight: "100vh", maxWidth: "100vw" }}
      />

      {/* ── Top Bar: Close Button ── */}
      <div
        className={`absolute top-0 left-0 right-0 z-50 flex items-center justify-end px-6 pt-6 pb-16 bg-gradient-to-b from-black/80 to-transparent pointer-events-none transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="pointer-events-auto w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/25 active:scale-95 transition-all duration-150 shadow-lg"
          aria-label="Close fullscreen"
        >
          <X size={18} />
        </button>
      </div>

      {/* ── Center Play/Pause Overlay (when paused) ── */}
      {!isPlaying && !isLoading && !error && (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <div className="absolute w-28 h-28 rounded-full bg-[#C4B5FD]/20 blur-2xl animate-pulse" />
          <div className="relative w-20 h-20 rounded-full bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center shadow-[0_0_60px_rgba(196,181,253,0.6)] transition-all duration-300 hover:scale-110 hover:bg-white/25 hover:shadow-[0_0_80px_rgba(196,181,253,0.8)]">
            <Play className="fill-white text-white ml-1.5" size={30} />
          </div>
        </div>
      )}

      {/* ── Loading Spinner ── */}
      {isLoading && (
        <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
          <div className="relative w-14 h-14">
            <div className="absolute inset-0 rounded-full border-2 border-white/10" />
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-white animate-spin" />
          </div>
        </div>
      )}

      {/* ── Error ── */}
      {error && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none">
          <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mb-3">
            <span className="text-red-400 text-xl font-bold">!</span>
          </div>
          <p className="text-white/70 text-sm font-inter text-center px-4">{error}</p>
        </div>
      )}

      {/* ── Controls Bottom Bar ── */}
      <div
        className={`absolute bottom-0 left-0 right-0 z-40 pointer-events-none transition-opacity duration-300 ${
          showControls || !isPlaying ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

        <div className="relative px-6 pt-8 pb-6">
          {/* Seek bar */}
          <div className="mb-4 pointer-events-auto">
            {hoverTime !== null && effectiveDuration > 0 && (
              <div
                className="absolute bg-black/90 text-white text-[11px] font-mono px-2 py-1 rounded-lg pointer-events-none z-50 -translate-x-1/2 mb-2 border border-white/10 shadow-lg"
                style={{
                  bottom: "calc(100% - 20px)",
                  left: `calc(24px + ${(hoverTime / effectiveDuration) * 100}% * (100% - 48px) / 100)`,
                }}
              >
                {formatTime(hoverTime)}
              </div>
            )}

            <div
              ref={seekBarRef}
              className="relative w-full cursor-pointer group/seek"
              style={{ height: "24px", display: "flex", alignItems: "center" }}
              onMouseDown={handleSeekMouseDown}
              onMouseMove={handleSeekHover}
              onMouseLeave={() => {
                if (!seekDraggingRef.current) setHoverTime(null);
              }}
              role="slider"
              aria-label="Seek"
              aria-valuemin={0}
              aria-valuemax={effectiveDuration}
              aria-valuenow={currentTime}
            >
              <div className="absolute inset-x-0 h-[4px] group-hover/seek:h-[6px] transition-all duration-150 rounded-full overflow-hidden bg-white/20">
                <div
                  className="absolute top-0 left-0 h-full bg-white/25 rounded-full"
                  style={{ width: `${bufferProgress}%` }}
                />
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#C4B5FD] to-[#DDD6FE] rounded-full transition-none"
                  style={{ width: `${displayProgress}%` }}
                />
              </div>
              <div
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg opacity-0 group-hover/seek:opacity-100 transition-opacity pointer-events-none"
                style={{ left: `calc(${displayProgress}% - 8px)` }}
              />
            </div>
          </div>

          {/* Bottom row */}
          <div className="flex items-center justify-between gap-3 pointer-events-auto">
            {/* Left: play, volume, time */}
            <div className="flex items-center gap-3">
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
              <div className="flex items-center gap-2">
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
                  className="relative w-24 cursor-pointer group/vol"
                  style={{ height: "20px", display: "flex", alignItems: "center" }}
                  onMouseDown={handleVolMouseDown}
                >
                  <div className="absolute inset-x-0 h-[4px] group-hover/vol:h-[5px] transition-all rounded-full overflow-hidden bg-white/20">
                    <div
                      className="absolute top-0 left-0 h-full bg-white rounded-full"
                      style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
                    />
                  </div>
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow opacity-0 group-hover/vol:opacity-100 transition-opacity pointer-events-none"
                    style={{ left: `calc(${(isMuted ? 0 : volume) * 100}% - 6px)` }}
                  />
                </div>
              </div>

              {/* Time display */}
              <span className="text-sm text-white/80 font-mono tabular-nums ml-2">
                {formatTime(currentTime)}{" "}
                <span className="text-white/40">/</span>{" "}
                {formatTime(effectiveDuration)}
              </span>
            </div>

            {/* Right: speed, exit */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowSpeed(!showSpeed);
                  }}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 active:scale-95 transition-all duration-150 text-xs font-mono font-bold"
                  aria-label="Playback speed"
                >
                  {playbackRate === 1 ? (
                    <Settings size={17} />
                  ) : (
                    <span>{playbackRate}×</span>
                  )}
                </button>
                {showSpeed && (
                  <SpeedMenu
                    current={playbackRate}
                    onSelect={setPlaybackRate}
                    onClose={() => setShowSpeed(false)}
                  />
                )}
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className="w-10 h-10 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 active:scale-95 transition-all duration-150"
                aria-label="Exit fullscreen"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4.5 h-4.5"
                >
                  <path d="M8 3v3a2 2 0 0 1-2 2H3" />
                  <path d="M21 8h-3a2 2 0 0 1-2-2V3" />
                  <path d="M3 16h3a2 2 0 0 1 2 2v3" />
                  <path d="M16 21v-3a2 2 0 0 1 2-2h3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
