"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Compass, Users, Heart, Plus, Globe, MapPin } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { useBookmarksContext } from "./BookmarksProvider";
import { AuthButton } from "./AuthButton";

export function Header() {
  const pathname = usePathname();
  const isCreatorsPage = pathname === "/creators" || pathname.startsWith("/creators/");
  const isChaptersPage = pathname === "/chapters" || pathname.startsWith("/chapters/");
  const isNearYouPage = pathname === "/near-you";
  const isBookmarksPage = pathname === "/bookmarks";
  const isSubmitPage = pathname === "/submit";
  const { bookmarkCount, isLoaded } = useBookmarksContext();

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md border-b border-stone-200 dark:border-stone-700">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-stone-900 to-stone-700 dark:from-stone-100 dark:to-stone-300 flex items-center justify-center">
              <Compass size={18} className="text-white dark:text-stone-900" />
            </div>
            <span className="font-semibold text-stone-900 dark:text-stone-100 group-hover:text-stone-700 dark:group-hover:text-stone-300 transition-colors">
              New Media Map
            </span>
          </Link>

          <nav className="flex items-center gap-1">
            <Link
              href="/creators"
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isCreatorsPage
                  ? "bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-50 dark:hover:bg-stone-800"
              )}
            >
              <Users size={16} />
              <span className="hidden sm:inline">Directory</span>
            </Link>

            <Link
              href="/chapters"
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isChaptersPage
                  ? "bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-50 dark:hover:bg-stone-800"
              )}
            >
              <Globe size={16} />
              <span className="hidden md:inline">Chapters</span>
            </Link>

            <Link
              href="/near-you"
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isNearYouPage
                  ? "bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-50 dark:hover:bg-stone-800"
              )}
            >
              <MapPin size={16} />
              <span className="hidden md:inline">Near You</span>
            </Link>

            <Link
              href="/submit"
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isSubmitPage
                  ? "bg-blue-600 text-white"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              )}
            >
              <Plus size={16} />
              <span className="hidden sm:inline">Submit Profile</span>
            </Link>

            <Link
              href="/bookmarks"
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors relative",
                isBookmarksPage
                  ? "bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-50 dark:hover:bg-stone-800"
              )}
            >
              <Heart size={16} />
              <span className="hidden lg:inline">Saved</span>
              {isLoaded && bookmarkCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {bookmarkCount > 9 ? "9+" : bookmarkCount}
                </span>
              )}
            </Link>
            
            <div className="hidden sm:block border-l border-stone-200 dark:border-stone-700 h-6 mx-2" />
            
            <div className="hidden sm:flex items-center gap-1">
              <AuthButton variant="compact" />
            </div>
            
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
