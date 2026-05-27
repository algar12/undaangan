import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import EditInvitationClient from "./EditInvitationClient";
import { ArrowLeft, Edit3, Settings } from "lucide-react";
import Link from "next/link";
import { APP_URL } from "@/lib/constants";

export const metadata: Metadata = { title: "Edit Undangan" };

export default async function EditInvitationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data } = await supabase
    .from("invitations")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  const invitation = data as any;

  if (!invitation) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-10 max-w-3xl mx-auto animate-fade-up">
      {/* Header */}
      <div className="text-center">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm mb-8 transition-colors text-white/50 hover:text-[var(--color-primary)] bg-white/5 px-4 py-2 rounded-full border border-white/10 hover:-translate-x-1"
        >
          <ArrowLeft size={16} /> Kembali ke Dashboard
        </Link>
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-full bg-[var(--color-primary)]/20 border border-[var(--color-primary)]/30 text-[var(--color-primary)] flex items-center justify-center relative shadow-[0_0_15px_rgba(212,175,55,0.2)]">
            <Edit3 size={24} />
          </div>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl text-white leading-tight mb-4">
          Edit Undangan
        </h1>
        <p className="text-white/60 text-lg max-w-lg mx-auto font-light mb-6">
          Ubah detail undangan pernikahan digital Anda di sini.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href={`${APP_URL}/inv/${invitation.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary py-2 px-6"
          >
            Lihat Undangan
          </a>
          <Link
            href={`/dashboard/settings`}
            className="btn-ghost py-2 px-4"
          >
            <Settings size={18} />
            Pengaturan Tema
          </Link>
        </div>
      </div>

      <EditInvitationClient initialData={invitation} invitationId={id} />
    </div>
  );
}
