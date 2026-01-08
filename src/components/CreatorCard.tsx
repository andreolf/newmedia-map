"use client";

import Link from "next/link";
import { Creator } from "@/types";
import { Avatar } from "./Avatar";
import { TagChip } from "./TagChip";
import { ArtifactIconRow } from "./ArtifactIconRow";
import { BookmarkButton } from "./BookmarkButton";
import { getSurfaceReason, formatSurfaceReason } from "@/lib/chapters";
import { MapPin, Sparkles } from "lucide-react";

interface CreatorCardProps {
  creator: Creator;
  compact?: boolean;
  chapterId?: string;
  userLocation?: { lat: number; lng: number };
  showWhySurfaced?: boolean;
}

export function CreatorCard({
  creator,
  compact = false,
  chapterId,
  userLocation,
  showWhySurfaced = true,
}: CreatorCardProps) {
  const surfaceReason = showWhySurfaced
    ? getSurfaceReason(creator, {
        chapterId,
        userLat: userLocation?.lat,
        userLng: userLocation?.lng,
      })
    : null;

  if (compact) {
    return (
      <Link href={`/creators/${creator.id}`}>
        <article className="group flex items-start gap-4 p-4 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors cursor-pointer">
          <Avatar
            name={creator.name}
            avatarUrl={creator.avatar_url}
            primarySignal={creator.primary_signal}
            size="md"
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-stone-900 dark:text-stone-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {creator.name}
                  </h3>
                  <BookmarkButton creatorId={creator.id} size="sm" />
                </div>
                <div className="flex items-center gap-2 text-sm text-stone-500 dark:text-stone-400 mt-0.5">
                  <span className="font-medium text-stone-700 dark:text-stone-300">
                    {creator.primary_signal}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin size={12} />
                    {creator.city ? `${creator.city}, ` : ""}
                    {creator.country}
                  </span>
                </div>
              </div>

              {/* Right side tags */}
              <div className="flex flex-wrap justify-end gap-1 max-w-[200px]">
                {creator.signals.slice(0, 3).map((signal) => (
                  <TagChip key={signal} label={signal} variant="signal" size="sm" />
                ))}
              </div>
            </div>

            <p className="text-sm text-stone-600 dark:text-stone-400 mt-2 line-clamp-2">
              {creator.editorial_reason}
            </p>

            {/* Why surfaced */}
            {surfaceReason && (
              <div className="flex items-center gap-1.5 mt-2 text-xs text-blue-600 dark:text-blue-400">
                <Sparkles size={12} />
                <span>{formatSurfaceReason(surfaceReason)}</span>
              </div>
            )}

            <div className="mt-2">
              <ArtifactIconRow artifacts={creator.artifacts} size="sm" />
            </div>
          </div>
        </article>
      </Link>
    );
  }

  // Grid card view
  return (
    <Link href={`/creators/${creator.id}`}>
      <article className="group bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl p-5 hover:border-stone-300 dark:hover:border-stone-600 hover:shadow-sm transition-all cursor-pointer h-full">
        <div className="flex gap-4">
          <Avatar
            name={creator.name}
            avatarUrl={creator.avatar_url}
            primarySignal={creator.primary_signal}
            size="md"
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-stone-900 dark:text-stone-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {creator.name}
              </h3>
              <BookmarkButton creatorId={creator.id} size="sm" />
            </div>

            <div className="flex items-center gap-1 text-stone-400 dark:text-stone-500 text-sm mt-0.5">
              <MapPin size={12} />
              <span>
                {creator.city ? `${creator.city}, ` : ""}
                {creator.country}
              </span>
            </div>

            <p className="text-stone-600 dark:text-stone-400 text-sm mt-2 line-clamp-2">
              {creator.editorial_reason}
            </p>

            {/* Why surfaced */}
            {surfaceReason && (
              <div className="flex items-center gap-1.5 mt-2 text-xs text-blue-600 dark:text-blue-400">
                <Sparkles size={12} />
                <span>{formatSurfaceReason(surfaceReason)}</span>
              </div>
            )}

            <div className="flex flex-wrap gap-1.5 mt-3">
              {creator.signals.slice(0, 3).map((signal) => (
                <TagChip key={signal} label={signal} variant="signal" size="sm" />
              ))}
            </div>

            <div className="mt-3 pt-3 border-t border-stone-100 dark:border-stone-700">
              <ArtifactIconRow artifacts={creator.artifacts} size="sm" />
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
