"use client";

import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookmarkButtonProps {
  isBookmarked: boolean;
  onToggle: () => void;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: 16,
  md: 20,
  lg: 24,
};

export function BookmarkButton({
  isBookmarked,
  onToggle,
  size = "md",
  className,
}: BookmarkButtonProps) {
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle();
      }}
      className={cn(
        "p-1.5 rounded-full transition-all duration-200",
        isBookmarked
          ? "text-red-500 hover:text-red-600 bg-red-50 dark:bg-red-950/30"
          : "text-stone-400 hover:text-red-500 hover:bg-stone-100 dark:hover:bg-stone-700",
        className
      )}
      aria-label={isBookmarked ? "Remove from saved" : "Save creator"}
    >
      <Heart
        size={sizes[size]}
        className={cn(
          "transition-all duration-200",
          isBookmarked && "fill-current"
        )}
      />
    </button>
  );
}

