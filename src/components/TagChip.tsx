"use client";

import { cn, getSignalColor } from "@/lib/utils";

interface TagChipProps {
  label: string;
  variant?: "signal" | "format" | "neutral";
  size?: "sm" | "md";
  colored?: boolean;
}

export function TagChip({
  label,
  variant = "signal",
  size = "sm",
  colored = true,
}: TagChipProps) {
  const baseStyles =
    "inline-flex items-center font-medium rounded-full whitespace-nowrap";

  const sizeStyles = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
  };

  const getVariantStyles = () => {
    if (variant === "signal" && colored) {
      const color = getSignalColor(label);
      return {
        backgroundColor: `${color}15`,
        color: color,
        border: `1px solid ${color}40`,
      };
    }
    if (variant === "format") {
      return "bg-stone-100 text-stone-600 border border-stone-200";
    }
    return "bg-stone-100 text-stone-500 border border-stone-200";
  };

  const variantStyles = getVariantStyles();

  return (
    <span
      className={cn(baseStyles, sizeStyles[size], typeof variantStyles === "string" ? variantStyles : "")}
      style={typeof variantStyles === "object" ? variantStyles : undefined}
    >
      {label}
    </span>
  );
}

