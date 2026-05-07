"use client";

import { useState, useTransition } from "react";
import { MessageCircle, Trash2, Phone, Users, Search, Plus } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { Badge } from "@/components/atoms/Badge";
import { Input } from "@/components/atoms/Input";
import { generateWhatsAppLink, normalizeIndonesianPhone } from "@/features/guests/whatsapp";
import { cn } from "@/lib/utils";
import type { Guest, Invitation } from "@/types";

interface GuestTableProps {
  guests: Guest[];
  invitation: Pick<Invitation, "slug" | "groom_name" | "bride_name">;
  onDelete: (guestId: string) => Promise<void>;
  onAddGuest: () => void;
  invitationUrl: string;
}

export function GuestTable({
  guests,
  invitation,
  onDelete,
  onAddGuest,
  invitationUrl,
}: GuestTableProps) {
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtered = guests.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    (g.phone_number ?? "").includes(search)
  );

  const handleDelete = (id: string) => {
    setDeletingId(id);
    startTransition(async () => {
      await onDelete(id);
      setDeletingId(null);
    });
  };

  const getWhatsAppLink = (guest: Guest) => {
    const phone = guest.phone_number
      ? normalizeIndonesianPhone(guest.phone_number)
      : undefined;
    return generateWhatsAppLink({
      guestName: guest.name,
      invitationUrl,
      groomName: invitation.groom_name,
      brideName: invitation.bride_name,
      phoneNumber: phone,
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: "var(--color-text-subtle)" }}
          />
          <input
            type="search"
            placeholder="Cari nama atau nomor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9 !py-2 text-sm"
            aria-label="Cari tamu"
          />
        </div>
        <Button size="sm" leftIcon={<Plus size={14} />} onClick={onAddGuest}>
          Tambah Tamu
        </Button>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 rounded-2xl" style={{ background: "var(--color-surface-raised)" }}>
          <p className="text-4xl mb-3">👥</p>
          <p className="font-medium" style={{ color: "var(--color-text)" }}>
            {search ? "Tamu tidak ditemukan" : "Belum ada tamu"}
          </p>
          <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>
            {search ? "Coba kata kunci lain" : "Klik tombol 'Tambah Tamu' untuk mulai"}
          </p>
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden border" style={{ borderColor: "var(--color-border)" }}>
          {/* Mobile: card list */}
          <ul className="divide-y sm:hidden" style={{ borderColor: "var(--color-border)" }}>
            {filtered.map((guest) => (
              <li key={guest.id} className="p-4 flex flex-col gap-3" style={{ background: "var(--color-surface)" }}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-sm">{guest.name}</p>
                    {guest.phone_number && (
                      <p className="text-xs mt-0.5 flex items-center gap-1" style={{ color: "var(--color-text-muted)" }}>
                        <Phone size={11} />
                        {guest.phone_number}
                      </p>
                    )}
                  </div>
                  <Badge variant="default">
                    <Users size={10} />
                    {guest.max_pax} kursi
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <a
                    href={getWhatsAppLink(guest)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary text-xs !py-1.5 !px-3 flex-1 text-center"
                    id={`wa-link-${guest.id}`}
                    aria-label={`Kirim undangan WhatsApp ke ${guest.name}`}
                  >
                    <MessageCircle size={12} />
                    Kirim WA
                  </a>
                  <Button
                    variant="danger"
                    size="sm"
                    leftIcon={<Trash2 size={12} />}
                    loading={deletingId === guest.id && isPending}
                    onClick={() => handleDelete(guest.id)}
                    aria-label={`Hapus tamu ${guest.name}`}
                  >
                    Hapus
                  </Button>
                </div>
              </li>
            ))}
          </ul>

          {/* Desktop: table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm" style={{ background: "var(--color-surface)" }}>
              <thead>
                <tr style={{ background: "var(--color-surface-raised)", borderBottom: "1px solid var(--color-border)" }}>
                  {["Nama Tamu", "No. WhatsApp", "Kursi", "Aksi"].map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-xs font-semibold tracking-wide uppercase"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: "var(--color-border)" }}>
                {filtered.map((guest) => (
                  <tr
                    key={guest.id}
                    className="group transition-colors hover:bg-[var(--color-surface-raised)]"
                  >
                    <td className="px-4 py-3 font-medium">{guest.name}</td>
                    <td className="px-4 py-3" style={{ color: "var(--color-text-muted)" }}>
                      {guest.phone_number ?? (
                        <span className="italic text-xs" style={{ color: "var(--color-text-subtle)" }}>
                          Tidak ada nomor
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="default">{guest.max_pax} kursi</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <a
                          href={getWhatsAppLink(guest)}
                          target="_blank"
                          rel="noopener noreferrer"
                          id={`wa-link-desktop-${guest.id}`}
                          className={cn(
                            "inline-flex items-center gap-1.5 px-3 py-1.5",
                            "text-xs font-semibold rounded-full text-white transition-all",
                            "bg-emerald-500 hover:bg-emerald-600 hover:-translate-y-px shadow-sm"
                          )}
                          aria-label={`Kirim undangan WhatsApp ke ${guest.name}`}
                        >
                          <MessageCircle size={12} />
                          Kirim WA
                        </a>
                        <Button
                          variant="danger"
                          size="sm"
                          leftIcon={<Trash2 size={12} />}
                          loading={deletingId === guest.id && isPending}
                          onClick={() => handleDelete(guest.id)}
                          aria-label={`Hapus tamu ${guest.name}`}
                        >
                          Hapus
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <p className="text-xs text-right" style={{ color: "var(--color-text-subtle)" }}>
        {filtered.length} dari {guests.length} tamu
      </p>
    </div>
  );
}
