"use client";

import Link from "next/link";
import { Creator, CreatorIntent } from "@/types";
import { Avatar } from "./Avatar";
import { TagChip } from "./TagChip";
import { BadgeIcons } from "./Badge";
import { MapPin, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { BookmarkButton } from "./BookmarkButton";
import { QuickShareButton } from "./QuickShareButton";
import { getDisplayLocation } from "@/lib/chapters";

interface CreatorListItemProps {
  creator: Creator;
  isSelected?: boolean;
}

// Get short intent labels
function getIntentShortLabel(intent: CreatorIntent): string {
  const shortLabels: Record<CreatorIntent, string> = {
    collaboration: "Collab",
    local_meetups: "Meetups",
    events_workshops: "Events",
    product_feedback: "Feedback",
    research_interviews: "Research",
    mentorship: "Mentor",
  };
  return shortLabels[intent] || intent;
}

export function CreatorListItem({ creator, isSelected = false }: CreatorListItemProps) {
  const displayLocation = getDisplayLocation(creator);
  const hasIntents = creator.intents && creator.intents.length > 0;

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
                {creator.badges && creator.badges.length > 0 && (
                  <BadgeIcons badges={creator.badges} />
                )}
                <BookmarkButton creatorId={creator.id} size="sm" />
                <QuickShareButton creator={creator} size="sm" />
              </div>

              {displayLocation && (
                <div className="flex items-center gap-1 text-[--muted-foreground] text-sm mt-0.5">
                  <MapPin size={12} />
                  <span className="truncate">{displayLocation}</span>
                </div>
              )}

              {/* Intents row - compact for list view */}
              {hasIntents && (
                <div className="flex items-center gap-1 mt-1 flex-wrap">
                  <Users size={10} className="text-[#6366f1]" />
                  {creator.intents.slice(0, 2).map((intent) => (
                    <span
                      key={intent}
                      className="px-1.5 py-0.5 text-[9px] font-medium bg-[#6366f1]/10 text-[#6366f1] rounded"
                    >
                      {getIntentShortLabel(intent)}
                    </span>
                  ))}
                  {creator.intents.length > 2 && (
                    <span className="text-[9px] text-[--muted-foreground]">
                      +{creator.intents.length - 2}
                    </span>
                  )}
                </div>
              )}
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
