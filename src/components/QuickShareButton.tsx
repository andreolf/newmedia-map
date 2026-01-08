"use client";

import { Share2 } from "lucide-react";
import { Creator } from "@/types";

interface QuickShareButtonProps {
  creator: Creator;
  size?: "sm" | "md";
}

export function QuickShareButton({ creator, size = "sm" }: QuickShareButtonProps) {
  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const profileUrl = `https://newmediamap.xyz/creators/${creator.id}`;
    const tweetText = encodeURIComponent(
      `🗺️ Check out ${creator.name} on @NewMediaMap\n\n"${creator.editorial_reason.slice(0, 100)}${creator.editorial_reason.length > 100 ? '...' : ''}"\n\n${profileUrl}`
    );

    window.open(
      `https://twitter.com/intent/tweet?text=${tweetText}`,
      "_blank",
      "width=550,height=420"
    );
  };

  const iconSize = size === "sm" ? 14 : 16;

  return (
    <button
      onClick={handleShare}
      className="p-1.5 rounded-full text-stone-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all duration-200"
      aria-label={`Share ${creator.name} on X`}
      title="Share on X"
    >
      <Share2 size={iconSize} />
    </button>
  );
}

