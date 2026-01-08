"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { CreatorListItem } from "@/components/CreatorListItem";
import { useBookmarksContext } from "@/components/BookmarksProvider";
import creatorsData from "@/data/creators.json";
import { Creator } from "@/types";
import { Heart, ArrowLeft, Trash2 } from "lucide-react";

const allCreators = creatorsData as Creator[];

export default function BookmarksPage() {
  const { bookmarks, isLoaded, clearAllBookmarks } = useBookmarksContext();

  const bookmarkedCreators = useMemo(() => {
    return bookmarks
      .map((id) => allCreators.find((c) => c.id === id))
      .filter((c): c is Creator => c !== undefined);
  }, [bookmarks]);

  if (!isLoaded) {
    return (
      <div className="h-screen flex flex-col bg-stone-50 dark:bg-stone-900">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-stone-400">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-stone-50 dark:bg-stone-900">
      <Header />

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-6">
            <Link
              href="/creators"
              className="inline-flex items-center gap-2 text-sm text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 mb-4"
            >
              <ArrowLeft size={16} />
              Back to directory
            </Link>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/30 flex items-center justify-center">
                  <Heart size={20} className="text-red-500" />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100">
                    Saved Creators
                  </h1>
                  <p className="text-sm text-stone-500 dark:text-stone-400">
                    {bookmarkedCreators.length} creator{bookmarkedCreators.length !== 1 ? "s" : ""} saved
                  </p>
                </div>
              </div>

              {bookmarkedCreators.length > 0 && (
                <button
                  onClick={clearAllBookmarks}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm text-stone-500 dark:text-stone-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                >
                  <Trash2 size={16} />
                  Clear all
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          {bookmarkedCreators.length > 0 ? (
            <div className="bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700 overflow-hidden">
              {bookmarkedCreators.map((creator) => (
                <CreatorListItem key={creator.id} creator={creator} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700">
              <Heart size={48} className="mx-auto text-stone-300 dark:text-stone-600 mb-4" />
              <h2 className="text-lg font-medium text-stone-700 dark:text-stone-300 mb-2">
                No saved creators yet
              </h2>
              <p className="text-stone-500 dark:text-stone-400 mb-4">
                Click the heart icon on any creator to save them here.
              </p>
              <Link
                href="/creators"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Explore creators
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

