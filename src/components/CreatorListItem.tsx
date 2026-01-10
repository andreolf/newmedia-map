"use client";

import Link from "next/link";
import { Creator } from "@/types";
import { Avatar } from "./Avatar";
import { TagChip } from "./TagChip";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { BookmarkButton } from "./BookmarkButton";
import { QuickShareButton } from "./QuickShareButton";

interface CreatorListItemProps {
  creator: Creator;
  isSelected?: boolean;
}

export function CreatorListItem({ creator, isSelected = false }: CreatorListItemProps) {
  return (
    <Link href={`/creators/${creator.id}`} id={`creator-${creator.id}`}>
      <article 
        className={cn(
          "group flex items-start gap-4 p-4 border-b border-[--border] transition-all cursor-pointer",
          isSelected 
            ? "bg-[#00ff88]/10 ring-2 ring-[#00ff88] ring-inset"
            : "bg-[--card] hover:bg-[--muted]"
        )}
      >
        <Avatar
          name={creator.name}
          avatarUrl={creator.avatar_url}
          primarySignal={creator.primary_signal}
          size="md"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1">
                <h3 className="font-semibold text-[--foreground] group-hover:text-[#00ff88] transition-colors truncate">
                  {creator.name}
                </h3>
                <BookmarkButton creatorId={creator.id} size="sm" />
                <QuickShareButton creator={creator} size="sm" />
              </div>
              
              <div className="flex items-center gap-1 text-[--muted-foreground] text-sm mt-0.5">
                <MapPin size={12} />
                <span className="truncate">
                  {creator.city ? `${creator.city}, ` : ""}
                  {creator.country}
                </span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-1 justify-end flex-shrink-0">
              {creator.signals.slice(0, 3).map((signal) => (
                <TagChip key={signal} label={signal} variant="signal" size="sm" />
              ))}
            </div>
          </div>
          
          <p className="text-[--muted-foreground] text-sm mt-1.5 line-clamp-1">
            {creator.editorial_reason}
          </p>
        </div>
      </article>
    </Link>
  );
}
