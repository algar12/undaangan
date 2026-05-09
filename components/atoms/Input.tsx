"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, leftAddon, rightAddon, className, ...props }, ref) => {
    if (leftAddon || rightAddon) {
      return (
        <div className="relative flex items-center">
          {leftAddon && (
            <span
              className="absolute left-3 text-[var(--color-text-subtle)] pointer-events-none"
              aria-hidden="true"
            >
              {leftAddon}
            </span>
          )}
          <input
            ref={ref}
            className={cn(
              "input-field",
              error && "error",
              leftAddon && "!pl-11",
              rightAddon && "!pr-11",
              className
            )}
            {...props}
          />
          {rightAddon && (
            <span
              className="absolute right-3 text-[var(--color-text-subtle)]"
              aria-hidden="true"
            >
              {rightAddon}
            </span>
          )}
        </div>
      );
    }

    return (
      <input
        ref={ref}
        className={cn("input-field", error && "error", className)}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

// Textarea variant
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ error, className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "input-field resize-none min-h-[100px]",
          error && "error",
          className
        )}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";
