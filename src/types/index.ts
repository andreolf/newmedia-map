export interface Artifact {
  type: "youtube" | "x" | "github" | "substack" | "website" | "talk" | "podcast" | "article";
  title: string;
  url: string;
}

export interface Recommendation {
  name: string;
  context: string;
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
}

export type ContentFormat = "video" | "writing" | "podcast" | "threads" | "code" | "talks";

export type Trajectory = "emerging" | "breakout" | "quiet-contributor" | "builder-educator";

