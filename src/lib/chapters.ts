import chaptersData from "@/data/chapters.json";
import creatorsData from "@/data/creators.json";
import eventsData from "@/data/events.json";
import monthlyDropsData from "@/data/monthly-drops.json";
import {
  Chapter,
  Creator,
  CreatorCategory,
  Event,
  MonthlyDrop,
  SurfaceReason,
  ChapterRegion,
  LocationVisibility,
  CreatorIntent,
  Artifact,
} from "@/types";

// Transform JSON data to proper types
const transformChapter = (data: (typeof chaptersData)[0]): Chapter => ({
  id: data.id,
  name: data.name,
  slug: data.slug,
  region: data.region as ChapterRegion,
  description: data.description,
  cover_image_url: data.cover_image_url ?? undefined,
  created_at: data.created_at,
  updated_at: data.updated_at,
});

// Transform creator with new fields
const transformCreator = (data: (typeof creatorsData)[0]): Creator => ({
  id: data.id,
  name: data.name,
  avatar_url: data.avatar_url,
  country: data.country,
  city: data.city,
  lat: data.lat,
  lng: data.lng,
  location_visibility: (data.location_visibility || "CITY") as LocationVisibility,
  collab_radius_km: data.collab_radius_km || 50,
  primary_signal: data.primary_signal,
  signals: data.signals,
  content_formats: data.content_formats,
  trajectory: data.trajectory,
  no_conference_circuit: data.no_conference_circuit,
  editorial_reason: data.editorial_reason,
  artifacts: data.artifacts as Artifact[],
  recommendations: data.recommendations,
  intents: (data.intents || []) as CreatorIntent[],
  chapter_ids: data.chapter_ids,
  categories: data.categories as Creator["categories"],
  created_at: data.created_at,
});

const transformEvent = (data: (typeof eventsData)[0]): Event => ({
  id: data.id,
  name: data.name,
  slug: data.slug,
  description: data.description,
  location_city: data.location_city,
  location_country: data.location_country,
  start_date: data.start_date,
  end_date: data.end_date,
  event_type: data.event_type as Event["event_type"],
  chapter_id: data.chapter_id,
  website_url: data.website_url,
  created_at: data.created_at,
});

export const chapters: Chapter[] = chaptersData.map(transformChapter);
export const creators: Creator[] = creatorsData.map(transformCreator);
export const events: Event[] = eventsData.map(transformEvent);
export const monthlyDrops: MonthlyDrop[] = monthlyDropsData as MonthlyDrop[];

// Chapter helpers
export function getChapterBySlug(slug: string): Chapter | undefined {
  return chapters.find((c) => c.slug === slug);
}

export function getChapterById(id: string): Chapter | undefined {
  return chapters.find((c) => c.id === id);
}

export function getCreatorsByChapter(chapterId: string): Creator[] {
  return creators.filter((c) => c.chapter_ids?.includes(chapterId));
}

export function getCreatorChapters(creator: Creator): Chapter[] {
  if (!creator.chapter_ids) return [];
  return creator.chapter_ids
    .map((id) => getChapterById(id))
    .filter((c): c is Chapter => c !== undefined);
}

export function getFeaturedCreatorsForChapter(
  chapterId: string,
  limit = 6
): Creator[] {
  return getCreatorsByChapter(chapterId)
    .sort((a, b) => {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, limit);
}

// Event helpers
export function getEventBySlug(slug: string): Event | undefined {
  return events.find((e) => e.slug === slug);
}

export function getEventById(id: string): Event | undefined {
  return events.find((e) => e.id === id);
}

export function getUpcomingEvents(limit?: number): Event[] {
  const now = new Date();
  const upcoming = events
    .filter((e) => new Date(e.start_date) >= now)
    .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());
  return limit ? upcoming.slice(0, limit) : upcoming;
}

export function getEventsByChapter(chapterId: string): Event[] {
  return events.filter((e) => e.chapter_id === chapterId);
}

export function getCreatorsAttendingEvent(eventId: string): Creator[] {
  return creators.filter((c) => c.attending_event_ids?.includes(eventId));
}

// Monthly drop helpers
export function getLatestDropForChapter(chapterId: string): MonthlyDrop | undefined {
  return monthlyDrops
    .filter((d) => d.chapter_id === chapterId)
    .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())[0];
}

export function getDropCreators(drop: MonthlyDrop): Creator[] {
  return drop.creator_ids
    .map((id) => creators.find((c) => c.id === id))
    .filter((c): c is Creator => c !== undefined);
}

// Location display helpers (privacy-aware)
export function getDisplayLocation(creator: Creator): string | null {
  switch (creator.location_visibility) {
    case "GLOBAL":
      return null;
    case "COUNTRY":
      return creator.country;
    case "CITY":
    case "NEAR_ME":
      return creator.city ? `${creator.city}, ${creator.country}` : creator.country;
    default:
      return creator.country;
  }
}

export function canShowInNearMe(creator: Creator): boolean {
  return creator.location_visibility === "NEAR_ME" && creator.lat !== null && creator.lng !== null;
}

