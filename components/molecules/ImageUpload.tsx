"use client";

import { useState } from "react";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  className?: string;
  label?: string;
}

export function ImageUpload({ value, onChange, className, label = "Upload Foto" }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("files", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      if (data.urls && data.urls.length > 0) {
        onChange(data.urls[0]);
      }
    } catch (error) {
      console.error(error);
      alert("Gagal mengunggah foto");
    } finally {
      setIsUploading(false);
      // Reset input
      e.target.value = "";
    }
  };

  return (
    <div className={cn("relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-4 transition-all", 
      value ? "border-[var(--color-primary)]/50 bg-[var(--color-primary)]/5" : "border-white/20 hover:border-white/40 bg-[#121212]",
      className)}>
      
      {value ? (
        <div className="relative w-full h-32 flex items-center justify-center overflow-hidden rounded-lg">
          <img src={value} alt="Uploaded" className="object-cover w-full h-full" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-black/60 hover:bg-rose-500/80 text-white rounded-full backdrop-blur transition-colors"
          >
            <X size={16} />
          </button>
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
              <span className="text-xs mt-1 opacity-70">JPG, PNG, WebP (Maks. 5MB)</span>
            </div>
          )}
          <input 
            type="file" 
            className="hidden" 
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </label>
      )}
    </div>
  );
}
