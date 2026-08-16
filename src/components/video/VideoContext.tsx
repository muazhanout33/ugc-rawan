"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";

/* ───────── Types ───────── */

interface VideoContextValue {
  /** Register a player's pause callback. Returns an unregister function. */
  register: (id: string, pauseFn: () => void) => () => void;
  /** Notify context that player with `id` started playing. Automatically pauses all other players. */
  notifyPlay: (id: string) => void;
  /** Notify context that player with `id` paused. */
  notifyPause: (id: string) => void;
  /** Active playing video ID */
  activeId: string | null;
}

const VideoContext = createContext<VideoContextValue | null>(null);

/* ───────── Provider ───────── */

export function VideoProvider({ children }: { children: ReactNode }) {
  // Map of registered player IDs to their pause callbacks
  const registryRef = useRef<Map<string, () => void>>(new Map());
  const [activeId, setActiveId] = useState<string | null>(null);

  const register = useCallback((id: string, pauseFn: () => void) => {
    registryRef.current.set(id, pauseFn);
    return () => {
      registryRef.current.delete(id);
    };
  }, []);

  const notifyPlay = useCallback((id: string) => {
    setActiveId(id);
    // Pause all other registered players immediately
    registryRef.current.forEach((pauseFn, registeredId) => {
      if (registeredId !== id) {
        try {
          pauseFn();
        } catch {
          // Ignore if element is unmounted or threw
        }
      }
    });
  }, []);

  const notifyPause = useCallback((id: string) => {
    setActiveId((curr) => (curr === id ? null : curr));
  }, []);

  return (
    <VideoContext.Provider
      value={{
        register,
        notifyPlay,
        notifyPause,
        activeId,
      }}
    >
      {children}
    </VideoContext.Provider>
  );
}

/* ───────── Hook ───────── */

export function useVideo() {
  const ctx = useContext(VideoContext);
  if (!ctx) {
    throw new Error("useVideo must be used within VideoProvider");
  }
  return ctx;
}

/* ───────── Helpers ───────── */

export function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0 || isNaN(seconds)) return "0:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }
  return `${m}:${s.toString().padStart(2, "0")}`;
}
