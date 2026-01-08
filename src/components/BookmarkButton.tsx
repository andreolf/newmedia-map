"use client";

import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBookmarksContext } from "./BookmarksProvider";

interface BookmarkButtonProps {
  creatorId: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: 16,
  md: 20,
  lg: 24,
};

export function BookmarkButton({
  creatorId,
  size = "md",
  className,
}: BookmarkButtonProps) {
  const { isBookmarked, toggleBookmark } = useBookmarksContext();
  const bookmarked = isBookmarked(creatorId);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleBookmark(creatorId);
      }}
      className={cn(
        "p-1.5 rounded-full transition-all duration-200",
        bookmarked
          ? "text-red-500 hover:text-red-600 bg-red-50 dark:bg-red-950/30"
          : "text-stone-400 hover:text-red-500 hover:bg-stone-100 dark:hover:bg-stone-700",
        className
      )}
      aria-label={bookmarked ? "Remove from saved" : "Save creator"}
    >
      <Heart
        size={sizes[size]}
        className={cn(
          "transition-all duration-200",
          bookmarked && "fill-current"
        )}
      />
    </button>
  );
}
