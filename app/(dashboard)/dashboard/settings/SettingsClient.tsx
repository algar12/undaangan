"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, ExternalLink, Trash2, Save, Settings2, HeartCrack } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { FormField } from "@/components/molecules/FormField";
import { Input } from "@/components/atoms/Input";
import { Button } from "@/components/atoms/Button";
import { ImageUpload } from "@/components/molecules/ImageUpload";
import { GalleryUpload } from "@/components/molecules/GalleryUpload";
import { AudioUpload } from "@/components/molecules/AudioUpload";
import { updateInvitationSchema, type UpdateInvitationInput } from "@/features/invitations/schemas";
import { APP_URL } from "@/lib/constants";
import type { Invitation, ThemeConfig } from "@/types";

interface Props { invitation: Invitation }

export default function SettingsClient({ invitation }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const theme = invitation.theme_config as unknown as ThemeConfig;

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } =
    useForm<UpdateInvitationInput>({
      resolver: zodResolver(updateInvitationSchema),
      defaultValues: {
        bride_name: invitation.bride_name,
        groom_name: invitation.groom_name,
        bride_parents: invitation.bride_parents ?? "",
        groom_parents: invitation.groom_parents ?? "",
        bride_photo: invitation.bride_photo ?? "",
        groom_photo: invitation.groom_photo ?? "",
        event_date: invitation.event_date,
        event_time: invitation.event_time.slice(0, 5),
        venue_name: invitation.venue_name,
        venue_address: invitation.venue_address,
        venue_maps_url: invitation.venue_maps_url ?? "",
        love_story: invitation.love_story ?? "",
        music_url: invitation.music_url ?? "",
        // We will store comma-separated URLs for the gallery input
        // @ts-ignore
        gallery_string: invitation.gallery_urls?.join(",\n") ?? "",
        theme_config: theme,
      },
    });

  const onSubmit = async (data: any) => {
    setError(null);
    setSuccess(false);
    
    // Process gallery string into array
    const gallery_urls = data.gallery_string
      ? data.gallery_string.split(",").map((s: string) => s.trim()).filter(Boolean)
      : [];

    const payload = {
      ...data,
      event_time: `${data.event_time}:00`,
      gallery_urls,
    };
    delete payload.gallery_string;

    const supabase = createClient();
    const { error } = await supabase
      .from("invitations")
      .update(payload as never)
      .eq("id", invitation.id);
    if (error) { setError(error.message); return; }
    setSuccess(true);
    router.refresh();
  };

  const togglePublish = async () => {
    setPublishing(true);
    const supabase = createClient();
    await supabase
      .from("invitations")
      .update({ is_published: !invitation.is_published } as never)
      .eq("id", invitation.id);
    setPublishing(false);
    router.refresh();
  };

  const invitationUrl = `${APP_URL}/inv/${invitation.slug}`;

  return (
    <div className="flex flex-col gap-10">
      
      {/* Header */}
      <div>
        <p className="text-[var(--color-primary)] font-bold tracking-widest uppercase text-xs mb-2">Konfigurasi</p>
        <h1 className="font-serif text-4xl text-[var(--color-text)] mb-2 leading-tight">
          Pengaturan
        </h1>
        <p className="text-[var(--color-text-muted)] text-lg">
          Sesuaikan detail undangan Anda di sini.
        </p>
      </div>

      <div className="modern-card overflow-hidden">
        
        {/* Status Publikasi */}
        <div className="p-8 border-b border-[var(--color-border)] bg-[var(--color-surface-hover)]/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold text-[var(--color-text)] mb-1 flex items-center gap-2">
              Status Undangan: 
              <span className={`px-3 py-1 rounded-full text-xs uppercase tracking-wider ${invitation.is_published ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                {invitation.is_published ? "Publik" : "Draft"}
              </span>
            </h3>
            <p className="text-sm text-[var(--color-text-muted)]">
              {invitation.is_published
                ? "Undangan Anda sudah bisa diakses oleh tamu."
                : "Undangan belum bisa dilihat oleh tamu."}
            </p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {invitation.is_published && (
              <a href={invitationUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary w-full sm:w-auto text-sm px-4">
                <ExternalLink size={16} /> Buka Undangan
              </a>
            )}
            <Button
              variant={invitation.is_published ? "secondary" : "primary"}
              loading={publishing}
              onClick={togglePublish}
              leftIcon={invitation.is_published ? <EyeOff size={16} /> : <Eye size={16} />}
              className="w-full sm:w-auto text-sm px-4"
            >
              {invitation.is_published ? "Sembunyikan" : "Publikasikan"}
            </Button>
          </div>
        </div>

        {/* Form Edit */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-8 flex flex-col gap-8" noValidate>
          
          {error && (
            <div className="p-4 rounded-xl text-sm bg-rose-50 border border-rose-200 text-rose-600">
              {error}
            </div>
          )}
          {success && (
            <div className="p-4 rounded-xl text-sm bg-emerald-50 border border-emerald-200 text-emerald-700">
              ✓ Perubahan berhasil disimpan!
            </div>
          )}

          <div>
            <h4 className="font-serif text-2xl text-[var(--color-text)] mb-6 flex items-center gap-2">
              <Settings2 size={24} className="text-[var(--color-primary)]" />
              Detail Pengantin
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FormField label="Nama Pengantin Pria" htmlFor="s-groom" error={errors.groom_name?.message} required>
                <Input id="s-groom" type="text" {...register("groom_name")} error={!!errors.groom_name} className="py-3 px-4 bg-[#121212] border-white/10 text-white" />
              </FormField>
              <FormField label="Nama Pengantin Wanita" htmlFor="s-bride" error={errors.bride_name?.message} required>
                <Input id="s-bride" type="text" {...register("bride_name")} error={!!errors.bride_name} className="py-3 px-4 bg-[#121212] border-white/10 text-white" />
              </FormField>
              <FormField label="Nama Orang Tua Pria" htmlFor="s-groom_parents" error={errors.groom_parents?.message}>
                <Input id="s-groom_parents" type="text" {...register("groom_parents")} error={!!errors.groom_parents} className="py-3 px-4 bg-[#121212] border-white/10 text-white" />
              </FormField>
              <FormField label="Nama Orang Tua Wanita" htmlFor="s-bride_parents" error={errors.bride_parents?.message}>
                <Input id="s-bride_parents" type="text" {...register("bride_parents")} error={!!errors.bride_parents} className="py-3 px-4 bg-[#121212] border-white/10 text-white" />
              </FormField>
              <FormField label="Foto Pria" htmlFor="s-groom_photo" error={errors.groom_photo?.message}>
                <ImageUpload 
                  value={watch("groom_photo") || ""} 
                  onChange={(url) => setValue("groom_photo", url)} 
                  label="Unggah Foto Pria"
                />
              </FormField>
              <FormField label="Foto Wanita" htmlFor="s-bride_photo" error={errors.bride_photo?.message}>
                <ImageUpload 
                  value={watch("bride_photo") || ""} 
                  onChange={(url) => setValue("bride_photo", url)} 
                  label="Unggah Foto Wanita"
                />
              </FormField>
            </div>
          </div>

          <div className="h-px bg-[var(--color-border)]" />

          <div>
            <h4 className="font-serif text-2xl text-[var(--color-text)] mb-6 flex items-center gap-2">
              <Settings2 size={24} className="text-[var(--color-primary)]" />
              Media & Galeri
            </h4>
            <div className="flex flex-col gap-6">
              <FormField label="Lagu Latar (Background Music)" htmlFor="s-music" hint="Pilih lagu (MP3) yang akan diputar otomatis saat undangan dibuka">
                <AudioUpload 
                  value={watch("music_url") || ""} 
                  onChange={(url) => setValue("music_url", url)} 
                />
              </FormField>
              <FormField label="Galeri Foto" htmlFor="s-gallery" hint="Tambahkan foto-foto pre-wedding Anda ke dalam galeri">
                <GalleryUpload 
                  urls={watch("gallery_string" as any) ? (watch("gallery_string" as any) as string).split(",").map(s => s.trim()).filter(Boolean) : []}
                  onChange={(urls) => setValue("gallery_string" as any, urls.join(","))}
                />
              </FormField>
            </div>
          </div>

          <div className="h-px bg-[var(--color-border)]" />

          <div>
            <h4 className="font-serif text-2xl text-[var(--color-text)] mb-6">Waktu & Tempat</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FormField label="Tanggal" htmlFor="s-date" error={errors.event_date?.message} required>
                <Input id="s-date" type="date" {...register("event_date")} error={!!errors.event_date} className="py-3 px-4" />
              </FormField>
              <FormField label="Waktu" htmlFor="s-time" error={errors.event_time?.message} required>
                <Input id="s-time" type="time" {...register("event_time")} error={!!errors.event_time} className="py-3 px-4" />
              </FormField>
              <FormField label="Nama Gedung" htmlFor="s-venue" error={errors.venue_name?.message} required className="sm:col-span-2">
                <Input id="s-venue" type="text" {...register("venue_name")} error={!!errors.venue_name} className="py-3 px-4" />
              </FormField>
              <FormField label="Alamat Lengkap" htmlFor="s-addr" error={errors.venue_address?.message} required className="sm:col-span-2">
                <Input id="s-addr" type="text" {...register("venue_address")} error={!!errors.venue_address} className="py-3 px-4" />
              </FormField>
              <FormField label="Link Google Maps" htmlFor="s-maps" error={errors.venue_maps_url?.message} hint="Opsional" className="sm:col-span-2">
                <Input id="s-maps" type="url" {...register("venue_maps_url")} error={!!errors.venue_maps_url} className="py-3 px-4" />
              </FormField>
            </div>
          </div>

          <div className="h-px bg-[var(--color-border)]" />

          <div>
            <h4 className="font-serif text-2xl text-[var(--color-text)] mb-6">Kisah Cinta</h4>
            <FormField label="Cerita singkat perjalanan cinta kalian" htmlFor="s-story" error={errors.love_story?.message} hint="Opsional">
              <textarea id="s-story" rows={4} className="input-field resize-none py-3 px-4" {...register("love_story")} />
            </FormField>
          </div>

          <div className="pt-4 flex justify-end">
            <Button type="submit" loading={isSubmitting} leftIcon={<Save size={18} />} className="w-full sm:w-auto shadow-lg px-8">
              Simpan Perubahan
            </Button>
          </div>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="rounded-3xl p-8 border border-rose-200 bg-rose-50/50 mt-4">
        <h3 className="font-serif text-2xl text-rose-700 mb-2 flex items-center gap-2">
          <HeartCrack size={24} /> Zona Berbahaya
        </h3>
        <p className="text-rose-600/80 mb-6 max-w-2xl">
          Menghapus undangan bersifat permanen. Semua data tamu, RSVP, dan konfigurasi akan hilang secara permanen dan tidak dapat dikembalikan.
        </p>
        <Button
          variant="danger"
          leftIcon={<Trash2 size={18} />}
          className="bg-rose-600 hover:bg-rose-700 text-white shadow-md"
          onClick={async () => {
            if (!confirm("Peringatan: Tindakan ini tidak bisa dibatalkan! Yakin ingin menghapus undangan ini?")) return;
            const supabase = createClient();
            await supabase.from("invitations").delete().eq("id", invitation.id);
            router.push("/dashboard");
            router.refresh();
          }}
        >
          Hapus Undangan Permanen
        </Button>
      </div>
    </div>
  );
}
