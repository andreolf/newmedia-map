import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { CreatorCard } from "@/components/CreatorCard";
import {
  chapters,
  getChapterBySlug,
  getCreatorsByChapter,
  getRegionEmoji,
  getLatestDropForChapter,
  getDropCreators,
  getEventsByChapter,
} from "@/lib/chapters";
import { EVENT_TYPE_LABELS, INTENT_LABELS, CreatorIntent } from "@/types";
import {
  Users,
  ArrowLeft,
  Send,
  Sparkles,
  Calendar,
  MapPin,
  Globe,
  ArrowRight,
} from "lucide-react";

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

function formatMonth(monthStr: string): string {
  const [year, month] = monthStr.split("-");
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export default async function ChapterPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const chapter = getChapterBySlug(slug);

  if (!chapter) {
    notFound();
  }

  const chapterCreators = getCreatorsByChapter(chapter.id);
  const emoji = getRegionEmoji(chapter.region);
  const latestDrop = getLatestDropForChapter(chapter.id);
  const dropCreators = latestDrop ? getDropCreators(latestDrop) : [];
  const chapterEvents = getEventsByChapter(chapter.id);

  // Get creators open to various intents
  const openToCollab = chapterCreators.filter((c) => c.intents?.includes("collaboration"));
  const openToMeetups = chapterCreators.filter((c) => c.intents?.includes("local_meetups"));

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
                <p className="text-lg text-[--muted-foreground] max-w-2xl">{chapter.description}</p>

                <div className="flex flex-wrap items-center gap-6 mt-4">
                  <div className="flex items-center gap-2 text-[--muted-foreground]">
                    <Users size={18} />
                    <span>
                      {chapterCreators.length} creator
                      {chapterCreators.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  {openToCollab.length > 0 && (
                    <div className="flex items-center gap-2 text-[#6366f1]">
                      <Sparkles size={16} />
                      <span>{openToCollab.length} open to collaboration</span>
                    </div>
                  )}
                  {openToMeetups.length > 0 && (
                    <div className="flex items-center gap-2 text-[#00ff88]">
                      <MapPin size={16} />
                      <span>{openToMeetups.length} open to meetups</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-12 space-y-12">
          {/* Monthly Drop (if exists) */}
          {latestDrop && dropCreators.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#ff3366]/10 rounded-xl flex items-center justify-center">
                  <Sparkles size={20} className="text-[#ff3366]" />
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold text-[--foreground]">
                    {formatMonth(latestDrop.month)} Drop
                  </h2>
                  <p className="text-sm text-[--muted-foreground]">{latestDrop.title}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dropCreators.map((creator) => (
                  <CreatorCard key={creator.id} creator={creator} chapterId={chapter.id} />
                ))}
              </div>
            </section>
          )}

          {/* Featured Creators */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold text-[--foreground]">
                Featured <span className="text-[#00ff88]">Creators</span>
              </h2>
              <Link
                href={`/creators?chapter=${chapter.id}`}
                className="flex items-center gap-1 text-sm font-medium text-[#00ff88] hover:underline underline-offset-4"
              >
                View all
                <ArrowRight size={14} />
              </Link>
            </div>

            {/* Filter by intent - client component would be better but keeping simple */}
            <div className="flex flex-wrap gap-2 mb-6">
              <Link
                href={`/creators?chapter=${chapter.id}`}
                className="px-3 py-1.5 rounded-full text-xs font-medium bg-[--muted] text-[--foreground] border border-[--border]"
              >
                All creators
              </Link>
              <Link
                href={`/creators?chapter=${chapter.id}&intents=collaboration`}
                className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#6366f1]/10 text-[#6366f1] border border-[#6366f1]/30"
              >
                Open to collaboration ({openToCollab.length})
              </Link>
              <Link
                href={`/creators?chapter=${chapter.id}&intents=local_meetups`}
                className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/30"
              >
                Open to meetups ({openToMeetups.length})
              </Link>
            </div>

            {chapterCreators.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {chapterCreators.slice(0, 6).map((creator) => (
                  <CreatorCard key={creator.id} creator={creator} chapterId={chapter.id} />
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

            {chapterCreators.length > 6 && (
              <div className="text-center mt-6">
                <Link
                  href={`/creators?chapter=${chapter.id}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[--muted] text-[--foreground] rounded-lg font-medium hover:bg-[--border] transition-colors"
                >
                  View all {chapterCreators.length} creators
                  <ArrowRight size={16} />
                </Link>
              </div>
            )}
          </section>

          {/* Chapter Events */}
          {chapterEvents.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl font-bold text-[--foreground]">
                  <Calendar size={20} className="inline mr-2" />
                  Upcoming Events
                </h2>
                <Link
                  href="/events"
                  className="flex items-center gap-1 text-sm font-medium text-[#00ff88] hover:underline underline-offset-4"
                >
                  All events
                  <ArrowRight size={14} />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {chapterEvents.slice(0, 2).map((event) => (
                  <Link
                    key={event.id}
                    href={`/events/${event.slug}`}
                    className="group flex items-start gap-4 p-4 bg-[--card] rounded-xl border border-[--border] hover:border-[#00ff88]/50 transition-all"
                  >
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        event.event_type === "conference"
                          ? "bg-[#6366f1]/10"
                          : event.event_type === "workshop"
                          ? "bg-[#00ff88]/10"
                          : "bg-[#ff3366]/10"
                      }`}
                    >
                      {event.event_type === "online" ? (
                        <Globe size={20} className="text-[--muted-foreground]" />
                      ) : (
                        <MapPin
                          size={20}
                          className={
                            event.event_type === "conference"
                              ? "text-[#6366f1]"
                              : event.event_type === "workshop"
                              ? "text-[#00ff88]"
                              : "text-[#ff3366]"
                          }
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium uppercase tracking-wide text-[--muted-foreground] mb-1">
                        {EVENT_TYPE_LABELS[event.event_type]}
                      </p>
                      <h3 className="font-semibold text-[--foreground] group-hover:text-[#00ff88] transition-colors truncate">
                        {event.name}
                      </h3>
                      <p className="text-sm text-[--muted-foreground]">
                        {new Date(event.start_date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                        {event.location_city && ` · ${event.location_city}`}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Submit CTA */}
          <section>
            <div className="relative overflow-hidden gradient-border p-8 text-center">
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
          </section>

          {/* Curators Section */}
          <section>
            <div className="bg-[--muted] rounded-xl p-6 border border-[--border]">
              <p className="text-sm text-[--muted-foreground] text-center">
                <span className="font-medium text-[--foreground]">
                  Curated by {chapter.name} Chapter
                </span>
                <span className="mx-2">·</span>
                <Link
                  href="/submit"
                  className="text-[#00ff88] hover:underline underline-offset-4"
                >
                  Apply to curate
                </Link>
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
