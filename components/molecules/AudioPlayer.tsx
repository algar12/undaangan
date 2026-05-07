"use client";

import { useEffect, useRef, useState } from "react";
import { Disc3, Pause } from "lucide-react";
import { cn } from "@/lib/utils";

interface AudioPlayerProps {
  musicUrl: string;
  isPlaying: boolean;
}

export function AudioPlayer({ musicUrl, isPlaying }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().then(() => setIsAudioPlaying(true)).catch(() => setIsAudioPlaying(false));
    } else if (!isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsAudioPlaying(false);
    }
  }, [isPlaying]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isAudioPlaying) {
      audioRef.current.pause();
      setIsAudioPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsAudioPlaying(true)).catch(() => setIsAudioPlaying(false));
    }
  };

  return (
    <>
      <audio ref={audioRef} src={musicUrl} loop className="hidden" />
      <button
        onClick={togglePlay}
        className={cn(
          "fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-500",
          isAudioPlaying ? "bg-[var(--color-primary)] animate-spin-slow" : "bg-[var(--color-text-muted)]"
        )}
        style={{ animationDuration: "4s" }}
        aria-label="Toggle Music"
      >
        {isAudioPlaying ? <Disc3 size={24} /> : <Pause size={24} />}
      </button>
    </>
  );
}
