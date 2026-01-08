import chaptersData from "@/data/chapters.json";
import creatorsData from "@/data/creators.json";
import { Chapter, Creator, SurfaceReason, ChapterRegion } from "@/types";

// Transform JSON data to proper types
const transformChapter = (data: typeof chaptersData[0]): Chapter => ({
  id: data.id,
  name: data.name,
  slug: data.slug,
  region: data.region as ChapterRegion,
  description: data.description,
  cover_image_url: data.cover_image_url ?? undefined,
  created_at: data.created_at,
  updated_at: data.updated_at,
});

export const chapters: Chapter[] = chaptersData.map(transformChapter);
export const creators = creatorsData as Creator[];

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
      // Sort by created_at descending (newest first)
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, limit);
}

// Get "why surfaced" reason for a creator
export function getSurfaceReason(
  creator: Creator,
  options?: {
    userLat?: number;
    userLng?: number;
    chapterId?: string;
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

  // Check if near user
  if (options?.userLat && options?.userLng && creator.lat && creator.lng) {
    const distance = getDistanceKm(
      options.userLat,
      options.userLng,
      creator.lat,
      creator.lng
    );
    if (distance <= 50) {
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

  // Open to local collab
  if (creator.open_to_local_collab) {
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
      return "New creator";
    case "open_to_collab":
      return "Open to local collaboration";
    case "recently_published":
      return "Recently published";
    case "near_you":
      return `${reason.distance_km} km away`;
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
  const R = 6371; // Earth radius in km
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

// Get creators near a location
export function getCreatorsNearLocation(
  lat: number,
  lng: number,
  radiusKm = 50,
  filters?: {
    openToCollab?: boolean;
    categories?: string[];
    chapterId?: string;
  }
): Array<Creator & { distance_km: number }> {
  return creators
    .filter((c) => {
      if (!c.lat || !c.lng) return false;
      if (filters?.openToCollab && !c.open_to_local_collab) return false;
      if (filters?.chapterId && !c.chapter_ids?.includes(filters.chapterId))
        return false;
      if (
        filters?.categories?.length &&
        !c.categories?.some((cat) => filters.categories?.includes(cat))
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
