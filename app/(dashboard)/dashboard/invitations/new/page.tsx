"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { ArrowLeft, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils";
import { DEFAULT_THEME_CONFIG } from "@/lib/constants";
import {
  createInvitationSchema,
  type CreateInvitationInput,
} from "@/features/invitations/schemas";
import { FormField } from "@/components/molecules/FormField";
import { Input } from "@/components/atoms/Input";
import { Button } from "@/components/atoms/Button";
import { ImageUpload } from "@/components/molecules/ImageUpload";
import { GalleryUpload } from "@/components/molecules/GalleryUpload";
import { AudioUpload } from "@/components/molecules/AudioUpload";

export default function NewInvitationPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateInvitationInput>({
    resolver: zodResolver(createInvitationSchema),
    defaultValues: {
      event_time: "09:00",
      cover_image_url: "",
      theme_config: DEFAULT_THEME_CONFIG,
    },
  });

  const onSubmit = async (data: CreateInvitationInput) => {
    setServerError(null);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }

    const slug = slugify(`${data.groom_name}-${data.bride_name}-${Date.now()}`);

    const payload = {
      user_id: user.id,
      slug,
      bride_name: data.bride_name,
      groom_name: data.groom_name,
      bride_parents: data.bride_parents || null,
      groom_parents: data.groom_parents || null,
      bride_photo: data.bride_photo || null,
      groom_photo: data.groom_photo || null,
      event_date: data.event_date,
      event_time: `${data.event_time}:00`,
      venue_name: data.venue_name,
      venue_address: data.venue_address,
      venue_maps_url: data.venue_maps_url || null,
      love_story: data.love_story || null,
      gallery_urls: (data as any).gallery_urls || [],
      music_url: (data as any).music_url || null,
      cover_image_url: (data as any).cover_image_url || null,
      theme_config: data.theme_config ?? DEFAULT_THEME_CONFIG,
    };

    const { error } = await supabase.from("invitations").insert([payload] as any);

    if (error) { setServerError(error.message); return; }
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="flex flex-col gap-10 max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm mb-8 transition-colors text-white/50 hover:text-[var(--color-primary)] bg-white/5 px-4 py-2 rounded-full border border-white/10 hover:-translate-x-1"
        >
          <ArrowLeft size={16} /> Kembali
        </Link>
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-full bg-[var(--color-primary)]/20 border border-[var(--color-primary)]/30 text-[var(--color-primary)] flex items-center justify-center">
            <Sparkles size={24} />
          </div>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl text-white leading-tight mb-4">
          Mulai Kisah Anda
        </h1>
        <p className="text-white/60 text-lg max-w-lg mx-auto font-light">
          Isi detail di bawah ini untuk membuat undangan pernikahan digital yang elegan dan memukau.
        </p>
      </div>

      {/* Form card */}
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

        {/* Section: Identitas */}
        <div>
          <h3 className="font-serif text-2xl text-white mb-6 flex items-center gap-3 border-b border-white/10 pb-4">
            <span className="w-8 h-8 rounded-full bg-[var(--color-primary)]/20 text-[var(--color-primary)] border border-[var(--color-primary)]/30 flex items-center justify-center text-sm font-sans font-bold">1</span>
            Identitas Mempelai
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FormField label="Nama Pengantin Pria" htmlFor="groom" error={errors.groom_name?.message} required>
              <Input id="groom" type="text" placeholder="Contoh: Rizky" {...register("groom_name")} error={!!errors.groom_name} className="py-3 px-4 bg-[#121212] border-white/10 text-white placeholder:text-white/30 focus:border-[var(--color-primary)]" />
            </FormField>
            <FormField label="Nama Pengantin Wanita" htmlFor="bride" error={errors.bride_name?.message} required>
              <Input id="bride" type="text" placeholder="Contoh: Salsabila" {...register("bride_name")} error={!!errors.bride_name} className="py-3 px-4 bg-[#121212] border-white/10 text-white placeholder:text-white/30 focus:border-[var(--color-primary)]" />
            </FormField>
            <FormField label="Nama Orang Tua Pria" htmlFor="groom_parents" error={errors.groom_parents?.message} hint="Contoh: Putra dari Bpk. Budi & Ibu Ani">
              <Input id="groom_parents" type="text" placeholder="Putra dari Bpk. ... & Ibu ..." {...register("groom_parents")} error={!!errors.groom_parents} className="py-3 px-4 bg-[#121212] border-white/10 text-white placeholder:text-white/30 focus:border-[var(--color-primary)]" />
            </FormField>
            <FormField label="Nama Orang Tua Wanita" htmlFor="bride_parents" error={errors.bride_parents?.message} hint="Contoh: Putri dari Bpk. Joko & Ibu Siti">
              <Input id="bride_parents" type="text" placeholder="Putri dari Bpk. ... & Ibu ..." {...register("bride_parents")} error={!!errors.bride_parents} className="py-3 px-4 bg-[#121212] border-white/10 text-white placeholder:text-white/30 focus:border-[var(--color-primary)]" />
            </FormField>
            <FormField label="File Foto Pria (Public Path)" htmlFor="groom_photo" error={errors.groom_photo?.message}>
              <ImageUpload 
                value={watch("groom_photo") || ""} 
                onChange={(url) => setValue("groom_photo", url)} 
                label="Unggah Foto Pria"
              />
            </FormField>
            <FormField label="File Foto Wanita (Public Path)" htmlFor="bride_photo" error={errors.bride_photo?.message}>
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
            <span className="w-8 h-8 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary-dark)] flex items-center justify-center text-sm font-sans font-bold">2</span>
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
              <Input id="venue" type="text" placeholder="Contoh: Gedung Serbaguna Graha Indah" {...register("venue_name")} error={!!errors.venue_name} className="py-3 px-4" />
            </FormField>
            <FormField label="Alamat Lengkap" htmlFor="address" error={errors.venue_address?.message} required className="sm:col-span-2">
              <Input id="address" type="text" placeholder="Jl. Contoh No. 123, Kecamatan, Kota" {...register("venue_address")} error={!!errors.venue_address} className="py-3 px-4" />
            </FormField>
            <FormField label="Link Google Maps" htmlFor="maps" error={errors.venue_maps_url?.message} hint="Opsional, akan memudahkan tamu menemukan lokasi acara" className="sm:col-span-2">
              <Input id="maps" type="url" placeholder="https://maps.google.com/..." {...register("venue_maps_url")} error={!!errors.venue_maps_url} className="py-3 px-4" />
            </FormField>
          </div>
        </div>

        {/* Section: Love Story */}
        <div>
          <h3 className="font-serif text-2xl text-[var(--color-text)] mb-6 flex items-center gap-3 border-b border-[var(--color-border)] pb-4">
            <span className="w-8 h-8 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary-dark)] flex items-center justify-center text-sm font-sans font-bold">3</span>
            Kisah Cinta
          </h3>
          <FormField label="Cerita singkat perjalanan cinta Anda" htmlFor="story" error={errors.love_story?.message} hint="Opsional, namun sangat direkomendasikan agar undangan lebih personal">
            <textarea
              id="story"
              rows={5}
              placeholder="Ceritakan bagaimana kalian bertemu, jatuh cinta, dan memutuskan menikah..."
              className="input-field resize-none py-3 px-4 bg-[#121212] border-white/10 text-white placeholder:text-white/30 focus:border-[var(--color-primary)]"
              {...register("love_story")}
            />
          </FormField>
        </div>

        {/* Section: Media & Galeri */}
        <div>
          <h3 className="font-serif text-2xl text-white mb-6 flex items-center gap-3 border-b border-white/10 pb-4">
            <span className="w-8 h-8 rounded-full bg-[var(--color-primary)]/20 text-[var(--color-primary)] border border-[var(--color-primary)]/30 flex items-center justify-center text-sm font-sans font-bold">4</span>
            Media & Galeri
          </h3>
          <div className="flex flex-col gap-8">
            <FormField label="Foto Sampul / Latar Belakang (Cover Image)" htmlFor="cover_image" hint="Pilih foto utama yang akan ditampilkan pada sampul depan undangan">
              <ImageUpload 
                value={watch("cover_image_url" as any) || ""} 
                onChange={(url) => setValue("cover_image_url" as any, url)} 
                label="Unggah Foto Sampul"
              />
            </FormField>

            <FormField label="Lagu Latar (Background Music)" htmlFor="music" hint="Pilih lagu (MP3) yang akan diputar otomatis saat undangan dibuka">
              <AudioUpload 
                value={watch("music_url") || ""} 
                onChange={(url) => setValue("music_url", url)} 
              />
            </FormField>

            <FormField label="Galeri Foto" htmlFor="gallery" hint="Tambahkan foto-foto pre-wedding Anda ke dalam galeri">
              <GalleryUpload 
                urls={watch("gallery_urls" as any) || []}
                onChange={(urls) => setValue("gallery_urls" as any, urls)}
              />
            </FormField>
          </div>
        </div>

        <div className="pt-4 mt-2">
          <Button type="submit" loading={isSubmitting} size="lg" className="w-full text-lg shadow-lg">
            {isSubmitting ? <><Loader2 size={20} className="animate-spin" /> Sedang Membuat...</> : "Buat Undangan Sekarang"}
          </Button>
          <p className="text-center text-xs text-[var(--color-text-muted)] mt-4">
            Anda dapat mengubah semua data ini nanti di menu Pengaturan.
          </p>
        </div>
      </form>
    </div>
  );
}
