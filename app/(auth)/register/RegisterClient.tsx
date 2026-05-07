"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { RegisterForm } from "@/components/organisms/AuthForms";

export default function RegisterClient() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (data: {
    email: string;
    password: string;
    full_name: string;
    confirmPassword: string;
  }) => {
    setError(null);
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: { data: { full_name: data.full_name } },
    });
    if (authError) {
      setError(
        authError.message.includes("already registered")
          ? "Email sudah terdaftar. Silakan masuk atau gunakan email lain."
          : authError.message
      );
      return;
    }
    router.push("/dashboard");
    router.refresh();
  };

  return <RegisterForm onSubmit={handleRegister} error={error} />;
}
