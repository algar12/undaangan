"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Smartphone, Users, PaintBucket, Menu, X } from "lucide-react";

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  return (
    <main className="min-h-screen text-[var(--color-text)]">
      {/* ══════ NAVBAR ══════ */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--color-border)] bg-[#121212]/70 backdrop-blur-xl shadow-sm transition-all duration-300">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-[#D4AF37] font-serif text-2xl font-bold tracking-wider">
              Undanganku
            </span>
          </Link>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-[var(--color-text-muted)] hover:text-white transition-colors">
              Masuk
            </Link>
            <Link href="/register" className="btn-primary">
              Buat Undangan
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button 
            className="md:hidden text-[var(--color-text-muted)] hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 right-0 bg-[#1a1a1a]/95 backdrop-blur-2xl border-b border-[var(--color-border)] p-6 flex flex-col gap-4 shadow-2xl">
            <Link 
              href="/login" 
              className="text-base font-medium text-[var(--color-text-muted)] hover:text-white transition-colors p-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Masuk
            </Link>
            <Link 
              href="/register" 
              className="btn-primary w-full justify-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Buat Undangan
            </Link>
          </div>
        )}
      </nav>

      {/* ══════ HERO ══════ */}
      <section className="relative pt-40 pb-20 px-6 min-h-[90vh] flex flex-col items-center justify-center text-center overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--color-gold-600)] rounded-full blur-[120px] opacity-[0.07] pointer-events-none" />
        
        <div className="relative z-10 max-w-4xl mx-auto animate-fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--color-border-gold)] bg-[rgba(212,175,55,0.05)] text-[var(--color-gold-400)] text-xs font-semibold tracking-widest uppercase mb-8">
            <Sparkles size={14} />
            Premium Digital Invitation
          </div>
          
          <h1 className="font-serif text-5xl md:text-7xl mb-6 leading-tight">
            Bagikan Momen Bahagia dengan <span className="text-gold italic">Elegan & Sempurna</span>
          </h1>
          
          <p className="text-[var(--color-text-muted)] text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Buat undangan pernikahan digital premium dalam hitungan menit. Desain eksklusif, fitur lengkap, dan pengalaman yang memukau untuk tamu istimewa Anda.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="btn-primary w-full sm:w-auto text-base px-8 py-4">
              Mulai Buat Undangan <ArrowRight size={18} />
            </Link>
            <Link href="#features" className="btn-secondary w-full sm:w-auto text-base px-8 py-4">
              Lihat Fitur
            </Link>
          </div>
        </div>
      </section>

      {/* ══════ FEATURES ══════ */}
      <section id="features" className="py-24 px-6 border-t border-[var(--color-border)] relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-up">
            <h2 className="font-serif text-4xl md:text-5xl mb-4">Dirancang untuk Kesempurnaan</h2>
            <p className="text-[var(--color-text-muted)]">Semua yang Anda butuhkan dalam satu platform</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Desain Mewah",
                desc: "Template eksklusif dengan tipografi premium.",
                icon: <PaintBucket className="text-[var(--color-gold-500)]" size={24} />
              },
              {
                title: "RSVP & Buku Tamu",
                desc: "Kelola konfirmasi kehadiran dan kumpulkan doa dari tamu dalam satu dashboard.",
                icon: <Users className="text-[var(--color-gold-500)]" size={24} />
              },
              {
                title: "Ramah Mobile",
                desc: "Tampilan sempurna dan interaktif di berbagai ukuran layar smartphone tamu Anda.",
                icon: <Smartphone className="text-[var(--color-gold-500)]" size={24} />
              }
            ].map((feat, i) => (
              <div key={i} className="glass-panel-gold p-8 rounded-2xl animate-fade-up" style={{ animationDelay: `${(i+1)*100}ms` }}>
                <div className="w-12 h-12 rounded-full bg-[rgba(212,175,55,0.1)] flex items-center justify-center mb-6 border border-[var(--color-border-gold)]">
                  {feat.icon}
                </div>
                <h3 className="font-serif text-2xl mb-3">{feat.title}</h3>
                <p className="text-[var(--color-text-muted)] leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ CTA ══════ */}
      <section className="py-24 px-6 border-t border-[var(--color-border)] relative overflow-hidden">
        <div className="absolute inset-0 bg-gold-gradient opacity-[0.05]" />
        
        <div className="relative z-10 max-w-3xl mx-auto text-center animate-fade-up">
          <h2 className="font-serif text-4xl md:text-5xl mb-6">Mulai Kisah Anda Hari Ini</h2>
          <p className="text-[var(--color-text-muted)] text-lg mb-10">
            Bergabung dengan ratusan pasangan lainnya dan buat undangan yang tak terlupakan.
          </p>
          <Link href="/register" className="btn-primary text-base px-10 py-4">
            Buat Undangan Gratis
          </Link>
        </div>
      </section>

      {/* ══════ FOOTER ══════ */}
      <footer className="py-8 border-t border-[var(--color-border)] text-center text-sm text-[var(--color-text-muted)]">
        <p>&copy; {new Date().getFullYear()} Undanganku. Crafted with love for special moments.</p>
      </footer>
    </main>
  );
}
