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
          ? "text-[#ff3366] bg-[#ff3366]/20"
          : "text-[--muted-foreground] hover:text-[#ff3366] hover:bg-[--muted]",
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
