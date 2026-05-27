"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2, Music } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

interface AudioUploadProps {
  value: string;
  onChange: (url: string) => void;
  className?: string;
  label?: string;
}

export function AudioUpload({ value, onChange, className, label = "Upload Lagu (MP3)" }: AudioUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      // 1. Dapatkan Signed URL dari API (Melewati batas 4.5MB Vercel)
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "get-signed-url", filename: file.name, contentType: file.type }),
      });

      if (!res.ok) throw new Error("Gagal mendapatkan URL unggahan");

      const { signedUrl, token, path, publicUrl } = await res.json();

      // 2. Upload file langsung ke Supabase Storage menggunakan client browser
      const supabase = createClient();
      const { error } = await supabase.storage
        .from("uploads")
        .uploadToSignedUrl(path, token, file);

      if (error) throw error;

      onChange(publicUrl);
    } catch (error) {
      console.error(error);
      alert("Gagal mengunggah lagu. Pastikan ukuran file sesuai batas.");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div className={cn("relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-4 transition-all", 
      value ? "border-[var(--color-primary)]/50 bg-[var(--color-primary)]/5" : "border-white/20 hover:border-white/40 bg-[#121212]",
      className)}>
      
      {value ? (
        <div className="relative w-full flex flex-col items-center justify-center gap-4 py-2">
          <div className="flex items-center gap-3 w-full px-4">
            <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center text-[var(--color-primary)] shrink-0">
              <Music size={20} />
            </div>
            <div className="flex-1 truncate text-sm text-white/80">
              {value.split('/').pop()}
            </div>
            <button
              type="button"
              onClick={() => onChange("")}
              className="w-8 h-8 flex items-center justify-center bg-rose-500/20 hover:bg-rose-500/80 text-rose-400 hover:text-white rounded-full transition-colors shrink-0"
              title="Hapus Lagu"
            >
              <X size={16} />
            </button>
          </div>
          <audio ref={audioRef} controls src={value} className="w-full h-10 outline-none" />
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-32 cursor-pointer">
          {isUploading ? (
            <div className="flex flex-col items-center text-[var(--color-primary)]">
              <Loader2 className="animate-spin mb-2" size={24} />
              <span className="text-sm">Mengunggah...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center text-white/50 hover:text-white/80 transition-colors">
              <Upload className="mb-2" size={24} />
              <span className="text-sm font-medium">{label}</span>
              <span className="text-xs mt-1 opacity-70">MP3, WAV, OGG (Maks. 10MB)</span>
            </div>
          )}
          <input 
            type="file" 
            className="hidden" 
            accept="audio/*"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </label>
      )}
    </div>
  );
}
