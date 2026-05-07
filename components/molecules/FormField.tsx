"use client";

import { cn } from "@/lib/utils";

interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function FormField({
  label,
  htmlFor,
  error,
  hint,
  required,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label
        htmlFor={htmlFor}
        className="text-sm font-medium"
        style={{ color: "var(--color-text)" }}
      >
        {label}
        {required && (
          <span className="ml-1" style={{ color: "var(--color-error)" }} aria-hidden="true">
            *
          </span>
        )}
      </label>
      {children}
      {hint && !error && (
        <p className="text-xs" style={{ color: "var(--color-text-subtle)" }}>
          {hint}
        </p>
      )}
      {error && (
        <p
          role="alert"
          className="text-xs flex items-center gap-1"
          style={{ color: "var(--color-error)" }}
        >
          <span aria-hidden="true">⚠</span>
          {error}
        </p>
      )}
    </div>
  );
}
