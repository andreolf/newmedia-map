"use client";

import Link from "next/link";
import { Creator } from "@/types";
import { Avatar } from "./Avatar";
import { TagChip } from "./TagChip";
import { ArrowRight } from "lucide-react";

interface MapPopupCardProps {
  creator: Creator;
}

export function MapPopupCard({ creator }: MapPopupCardProps) {
  return (
    <div className="w-64 p-3">
      <div className="flex items-start gap-3">
        <Avatar
          name={creator.name}
          avatarUrl={creator.avatar_url}
          primarySignal={creator.primary_signal}
          size="sm"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-stone-900 text-sm">{creator.name}</h3>
          <p className="text-stone-500 text-xs mt-0.5 line-clamp-2">
            {creator.editorial_reason}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1 mt-2">
        {creator.signals.slice(0, 2).map((signal) => (
          <TagChip key={signal} label={signal} variant="signal" size="sm" />
        ))}
      </div>

      <Link
        href={`/creators/${creator.id}`}
        className="flex items-center gap-1 mt-3 text-sm font-medium text-stone-700 hover:text-stone-900 transition-colors"
      >
        View profile
        <ArrowRight size={14} />
      </Link>
    </div>
  );
}

