import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { CreatorCard } from "@/components/CreatorCard";
import chaptersData from "@/data/chapters.json";
import creatorsData from "@/data/creators.json";
import { Chapter, Creator, ChapterRegion } from "@/types";
import { Users, ArrowLeft, Send } from "lucide-react";

// Transform chapter data directly in this file
const chapters: Chapter[] = chaptersData.map((data) => ({
  id: data.id,
  name: data.name,
  slug: data.slug,
  region: data.region as ChapterRegion,
  description: data.description,
  cover_image_url: data.cover_image_url ?? undefined,
  created_at: data.created_at,
  updated_at: data.updated_at,
}));

const creators = creatorsData as Creator[];

function getChapterBySlug(slug: string): Chapter | undefined {
  return chapters.find((c) => c.slug === slug);
}

function getCreatorsByChapter(chapterId: string): Creator[] {
  return creators.filter((c) => c.chapter_ids?.includes(chapterId));
}

function getRegionEmoji(region: string): string {
  const emojis: Record<string, string> = {
    Africa: "🌍",
    Europe: "🌍",
    Americas: "🌎",
    Asia: "🌏",
    MENA: "🌍",
  };
  return emojis[region] || "🌐";
}

// Static generation - create pages at build time
export const dynamicParams = false;

export function generateStaticParams() {
  return chapters.map((chapter) => ({
    slug: chapter.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const chapter = getChapterBySlug(slug);
  if (!chapter) return { title: "Chapter Not Found" };

  return {
    title: `${chapter.name} | New Media Map`,
    description: chapter.description,
  };
}

export default async function ChapterPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const chapter = getChapterBySlug(slug);

  if (!chapter) {
    notFound();
  }

  const chapterCreators = getCreatorsByChapter(chapter.id);
  const emoji = getRegionEmoji(chapter.region);

  return (
    <div className="min-h-screen bg-[--background] relative">
      {/* Grain overlay */}
      <div className="grain" />
      
      {/* Background mesh */}
      <div className="fixed inset-0 mesh-gradient pointer-events-none" />
      
      <Header />

      <main className="relative">
        {/* Hero */}
        <div className="bg-gradient-to-br from-[--muted] to-[--card] border-b border-[--border]">
          <div className="max-w-6xl mx-auto px-4 py-12">
            <Link
              href="/chapters"
              className="inline-flex items-center gap-2 text-sm text-[--muted-foreground] hover:text-[#00ff88] mb-6 transition-colors"
            >
              <ArrowLeft size={16} />
              All chapters
            </Link>

            <div className="flex flex-col sm:flex-row items-start gap-6">
              <div className="w-20 h-20 bg-[--card] rounded-2xl flex items-center justify-center border border-[--border]">
                <span className="text-4xl">{emoji}</span>
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="font-display text-3xl font-bold text-[--foreground]">
                    {chapter.name}
                  </h1>
                  <span className="px-2.5 py-1 bg-[--muted] border border-[--border] rounded-full text-sm font-medium text-[--muted-foreground]">
                    {chapter.region}
                  </span>
                </div>
                <p className="text-lg text-[--muted-foreground] max-w-2xl">
                  {chapter.description}
                </p>

                <div className="flex items-center gap-6 mt-4">
                  <div className="flex items-center gap-2 text-[--muted-foreground]">
                    <Users size={18} />
                    <span>
                      {chapterCreators.length} featured creator
                      {chapterCreators.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Creators */}
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl font-bold text-[--foreground]">
              Featured <span className="text-[#00ff88]">Creators</span>
            </h2>
            <Link
              href={`/creators?chapter=${chapter.id}`}
              className="text-sm font-medium text-[#00ff88] hover:underline underline-offset-4"
            >
              View all →
            </Link>
          </div>

          {chapterCreators.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {chapterCreators.map((creator) => (
                <CreatorCard
                  key={creator.id}
                  creator={creator}
                  chapterId={chapter.id}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 gradient-border">
              <p className="text-[--muted-foreground] mb-4">
                No creators featured in this chapter yet.
              </p>
              <Link
                href="/submit"
                className="inline-flex items-center gap-2 text-[#00ff88] hover:underline underline-offset-4"
              >
                Submit a creator
              </Link>
            </div>
          )}
        </div>

        {/* Submit CTA */}
        <div className="max-w-6xl mx-auto px-4 pb-12">
          <div className="relative overflow-hidden gradient-border p-8 text-center">
            {/* Background glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#6366f1] rounded-full blur-[100px] opacity-20" />
            
            <div className="relative">
              <h3 className="font-display text-xl font-bold text-[--foreground] mb-2">
                Know someone who should be featured?
              </h3>
              <p className="text-[--muted-foreground] mb-4">
                Submit a creator to {chapter.name}. We prioritize signal over clout.
              </p>
              <Link
                href={`/submit?chapter=${chapter.id}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#6366f1] text-white rounded-lg font-semibold hover:bg-[#5558e3] transition-colors"
              >
                <Send size={16} />
                Submit to this chapter
              </Link>
            </div>
          </div>
        </div>

        {/* Curators Section */}
        <div className="max-w-6xl mx-auto px-4 pb-12">
          <div className="bg-[--muted] rounded-xl p-6 border border-[--border]">
            <p className="text-sm text-[--muted-foreground] text-center">
              <span className="font-medium text-[--foreground]">Curated by {chapter.name} Chapter</span>
              <span className="mx-2">·</span>
              <Link
                href="/submit"
                className="text-[#00ff88] hover:underline underline-offset-4"
              >
                Apply to curate
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
