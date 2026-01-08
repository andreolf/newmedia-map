"use client";

import { useEffect, useState } from "react";
import { Sparkles, Trophy, Star, Flame } from "lucide-react";
import { Creator } from "@/types";

interface DiscoveryBadgeProps {
  creator: Creator;
}

// Simulated discovery time (in production, would be tracked per user)
function getDiscoveryTime(creatorId: string): Date | null {
  if (typeof window === "undefined") return null;
  
  const discoveries = JSON.parse(localStorage.getItem("nmm_discoveries") || "{}");
  if (discoveries[creatorId]) {
    return new Date(discoveries[creatorId]);
  }
  return null;
}

function trackDiscovery(creatorId: string) {
  if (typeof window === "undefined") return;
  
  const discoveries = JSON.parse(localStorage.getItem("nmm_discoveries") || "{}");
  if (!discoveries[creatorId]) {
    discoveries[creatorId] = new Date().toISOString();
    localStorage.setItem("nmm_discoveries", JSON.stringify(discoveries));
  }
}

function getDiscoveryRank(discoveryDate: Date | null): { rank: string; icon: React.ElementType; color: string } | null {
  if (!discoveryDate) return null;
  
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - discoveryDate.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays < 7) {
    return { rank: "Early Explorer", icon: Flame, color: "text-orange-500" };
  } else if (diffDays < 30) {
    return { rank: "Pioneer", icon: Star, color: "text-yellow-500" };
  } else if (diffDays < 90) {
    return { rank: "Trailblazer", icon: Trophy, color: "text-amber-500" };
  }
  return { rank: "OG Discoverer", icon: Sparkles, color: "text-purple-500" };
}

export function DiscoveryBadge({ creator }: DiscoveryBadgeProps) {
  const [discoveryInfo, setDiscoveryInfo] = useState<{
    date: Date | null;
    rank: { rank: string; icon: React.ElementType; color: string } | null;
  }>({ date: null, rank: null });

  useEffect(() => {
    // Track this visit as a discovery
    trackDiscovery(creator.id);
    
    // Get discovery info
    const date = getDiscoveryTime(creator.id);
    const rank = getDiscoveryRank(date);
    setDiscoveryInfo({ date, rank });
  }, [creator.id]);

  if (!discoveryInfo.rank || !discoveryInfo.date) {
    return null;
  }

  const Icon = discoveryInfo.rank.icon;
  const daysSince = Math.floor((new Date().getTime() - discoveryInfo.date.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="p-4 bg-gradient-to-br from-stone-50 to-stone-100 dark:from-stone-800 dark:to-stone-900 rounded-xl border border-stone-200 dark:border-stone-700">
      <div className="flex items-center gap-3 mb-2">
        <div className={`${discoveryInfo.rank.color}`}>
          <Icon size={24} />
        </div>
        <div>
          <div className="text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wide">
            Your Badge
          </div>
          <div className="font-semibold text-stone-900 dark:text-stone-100">
            {discoveryInfo.rank.rank}
          </div>
        </div>
      </div>
      <p className="text-xs text-stone-500 dark:text-stone-400">
        You discovered {creator.name.split(" ")[0]} {daysSince === 0 ? "today" : `${daysSince} day${daysSince !== 1 ? "s" : ""} ago`}
      </p>
      
      <button
        onClick={() => {
          const tweetText = encodeURIComponent(
            `🏆 ${discoveryInfo.rank?.rank} badge unlocked!\n\nI discovered @${creator.artifacts.find(a => a.type === "x")?.url.split("/").pop() || creator.name} on @NewMediaMap ${daysSince} days ago.\n\nFind emerging Web3 voices before they blow up 👇\nnewmediamap.xyz/creators/${creator.id}`
          );
          window.open(
            `https://twitter.com/intent/tweet?text=${tweetText}`,
            "_blank",
            "width=550,height=420"
          );
        }}
        className="mt-3 flex items-center justify-center gap-2 w-full px-3 py-2 bg-black dark:bg-white text-white dark:text-black text-sm font-medium rounded-lg hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors"
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        Share my badge
      </button>
    </div>
  );
}

