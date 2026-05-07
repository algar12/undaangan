import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import type { Invitation, RSVPResponse, RSVPStats } from "@/types";
import { Badge } from "@/components/atoms/Badge";
import { RSVPStatsCard } from "@/components/molecules/RSVPStatsCard";
import { formatDate } from "@/lib/utils";
import { RSVP_STATUS_LABELS } from "@/lib/constants";
import { ClipboardList, MessageSquare } from "lucide-react";

export const metadata: Metadata = { title: "RSVP" };

export default async function RSVPPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: rawInvitation } = await supabase
    .from("invitations")
    .select("id, groom_name, bride_name")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  const invitation = rawInvitation as Pick<Invitation, "id" | "groom_name" | "bride_name"> | null;

  if (!invitation) {
    return (
      <div className="flex flex-col gap-10">
        <div>
          <p className="text-[var(--color-primary)] font-bold tracking-widest uppercase text-xs mb-2">Laporan</p>
          <h1 className="font-serif text-4xl text-[var(--color-text)] mb-2 leading-tight">Data RSVP</h1>
        </div>
        <div className="modern-card p-16 text-center flex flex-col items-center">
          <div className="w-20 h-20 bg-[var(--color-surface-hover)] rounded-full flex items-center justify-center text-[var(--color-text-subtle)] mb-6">
            <ClipboardList size={32} />
          </div>
          <h3 className="font-serif text-2xl mb-2 text-[var(--color-text)]">Belum Ada Undangan</h3>
          <p className="text-[var(--color-text-muted)] max-w-sm mb-6 text-base">
            Buat undangan terlebih dahulu untuk mulai menerima konfirmasi kehadiran dari tamu Anda.
          </p>
        </div>
      </div>
    );
  }

  const { data: rawResponses } = await supabase
    .from("rsvp_responses")
    .select("id, guest_name, status, pax_count, message, responded_at")
    .eq("invitation_id", invitation.id)
    .order("responded_at", { ascending: false });

  const responses = (rawResponses ?? []) as Pick<RSVPResponse, "id" | "guest_name" | "status" | "pax_count" | "message" | "responded_at">[];

  const stats: RSVPStats = {
    total: responses.length,
    attending: responses.filter((r) => r.status === "attending").length,
    not_attending: responses.filter((r) => r.status === "not_attending").length,
    maybe: responses.filter((r) => r.status === "maybe").length,
    total_pax: responses.filter((r) => r.status === "attending").reduce((sum, r) => sum + r.pax_count, 0),
  };

  const statusVariant = {
    attending: "success",
    not_attending: "danger",
    maybe: "warning",
  } as const;

  return (
    <div className="flex flex-col gap-10">
      {/* Header */}
      <div>
        <p className="text-[var(--color-primary)] font-bold tracking-widest uppercase text-xs mb-2">Laporan</p>
        <h1 className="font-serif text-4xl text-[var(--color-text)] mb-2 leading-tight">
          Data Kehadiran
        </h1>
        <p className="text-[var(--color-text-muted)] text-lg">
          {invitation.groom_name} &amp; {invitation.bride_name}
        </p>
      </div>

      {/* Stats */}
      <RSVPStatsCard stats={stats} />

      {/* Response list */}
      <div className="modern-card overflow-hidden">
        <div className="p-6 border-b border-[var(--color-border)] bg-[var(--color-surface-hover)]/30">
          <h2 className="font-serif text-2xl font-bold text-[var(--color-text)]">Riwayat Konfirmasi</h2>
        </div>

        {responses.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-[var(--color-surface-hover)] rounded-full flex items-center justify-center text-[var(--color-primary)] mb-6">
              <MessageSquare size={32} />
            </div>
            <h3 className="font-serif text-2xl mb-2 text-[var(--color-text)]">Belum Ada Respon</h3>
            <p className="text-[var(--color-text-muted)] max-w-sm text-base">
              Tamu akan muncul di sini secara otomatis setelah mereka mengisi form RSVP di halaman undangan Anda.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--color-border)]">
            {responses.map((r) => (
              <div key={r.id} className="p-6 flex flex-col md:flex-row gap-6 hover:bg-[var(--color-surface-hover)]/30 transition-colors">
                {/* User Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-[var(--color-text)]">{r.guest_name}</h3>
                    <Badge variant={statusVariant[r.status]} className="px-3 py-1 text-xs uppercase tracking-wider">{RSVP_STATUS_LABELS[r.status]}</Badge>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[var(--color-text-muted)] font-medium mb-3">
                    <span className="text-[var(--color-primary-dark)] bg-[var(--color-primary-light)] px-2 py-0.5 rounded-md">{r.pax_count} Orang</span>
                    <span className="w-1 h-1 rounded-full bg-[var(--color-border)]" />
                    <span>{formatDate(r.responded_at.split("T")[0])}</span>
                  </div>
                  {r.message && (
                    <div className="bg-[var(--color-surface-hover)] rounded-xl p-4 relative">
                      <MessageSquare className="absolute top-4 left-4 text-[var(--color-border)]" size={24} />
                      <p className="text-sm italic text-[var(--color-text-muted)] leading-relaxed pl-10">
                        &ldquo;{r.message}&rdquo;
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
