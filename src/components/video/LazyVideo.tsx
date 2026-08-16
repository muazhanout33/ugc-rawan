"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";

const VideoPlayer = dynamic(
  () => import("@/components/video/VideoPlayer"),
  { ssr: false, loading: () => null }
);

interface LazyVideoProps {
  id: string;
  src: string;
  poster?: string;
  className?: string;
  onFullscreen?: (currentTime: number) => void;
}

export default function LazyVideo({
  id,
  src,
  poster,
  className = "",
  onFullscreen,
}: LazyVideoProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShouldLoad(true);
          io.disconnect();
        }
      },
      // Start loading ~600px before the card enters the viewport
      { rootMargin: "600px 0px" }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (!shouldLoad) {
    return (
      <div
        ref={ref}
        className={`relative bg-[#130D22] overflow-hidden ${className}`}
        style={{ aspectRatio: "9/16" }}
        aria-hidden="true"
      >
        {poster ? (
          <Image
            src={poster}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
          />
        ) : null}
      </div>
    );
  }

  return (
    <div ref={ref} className={className}>
      <VideoPlayer
        id={id}
        src={src}
        poster={poster}
        className="rounded-2xl"
        onFullscreen={onFullscreen}
      />
    </div>
  );
}