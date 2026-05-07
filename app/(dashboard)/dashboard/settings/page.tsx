import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import type { Invitation } from "@/types";
import SettingsClient from "./SettingsClient";

export const metadata: Metadata = { title: "Pengaturan" };

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: rawInvitation } = await supabase
    .from("invitations")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  const invitation = rawInvitation as Invitation | null;

  return (
    <div className="flex flex-col gap-8 max-w-2xl">
      <div>
        <p className="section-label mb-2" style={{ color: "var(--color-primary)" }}>Pengaturan</p>
        <h1 className="font-heading text-3xl sm:text-4xl" style={{ color: "var(--color-text)", fontWeight: 500 }}>
          Pengaturan Undangan
        </h1>
      </div>
      <div className="h-px" style={{ background: "linear-gradient(90deg, rgba(201,168,76,0.3), rgba(201,168,76,0.05))" }} />
      {invitation ? (
        <SettingsClient invitation={invitation} />
      ) : (
        <div
          className="rounded-2xl p-14 text-center"
          style={{ background: "var(--color-surface)", border: "1px dashed rgba(201,168,76,0.25)" }}
        >
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            Buat undangan terlebih dahulu untuk mengakses pengaturan.
          </p>
        </div>
      )}
    </div>
  );
}
