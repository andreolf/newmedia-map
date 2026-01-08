// Content categories (anti-shill: no generic promo)
export type CreatorCategory = "Build" | "Explain" | "Apply" | "Document" | "Critique";

export const CATEGORY_DESCRIPTIONS: Record<CreatorCategory, string> = {
  Build: "Creating tools, protocols, or infrastructure",
  Explain: "Breaking down complex topics for others",
  Apply: "Using crypto/web3 for real-world use cases",
  Document: "Recording history, culture, and community",
  Critique: "Constructive analysis and accountability",
};

export interface Artifact {
  type: "youtube" | "x" | "github" | "substack" | "website" | "talk" | "podcast" | "article";
  title: string;
  url: string;
  category?: CreatorCategory;
  created_at?: string;
}

export interface Recommendation {
  name: string;
  context: string;
}

// Chapter (regional brand node)
export type ChapterRegion = "Africa" | "Europe" | "Americas" | "Asia" | "MENA";

export interface Chapter {
  id: string;
  name: string;
  slug: string;
  region: ChapterRegion;
  description: string;
  cover_image_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ChapterCreator {
  creator_id: string;
  chapter_id: string;
  context_line?: string;
  featured_at: string;
}

export interface MonthlyDrop {
  id: string;
  chapter_id: string;
  month: string;
  title: string;
  creator_ids: string[];
  published_at: string;
}

export interface Creator {
  id: string;
  name: string;
  avatar_url: string | null;
  country: string;
  city: string | null;
  lat: number;
  lng: number;
  primary_signal: string;
  signals: string[];
  content_formats: string[];
  trajectory: string;
  no_conference_circuit: boolean;
  editorial_reason: string;
  artifacts: Artifact[];
  recommendations: Recommendation[];
  chapter_ids?: string[];
  open_to_local_collab?: boolean;
  categories?: CreatorCategory[];
  created_at?: string;
}

export type SurfaceReason = 
  | { type: "featured_in_chapter"; chapter_name: string }
  | { type: "new_creator" }
  | { type: "open_to_collab" }
  | { type: "recently_published" }
  | { type: "near_you"; distance_km: number };

export type ContentFormat = "video" | "writing" | "podcast" | "threads" | "code" | "talks";

export type Trajectory = "emerging" | "breakout" | "quiet-contributor" | "builder-educator";

export type UserRole = "admin" | "curator";

export interface CuratorPermission {
  user_id: string;
  chapter_id: string;
  role: UserRole;
}
