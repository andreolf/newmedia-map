"use client";

import { cn, getInitials, getSignalColor } from "@/lib/utils";

interface AvatarProps {
  name: string;
  avatarUrl: string | null;
  primarySignal: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeConfig = {
  sm: { container: 40, ring: 2, text: "text-xs" },
  md: { container: 56, ring: 3, text: "text-sm" },
  lg: { container: 80, ring: 4, text: "text-lg" },
  xl: { container: 120, ring: 5, text: "text-2xl" },
};

export function Avatar({ name, avatarUrl, primarySignal, size = "md" }: AvatarProps) {
  const config = sizeConfig[size];
  const ringColor = getSignalColor(primarySignal);
  const initials = getInitials(name);

  return (
    <div
      className="relative rounded-full flex-shrink-0"
      style={{
        width: config.container,
        height: config.container,
        padding: config.ring,
        background: `linear-gradient(135deg, ${ringColor}, ${ringColor}80)`,
        boxShadow: `0 0 20px ${ringColor}30`,
      }}
    >
      <div className="w-full h-full rounded-full overflow-hidden bg-[--muted] flex items-center justify-center">
        {avatarUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={avatarUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className={cn("font-bold text-[--muted-foreground]", config.text)}>
            {initials}
          </span>
        )}
      </div>
    </div>
  );
}
