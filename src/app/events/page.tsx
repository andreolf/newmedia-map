import Link from "next/link";
import { Header } from "@/components/Header";
import { events, chapters, getCreatorsAttendingEvent, getEventsByChapter } from "@/lib/chapters";
import { EVENT_TYPE_LABELS, Event } from "@/types";
import { Calendar, MapPin, Globe, Users, ArrowRight, Sparkles } from "lucide-react";

export const metadata = {
  title: "Events | New Media Map",
  description: "Discover Web3 events, workshops, and builder nights around the world.",
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function EventCard({ event }: { event: Event }) {
  const attendeeCount = getCreatorsAttendingEvent(event.id).length;
  const chapter = event.chapter_id ? chapters.find((c) => c.id === event.chapter_id) : null;
  const isOnline = event.event_type === "online";
  const isPast = new Date(event.start_date) < new Date();

  return (
    <Link
      href={`/events/${event.slug}`}
      className={`group block bg-[--card] rounded-xl border border-[--border] overflow-hidden hover:border-[#00ff88]/50 transition-all ${
        isPast ? "opacity-60" : ""
      }`}
    >
      {/* Event type badge header */}
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
        {isPast && <span className="ml-2 opacity-50">• Past</span>}
      </div>

      <div className="p-5">
        <h3 className="text-lg font-semibold text-[--foreground] mb-2 group-hover:text-[#00ff88] transition-colors">
          {event.name}
        </h3>

        <div className="space-y-2 text-sm text-[--muted-foreground]">
          {/* Date */}
          <div className="flex items-center gap-2">
            <Calendar size={14} />
            <span>
              {formatDate(event.start_date)}
              {event.end_date && event.end_date !== event.start_date && (
                <> – {formatDate(event.end_date)}</>
              )}
            </span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2">
            {isOnline ? (
              <>
                <Globe size={14} />
                <span>Online Event</span>
              </>
            ) : (
              <>
                <MapPin size={14} />
                <span>
                  {event.location_city}
                  {event.location_country && `, ${event.location_country}`}
                </span>
              </>
            )}
          </div>

          {/* Attendees */}
          {attendeeCount > 0 && (
            <div className="flex items-center gap-2 text-[#00ff88]">
              <Users size={14} />
              <span>
                {attendeeCount} creator{attendeeCount !== 1 ? "s" : ""} attending
              </span>
            </div>
          )}
        </div>

        <p className="text-sm text-[--muted-foreground] mt-3 line-clamp-2">
          {event.description}
        </p>

        {chapter && (
          <div className="mt-3 pt-3 border-t border-[--border]">
            <span className="text-xs text-[--muted-foreground]">
              Part of{" "}
              <span className="text-[--foreground] font-medium">{chapter.name}</span>
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}

export default function EventsPage() {
  const now = new Date();
  const upcomingEvents = events
    .filter((e) => new Date(e.start_date) >= now)
    .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());
  const pastEvents = events
    .filter((e) => new Date(e.start_date) < now)
    .sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime());

  return (
    <div className="min-h-screen bg-[--background]">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-[--foreground] mb-2">Events</h1>
          <p className="text-[--muted-foreground]">
            Web3 events, workshops, and builder nights around the world. Connect with creators
            in person.
          </p>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-[#00ff88]/10 to-[#6366f1]/10 rounded-xl border border-[#00ff88]/30 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-[--foreground] mb-1">
                Hosting an event?
              </h2>
              <p className="text-sm text-[--muted-foreground]">
                List your builder night, workshop, or conference to connect with creators.
              </p>
            </div>
            <Link
              href="/submit?type=event"
              className="flex items-center gap-2 px-4 py-2 bg-[#00ff88] text-black rounded-lg font-medium hover:bg-[#00ff88]/90 transition-colors"
            >
              <Sparkles size={16} />
              Submit event
            </Link>
          </div>
        </div>

        {/* Upcoming Events */}
        {upcomingEvents.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-[--foreground] mb-4">Upcoming Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </section>
        )}

        {/* No upcoming events */}
        {upcomingEvents.length === 0 && (
          <div className="text-center py-12 bg-[--card] rounded-xl border border-[--border] mb-12">
            <Calendar size={48} className="mx-auto text-[--muted-foreground] mb-4" />
            <h3 className="text-lg font-medium text-[--foreground] mb-2">No upcoming events</h3>
            <p className="text-[--muted-foreground]">Check back soon or submit your own event.</p>
          </div>
        )}

        {/* Past Events */}
        {pastEvents.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold text-[--foreground] mb-4">Past Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
