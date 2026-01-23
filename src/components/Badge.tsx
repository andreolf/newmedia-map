"use client";

import { Badge as BadgeData, BADGE_CONFIG, BadgeType } from "@/types";

interface BadgeProps {
  badge: BadgeData;
  size?: "sm" | "md";
  showLabel?: boolean;
}

export function Badge({ badge, size = "sm", showLabel = true }: BadgeProps) {
  const config = BADGE_CONFIG[badge.type];

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border ${
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm"
      }`}
      style={{
        borderColor: config.color,
        backgroundColor: `${config.color}15`,
        color: config.color,
      }}
      title={badge.context || config.description}
    >
      <span>{config.emoji}</span>
      {showLabel && <span className="font-medium">{config.label}</span>}
    </span>
  );
}

interface BadgeRowProps {
  badges: BadgeData[];
  maxShow?: number;
  size?: "sm" | "md";
}

export function BadgeRow({ badges, maxShow = 3, size = "sm" }: BadgeRowProps) {
  if (!badges || badges.length === 0) return null;

  const visible = badges.slice(0, maxShow);
  const remaining = badges.length - maxShow;

  return (
    <div className="flex flex-wrap items-center gap-1">
      {visible.map((badge, i) => (
        <Badge key={`${badge.type}-${i}`} badge={badge} size={size} />
      ))}
      {remaining > 0 && (
        <span className="text-xs text-muted-foreground">+{remaining}</span>
      )}
    </div>
  );
}

// Simple icon-only badges for compact views
export function BadgeIcons({ badges }: { badges: BadgeData[] }) {
  if (!badges || badges.length === 0) return null;

  return (
    <div className="flex items-center gap-0.5">
      {badges.map((badge, i) => {
        const config = BADGE_CONFIG[badge.type];
        return (
          <span
            key={`${badge.type}-${i}`}
            title={`${config.label}: ${badge.context || config.description}`}
            className="cursor-help"
          >
            {config.emoji}
          </span>
        );
      })}
    </div>
  );
}
