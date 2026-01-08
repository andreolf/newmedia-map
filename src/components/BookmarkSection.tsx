"use client";

import { BookmarkButton } from "./BookmarkButton";
import { useBookmarksContext } from "./BookmarksProvider";

interface BookmarkSectionProps {
  creatorId: string;
}

export function BookmarkSection({ creatorId }: BookmarkSectionProps) {
  const { isBookmarked, toggleBookmark } = useBookmarksContext();

  return (
    <BookmarkButton
      isBookmarked={isBookmarked(creatorId)}
      onToggle={() => toggleBookmark(creatorId)}
      size="lg"
    />
  );
}

