"use client";

import { type ComponentProps } from "react";
import { useFormStatus } from "react-dom";

export function SaveButton({ label, pendingLabel, variant = "primary", className = "", disabled, ...rest }: ButtonProps) {
  const { pending } = useFormStatus();
  const base = "inline-flex items-center justify-center rounded-lg border px-4 py-2 text-sm font-medium transition";
  const palette =
    variant === "danger"
      ? "border-aurora-rose/50 bg-aurora-rose/10 text-aurora-rose hover:bg-aurora-rose/20 disabled:opacity-60"
      : "border-aurora-teal/50 bg-aurora-teal/20 text-white hover:bg-aurora-teal/30 disabled:opacity-60";

  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className={`${base} ${palette} ${className}`.trim()}
      {...rest}
    >
      {pending ? pendingLabel : label}
    </button>
  );
}

type ButtonProps = {
  label: string;
  pendingLabel: string;
  variant?: "primary" | "danger";
  className?: string;
  disabled?: boolean;
} & Omit<ComponentProps<"button">, "type">;
