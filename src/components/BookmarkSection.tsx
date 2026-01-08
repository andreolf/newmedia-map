"use client";

import { BookmarkButton } from "./BookmarkButton";

interface BookmarkSectionProps {
  creatorId: string;
}

export function BookmarkSection({ creatorId }: BookmarkSectionProps) {
  return <BookmarkButton creatorId={creatorId} size="lg" />;
}
