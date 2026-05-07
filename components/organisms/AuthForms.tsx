"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Mail, Lock, User, Eye, EyeOff, AlertCircle } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { FormField } from "@/components/molecules/FormField";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

const registerSchema = loginSchema
  .extend({
    full_name: z.string().min(2, "Nama minimal 2 karakter"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Password tidak cocok",
    path: ["confirmPassword"],
  });

type LoginInput = z.infer<typeof loginSchema>;
type RegisterInput = z.infer<typeof registerSchema>;

// ============================================================
// LOGIN FORM
// ============================================================
interface LoginFormProps {
  onSubmit: (data: LoginInput) => Promise<void>;
  error?: string | null;
}

export function LoginForm({ onSubmit, error }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
      {error && (
        <div role="alert" className="p-4 rounded-xl text-sm flex items-start gap-3 bg-rose-50 text-rose-600 border border-rose-200">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <FormField label="Email" htmlFor="login-email" error={errors.email?.message} required>
        <Input
          id="login-email"
          type="email"
          placeholder="nama@email.com"
          autoComplete="email"
          error={!!errors.email}
          leftAddon={<Mail size={18} className="text-[var(--color-text-subtle)]" />}
          {...register("email")}
        />
      </FormField>

      <FormField label="Password" htmlFor="login-password" error={errors.password?.message} required>
        <Input
          id="login-password"
          type={showPassword ? "text" : "password"}
          placeholder="••••••••"
          autoComplete="current-password"
          error={!!errors.password}
          leftAddon={<Lock size={18} className="text-[var(--color-text-subtle)]" />}
          rightAddon={
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
              className="text-[var(--color-text-subtle)] hover:text-[var(--color-text)] transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          }
          {...register("password")}
        />
      </FormField>

      <Button type="submit" loading={isSubmitting} className="w-full mt-2 shadow-md">
        Masuk ke Akun
      </Button>
    </form>
  );
}

// ============================================================
// REGISTER FORM
// ============================================================
interface RegisterFormProps {
  onSubmit: (data: RegisterInput) => Promise<void>;
  error?: string | null;
}

export function RegisterForm({ onSubmit, error }: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
      {error && (
        <div role="alert" className="p-4 rounded-xl text-sm flex items-start gap-3 bg-rose-50 text-rose-600 border border-rose-200">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <FormField label="Nama Lengkap" htmlFor="reg-name" error={errors.full_name?.message} required>
        <Input
          id="reg-name"
          type="text"
          placeholder="Nama Anda"
          autoComplete="name"
          error={!!errors.full_name}
          leftAddon={<User size={18} className="text-[var(--color-text-subtle)]" />}
          {...register("full_name")}
        />
      </FormField>

      <FormField label="Email" htmlFor="reg-email" error={errors.email?.message} required>
        <Input
          id="reg-email"
          type="email"
          placeholder="nama@email.com"
          autoComplete="email"
          error={!!errors.email}
          leftAddon={<Mail size={18} className="text-[var(--color-text-subtle)]" />}
          {...register("email")}
        />
      </FormField>

      <FormField label="Password" htmlFor="reg-password" error={errors.password?.message} required hint="Minimal 6 karakter">
        <Input
          id="reg-password"
          type={showPassword ? "text" : "password"}
          placeholder="••••••••"
          autoComplete="new-password"
          error={!!errors.password}
          leftAddon={<Lock size={18} className="text-[var(--color-text-subtle)]" />}
          rightAddon={
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="text-[var(--color-text-subtle)] hover:text-[var(--color-text)] transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          }
          {...register("password")}
        />
      </FormField>

      <FormField label="Konfirmasi Password" htmlFor="reg-confirm" error={errors.confirmPassword?.message} required>
        <Input
          id="reg-confirm"
          type={showPassword ? "text" : "password"}
          placeholder="••••••••"
          autoComplete="new-password"
          error={!!errors.confirmPassword}
          leftAddon={<Lock size={18} className="text-[var(--color-text-subtle)]" />}
          {...register("confirmPassword")}
        />
      </FormField>

      <Button type="submit" loading={isSubmitting} className="w-full mt-2 shadow-md">
        Buat Akun Sekarang
      </Button>
    </form>
  );
}
