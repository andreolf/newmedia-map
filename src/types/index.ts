// Content categories (anti-shill: no generic promo)
export type CreatorCategory = "Build" | "Explain" | "Apply" | "Document" | "Critique";

export const CATEGORY_DESCRIPTIONS: Record<CreatorCategory, string> = {
  Build: "Creating tools, protocols, or infrastructure",
  Explain: "Breaking down complex topics for others",
  Apply: "Using crypto/web3 for real-world use cases",
  Document: "Recording history, culture, and community",
  Critique: "Constructive analysis and accountability",
};

// Location visibility levels (privacy-aware)
export type LocationVisibility = "GLOBAL" | "COUNTRY" | "CITY" | "NEAR_ME";

export const LOCATION_VISIBILITY_DESCRIPTIONS: Record<LocationVisibility, string> = {
  GLOBAL: "No location shown publicly",
  COUNTRY: "Only country displayed",
  CITY: "City and country displayed",
  NEAR_ME: "Shown in 'Near you' discovery (approx distance only, no exact coords)",
};

// Creator intents (what they're open to)
export type CreatorIntent =
  | "collaboration"
  | "local_meetups"
  | "events_workshops"
  | "product_feedback"
  | "research_interviews"
  | "mentorship";

export const INTENT_LABELS: Record<CreatorIntent, string> = {
  collaboration: "Open to collaboration",
  local_meetups: "Open to local meetups",
  events_workshops: "Open to events & workshops",
  product_feedback: "Open to product feedback",
  research_interviews: "Open to research/interviews",
  mentorship: "Open to mentorship",
};

export const INTENT_DESCRIPTIONS: Record<CreatorIntent, string> = {
  collaboration: "Interested in collaborating on projects or content",
  local_meetups: "Available for in-person meetups in your area",
  events_workshops: "Open to speaking or participating in events",
  product_feedback: "Willing to provide feedback on products/tools",
  research_interviews: "Available for research interviews or studies",
  mentorship: "Open to mentoring others in the space",
};

export interface Artifact {
  type: "youtube" | "x" | "github" | "substack" | "website" | "talk" | "podcast" | "article";
  title: string;
  url: string;
  category?: CreatorCategory;
  created_at?: string;
  event_id?: string; // Tag artifact to an event
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
  context_line?: string; // 1-sentence curator context
  featured_at: string;
}

export interface MonthlyDrop {
  id: string;
  chapter_id: string;
  month: string; // e.g. "2026-01"
  title: string;
  creator_ids: string[];
  published_at: string;
}

// Event entity
export type EventType = "builder_night" | "conference" | "workshop" | "online";

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  builder_night: "Builder Night",
  conference: "Conference",
  workshop: "Workshop",
  online: "Online Event",
};

export interface Event {
  id: string;
  name: string;
  slug: string;
  description: string;
  location_city?: string;
  location_country?: string;
  start_date: string;
  end_date?: string;
  event_type: EventType;
  chapter_id?: string; // Optional chapter association
  website_url?: string;
  created_at: string;
}

export interface EventAttendee {
  event_id: string;
  creator_id: string;
  opted_in_at: string;
}

// Creator profile
export interface Creator {
  id: string;
  name: string;
  avatar_url: string | null;
  
  // Location (stored privately, displayed per visibility)
  country: string;
  city: string | null;
  lat: number | null; // Optional - only used for near_me discovery
  lng: number | null;
  location_visibility: LocationVisibility;
  collab_radius_km: number; // Default 50, for near-me matching
  
  // Signals & content
  primary_signal: string;
  signals: string[];
  content_formats: string[];
  trajectory: string;
  no_conference_circuit: boolean;
  editorial_reason: string;
  artifacts: Artifact[];
  recommendations: Recommendation[];
  
  // Intents (what creator is open to)
  intents: CreatorIntent[];
  
  // Chapter associations
  chapter_ids?: string[];
  chapter_context?: Record<string, string>; // chapter_id -> context_line
  
  // Categories (proof of work type)
  categories?: CreatorCategory[];
  
  // Events
  attending_event_ids?: string[];
  
  // Timestamps
  created_at?: string;
  updated_at?: string;
}

// Why a creator is surfaced (explainability)
export type SurfaceReason =
  | { type: "featured_in_chapter"; chapter_name: string }
  | { type: "new_creator" }
  | { type: "open_to_collab" }
  | { type: "recently_published" }
  | { type: "near_you"; distance_km: number }
  | { type: "attending_event"; event_name: string }
  | { type: "monthly_drop"; chapter_name: string; month: string };

export type ContentFormat = "video" | "writing" | "podcast" | "threads" | "code" | "talks";

export type Trajectory = "emerging" | "breakout" | "quiet-contributor" | "builder-educator";

export type UserRole = "admin" | "curator";

export interface CuratorPermission {
  user_id: string;
  chapter_id: string;
  role: UserRole;
}

// Company Brief (non-marketplace collaboration)
export interface CompanyBrief {
  id: string;
  company_name: string;
  contact_email: string;
  what_building: string;
  region_focus?: string; // chapter_id or "global"
  category_focus: CreatorCategory[];
  intent_focus: CreatorIntent[];
  what_creators_get: string; // Access, learning, mentorship, early roadmap
  optional_support?: string; // Stipend, travel, tool credits - NOT the headline
  status: "pending" | "approved" | "rejected";
  created_at: string;
}
