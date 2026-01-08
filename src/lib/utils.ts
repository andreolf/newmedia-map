import { type ClassValue, clsx } from "clsx";
import { Creator } from "@/types";
import { signalColorMap } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function getSignalColor(signal: string): string {
  return signalColorMap[signal.toLowerCase()] || "#6B7280";
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function filterCreators(
  creators: Creator[],
  filters: {
    signals?: string[];
    contentFormats?: string[];
    countries?: string[];
    trajectories?: string[];
    noConferenceCircuit?: boolean;
    search?: string;
  }
): Creator[] {
  return creators.filter((creator) => {
    // Signals filter
    if (filters.signals && filters.signals.length > 0) {
      const hasSignal = filters.signals.some((s) =>
        creator.signals.includes(s)
      );
      if (!hasSignal) return false;
    }

    // Content formats filter
    if (filters.contentFormats && filters.contentFormats.length > 0) {
      const hasFormat = filters.contentFormats.some((f) =>
        creator.content_formats.includes(f)
      );
      if (!hasFormat) return false;
    }

    // Countries filter
    if (filters.countries && filters.countries.length > 0) {
      if (!filters.countries.includes(creator.country)) return false;
    }

    // Trajectories filter
    if (filters.trajectories && filters.trajectories.length > 0) {
      if (!filters.trajectories.includes(creator.trajectory)) return false;
    }

    // No conference circuit filter
    if (filters.noConferenceCircuit) {
      if (!creator.no_conference_circuit) return false;
    }

    // Search filter
    if (filters.search && filters.search.trim()) {
      const query = filters.search.toLowerCase();
      const searchable = [
        creator.name,
        creator.editorial_reason,
        ...creator.signals,
      ]
        .join(" ")
        .toLowerCase();
      if (!searchable.includes(query)) return false;
    }

    return true;
  });
}

export function sortCreators(
  creators: Creator[],
  sortBy: "recent" | "az"
): Creator[] {
  if (sortBy === "az") {
    return [...creators].sort((a, b) => a.name.localeCompare(b.name));
  }
  // Default: recent (reverse order for demo, since we don't have dates)
  return [...creators];
}

