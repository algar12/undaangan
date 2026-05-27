"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Loader2, Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { DEFAULT_THEME_CONFIG } from "@/lib/constants";
import {
  updateInvitationSchema,
  type UpdateInvitationInput,
} from "@/features/invitations/schemas";
import { FormField } from "@/components/molecules/FormField";
import { Input } from "@/components/atoms/Input";
import { Button } from "@/components/atoms/Button";
import { ImageUpload } from "@/components/molecules/ImageUpload";
import { GalleryUpload } from "@/components/molecules/GalleryUpload";
import { AudioUpload } from "@/components/molecules/AudioUpload";

interface EditInvitationClientProps {
  initialData: any;
  invitationId: string;
}

export default function EditInvitationClient({ initialData, invitationId }: EditInvitationClientProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<UpdateInvitationInput>({
    resolver: zodResolver(updateInvitationSchema),
    defaultValues: {
      bride_name: initialData.bride_name,
      groom_name: initialData.groom_name,
      bride_parents: initialData.bride_parents || "",
      groom_parents: initialData.groom_parents || "",
      bride_photo: initialData.bride_photo || "",
      groom_photo: initialData.groom_photo || "",
      event_date: initialData.event_date,
      event_time: initialData.event_time ? initialData.event_time.slice(0, 5) : "09:00",
      venue_name: initialData.venue_name,
      venue_address: initialData.venue_address,
      venue_maps_url: initialData.venue_maps_url || "",
      love_story: initialData.love_story || "",
      gallery_urls: initialData.gallery_urls || [],
      music_url: initialData.music_url || "",
      cover_image_url: initialData.cover_image_url || "",
      theme_config: initialData.theme_config || DEFAULT_THEME_CONFIG,
      is_published: initialData.is_published,
    },
  });

  const onSubmit = async (data: UpdateInvitationInput) => {
    setServerError(null);
    setSuccessMsg(null);
    const supabase = createClient();

    const payload = {
      bride_name: data.bride_name,
      groom_name: data.groom_name,
      bride_parents: data.bride_parents || null,
      groom_parents: data.groom_parents || null,
      bride_photo: data.bride_photo || null,
      groom_photo: data.groom_photo || null,
      event_date: data.event_date,
      event_time: data.event_time ? `${data.event_time}:00` : null,
      venue_name: data.venue_name,
      venue_address: data.venue_address,
      venue_maps_url: data.venue_maps_url || null,
      love_story: data.love_story || null,
      gallery_urls: data.gallery_urls || [],
      music_url: data.music_url || null,
      cover_image_url: data.cover_image_url || null,
      theme_config: data.theme_config ?? DEFAULT_THEME_CONFIG,
      is_published: data.is_published,
    };

    const { error } = await (supabase.from("invitations") as any)
      .update(payload)
      .eq("id", invitationId);

    if (error) { 
      setServerError(error.message); 
      return; 
    }
    
    setSuccessMsg("Undangan berhasil diperbarui.");
    router.refresh();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-[#1a1a1a] rounded-3xl border border-white/10 p-8 sm:p-10 flex flex-col gap-10 relative overflow-hidden shadow-2xl"
      noValidate
    >
      {serverError && (
        <div className="p-4 rounded-xl text-sm bg-rose-500/10 border border-rose-500/20 text-rose-400">
          {serverError}
        </div>
      )}
      
      {successMsg && (
        <div className="p-4 rounded-xl text-sm bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-2">
          <Check size={16} /> {successMsg}
        </div>
      )}

      {/* Section: Publikasi */}
      <div>
        <h3 className="font-serif text-2xl text-white mb-6 flex items-center gap-3 border-b border-white/10 pb-4">
          <span className="w-8 h-8 rounded-full bg-[var(--color-primary)]/20 text-[var(--color-primary)] border border-[var(--color-primary)]/30 flex items-center justify-center text-sm font-sans font-bold">1</span>
          Status Publikasi
        </h3>
        <label className="flex items-center gap-3 cursor-pointer p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-[var(--color-primary)] transition-colors">
          <input type="checkbox" {...register("is_published")} className="w-5 h-5 accent-[var(--color-primary)]" />
          <span className="text-white">Publikasikan Undangan</span>
        </label>
        <p className="text-sm text-white/50 mt-2 ml-4">Centang ini jika undangan Anda sudah siap dibagikan ke tamu.</p>
      </div>

      {/* Section: Identitas */}
      <div>
        <h3 className="font-serif text-2xl text-white mb-6 flex items-center gap-3 border-b border-white/10 pb-4">
          <span className="w-8 h-8 rounded-full bg-[var(--color-primary)]/20 text-[var(--color-primary)] border border-[var(--color-primary)]/30 flex items-center justify-center text-sm font-sans font-bold">2</span>
          Identitas Mempelai
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <FormField label="Nama Pengantin Pria" htmlFor="groom" error={errors.groom_name?.message} required>
            <Input id="groom" type="text" placeholder="Contoh: Rizky" {...register("groom_name")} error={!!errors.groom_name} className="py-3 px-4 bg-[#121212] border-white/10 text-white placeholder:text-white/30 focus:border-[var(--color-primary)]" />
          </FormField>
          <FormField label="Nama Pengantin Wanita" htmlFor="bride" error={errors.bride_name?.message} required>
            <Input id="bride" type="text" placeholder="Contoh: Salsabila" {...register("bride_name")} error={!!errors.bride_name} className="py-3 px-4 bg-[#121212] border-white/10 text-white placeholder:text-white/30 focus:border-[var(--color-primary)]" />
          </FormField>
          <FormField label="Nama Orang Tua Pria" htmlFor="groom_parents" error={errors.groom_parents?.message}>
            <Input id="groom_parents" type="text" placeholder="Putra dari Bpk. ... & Ibu ..." {...register("groom_parents")} error={!!errors.groom_parents} className="py-3 px-4 bg-[#121212] border-white/10 text-white placeholder:text-white/30 focus:border-[var(--color-primary)]" />
          </FormField>
          <FormField label="Nama Orang Tua Wanita" htmlFor="bride_parents" error={errors.bride_parents?.message}>
            <Input id="bride_parents" type="text" placeholder="Putri dari Bpk. ... & Ibu ..." {...register("bride_parents")} error={!!errors.bride_parents} className="py-3 px-4 bg-[#121212] border-white/10 text-white placeholder:text-white/30 focus:border-[var(--color-primary)]" />
          </FormField>
          <FormField label="File Foto Pria" htmlFor="groom_photo" error={errors.groom_photo?.message}>
            <ImageUpload 
              value={watch("groom_photo") || ""} 
              onChange={(url) => setValue("groom_photo", url)} 
              label="Unggah Foto Pria"
            />
          </FormField>
          <FormField label="File Foto Wanita" htmlFor="bride_photo" error={errors.bride_photo?.message}>
            <ImageUpload 
              value={watch("bride_photo") || ""} 
              onChange={(url) => setValue("bride_photo", url)} 
              label="Unggah Foto Wanita"
            />
          </FormField>
        </div>
      </div>

      {/* Section: Acara */}
      <div>
        <h3 className="font-serif text-2xl text-[var(--color-text)] mb-6 flex items-center gap-3 border-b border-[var(--color-border)] pb-4">
          <span className="w-8 h-8 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary-dark)] flex items-center justify-center text-sm font-sans font-bold">3</span>
          Detail Acara
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <FormField label="Tanggal Acara" htmlFor="date" error={errors.event_date?.message} required>
            <Input id="date" type="date" {...register("event_date")} error={!!errors.event_date} className="py-3 px-4" />
          </FormField>
          <FormField label="Waktu Acara" htmlFor="time" error={errors.event_time?.message} required>
            <Input id="time" type="time" {...register("event_time")} error={!!errors.event_time} className="py-3 px-4" />
          </FormField>
          <FormField label="Nama Gedung / Lokasi" htmlFor="venue" error={errors.venue_name?.message} required className="sm:col-span-2">
            <Input id="venue" type="text" placeholder="Contoh: Gedung Serbaguna" {...register("venue_name")} error={!!errors.venue_name} className="py-3 px-4" />
          </FormField>
          <FormField label="Alamat Lengkap" htmlFor="address" error={errors.venue_address?.message} required className="sm:col-span-2">
            <Input id="address" type="text" placeholder="Jl. Contoh No. 123" {...register("venue_address")} error={!!errors.venue_address} className="py-3 px-4" />
          </FormField>
          <FormField label="Link Google Maps" htmlFor="maps" error={errors.venue_maps_url?.message} className="sm:col-span-2">
            <Input id="maps" type="url" placeholder="https://maps.google.com/..." {...register("venue_maps_url")} error={!!errors.venue_maps_url} className="py-3 px-4" />
          </FormField>
        </div>
      </div>

      {/* Section: Love Story */}
      <div>
        <h3 className="font-serif text-2xl text-[var(--color-text)] mb-6 flex items-center gap-3 border-b border-[var(--color-border)] pb-4">
          <span className="w-8 h-8 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary-dark)] flex items-center justify-center text-sm font-sans font-bold">4</span>
          Kisah Cinta
        </h3>
        <FormField label="Cerita singkat perjalanan cinta Anda" htmlFor="story" error={errors.love_story?.message}>
          <textarea
            id="story"
            rows={5}
            className="input-field resize-none py-3 px-4 bg-[#121212] border-white/10 text-white placeholder:text-white/30 focus:border-[var(--color-primary)]"
            {...register("love_story")}
          />
        </FormField>
      </div>

      {/* Section: Media & Galeri */}
      <div>
        <h3 className="font-serif text-2xl text-white mb-6 flex items-center gap-3 border-b border-white/10 pb-4">
          <span className="w-8 h-8 rounded-full bg-[var(--color-primary)]/20 text-[var(--color-primary)] border border-[var(--color-primary)]/30 flex items-center justify-center text-sm font-sans font-bold">5</span>
          Media & Galeri
        </h3>
        <div className="flex flex-col gap-8">
          <FormField label="Foto Sampul / Latar Belakang (Cover Image)" htmlFor="cover_image" hint="Pilih foto utama yang akan ditampilkan pada sampul depan undangan">
            <ImageUpload 
              value={watch("cover_image_url") || ""} 
              onChange={(url) => setValue("cover_image_url", url)} 
              label="Unggah Foto Sampul"
            />
          </FormField>

          <FormField label="Lagu Latar (Background Music)" htmlFor="music">
            <AudioUpload 
              value={watch("music_url") || ""} 
              onChange={(url) => setValue("music_url", url)} 
            />
          </FormField>

          <FormField label="Galeri Foto" htmlFor="gallery">
            <GalleryUpload 
              urls={watch("gallery_urls") || []}
              onChange={(urls) => setValue("gallery_urls", urls)}
            />
          </FormField>
        </div>
      </div>

      <div className="pt-4 mt-2">
        <Button type="submit" loading={isSubmitting} size="lg" className="w-full text-lg shadow-lg">
          {isSubmitting ? <><Loader2 size={20} className="animate-spin" /> Sedang Menyimpan...</> : "Simpan Perubahan"}
        </Button>
      </div>
    </form>
  );
}