// Get "why surfaced" reason for a creator
export function getSurfaceReason(
  creator: Creator,
  options?: {
    userLat?: number;
    userLng?: number;
    chapterId?: string;
    eventId?: string;
  }
): SurfaceReason | null {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // If viewing in chapter context, show "Featured in X"
  if (options?.chapterId) {
    const chapter = getChapterById(options.chapterId);
    if (chapter && creator.chapter_ids?.includes(options.chapterId)) {
      return { type: "featured_in_chapter", chapter_name: chapter.name };
    }
  }

  // If viewing in event context
  if (options?.eventId && creator.attending_event_ids?.includes(options.eventId)) {
    const event = getEventById(options.eventId);
    if (event) {
      return { type: "attending_event", event_name: event.name };
    }
  }

  // Check if near user (only if creator allows near_me discovery)
  if (
    options?.userLat &&
    options?.userLng &&
    canShowInNearMe(creator) &&
    creator.lat &&
    creator.lng
  ) {
    const distance = getDistanceKm(
      options.userLat,
      options.userLng,
      creator.lat,
      creator.lng
    );
    if (distance <= (creator.collab_radius_km || 50)) {
      return { type: "near_you", distance_km: Math.round(distance * 10) / 10 };
    }
  }

  // New creator (last 30 days)
  if (creator.created_at) {
    const createdAt = new Date(creator.created_at);
    if (createdAt >= thirtyDaysAgo) {
      return { type: "new_creator" };
    }
  }

  // Has collaboration intents
  if (creator.intents?.length > 0) {
    return { type: "open_to_collab" };
  }

  // Recently published (check artifacts)
  const recentArtifact = creator.artifacts?.find((a) => {
    if (!a.created_at) return false;
    return new Date(a.created_at) >= sevenDaysAgo;
  });
  if (recentArtifact) {
    return { type: "recently_published" };
  }

  // Default: show chapter if has one
  if (creator.chapter_ids?.length) {
    const chapter = getChapterById(creator.chapter_ids[0]);
    if (chapter) {
      return { type: "featured_in_chapter", chapter_name: chapter.name };
    }
  }

  return null;
}

// Format surface reason for display
export function formatSurfaceReason(reason: SurfaceReason): string {
  switch (reason.type) {
    case "featured_in_chapter":
      return `Featured in ${reason.chapter_name}`;
    case "new_creator":
      return "New profile";
    case "open_to_collab":
      return "Open to collaboration";
    case "recently_published":
      return "Recently published";
    case "near_you":
      return `${reason.distance_km} km away`;
    case "attending_event":
      return `Attending ${reason.event_name}`;
    case "monthly_drop":
      return `${reason.chapter_name} ${reason.month} drop`;
    default:
      return "";
  }
}

// Haversine distance calculation
export function getDistanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

// Get creators near a location (privacy-aware)
export function getCreatorsNearLocation(
  lat: number,
  lng: number,
  radiusKm = 50,
  filters?: {
    intents?: CreatorIntent[];
    categories?: string[];
    chapterId?: string;
  }
): Array<Creator & { distance_km: number }> {
  return creators
    .filter((c) => {
      // Only show creators who opted into near_me discovery
      if (!canShowInNearMe(c)) return false;
      if (!c.lat || !c.lng) return false;

      // Apply filters
      if (filters?.chapterId && !c.chapter_ids?.includes(filters.chapterId)) return false;
      if (
        filters?.categories?.length &&
        !c.categories?.some((cat) => filters.categories?.includes(cat))
      )
        return false;
      if (
        filters?.intents?.length &&
        !c.intents?.some((intent) => filters.intents?.includes(intent))
      )
        return false;

      const distance = getDistanceKm(lat, lng, c.lat, c.lng);
      return distance <= radiusKm;
    })
    .map((c) => ({
      ...c,
      distance_km: Math.round(getDistanceKm(lat, lng, c.lat!, c.lng!) * 10) / 10,
    }))
    .sort((a, b) => a.distance_km - b.distance_km);
}

// Filter creators with all new filter options
export interface CreatorFilters {
  signals?: string[];
  categories?: string[];
  intents?: CreatorIntent[];
  countries?: string[];
  trajectories?: string[];
  chapterId?: string;
  noConferenceCircuit?: boolean;
  search?: string;
}

export function filterCreatorsAdvanced(
  allCreators: Creator[],
  filters: CreatorFilters
): Creator[] {
  return allCreators.filter((c) => {
    if (filters.signals?.length && !filters.signals.some((s) => c.signals.includes(s))) {
      return false;
    }
    if (
      filters.categories?.length &&
      !filters.categories.some((cat) => c.categories?.includes(cat as CreatorCategory))
    ) {
      return false;
    }
    if (filters.intents?.length && !filters.intents.some((i) => c.intents?.includes(i))) {
      return false;
    }
    if (filters.countries?.length && !filters.countries.includes(c.country)) {
      return false;
    }
    if (filters.trajectories?.length && !filters.trajectories.includes(c.trajectory)) {
      return false;
    }
    if (filters.chapterId && !c.chapter_ids?.includes(filters.chapterId)) {
      return false;
    }
    if (filters.noConferenceCircuit && !c.no_conference_circuit) {
      return false;
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matches =
        c.name.toLowerCase().includes(searchLower) ||
        c.signals.some((s) => s.toLowerCase().includes(searchLower)) ||
        c.editorial_reason.toLowerCase().includes(searchLower) ||
        c.country.toLowerCase().includes(searchLower) ||
        (c.city?.toLowerCase().includes(searchLower) ?? false);
      if (!matches) return false;
    }
    return true;
  });
}

// Get region emoji
export function getRegionEmoji(region: string): string {
  const emojis: Record<string, string> = {
    Africa: "🌍",
    Europe: "🌍",
    Americas: "🌎",
    Asia: "🌏",
    MENA: "🌍",
  };
  return emojis[region] || "🌐";
}

// Get all unique countries from creators
export function getAllCountries(): string[] {
  return [...new Set(creators.map((c) => c.country))].sort();
}
