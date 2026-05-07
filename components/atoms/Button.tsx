"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "ghost" | "danger" | "secondary";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "btn-primary",
  ghost: "btn-ghost",
  secondary: [
    "inline-flex items-center justify-center gap-2",
    "px-5 py-2.5 rounded-full font-medium text-sm",
    "transition-all duration-200",
    "bg-[var(--color-surface-raised)] text-[var(--color-text)]",
    "border border-[var(--color-border)]",
    "hover:bg-[var(--color-border)] hover:-translate-y-px",
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
  ].join(" "),
  danger: [
    "inline-flex items-center justify-center gap-2",
    "px-5 py-2.5 rounded-full font-semibold text-sm text-white",
    "bg-red-600 hover:bg-red-700 transition-all duration-200",
    "hover:-translate-y-0.5 shadow-sm hover:shadow-md",
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
  ].join(" "),
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "!px-3.5 !py-1.5 !text-xs",
  md: "",
  lg: "!px-7 !py-3.5 !text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      leftIcon,
      rightIcon,
      children,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {loading ? (
          <span
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"
            aria-hidden="true"
          />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        {children}
        {!loading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";
