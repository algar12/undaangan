import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/organisms/DashboardShell";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const userName = user.user_metadata?.full_name ?? user.email ?? "Pengguna";

  return <DashboardShell userName={userName}>{children}</DashboardShell>;
}
