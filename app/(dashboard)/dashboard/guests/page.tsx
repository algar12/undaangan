import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import type { Guest, Invitation } from "@/types";
import { APP_URL } from "@/lib/constants";
import GuestsClient from "./GuestsClient";

export const metadata: Metadata = { title: "Daftar Tamu" };

export default async function GuestsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Ambil undangan milik user (pakai yang pertama / terbaru)
  const { data: rawInvitation } = await supabase
    .from("invitations")
    .select("id, slug, groom_name, bride_name")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  const invitation = rawInvitation as Pick<Invitation, "id" | "slug" | "groom_name" | "bride_name"> | null;

  if (!invitation) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <p className="section-label mb-2" style={{ color: "var(--color-primary)" }}>Daftar Tamu</p>
          <h1 className="font-heading text-3xl sm:text-4xl" style={{ color: "var(--color-text)", fontWeight: 500 }}>
            Daftar Tamu
          </h1>
        </div>
        <div
          className="rounded-2xl p-14 text-center"
          style={{ background: "var(--color-surface)", border: "1px dashed rgba(201,168,76,0.25)" }}
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)", color: "var(--color-primary)", fontSize: "1.5rem" }}
          >
            ✦
          </div>
          <h2 className="font-heading text-xl mb-2" style={{ color: "var(--color-text)", fontWeight: 500 }}>
            Belum Ada Undangan
          </h2>
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            Buat undangan terlebih dahulu sebelum menambahkan tamu.
          </p>
        </div>
      </div>
    );
  }

  const { data: rawGuests } = await supabase
    .from("guests")
    .select("*")
    .eq("invitation_id", invitation.id)
    .order("created_at", { ascending: true });

  const guests = (rawGuests ?? []) as Guest[];
  const invitationUrl = `${APP_URL}/inv/${invitation.slug}`;

  return (
    <GuestsClient
      invitation={invitation}
      initialGuests={guests}
      invitationUrl={invitationUrl}
    />
  );
}
