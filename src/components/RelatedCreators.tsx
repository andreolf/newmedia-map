"use client";

import Link from "next/link";
import { Creator } from "@/types";
import { Avatar } from "./Avatar";
import { TagChip } from "./TagChip";
import { MapPin, ArrowRight } from "lucide-react";
import creatorsData from "@/data/creators.json";

const allCreators = creatorsData as Creator[];

interface RelatedCreatorsProps {
  currentCreator: Creator;
  maxResults?: number;
}

function calculateSimilarity(a: Creator, b: Creator): number {
  if (a.id === b.id) return -1; // Exclude self

  let score = 0;

  // Same primary signal (high weight)
  if (a.primary_signal === b.primary_signal) {
    score += 10;
  }

  // Overlapping signals
  const sharedSignals = a.signals.filter((s) => b.signals.includes(s));
  score += sharedSignals.length * 3;

  // Same country
  if (a.country === b.country) {
    score += 5;
  }

  // Same trajectory
  if (a.trajectory === b.trajectory) {
    score += 2;
  }

  // Similar content formats
  const sharedFormats = a.content_formats.filter((f) => b.content_formats.includes(f));
  score += sharedFormats.length;

  return score;
}

export function RelatedCreators({ currentCreator, maxResults = 4 }: RelatedCreatorsProps) {
  // Calculate similarity scores and sort
  const relatedCreators = allCreators
    .map((creator) => ({
      creator,
      score: calculateSimilarity(currentCreator, creator),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
    .map((item) => item.creator);

  if (relatedCreators.length === 0) {
    return null;
  }

  return (
    <section className="mt-8">
      <h2 className="font-serif text-2xl text-stone-900 dark:text-stone-100 mb-4">
        Similar Creators
      </h2>
      <div className="grid gap-3">
        {relatedCreators.map((creator) => (
          <Link
            key={creator.id}
            href={`/creators/${creator.id}`}
            className="group flex items-center gap-4 p-4 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl hover:border-stone-300 dark:hover:border-stone-600 hover:shadow-sm transition-all"
          >
            <Avatar
              name={creator.name}
              avatarUrl={creator.avatar_url}
              primarySignal={creator.primary_signal}
              size="md"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-stone-900 dark:text-stone-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                {creator.name}
              </h3>
              <div className="flex items-center gap-1 text-stone-400 dark:text-stone-500 text-sm mt-0.5">
                <MapPin size={12} />
                <span className="truncate">
                  {creator.city ? `${creator.city}, ` : ""}
                  {creator.country}
                </span>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {creator.signals.slice(0, 2).map((signal) => (
                  <TagChip key={signal} label={signal} variant="signal" size="sm" />
                ))}
              </div>
            </div>
            <ArrowRight
              size={16}
              className="text-stone-300 dark:text-stone-600 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
            />
          </Link>
        ))}
      </div>
    </section>
  );
}

