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
export const dynamicParams = false; // Only allow paths from generateStaticParams

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
    <div className="min-h-screen bg-stone-50 dark:bg-stone-900">
      <Header />

      <main>
        {/* Hero */}
        <div className="bg-gradient-to-br from-stone-100 to-stone-200 dark:from-stone-800 dark:to-stone-900 border-b border-stone-200 dark:border-stone-700">
          <div className="max-w-6xl mx-auto px-4 py-12">
            <Link
              href="/chapters"
              className="inline-flex items-center gap-2 text-sm text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 mb-6"
            >
              <ArrowLeft size={16} />
              All chapters
            </Link>

            <div className="flex items-start gap-6">
              <div className="w-20 h-20 bg-white dark:bg-stone-700 rounded-2xl flex items-center justify-center shadow-sm">
                <span className="text-4xl">{emoji}</span>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">
                    {chapter.name}
                  </h1>
                  <span className="px-2.5 py-1 bg-stone-200 dark:bg-stone-700 rounded-full text-sm font-medium text-stone-600 dark:text-stone-300">
                    {chapter.region}
                  </span>
                </div>
                <p className="text-lg text-stone-600 dark:text-stone-400 max-w-2xl">
                  {chapter.description}
                </p>

                <div className="flex items-center gap-6 mt-4">
                  <div className="flex items-center gap-2 text-stone-500 dark:text-stone-400">
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
            <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
              Featured Creators
            </h2>
            <Link
              href={`/creators?chapter=${chapter.id}`}
              className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
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
            <div className="text-center py-12 bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700">
              <p className="text-stone-500 dark:text-stone-400 mb-4">
                No creators featured in this chapter yet.
              </p>
              <Link
                href="/submit"
                className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
              >
                Submit a creator
              </Link>
            </div>
          )}
        </div>

        {/* Submit CTA */}
        <div className="max-w-6xl mx-auto px-4 pb-12">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl border border-blue-100 dark:border-blue-900 p-8 text-center">
            <h3 className="text-xl font-semibold text-stone-900 dark:text-stone-100 mb-2">
              Know someone who should be featured?
            </h3>
            <p className="text-stone-600 dark:text-stone-400 mb-4">
              Submit a creator to {chapter.name}. We prioritize signal over
              clout.
            </p>
            <Link
              href={`/submit?chapter=${chapter.id}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <Send size={16} />
              Submit to this chapter
            </Link>
          </div>
        </div>

        {/* Curators Section */}
        <div className="max-w-6xl mx-auto px-4 pb-12">
          <div className="bg-stone-100 dark:bg-stone-800/50 rounded-xl p-6">
            <p className="text-sm text-stone-500 dark:text-stone-400 text-center">
              <span className="font-medium">Curated by {chapter.name} Chapter</span>
              <span className="mx-2">·</span>
              <Link
                href="/submit"
                className="text-blue-600 dark:text-blue-400 hover:underline"
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
