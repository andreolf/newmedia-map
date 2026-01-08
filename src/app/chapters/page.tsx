import Link from "next/link";
import { Header } from "@/components/Header";
import { chapters, getCreatorsByChapter, getRegionEmoji } from "@/lib/chapters";
import { MapPin, Users, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Chapters | New Media Map",
  description: "Regional chapters connecting emerging Web3 creators worldwide",
};

function ChapterCard({ chapter }: { chapter: (typeof chapters)[0] }) {
  const creatorCount = getCreatorsByChapter(chapter.id).length;
  const emoji = getRegionEmoji(chapter.region);

  return (
    <Link
      href={`/chapters/${chapter.slug}`}
      className="group block bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 overflow-hidden hover:shadow-lg hover:border-stone-300 dark:hover:border-stone-600 transition-all"
    >
      {/* Cover gradient */}
      <div className="h-32 bg-gradient-to-br from-stone-100 to-stone-200 dark:from-stone-700 dark:to-stone-800 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-5xl">{emoji}</span>
        </div>
        <div className="absolute top-3 right-3">
          <span className="px-2 py-1 bg-white/80 dark:bg-stone-900/80 backdrop-blur-sm rounded-full text-xs font-medium text-stone-600 dark:text-stone-300">
            {chapter.region}
          </span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {chapter.name}
        </h3>
        <p className="text-sm text-stone-500 dark:text-stone-400 line-clamp-2 mb-4">
          {chapter.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm text-stone-500 dark:text-stone-400">
            <Users size={14} />
            <span>
              {creatorCount} creator{creatorCount !== 1 ? "s" : ""}
            </span>
          </div>
          <span className="flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:gap-2 transition-all">
            Explore
            <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function ChaptersPage() {
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-900">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-stone-900 dark:text-stone-100 mb-4">
            Regional Chapters
          </h1>
          <p className="text-lg text-stone-500 dark:text-stone-400 max-w-2xl mx-auto">
            New Media Map operates through regional chapters—local communities
            curating and connecting emerging Web3 voices in their part of the
            world.
          </p>
        </div>

        {/* Chapter Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chapters.map((chapter) => (
            <ChapterCard key={chapter.id} chapter={chapter} />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <div className="inline-block bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 p-8">
            <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100 mb-2">
              Start a chapter in your region
            </h2>
            <p className="text-stone-500 dark:text-stone-400 mb-4">
              Know your local Web3 scene? Help us surface emerging voices.
            </p>
            <Link
              href="/submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-lg font-medium hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors"
            >
              <MapPin size={16} />
              Apply to curate
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
