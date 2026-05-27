import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, ExternalLink, Eye, EyeOff, Calendar, MapPin, Heart } from "lucide-react";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { formatDate } from "@/lib/utils";
import { APP_URL } from "@/lib/constants";
import type { Invitation } from "@/types";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: rawInvitations } = await supabase
    .from("invitations")
    .select("id, slug, bride_name, groom_name, event_date, is_published, created_at, venue_name")
    .order("created_at", { ascending: false });

  type InvRow = Pick<
    Invitation,
    "id" | "slug" | "bride_name" | "groom_name" | "event_date" | "is_published" | "venue_name"
  >;
  const invitations = rawInvitations as unknown as InvRow[] | null;

  return (
    <div className="flex flex-col gap-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-[#1a1a1a] p-8 md:p-12 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden animate-fade-up">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 opacity-[0.03] animate-pulse-soft">
          <Heart size={400} fill="currentColor" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent pointer-events-none" />
        
        <div className="relative z-10">
          <p className="text-[var(--color-primary)] font-bold tracking-[0.2em] uppercase text-xs mb-4">
            Dashboard Utama
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-white mb-4 leading-tight">
            Kisah Anda <br className="hidden md:block" />Dimulai di Sini
          </h1>
          <p className="text-white/60 max-w-md text-lg font-light leading-relaxed">
            Kelola undangan pernikahan digital Anda dengan mudah, elegan, dan penuh makna.
          </p>
        </div>
        <Link href="/dashboard/invitations/new" className="relative z-10 w-full md:w-auto hover:scale-105 transition-transform">
          <Button leftIcon={<Plus size={18} />} className="w-full md:w-auto py-4 px-8 text-sm tracking-widest uppercase shadow-[0_4px_14px_rgba(212,175,55,0.2)] hover:shadow-[0_8px_24px_rgba(212,175,55,0.3)] bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-black font-bold transition-all duration-300">
            Buat Undangan Baru
          </Button>
        </Link>
      </div>

      {/* Invitation list */}
      <div className="animate-fade-up delay-100">
        <h2 className="font-serif text-2xl mb-6 flex items-center gap-3 text-white">
          Undangan Anda
          <span className="text-xs tracking-widest uppercase font-sans font-medium px-3 py-1 bg-white/10 rounded-full text-white/50">
            {invitations?.length || 0} Total
          </span>
        </h2>

        {!invitations || invitations.length === 0 ? (
          <div className="bg-[#1a1a1a] p-16 text-center border border-white/5 rounded-3xl flex flex-col items-center shadow-lg animate-fade-up delay-200">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center text-white/30 mb-6 border border-white/10">
              <Heart size={32} />
            </div>
            <h3 className="font-serif text-2xl mb-3 text-white">
              Belum Ada Undangan
            </h3>
            <p className="text-white/60 max-w-sm mb-8 text-lg font-light">
              Momen spesial Anda layak mendapatkan undangan yang indah. Mari mulai buat sekarang.
            </p>
            <Link href="/dashboard/invitations/new" className="hover:scale-105 transition-transform">
              <Button leftIcon={<Plus size={18} />} className="bg-white/10 text-white hover:bg-white/20 border-white/20 transition-all duration-300">
                Buat Undangan Pertama
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {invitations.map((inv, i) => (
              <div key={inv.id} className="bg-[#1a1a1a] border border-white/5 rounded-3xl flex flex-col overflow-hidden group shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_8px_30px_rgba(212,175,55,0.1)] hover:border-[var(--color-primary-light)] animate-fade-up" style={{ animationDelay: `${(i+2)*100}ms` }}>
                <div className="p-8 pb-6 flex-1 flex flex-col relative">
                  {/* Decorative faint heart */}
                  <Heart className="absolute right-6 top-6 text-white/5 group-hover:scale-110 transition-transform duration-500 group-hover:text-[var(--color-primary-light)]" size={80} />
                  
                  <div className="relative z-10">
                    <Badge variant={inv.is_published ? "success" : "warning"} className="mb-6 px-3 py-1.5 shadow-sm bg-black/40 backdrop-blur-md border border-white/10 transition-colors group-hover:border-[var(--color-primary-light)]">
                      {inv.is_published ? (
                        <> <Eye size={12} className="text-emerald-400" /> <span className="text-emerald-400">Publik</span> </>
                      ) : (
                        <> <EyeOff size={12} className="text-amber-400" /> <span className="text-amber-400">Draft</span> </>
                      )}
                    </Badge>
                    
                    <h3 className="font-serif text-2xl text-white mb-6 leading-snug group-hover:text-[var(--color-primary)] transition-colors">
                      {inv.groom_name} <span className="text-[var(--color-primary)] italic">&amp;</span> {inv.bride_name}
                    </h3>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3 text-sm text-white/60">
                        <div className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-[var(--color-primary)] border border-white/5 group-hover:border-[var(--color-primary-light)] transition-colors">
                          <Calendar size={14} />
                        </div>
                        <span className="font-light tracking-wide">{formatDate(inv.event_date)}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-white/60">
                        <div className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-[var(--color-primary)] border border-white/5 group-hover:border-[var(--color-primary-light)] transition-colors">
                          <MapPin size={14} />
                        </div>
                        <span className="font-light tracking-wide line-clamp-1" title={inv.venue_name}>{inv.venue_name}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-white/5 p-4 bg-black/20 flex items-center justify-between gap-3 group-hover:bg-black/30 transition-colors">
                  <Link href={`/dashboard/invitations/${inv.id}`} className="flex-1">
                    <Button variant="secondary" className="w-full justify-center bg-white/10 hover:bg-white/20 text-white border-none transition-colors">
                      Kelola
                    </Button>
                  </Link>
                  <a
                    href={`${APP_URL}/inv/${inv.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-[var(--color-primary)] border border-white/10 text-white transition-all duration-300 shadow-sm group-hover:border-[var(--color-primary)] hover:scale-110 hover:rotate-12"
                    title="Lihat Undangan"
                  >
                    <ExternalLink size={18} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
