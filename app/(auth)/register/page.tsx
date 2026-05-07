import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import RegisterClient from "./RegisterClient";
import Link from "next/link";
import { Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "Daftar Gratis",
  description: "Buat akun Undanganku dan mulai buat undangan pernikahan digital",
};

export default async function RegisterPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/dashboard");

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-[var(--color-bg)] relative overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[var(--color-primary-light)] blur-[120px] opacity-60 pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[var(--color-primary-light)] blur-[120px] opacity-60 pointer-events-none" />

      <div className="w-full max-w-md relative z-10 py-10">
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
            <h2 className="font-serif text-2xl font-bold mb-2">Buat Akun Gratis</h2>
            <p className="text-[var(--color-text-muted)] text-sm">
              Mulai buat undangan pernikahan impian Anda
            </p>
          </div>

          <RegisterClient />

          <div className="mt-8 pt-6 border-t border-[var(--color-border)] text-center text-sm">
            <p className="text-[var(--color-text-muted)]">
              Sudah punya akun?{" "}
              <Link href="/login" className="font-bold text-[var(--color-primary-dark)] hover:underline">
                Masuk di sini
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
