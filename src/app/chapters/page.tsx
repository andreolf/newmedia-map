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
      className="group block gradient-border overflow-hidden hover:scale-[1.02] transition-all"
    >
      {/* Cover gradient */}
      <div className="h-32 bg-gradient-to-br from-[--muted] to-[--card] relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-5xl">{emoji}</span>
        </div>
        <div className="absolute top-3 right-3">
          <span className="px-2.5 py-1 bg-[--background]/80 backdrop-blur-sm rounded-full text-xs font-medium text-[--muted-foreground]">
            {chapter.region}
          </span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-semibold text-[--foreground] mb-2 group-hover:text-[#00ff88] transition-colors">
          {chapter.name}
        </h3>
        <p className="text-sm text-[--muted-foreground] line-clamp-2 mb-4">
          {chapter.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm text-[--muted-foreground]">
            <Users size={14} />
            <span>
              {creatorCount} creator{creatorCount !== 1 ? "s" : ""}
            </span>
          </div>
          <span className="flex items-center gap-1 text-sm font-medium text-[#00ff88] group-hover:gap-2 transition-all">
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
    <div className="min-h-screen bg-[--background] relative">
      {/* Grain overlay */}
      <div className="grain" />
      
      {/* Background mesh */}
      <div className="fixed inset-0 mesh-gradient pointer-events-none" />
      
      <Header />

      <main className="relative max-w-6xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-[--foreground] mb-4">
            Regional <span className="text-[#6366f1]">Chapters</span>
          </h1>
          <p className="text-lg text-[--muted-foreground] max-w-2xl mx-auto">
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
          <div className="inline-block gradient-border p-8">
            <h2 className="text-xl font-semibold text-[--foreground] mb-2">
              Start a chapter in your region
            </h2>
            <p className="text-[--muted-foreground] mb-4">
              Know your local Web3 scene? Help us surface emerging voices.
            </p>
            <Link
              href="/submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#00ff88] text-[#0a0a0f] rounded-lg font-semibold hover:bg-[#00cc6f] transition-colors glow-accent"
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
