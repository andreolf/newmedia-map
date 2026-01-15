"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Radio, Users, Heart, Plus, Globe, MapPin, Menu, X, Calendar, Building2 } from "lucide-react";
import { useBookmarksContext } from "./BookmarksProvider";
import { AuthButton } from "./AuthButton";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isCreatorsPage = pathname === "/creators" || pathname.startsWith("/creators/");
  const isChaptersPage = pathname === "/chapters" || pathname.startsWith("/chapters/");
  const isEventsPage = pathname === "/events" || pathname.startsWith("/events/");
  const isNearYouPage = pathname === "/near-you";
  const isCompaniesPage = pathname === "/companies";
  const isBookmarksPage = pathname === "/bookmarks";
  const isSubmitPage = pathname === "/submit";
  const { bookmarkCount, isLoaded } = useBookmarksContext();

  const navItems = [
    { href: "/creators", label: "Creators", icon: Users, active: isCreatorsPage },
    { href: "/chapters", label: "Chapters", icon: Globe, active: isChaptersPage },
    { href: "/events", label: "Events", icon: Calendar, active: isEventsPage },
    { href: "/near-you", label: "Near You", icon: MapPin, active: isNearYouPage },
    { href: "/bookmarks", label: "Saved", icon: Heart, active: isBookmarksPage, badge: isLoaded && bookmarkCount > 0 ? bookmarkCount : null },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[--background]/80 backdrop-blur-xl border-b border-[--border]">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00ff88] to-[#6366f1] flex items-center justify-center shadow-lg shadow-[#00ff88]/20">
              <Radio size={18} className="text-[#0a0a0f]" />
            </div>
            <span className="font-display font-bold text-[--foreground] group-hover:text-[#00ff88] transition-colors hidden sm:inline">
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
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all relative",
                  item.active
                    ? "bg-[--card] text-[#00ff88] border border-[#00ff88]/30"
                    : "text-[--muted-foreground] hover:text-[--foreground] hover:bg-[--card]"
                )}
              >
                <item.icon size={16} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#ff3366] text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {item.badge > 9 ? "9+" : item.badge}
                  </span>
                )}
              </Link>
            ))}

            <Link
              href="/submit"
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ml-2",
                isSubmitPage
                  ? "bg-[#00ff88] text-[#0a0a0f] glow-accent"
                  : "bg-[#00ff88] text-[#0a0a0f] hover:bg-[#00cc6f] glow-accent"
              )}
            >
              <Plus size={16} />
              <span>Submit</span>
            </Link>
            
            <div className="border-l border-[--border] h-6 mx-3" />
            
            <ThemeToggle />
            <AuthButton variant="compact" />
          </nav>

          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/submit"
              className="flex items-center justify-center w-10 h-10 bg-[#00ff88] text-[#0a0a0f] rounded-xl glow-accent"
            >
              <Plus size={18} />
            </Link>
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex items-center justify-center w-10 h-10 text-[--muted-foreground] hover:text-[--foreground] hover:bg-[--card] rounded-xl transition-colors"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[--border]">
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all relative",
                    item.active
                      ? "bg-[--card] text-[#00ff88] border border-[#00ff88]/30"
                      : "text-[--muted-foreground] hover:text-[--foreground] hover:bg-[--card]"
                  )}
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto px-2 py-0.5 bg-[#ff3366] text-white text-xs font-bold rounded-full">
                      {item.badge > 9 ? "9+" : item.badge}
                    </span>
                  )}
                </Link>
              ))}
              
              <div className="border-t border-[--border] my-3" />
              
              <div className="px-4 py-2">
                <AuthButton variant="default" />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
