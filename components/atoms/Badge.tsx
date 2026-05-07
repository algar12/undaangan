import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "success" | "danger" | "warning" | "info" | "gold";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variants: Record<BadgeVariant, string> = {
  default: "bg-white/5 text-white/60 border border-white/10",
  success: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  danger: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
  warning: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  info: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  gold: "bg-[var(--color-primary-light)]/20 text-[var(--color-primary)] border border-[var(--color-primary)]/30",
};

export function Badge({ variant = "default", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-0.5",
        "text-xs font-medium rounded-full whitespace-nowrap",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
