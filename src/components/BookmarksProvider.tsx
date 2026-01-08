"use client";

import { createContext, useContext, ReactNode } from "react";
import { useBookmarks } from "@/hooks/useBookmarks";

type BookmarksContextType = ReturnType<typeof useBookmarks>;

const BookmarksContext = createContext<BookmarksContextType | undefined>(undefined);

export function BookmarksProvider({ children }: { children: ReactNode }) {
  const bookmarks = useBookmarks();

  return (
    <BookmarksContext.Provider value={bookmarks}>
      {children}
    </BookmarksContext.Provider>
  );
}

export function useBookmarksContext() {
  const context = useContext(BookmarksContext);
  if (context === undefined) {
    throw new Error("useBookmarksContext must be used within a BookmarksProvider");
  }
  return context;
}

