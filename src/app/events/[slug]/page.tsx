import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { CreatorCard } from "@/components/CreatorCard";
import {
  events,
  getEventBySlug,
  getCreatorsAttendingEvent,
  getChapterById,
  creators,
} from "@/lib/chapters";
import { EVENT_TYPE_LABELS } from "@/types";
import {
  Calendar,
  MapPin,
  Globe,
  Users,
  ArrowLeft,
  ExternalLink,
  Plus,
  Sparkles,
} from "lucide-react";

export const dynamicParams = false;

export function generateStaticParams() {
  return events.map((event) => ({
    slug: event.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  if (!event) return { title: "Event Not Found" };

  return {
    title: `${event.name} | New Media Map`,
    description: event.description,
  };
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  const attendingCreators = getCreatorsAttendingEvent(event.id);
  const chapter = event.chapter_id ? getChapterById(event.chapter_id) : null;
  const isOnline = event.event_type === "online";
  const isPast = new Date(event.start_date) < new Date();

  // Get related creators (from same chapter or random if no chapter)
  const relatedCreators = event.chapter_id
    ? creators.filter((c) => c.chapter_ids?.includes(event.chapter_id!)).slice(0, 6)
    : creators.slice(0, 6);

  return (
    <div className="min-h-screen bg-[--background]">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Back link */}
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-[--muted-foreground] hover:text-[--foreground] mb-6"
        >
          <ArrowLeft size={16} />
          Back to events
        </Link>

        {/* Event header */}
        <div className="bg-[--card] rounded-xl border border-[--border] overflow-hidden mb-8">
          {/* Type badge */}
          <div
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wide ${
              event.event_type === "conference"
                ? "bg-[#6366f1]/10 text-[#6366f1]"
                : event.event_type === "workshop"
                ? "bg-[#00ff88]/10 text-[#00ff88]"
                : event.event_type === "builder_night"
                ? "bg-[#ff3366]/10 text-[#ff3366]"
                : "bg-[--muted] text-[--muted-foreground]"
            }`}
          >
            {EVENT_TYPE_LABELS[event.event_type]}
            {isPast && <span className="ml-2 opacity-50">• Past event</span>}
          </div>

          <div className="p-6">
            <h1 className="font-display text-3xl font-bold text-[--foreground] mb-4">
              {event.name}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Date */}
              <div className="flex items-center gap-3 text-[--foreground]">
                <div className="w-10 h-10 bg-[#00ff88]/10 rounded-lg flex items-center justify-center">
                  <Calendar size={20} className="text-[#00ff88]" />
                </div>
                <div>
                  <p className="font-medium">{formatDate(event.start_date)}</p>
                  {event.end_date && event.end_date !== event.start_date && (
                    <p className="text-sm text-[--muted-foreground]">
                      to {formatDate(event.end_date)}
                    </p>
                  )}
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-3 text-[--foreground]">
                <div className="w-10 h-10 bg-[#6366f1]/10 rounded-lg flex items-center justify-center">
                  {isOnline ? (
                    <Globe size={20} className="text-[#6366f1]" />
                  ) : (
                    <MapPin size={20} className="text-[#6366f1]" />
                  )}
                </div>
                <div>
                  {isOnline ? (
                    <p className="font-medium">Online Event</p>
                  ) : (
                    <>
                      <p className="font-medium">{event.location_city}</p>
                      {event.location_country && (
                        <p className="text-sm text-[--muted-foreground]">
                          {event.location_country}
                        </p>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            <p className="text-[--muted-foreground] leading-relaxed mb-6">{event.description}</p>

            <div className="flex flex-wrap gap-3">
              {event.website_url && (
                <a
                  href={event.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-[#00ff88] text-black rounded-lg font-medium hover:bg-[#00ff88]/90 transition-colors"
                >
                  <ExternalLink size={16} />
                  Visit website
                </a>
              )}
              {chapter && (
                <Link
                  href={`/chapters/${chapter.slug}`}
                  className="flex items-center gap-2 px-4 py-2 bg-[--muted] text-[--foreground] rounded-lg font-medium hover:bg-[--border] transition-colors"
                >
                  Part of {chapter.name}
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Attending creators */}
        {attendingCreators.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-[--foreground]">
                <Users size={20} className="inline mr-2" />
                Creators Attending
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {attendingCreators.map((creator) => (
                <CreatorCard key={creator.id} creator={creator} compact />
              ))}
            </div>
          </section>
        )}

        {/* Opt-in CTA */}
        {!isPast && (
          <div className="bg-gradient-to-r from-[#00ff88]/10 to-[#6366f1]/10 rounded-xl border border-[#00ff88]/30 p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-[--foreground] mb-1">
                  Attending this event?
                </h2>
                <p className="text-sm text-[--muted-foreground]">
                  Let others know you&apos;ll be there and connect before the event.
                </p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-[#00ff88] text-black rounded-lg font-medium hover:bg-[#00ff88]/90 transition-colors">
                <Plus size={16} />
                I&apos;m attending
              </button>
            </div>
          </div>
        )}

        {/* Related creators */}
        {relatedCreators.length > 0 && attendingCreators.length === 0 && (
          <section>
            <h2 className="text-xl font-semibold text-[--foreground] mb-4">
              <Sparkles size={20} className="inline mr-2" />
              {chapter ? `Creators from ${chapter.name}` : "Featured Creators"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relatedCreators.slice(0, 4).map((creator) => (
                <CreatorCard key={creator.id} creator={creator} compact />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
