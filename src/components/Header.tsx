"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Compass, Users, Heart, Plus, Globe, MapPin, Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { useBookmarksContext } from "./BookmarksProvider";
import { AuthButton } from "./AuthButton";

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isCreatorsPage = pathname === "/creators" || pathname.startsWith("/creators/");
  const isChaptersPage = pathname === "/chapters" || pathname.startsWith("/chapters/");
  const isNearYouPage = pathname === "/near-you";
  const isBookmarksPage = pathname === "/bookmarks";
  const isSubmitPage = pathname === "/submit";
  const { bookmarkCount, isLoaded } = useBookmarksContext();

  const navItems = [
    { href: "/creators", label: "Directory", icon: Users, active: isCreatorsPage },
    { href: "/chapters", label: "Chapters", icon: Globe, active: isChaptersPage },
    { href: "/near-you", label: "Near You", icon: MapPin, active: isNearYouPage },
    { href: "/bookmarks", label: "Saved", icon: Heart, active: isBookmarksPage, badge: isLoaded && bookmarkCount > 0 ? bookmarkCount : null },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md border-b border-stone-200 dark:border-stone-700">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-stone-900 to-stone-700 dark:from-stone-100 dark:to-stone-300 flex items-center justify-center">
              <Compass size={18} className="text-white dark:text-stone-900" />
            </div>
            <span className="font-semibold text-stone-900 dark:text-stone-100 group-hover:text-stone-700 dark:group-hover:text-stone-300 transition-colors hidden sm:inline">
              New Media Map
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors relative",
                  item.active
                    ? "bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                    : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-50 dark:hover:bg-stone-800"
                )}
              >
                <item.icon size={16} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {item.badge > 9 ? "9+" : item.badge}
                  </span>
                )}
              </Link>
            ))}

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
              <span>Submit</span>
            </Link>
            
            <div className="border-l border-stone-200 dark:border-stone-700 h-6 mx-2" />
            
            <AuthButton variant="compact" />
            
            <ThemeToggle />
          </nav>

          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/submit"
              className="flex items-center justify-center w-9 h-9 bg-blue-600 text-white rounded-lg"
            >
              <Plus size={18} />
            </Link>
            
            <ThemeToggle />
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex items-center justify-center w-9 h-9 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-stone-200 dark:border-stone-700">
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors relative",
                    item.active
                      ? "bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                      : "text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800"
                  )}
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                      {item.badge > 9 ? "9+" : item.badge}
                    </span>
                  )}
                </Link>
              ))}
              
              <div className="border-t border-stone-200 dark:border-stone-700 my-2" />
              
              <div className="px-3 py-2">
                <AuthButton variant="default" />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
