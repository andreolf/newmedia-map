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
    sm: "px-2.5 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
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
      return "bg-[--muted] text-[--muted-foreground] border border-[--border]";
    }
    return "bg-[--muted] text-[--muted-foreground] border border-[--border]";
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
