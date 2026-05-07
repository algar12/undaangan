"use client";

import { useState, useTransition } from "react";
import { Plus, X, Search, Users, Phone, Trash2, MessageCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";
import { FormField } from "@/components/molecules/FormField";
import { Input } from "@/components/atoms/Input";
import { Button } from "@/components/atoms/Button";
import { Badge } from "@/components/atoms/Badge";
import { createGuestSchema, type CreateGuestInput } from "@/features/guests/schemas";
import { generateWhatsAppLink, normalizeIndonesianPhone } from "@/features/guests/whatsapp";
import { cn } from "@/lib/utils";
import type { Guest, Invitation } from "@/types";

interface Props {
  invitation: Pick<Invitation, "id" | "slug" | "groom_name" | "bride_name">;
  initialGuests: Guest[];
  invitationUrl: string;
}

export default function GuestsClient({ invitation, initialGuests, invitationUrl }: Props) {
  const [guests, setGuests] = useState<Guest[]>(initialGuests);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const filteredGuests = guests.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    (g.phone_number ?? "").includes(search)
  );

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm<CreateGuestInput>({
      resolver: zodResolver(createGuestSchema),
      defaultValues: { max_pax: 1 },
    });

  const handleAdd = async (data: CreateGuestInput) => {
    const supabase = createClient();
    
    const insertData = {
      invitation_id: invitation.id,
      name: data.name,
      phone_number: data.phone_number || null,
      email: data.email || null,
      address: data.address || null,
      notes: data.notes || null,
      max_pax: data.max_pax,
    };

    const { data: newGuest, error } = await supabase
      .from("guests")
      .insert([insertData] as any)
      .select()
      .single();
    if (!error && newGuest) {
      setGuests((prev) => [...prev, newGuest as Guest]);
      reset();
      setShowModal(false);
    }
  };

  const handleDelete = async (guestId: string) => {
    setDeletingId(guestId);
    const supabase = createClient();
    const { error } = await supabase.from("guests").delete().eq("id", guestId);
    if (!error) {
      startTransition(() => {
        setGuests((prev) => prev.filter((g) => g.id !== guestId));
        setDeletingId(null);
      });
    } else {
      setDeletingId(null);
    }
  };

  const getWhatsAppLink = (guest: Guest) => {
    const phone = guest.phone_number ? normalizeIndonesianPhone(guest.phone_number) : undefined;
    return generateWhatsAppLink({
      guestName: guest.name,
      invitationUrl,
      groomName: invitation.groom_name,
      brideName: invitation.bride_name,
      phoneNumber: phone,
    });
  };

  return (
    <div className="flex flex-col gap-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <p className="text-[var(--color-primary)] font-bold tracking-widest uppercase text-xs mb-2">Manajemen</p>
          <h1 className="font-serif text-4xl text-[var(--color-text)] mb-2 leading-tight">
            Daftar Tamu
          </h1>
          <p className="text-[var(--color-text-muted)] text-lg">
            {invitation.groom_name} &amp; {invitation.bride_name}
          </p>
        </div>
        <Button leftIcon={<Plus size={18} />} onClick={() => setShowModal(true)} className="py-3 px-6 shadow-md">
          Tambah Tamu
        </Button>
      </div>

      {/* Main Content Area */}
      <div className="modern-card overflow-hidden">
        {/* Toolbar */}
        <div className="p-6 border-b border-[var(--color-border)] bg-[var(--color-surface-hover)]/30 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-subtle)]" size={18} />
            <input
              type="search"
              placeholder="Cari nama atau nomor telepon..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-[#1a1a1a] border border-white/10 rounded-xl text-sm text-white outline-none focus:border-[var(--color-primary)] transition-all"
            />
          </div>
          <div className="text-sm font-medium text-white/70 bg-[#1a1a1a] px-4 py-2.5 rounded-xl border border-white/10 shadow-sm w-full sm:w-auto text-center">
            <span className="text-[var(--color-primary)] font-bold text-lg">{filteredGuests.length}</span> Tamu
          </div>
        </div>

        {/* Guest List */}
        {filteredGuests.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-white/30 mb-6">
              <Users size={32} />
            </div>
            <h3 className="font-serif text-2xl mb-2 text-white">
              {search ? "Tamu Tidak Ditemukan" : "Belum Ada Tamu"}
            </h3>
            <p className="text-white/50 max-w-sm mb-6 text-base font-light">
              {search ? "Coba gunakan kata kunci pencarian yang lain." : "Mulai tambahkan tamu yang akan Anda undang ke acara spesial ini."}
            </p>
            {!search && (
              <Button onClick={() => setShowModal(true)} variant="secondary" className="bg-white/10 text-white hover:bg-white/20 border-none">
                Tambah Tamu Pertama
              </Button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {filteredGuests.map((guest) => (
              <div key={guest.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:bg-white/5 transition-colors">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 rounded-full bg-[var(--color-primary)]/20 text-[var(--color-primary)] border border-[var(--color-primary)]/30 font-serif text-xl flex items-center justify-center shrink-0">
                    {guest.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">{guest.name}</h3>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-white/60">
                      {guest.phone_number ? (
                        <span className="flex items-center gap-1.5"><Phone size={14} className="text-[var(--color-primary)]" /> {guest.phone_number}</span>
                      ) : (
                        <span className="italic text-white/30">Tidak ada nomor</span>
                      )}
                      <span className="w-1 h-1 rounded-full bg-white/20" />
                      <span className="flex items-center gap-1.5 text-white/80 font-medium">
                        <Users size={14} className="text-[var(--color-primary)]" /> {guest.max_pax} Kursi
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <a
                    href={getWhatsAppLink(guest)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#25D366]/10 text-[#075E54] hover:bg-[#25D366] hover:text-white transition-all font-semibold text-sm shadow-sm"
                  >
                    <MessageCircle size={18} /> Kirim WA
                  </a>
                  <button
                    onClick={() => handleDelete(guest.id)}
                    disabled={deletingId === guest.id}
                    className="w-11 h-11 flex items-center justify-center rounded-xl border border-rose-200 text-rose-500 hover:bg-rose-50 hover:border-rose-300 transition-all bg-white shadow-sm disabled:opacity-50"
                    aria-label="Hapus"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

        {/* Modal Tambah Tamu */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
            <div className="relative bg-[#1a1a1a] rounded-3xl p-6 md:p-8 w-full max-w-lg shadow-2xl border border-white/10 animate-in fade-in zoom-in duration-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-serif text-2xl text-white">Tambah Tamu Baru</h3>
              <button
                onClick={() => setShowModal(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--color-surface-hover)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit(handleAdd)} className="flex flex-col gap-5" noValidate>
              <FormField label="Nama Lengkap Tamu" htmlFor="g-name" error={errors.name?.message} required>
                <Input id="g-name" type="text" placeholder="Masukkan nama tamu..." {...register("name")} error={!!errors.name} className="py-3 px-4" />
              </FormField>
              
              <div className="grid grid-cols-2 gap-5">
                <FormField label="No. WhatsApp" htmlFor="g-phone" error={errors.phone_number?.message} hint="Awali dengan +62">
                  <Input id="g-phone" type="tel" placeholder="+6281234567890" {...register("phone_number")} error={!!errors.phone_number} className="py-3 px-4" />
                </FormField>
                <FormField label="Jatah Kursi (Pax)" htmlFor="g-pax" error={errors.max_pax?.message} required>
                  <Input id="g-pax" type="number" min={1} max={20} {...register("max_pax", { valueAsNumber: true })} error={!!errors.max_pax} className="py-3 px-4" />
                </FormField>
              </div>

              <FormField label="Catatan Tambahan" htmlFor="g-notes" error={errors.notes?.message} hint="Opsional (Misal: Teman Kantor, Keluarga, dll)">
                <Input id="g-notes" type="text" placeholder="Masukkan catatan..." {...register("notes")} className="py-3 px-4" />
              </FormField>

              <div className="flex gap-4 mt-4 pt-4 border-t border-[var(--color-border)]">
                <Button type="button" variant="secondary" className="flex-1 bg-[var(--color-surface-hover)] border-none shadow-none" onClick={() => { reset(); setShowModal(false); }}>
                  Batal
                </Button>
                <Button type="submit" loading={isSubmitting} className="flex-1 shadow-lg">
                  Simpan Tamu
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
