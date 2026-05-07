import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import LoginClient from "./LoginClient";
import Link from "next/link";
import { Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "Masuk",
  description: "Masuk ke akun Undanganku Anda",
};

export default async function LoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/dashboard");

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-[var(--color-bg)] relative overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-[var(--color-primary-light)] blur-[100px] opacity-60 pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-[var(--color-primary-light)] blur-[100px] opacity-60 pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <Link href="/" className="flex flex-col items-center gap-3 mb-8 group hover:scale-105 transition-transform">
          <div className="w-14 h-14 rounded-3xl bg-[var(--color-primary-light)] text-[var(--color-primary-dark)] flex items-center justify-center shadow-sm">
            <Heart size={28} fill="currentColor" />
          </div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-[var(--color-text)]">
            Undanganku
          </h1>
        </Link>

        <div className="modern-card p-8 sm:p-10">
          <div className="text-center mb-8">
            <h2 className="font-serif text-2xl font-bold mb-2">Selamat Datang Kembali</h2>
            <p className="text-[var(--color-text-muted)] text-sm">
              Masuk untuk mengelola undangan Anda
            </p>
          </div>

          <LoginClient />

          <div className="mt-8 pt-6 border-t border-[var(--color-border)] text-center text-sm">
            <p className="text-[var(--color-text-muted)]">
              Belum punya akun?{" "}
              <Link href="/register" className="font-bold text-[var(--color-primary-dark)] hover:underline">
                Buat Akun Gratis
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
