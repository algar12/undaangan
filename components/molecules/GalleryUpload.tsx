"use client";

import { useState } from "react";
import { Upload, X, Loader2, ImagePlus } from "lucide-react";
import { cn } from "@/lib/utils";

interface GalleryUploadProps {
  urls: string[];
  onChange: (urls: string[]) => void;
  className?: string;
}

export function GalleryUpload({ urls, onChange, className }: GalleryUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      if (data.urls && data.urls.length > 0) {
        // Append new URLs to existing ones
        onChange([...urls, ...data.urls]);
      }
    } catch (error) {
      console.error(error);
      alert("Gagal mengunggah foto galeri");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleRemove = (indexToRemove: number) => {
    onChange(urls.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {urls.map((url, idx) => (
          <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group border border-white/10 bg-[#121212]">
            <img src={url} alt={`Gallery ${idx}`} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="w-10 h-10 flex items-center justify-center bg-rose-500 hover:bg-rose-600 text-white rounded-full transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        ))}

        <label className="relative aspect-square flex flex-col items-center justify-center border-2 border-dashed border-white/20 hover:border-white/40 rounded-xl cursor-pointer bg-[#121212] transition-colors group">
          {isUploading ? (
            <div className="flex flex-col items-center text-[var(--color-primary)]">
              <Loader2 className="animate-spin mb-2" size={24} />
              <span className="text-xs">Mengunggah...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center text-white/50 group-hover:text-white/80 transition-colors">
              <ImagePlus className="mb-2" size={28} />
              <span className="text-sm font-medium">Tambah Foto</span>
            </div>
          )}
          <input 
            type="file" 
            className="hidden" 
            accept="image/*"
            multiple
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </label>
      </div>
    </div>
  );
}
