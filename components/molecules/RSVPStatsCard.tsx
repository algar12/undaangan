import { cn } from "@/lib/utils";
import type { RSVPStats } from "@/types";
import { ClipboardList, CheckCircle2, XCircle, Users } from "lucide-react";

interface RSVPStatsCardProps {
  stats: RSVPStats;
  className?: string;
}

interface StatItemProps {
  label: string;
  value: number;
  color: string;
  bg: string;
  icon: React.ReactNode;
}

function StatItem({ label, value, color, bg, icon }: StatItemProps) {
  return (
    <div className={cn("flex flex-col p-6 rounded-2xl border transition-all hover:shadow-md", bg, "border-transparent hover:border-current")}>
      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-white/50", color)}>
        {icon}
      </div>
      <span className={cn("text-4xl font-bold font-sans mb-1", color)}>{value}</span>
      <span className="text-sm font-medium text-[var(--color-text-muted)]">{label}</span>
    </div>
  );
}

export function RSVPStatsCard({ stats, className }: RSVPStatsCardProps) {
  return (
    <div className={cn("grid grid-cols-2 md:grid-cols-4 gap-4", className)}>
      <StatItem
        label="Total Respon"
        value={stats.total}
        color="text-[var(--color-primary)]"
        bg="bg-[var(--color-primary)]/10"
        icon={<ClipboardList size={24} />}
      />
      <StatItem
        label="Akan Hadir"
        value={stats.attending}
        color="text-emerald-400"
        bg="bg-emerald-500/10"
        icon={<CheckCircle2 size={24} />}
      />
      <StatItem
        label="Tidak Hadir"
        value={stats.not_attending}
        color="text-rose-400"
        bg="bg-rose-500/10"
        icon={<XCircle size={24} />}
      />
      <StatItem
        label="Total Kursi"
        value={stats.total_pax}
        color="text-blue-400"
        bg="bg-blue-500/10"
        icon={<Users size={24} />}
      />
    </div>
  );
}
