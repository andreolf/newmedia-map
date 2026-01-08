"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "newmediamap_bookmarks";

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load bookmarks from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setBookmarks(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load bookmarks:", e);
    }
    setIsLoaded(true);
  }, []);

  // Save bookmarks to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
      } catch (e) {
        console.error("Failed to save bookmarks:", e);
      }
    }
  }, [bookmarks, isLoaded]);

  const addBookmark = useCallback((creatorId: string) => {
    setBookmarks((prev) => {
      if (prev.includes(creatorId)) return prev;
      return [...prev, creatorId];
    });
  }, []);

  const removeBookmark = useCallback((creatorId: string) => {
    setBookmarks((prev) => prev.filter((id) => id !== creatorId));
  }, []);

  const toggleBookmark = useCallback((creatorId: string) => {
    setBookmarks((prev) => {
      if (prev.includes(creatorId)) {
        return prev.filter((id) => id !== creatorId);
      }
      return [...prev, creatorId];
    });
  }, []);

  const isBookmarked = useCallback(
    (creatorId: string) => bookmarks.includes(creatorId),
    [bookmarks]
  );

  const clearAllBookmarks = useCallback(() => {
    setBookmarks([]);
  }, []);

  return {
    bookmarks,
    isLoaded,
    addBookmark,
    removeBookmark,
    toggleBookmark,
    isBookmarked,
    clearAllBookmarks,
    bookmarkCount: bookmarks.length,
  };
}

