"use client";

import { useState, useEffect } from "react";
import { MailOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface WelcomeCoverProps {
  groomName: string;
  brideName: string;
  guestName?: string;
  onOpen: () => void;
}

export function WelcomeCover({ groomName, brideName, guestName, onOpen }: WelcomeCoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Block scrolling when cover is active
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
    document.body.style.overflow = "auto";
    setTimeout(() => {
      onOpen();
    }, 1000); // Wait for the fade up animation before fully unmounting/triggering audio
  };

  if (!mounted) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-bg)] transition-all duration-1000",
        isOpen ? "opacity-0 pointer-events-none -translate-y-full" : "opacity-100"
      )}
    >
      <div className="absolute inset-0 bg-[var(--color-primary)] opacity-[0.03] pointer-events-none" />
      <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] max-w-[600px] max-h-[600px] rounded-full bg-[var(--color-primary-light)] blur-[100px] opacity-70 pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[70vw] h-[70vw] max-w-[600px] max-h-[600px] rounded-full bg-[var(--color-primary-light)] blur-[100px] opacity-70 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-lg w-full animate-fade-up">
        <p className="text-[var(--color-primary-dark)] tracking-[0.3em] text-xs font-semibold uppercase mb-8">
          The Wedding Of
        </p>

        <h1 className="font-serif text-5xl md:text-6xl text-[var(--color-text)] mb-6">
          {groomName} &amp; {brideName}
        </h1>

        <div className="w-16 h-px bg-[var(--color-border)] my-6" />

        <p className="text-sm font-medium text-[var(--color-text-muted)] mb-2">Kepada Yth. Bapak/Ibu/Saudara/i</p>
        <h2 className="font-serif text-2xl text-[var(--color-text)] mb-10">
          {guestName || "Tamu Undangan"}
        </h2>

        <button
          onClick={handleOpen}
          className="btn-primary flex items-center gap-2 shadow-lg hover:shadow-xl text-base px-8 py-3"
        >
          <MailOpen size={18} /> Buka Undangan
        </button>
      </div>
    </div>
  );
}
