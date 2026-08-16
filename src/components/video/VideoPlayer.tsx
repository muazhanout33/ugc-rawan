"use client";

import {
  useRef,
  useCallback,
  useEffect,
  useState,
  memo,
  type MouseEvent as ReactMouseEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
} from "lucide-react";
import { useVideo, formatTime } from "./VideoContext";

export interface VideoPlayerProps {
  id: string;
  src: string;
  poster?: string;
  className?: string;
  onFullscreen?: (currentTime: number) => void;
}

const VideoPlayer = memo(function VideoPlayer({
  id,
  src,
  poster,
  className = "",
  onFullscreen,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const seekBarRef = useRef<HTMLDivElement>(null);
  const volBarRef = useRef<HTMLDivElement>(null);
  const controlsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number>(0);
  const seekDraggingRef = useRef(false);
  const volumeDraggingRef = useRef(false);
  const wasJustSeekingRef = useRef(false);

  // ── Completely Isolated Local State ──
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolumeState] = useState(1);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [localSeekProgress, setLocalSeekProgress] = useState<number | null>(null);

  const { register, notifyPlay, notifyPause } = useVideo();

  // ── Register pause callback with VideoContext ──
  useEffect(() => {
    const unregister = register(id, () => {
      if (videoRef.current && !videoRef.current.paused) {
        videoRef.current.pause();
      }
    });
    return unregister;
  }, [id, register]);

  // ── Smooth 60 FPS progress update loop while playing ──
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

  // ── IntersectionObserver: Auto-pause when scrolled out of viewport ──
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || entry.intersectionRatio < 0.2) {
            if (videoRef.current && !videoRef.current.paused) {
              videoRef.current.pause();
            }
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // ── Auto-hide Controls Logic ──
  const scheduleHideControls = useCallback(() => {
    if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    controlsTimerRef.current = setTimeout(() => {
      if (!seekDraggingRef.current && !volumeDraggingRef.current) {
        setShowControls(false);
      }
    }, 2800);
  }, []);

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

  // ── Toggle Play / Pause ──
  const togglePlay = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) {
      el.play().catch(() => {});
    } else {
      el.pause();
    }
  }, []);

  // Handler for container clicks (ignores clicks resulting from seek/volume dragging)
  const handleContainerClick = useCallback(() => {
    if (wasJustSeekingRef.current) {
      wasJustSeekingRef.current = false;
      return;
    }
    togglePlay();
  }, [togglePlay]);

  // ── Video HTML Event Handlers ──
  const handlePlayEvent = useCallback(() => {
    setIsPlaying(true);
    notifyPlay(id);
    if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    scheduleHideControls();
  }, [id, notifyPlay, scheduleHideControls]);

  const handlePauseEvent = useCallback(() => {
    setIsPlaying(false);
    notifyPause(id);
    setShowControls(true);
  }, [id, notifyPause]);

  const handleEndedEvent = useCallback(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    notifyPause(id);
    setShowControls(true);
  }, [id, notifyPause]);

  const handleTimeUpdateEvent = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    setCurrentTime(el.currentTime);
  }, []);

  const handleLoadedMetadataEvent = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    if (el.duration && isFinite(el.duration) && el.duration > 0) {
      setDuration(el.duration);
    }
    setIsLoading(false);
    setError(null);
  }, []);

  const handleProgressEvent = useCallback(() => {
    const el = videoRef.current;
    if (!el || !el.duration || !isFinite(el.duration)) return;
    if (el.buffered.length > 0) {
      setBuffered(el.buffered.end(el.buffered.length - 1) / el.duration);
    }
  }, []);

  // ── Toggle Mute & Set Volume ──
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

  // ── Robust Seek logic (Preserves Playback State) ──
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

  // ── Draggable Seek Bar ──
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
        // Keep wasJustSeekingRef active through the click event phase
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

  // ── Draggable Volume Bar ──
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

  // ── Keyboard Shortcuts ──
  const handleKeyDown = useCallback(
    (e: ReactKeyboardEvent) => {
      const el = videoRef.current;
      if (!el) return;

      switch (e.key) {
        case " ":
        case "k":
          e.preventDefault();
          togglePlay();
          break;
        case "f":
          e.preventDefault();
          onFullscreen?.(el.currentTime);
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
      }
    },
    [togglePlay, onFullscreen, toggleMute, seekTo, setVolume, volume]
  );

  // Computed Progress percentages strictly for THIS component instance
  const effectiveDuration = (videoRef.current?.duration && isFinite(videoRef.current.duration) && videoRef.current.duration > 0)
    ? videoRef.current.duration
    : duration;

  const actualProgress = effectiveDuration > 0 ? (currentTime / effectiveDuration) * 100 : 0;
  const displayProgress = localSeekProgress !== null ? localSeekProgress : actualProgress;
  const bufferProgress = effectiveDuration > 0 ? buffered * 100 : 0;

  return (
    <div
      ref={containerRef}
      className={`relative group bg-black overflow-hidden select-none outline-none transition-all duration-500 cursor-pointer ${
        isPlaying || isHovered
          ? "ring-1 ring-[#8B5CF6]/50 shadow-[0_0_30px_rgba(139,92,246,0.3)]"
          : ""
      } ${className}`}
      style={{ aspectRatio: "9/16" }}
      tabIndex={0}
      role="region"
      aria-label="Video player"
      onClick={handleContainerClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => {
        setIsHovered(true);
        setShowControls(true);
        setShowVolumeSlider(true);
        if (isPlaying) scheduleHideControls();
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowVolumeSlider(false);
        if (isPlaying) setShowControls(false);
        setHoverTime(null);
      }}
      onKeyDown={handleKeyDown}
    >
      {/* ── Video Element ── */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        preload="metadata"
        playsInline
        muted={isMuted}
        className="absolute inset-0 w-full h-full object-cover"
        onPlay={handlePlayEvent}
        onPause={handlePauseEvent}
        onEnded={handleEndedEvent}
        onTimeUpdate={handleTimeUpdateEvent}
        onLoadedMetadata={handleLoadedMetadataEvent}
        onProgress={handleProgressEvent}
        onWaiting={() => setIsLoading(true)}
        onCanPlay={() => setIsLoading(false)}
        onPlaying={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setError("Failed to load video");
        }}
      />

      {/* ── Gradient Overlay ── */}
      <div
        className={`absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30 pointer-events-none z-10 transition-opacity duration-300 ${
          showControls || !isPlaying ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* ── Loading Spinner ── */}
      {isLoading && (
        <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-2 border-white/10" />
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-white animate-spin" />
          </div>
        </div>
      )}

      {/* ── Error State ── */}
      {error && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/70 pointer-events-none">
          <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center mb-2">
            <span className="text-red-400 text-lg font-bold">!</span>
          </div>
          <p className="text-white/70 text-xs font-inter text-center px-4">{error}</p>
        </div>
      )}

      {/* ── Center Play/Pause Overlay (when paused) ── */}
      {!isPlaying && !isLoading && !error && (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          {/* Subtle pulse glow */}
          <div className="absolute w-20 h-20 rounded-full bg-[#8B5CF6]/20 blur-lg animate-pulse" />
          <div className="relative w-14 h-14 rounded-full bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-all duration-300 group-hover:scale-110 group-hover:bg-white/25 group-hover:shadow-[0_0_50px_rgba(139,92,246,0.8)]">
            <Play className="fill-white text-white ml-1" size={20} />
          </div>
        </div>
      )}

      {/* ── Controls Overlay (pointer-events-none container so clicks reach video) ── */}
      <div
        className={`absolute inset-0 z-40 flex flex-col justify-end pointer-events-none transition-opacity duration-300 ${
          showControls || !isPlaying ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* ── Seek Bar ── */}
        <div className="px-3 pb-1 pt-6 pointer-events-auto">
          {/* Time hover tooltip */}
          {hoverTime !== null && (
            <div
              className="absolute bottom-[68px] bg-black/90 text-white text-[10px] font-mono px-1.5 py-0.5 rounded pointer-events-none z-50 transform -translate-x-1/2 shadow-md border border-white/10"
              style={{
                left: `calc(12px + ${((hoverTime / (effectiveDuration || 1)) * 100)}% * (100% - 24px) / 100)`,
              }}
            >
              {formatTime(hoverTime)}
            </div>
          )}

          {/* Seek track */}
          <div
            ref={seekBarRef}
            className="relative w-full cursor-pointer group/seek"
            style={{ height: "20px", display: "flex", alignItems: "center" }}
            onMouseDown={handleSeekMouseDown}
            onMouseMove={handleSeekHover}
            onMouseLeave={() => setHoverTime(null)}
            role="slider"
            aria-label="Seek"
            aria-valuemin={0}
            aria-valuemax={effectiveDuration}
            aria-valuenow={currentTime}
          >
            <div className="absolute inset-x-0 h-[3px] group-hover/seek:h-[5px] transition-all duration-150 rounded-full overflow-hidden bg-white/20">
              {/* Buffer */}
              <div
                className="absolute top-0 left-0 h-full bg-white/25 rounded-full"
                style={{ width: `${bufferProgress}%` }}
              />
              {/* Progress */}
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] rounded-full transition-none"
                style={{ width: `${displayProgress}%` }}
              />
            </div>
            {/* Thumb dot */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md opacity-0 group-hover/seek:opacity-100 transition-opacity pointer-events-none"
              style={{ left: `calc(${displayProgress}% - 6px)` }}
            />
          </div>
        </div>

        {/* ── Bottom Controls Bar ── */}
        <div className="relative flex items-center justify-between gap-2 px-3 pb-3 pt-0.5 pointer-events-auto">
          {/* Left controls */}
          <div className="flex items-center gap-1">
            {/* Play/Pause Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white hover:bg-white/20 active:scale-90 transition-all duration-150"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause size={15} className="fill-white" />
              ) : (
                <Play size={15} className="fill-white ml-0.5" />
              )}
            </button>

            {/* Volume Button + Expanding Slider */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMute();
                }}
                className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 active:scale-90 transition-all duration-150"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX size={14} />
                ) : (
                  <Volume2 size={14} />
                )}
              </button>

              {/* Volume Slider */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-out ${
                  showVolumeSlider ? "w-16 opacity-100" : "w-0 opacity-0"
                }`}
              >
                <div
                  ref={volBarRef}
                  className="relative w-16 cursor-pointer group/vol"
                  style={{ height: "16px", display: "flex", alignItems: "center" }}
                  onMouseDown={handleVolMouseDown}
                >
                  <div className="absolute inset-x-0 h-[3px] group-hover/vol:h-[4px] transition-all rounded-full overflow-hidden bg-white/20">
                    <div
                      className="absolute top-0 left-0 h-full bg-white rounded-full"
                      style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Current Time / Duration Display */}
            <span className="text-[10px] text-white/70 font-mono tabular-nums ml-1">
              {formatTime(currentTime)}{" "}
              <span className="text-white/30">/</span>{" "}
              {formatTime(effectiveDuration)}
            </span>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-1">
            {/* Fullscreen Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFullscreen?.(currentTime);
              }}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 active:scale-90 transition-all duration-150"
              aria-label="Open fullscreen"
            >
              <Maximize2 size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default VideoPlayer;
