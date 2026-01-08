"use client";

import Link from "next/link";
import { Creator } from "@/types";
import { Avatar } from "./Avatar";
import { TagChip } from "./TagChip";
import { ArtifactIconRow } from "./ArtifactIconRow";
import { MapPin, Bookmark } from "lucide-react";

interface CreatorCardProps {
  creator: Creator;
  compact?: boolean;
}

export function CreatorCard({ creator, compact = false }: CreatorCardProps) {
  if (compact) {
    return (
      <Link href={`/creators/${creator.id}`}>
        <article className="group flex items-start gap-4 p-4 hover:bg-stone-50 transition-colors cursor-pointer">
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
                  <h3 className="font-semibold text-stone-900 group-hover:text-blue-600 transition-colors">
                    {creator.name}
                  </h3>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    className="text-stone-300 hover:text-stone-500 transition-colors"
                  >
                    <Bookmark size={16} />
                  </button>
                </div>
                <div className="flex items-center gap-2 text-sm text-stone-500 mt-0.5">
                  <span className="font-medium text-stone-700">
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

            <p className="text-sm text-stone-600 mt-2 line-clamp-2">
              {creator.editorial_reason}
            </p>

            <div className="mt-2">
              <ArtifactIconRow artifacts={creator.artifacts} size="sm" />
            </div>
          </div>
        </article>
      </Link>
    );
  }

  // Original grid card view
  return (
    <Link href={`/creators/${creator.id}`}>
      <article className="group bg-white border border-stone-200 rounded-xl p-5 hover:border-stone-300 hover:shadow-sm transition-all cursor-pointer">
        <div className="flex gap-4">
          <Avatar
            name={creator.name}
            avatarUrl={creator.avatar_url}
            primarySignal={creator.primary_signal}
            size="md"
          />

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-stone-900 group-hover:text-stone-700 transition-colors">
              {creator.name}
            </h3>

            <div className="flex items-center gap-1 text-stone-400 text-sm mt-0.5">
              <MapPin size={12} />
              <span>
                {creator.city ? `${creator.city}, ` : ""}
                {creator.country}
              </span>
            </div>

            <p className="text-stone-600 text-sm mt-2 line-clamp-2">
              {creator.editorial_reason}
            </p>

            <div className="flex flex-wrap gap-1.5 mt-3">
              {creator.signals.slice(0, 3).map((signal) => (
                <TagChip key={signal} label={signal} variant="signal" size="sm" />
              ))}
            </div>

            <div className="mt-3 pt-3 border-t border-stone-100">
              <ArtifactIconRow artifacts={creator.artifacts} size="sm" />
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
