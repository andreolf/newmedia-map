import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Avatar } from "@/components/Avatar";
import { TagChip } from "@/components/TagChip";
import { ArtifactIconRow } from "@/components/ArtifactIconRow";
import { ClaimProfileButton } from "@/components/ClaimProfileButton";
import { BookmarkSection } from "@/components/BookmarkSection";
import { ArtifactPreview } from "@/components/ArtifactPreview";
import { RelatedCreators } from "@/components/RelatedCreators";
import { ShareableCard } from "@/components/ShareableCard";
import { DiscoveryBadge } from "@/components/DiscoveryBadge";
import { BadgeRow } from "@/components/Badge";
import creatorsData from "@/data/creators.json";
import { Creator, Artifact } from "@/types";
import { contentFormatLabels, trajectoryLabels } from "@/lib/constants";
import {
  MapPin,
  ArrowLeft,
  ExternalLink,
  Youtube,
  Twitter,
  Github,
  Globe,
  BookOpen,
  Mic,
  FileText,
  Presentation,
  Quote,
} from "lucide-react";

const creators = creatorsData as Creator[];

const iconMap: Record<string, React.ElementType> = {
  youtube: Youtube,
  x: Twitter,
  github: Github,
  website: Globe,
  substack: BookOpen,
  podcast: Mic,
  article: FileText,
  talk: Presentation,
};

// Generate static params for all creators
export function generateStaticParams() {
  return creators.map((creator) => ({
    id: creator.id,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const creator = creators.find((c) => c.id === id);
  if (!creator) return { title: "Creator Not Found" };

  return {
    title: `${creator.name} | New Media Map`,
    description: creator.editorial_reason,
  };
}

function ArtifactCard({ artifact }: { artifact: Artifact }) {
  const Icon = iconMap[artifact.type] || Globe;

  return (
    <a
      href={artifact.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-4 p-4 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl hover:border-stone-300 dark:hover:border-stone-600 hover:shadow-sm transition-all"
    >
      <div className="w-10 h-10 rounded-lg bg-stone-100 dark:bg-stone-700 flex items-center justify-center group-hover:bg-stone-200 dark:group-hover:bg-stone-600 transition-colors">
        <Icon size={20} className="text-stone-500 dark:text-stone-400" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-stone-900 dark:text-stone-100 truncate">
          {artifact.title}
        </div>
        <div className="text-xs text-stone-400 dark:text-stone-500 capitalize">{artifact.type}</div>
      </div>
      <ExternalLink
        size={16}
        className="text-stone-300 dark:text-stone-600 group-hover:text-stone-500 dark:group-hover:text-stone-400 transition-colors"
      />
    </a>
  );
}

export default async function CreatorProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const creator = creators.find((c) => c.id === id);

  if (!creator) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-900">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Link */}
        <Link
          href="/creators"
          className="inline-flex items-center gap-2 text-sm text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 mb-8 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to directory
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Header */}
            <header className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl p-8">
              <div className="flex flex-col sm:flex-row items-start gap-6">
                <Avatar
                  name={creator.name}
                  avatarUrl={creator.avatar_url}
                  primarySignal={creator.primary_signal}
                  size="xl"
                />

                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <h1 className="font-serif text-3xl text-stone-900 dark:text-stone-100">
                      {creator.name}
                    </h1>
                    <BookmarkSection creatorId={creator.id} />
                  </div>

                  {/* Curator Badges */}
                  {creator.badges && creator.badges.length > 0 && (
                    <div className="mt-2">
                      <BadgeRow badges={creator.badges} maxShow={5} size="md" />
                    </div>
                  )}

                  <div className="flex items-center gap-1 text-stone-500 dark:text-stone-400 mt-2">
                    <MapPin size={16} />
                    <span>
                      {creator.city ? `${creator.city}, ` : ""}
                      {creator.country}
                    </span>
                  </div>

                  <p className="text-stone-600 dark:text-stone-300 mt-4 text-lg leading-relaxed">
                    {creator.editorial_reason}
                  </p>

                  {/* Signals */}
                  <div className="flex flex-wrap gap-2 mt-6">
                    {creator.signals.map((signal) => (
                      <TagChip key={signal} label={signal} variant="signal" size="md" />
                    ))}
                  </div>

                  {/* Content Formats & Trajectory */}
                  <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-stone-100 dark:border-stone-700">
                    <div className="text-sm text-stone-500 dark:text-stone-400">
                      <span className="font-medium">Formats:</span>{" "}
                      {creator.content_formats
                        .map((f) => contentFormatLabels[f] || f)
                        .join(", ")}
                    </div>
                    <span className="text-stone-300 dark:text-stone-600">•</span>
                    <div className="text-sm text-stone-500 dark:text-stone-400">
                      <span className="font-medium">Trajectory:</span>{" "}
                      {trajectoryLabels[creator.trajectory] || creator.trajectory}
                    </div>
                    {creator.no_conference_circuit && (
                      <>
                        <span className="text-stone-300 dark:text-stone-600">•</span>
                        <span className="text-xs px-2 py-1 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 rounded-full">
                          No conference circuit
                        </span>
                      </>
                    )}
                  </div>

                  {/* Artifact Icons */}
                  <div className="mt-4">
                    <ArtifactIconRow artifacts={creator.artifacts} size="md" />
                  </div>
                </div>
              </div>
            </header>

            {/* Proof of Work */}
            <section>
              <h2 className="font-serif text-2xl text-stone-900 dark:text-stone-100 mb-4">
                Proof of Work
              </h2>
              <div className="grid gap-4">
                {/* Featured artifact (first YouTube if available) */}
                {creator.artifacts.find((a) => a.type === "youtube") && (
                  <ArtifactPreview artifact={creator.artifacts.find((a) => a.type === "youtube")!} />
                )}
                
                {/* Other artifacts */}
                <div className="grid gap-3 sm:grid-cols-2">
                  {creator.artifacts
                    .filter((a) => a.type !== "youtube" || a !== creator.artifacts.find((x) => x.type === "youtube"))
                    .map((artifact, i) => (
                      <ArtifactPreview key={i} artifact={artifact} />
                    ))}
                </div>
              </div>
            </section>

            {/* Community Validation */}
            {creator.recommendations.length > 0 && (
              <section>
                <h2 className="font-serif text-2xl text-stone-900 dark:text-stone-100 mb-4">
                  Community Validation
                </h2>
                <div className="space-y-4">
                  {creator.recommendations.map((rec, i) => (
                    <blockquote
                      key={i}
                      className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl p-6"
                    >
                      <Quote size={24} className="text-stone-200 dark:text-stone-700 mb-3" />
                      <p className="text-stone-600 dark:text-stone-300 italic leading-relaxed">
                        &ldquo;{rec.context}&rdquo;
                      </p>
                      <footer className="mt-4 text-sm font-medium text-stone-900 dark:text-stone-100">
                        — {rec.name}
                      </footer>
                    </blockquote>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Share Card */}
            <ShareableCard creator={creator} />

            {/* Discovery Badge */}
            <DiscoveryBadge creator={creator} />

            {/* Claim Profile */}
            <ClaimProfileButton creator={creator} />

            {/* Related Creators */}
            <RelatedCreators currentCreator={creator} maxResults={3} />
          </div>
        </div>
      </main>
    </div>
  );
}
