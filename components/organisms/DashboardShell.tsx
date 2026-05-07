"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Settings,
  LogOut,
  Menu,
  X,
  Heart
} from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  matchExact?: boolean;
}

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} />, matchExact: true },
  { href: "/dashboard/guests", label: "Daftar Tamu", icon: <Users size={18} /> },
  { href: "/dashboard/rsvp", label: "RSVP", icon: <BookOpen size={18} /> },
  { href: "/dashboard/settings", label: "Pengaturan", icon: <Settings size={18} /> },
];

interface DashboardShellProps {
  children: React.ReactNode;
  userName?: string | null;
}

export function DashboardShell({ children, userName }: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const isActive = (item: NavItem) =>
    item.matchExact ? pathname === item.href : pathname.startsWith(item.href);

  return (
    <div className="min-h-screen flex flex-col bg-[#121212] text-white font-sans">
      {/* ══════ TOP NAVIGATION (DESKTOP) ══════ */}
      <header className="sticky top-0 z-40 w-full bg-[#1A1A1A]/90 backdrop-blur-xl border-b border-white/10 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-white group-hover:scale-105 transition-transform border border-white/20">
              <Heart size={20} className="text-white" />
            </div>
            <span className="font-serif text-2xl font-bold tracking-tight text-white">
              Undanganku
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 bg-[#222] p-1.5 rounded-full border border-white/10">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300",
                  isActive(item)
                    ? "bg-white text-black shadow-sm"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop User/Logout */}
          <div className="hidden md:flex items-center gap-4">
            {userName && (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs text-white/50">Selamat datang,</p>
                  <p className="text-sm font-bold text-white">{userName}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center font-bold shadow-md border border-white/10">
                  {userName.charAt(0).toUpperCase()}
                </div>
              </div>
            )}
            <div className="w-px h-8 bg-white/10 mx-1" />
            <button
              onClick={handleLogout}
              className="p-2.5 rounded-full text-white/60 hover:bg-rose-500/20 hover:text-rose-400 transition-colors"
              aria-label="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 rounded-xl bg-white/5 text-white border border-white/10"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* ══════ MOBILE NAVIGATION ══════ */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-30 pt-20 bg-[#121212]/95 backdrop-blur-md">
          <nav className="flex flex-col p-6 gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-4 px-6 py-4 rounded-2xl text-base font-semibold transition-all border border-transparent",
                  isActive(item)
                    ? "bg-white/10 text-white border-white/20 shadow-sm"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
            <div className="h-px bg-white/10 my-4" />
            <button
              onClick={handleLogout}
              className="flex items-center gap-4 px-6 py-4 rounded-2xl text-base font-semibold text-rose-400 hover:bg-rose-500/10"
            >
              <LogOut size={20} />
              Keluar Akun
            </button>
          </nav>
        </div>
      )}

      {/* ══════ MAIN CONTENT ══════ */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-12">
        <div className="animate-float-up">
          {children}
        </div>
      </main>
    </div>
  );
}
