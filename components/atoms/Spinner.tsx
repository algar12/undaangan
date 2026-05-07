import { cn } from "@/lib/utils";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: "w-4 h-4 border-2",
  md: "w-8 h-8 border-2",
  lg: "w-12 h-12 border-3",
};

export function Spinner({ size = "md", className }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label="Memuat..."
      className={cn(
        "rounded-full border-[var(--color-border)] border-t-[var(--color-primary)] animate-spin",
        sizes[size],
        className
      )}
    />
  );
}

export function PageSpinner() {
  return (
    <div className="min-h-dvh flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" />
        <p className="text-sm animate-pulse" style={{ color: "var(--color-text-muted)" }}>
          Memuat...
        </p>
      </div>
    </div>
  );
}
