"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { chapters, events, getCreatorsAttendingEvent } from "@/lib/chapters";
import {
  CATEGORY_DESCRIPTIONS,
  CreatorCategory,
  CreatorIntent,
  EVENT_TYPE_LABELS,
} from "@/types";
import {
  Building2,
  Sparkles,
  Users,
  ArrowRight,
  Send,
  CheckCircle,
  Globe,
  Gift,
  Shield,
  Handshake,
  Calendar,
  MapPin,
} from "lucide-react";

// Get upcoming events with attending creator count
function getUpcomingEventsWithAttendees() {
  const now = new Date();
  return events
    .filter((e) => new Date(e.start_date) >= now)
    .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
    .map((event) => ({
      ...event,
      attendingCount: getCreatorsAttendingEvent(event.id).length,
    }));
}

const INTENT_OPTIONS: { value: CreatorIntent; label: string }[] = [
  { value: "collaboration", label: "Open to collaboration" },
  { value: "product_feedback", label: "Product feedback/co-creation" },
  { value: "research_interviews", label: "Research/interviews" },
  { value: "events_workshops", label: "Events/workshops" },
  { value: "mentorship", label: "Mentorship" },
];

export default function CompaniesPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [wantMatchmaking, setWantMatchmaking] = useState(false);
  const upcomingEvents = getUpcomingEventsWithAttendees();
  const [formData, setFormData] = useState({
    companyName: "",
    contactEmail: "",
    whatBuilding: "",
    regionFocus: "",
    eventFocus: "", // Which event they want to connect creators at
    categoryFocus: [] as CreatorCategory[],
    intentFocus: [] as CreatorIntent[],
    whatCreatorsGet: "",
    optionalSupport: "",
    additionalNotes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would submit to an API
    console.log("Company Brief submission:", { ...formData, wantMatchmaking });
    setFormSubmitted(true);
  };

  const toggleCategory = (cat: CreatorCategory) => {
    setFormData((prev) => ({
      ...prev,
      categoryFocus: prev.categoryFocus.includes(cat)
        ? prev.categoryFocus.filter((c) => c !== cat)
        : [...prev.categoryFocus, cat],
    }));
  };

  const toggleIntent = (intent: CreatorIntent) => {
    setFormData((prev) => ({
      ...prev,
      intentFocus: prev.intentFocus.includes(intent)
        ? prev.intentFocus.filter((i) => i !== intent)
        : [...prev.intentFocus, intent],
    }));
  };

  return (
    <div className="min-h-screen bg-[--background]">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[--card] border border-[--border] rounded-full text-sm text-[--muted-foreground] mb-6">
            <Building2 size={14} />
            <span>For Companies & Projects</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-[--foreground] mb-4">
            Connect with emerging creators
          </h1>
          <p className="text-xl text-[--muted-foreground] max-w-2xl mx-auto">
            Discovery and collaboration, not ads. Find creators who align with your mission.
          </p>
        </div>

        {/* Not a marketplace notice */}
        <div className="flex items-start gap-3 p-4 mb-8 bg-[#ff3366]/5 border border-[#ff3366]/20 rounded-xl max-w-3xl mx-auto">
          <Shield size={20} className="text-[#ff3366] mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-[--foreground] font-medium">
              This is not an influencer marketplace
            </p>
            <p className="text-sm text-[--muted-foreground] mt-1">
              We don&apos;t facilitate paid promotions, sponsored content, or bidding on creators.
              Company Briefs are about authentic collaboration where both sides gain value.
            </p>
          </div>
        </div>

        {/* How it works */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="bg-[--card] rounded-xl border border-[--border] p-6">
            <div className="w-12 h-12 bg-[#6366f1]/10 rounded-xl flex items-center justify-center mb-4">
              <Globe size={24} className="text-[#6366f1]" />
            </div>
            <h3 className="text-lg font-semibold text-[--foreground] mb-2">Browse by chapter</h3>
            <p className="text-[--muted-foreground] text-sm">
              Find creators in specific regions. Each chapter has curated voices from Africa,
              Europe, Americas, Asia, and MENA.
            </p>
          </div>

          <div className="bg-[--card] rounded-xl border border-[--border] p-6">
            <div className="w-12 h-12 bg-[#00ff88]/10 rounded-xl flex items-center justify-center mb-4">
              <Sparkles size={24} className="text-[#00ff88]" />
            </div>
            <h3 className="text-lg font-semibold text-[--foreground] mb-2">Submit a brief</h3>
            <p className="text-[--muted-foreground] text-sm">
              Tell us what you&apos;re building and what you&apos;re looking for. We&apos;ll
              surface it to relevant creators.
            </p>
          </div>

          <div className="bg-[--card] rounded-xl border border-[--border] p-6">
            <div className="w-12 h-12 bg-[#ff3366]/10 rounded-xl flex items-center justify-center mb-4">
              <Users size={24} className="text-[#ff3366]" />
            </div>
            <h3 className="text-lg font-semibold text-[--foreground] mb-2">Authentic content</h3>
            <p className="text-[--muted-foreground] text-sm">
              No forced talking points. Creators share genuine perspectives based on real
              experiences with your product.
            </p>
          </div>
        </div>

        {/* Upcoming Events - Find creators at conferences */}
        {upcomingEvents.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-[--foreground]">
                  <Calendar size={24} className="inline mr-2" />
                  Creators at upcoming events
                </h2>
                <p className="text-sm text-[--muted-foreground] mt-1">
                  See which creators will be at conferences and meetups
                </p>
              </div>
              <Link
                href="/events"
                className="text-sm text-[#00ff88] hover:underline flex items-center gap-1"
              >
                All events <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingEvents.slice(0, 6).map((event) => (
                <Link
                  key={event.id}
                  href={`/events/${event.slug}`}
                  className="group bg-[--card] rounded-xl border border-[--border] p-5 hover:border-[#6366f1]/50 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span
                      className={`text-xs font-bold uppercase tracking-wide px-2 py-1 rounded ${event.event_type === "conference"
                          ? "bg-[#6366f1]/10 text-[#6366f1]"
                          : event.event_type === "workshop"
                            ? "bg-[#00ff88]/10 text-[#00ff88]"
                            : "bg-[--muted] text-[--muted-foreground]"
                        }`}
                    >
                      {EVENT_TYPE_LABELS[event.event_type]}
                    </span>
                    {event.attendingCount > 0 && (
                      <span className="flex items-center gap-1 text-sm font-medium text-[#00ff88]">
                        <Users size={14} />
                        {event.attendingCount}
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-[--foreground] group-hover:text-[#6366f1] transition-colors mb-2">
                    {event.name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-[--muted-foreground]">
                    <Calendar size={14} />
                    {new Date(event.start_date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                    {event.location_city && (
                      <>
                        <span className="text-[--border]">•</span>
                        <MapPin size={14} />
                        {event.location_city}
                      </>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Chapters Browse */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-[--foreground] mb-6">Browse by chapter</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {chapters.map((chapter) => (
              <Link
                key={chapter.id}
                href={`/chapters/${chapter.slug}`}
                className="group flex flex-col items-center p-4 bg-[--card] rounded-xl border border-[--border] hover:border-[#00ff88]/50 transition-all text-center"
              >
                <span className="text-3xl mb-2">
                  {chapter.region === "Africa"
                    ? "🌍"
                    : chapter.region === "Europe"
                      ? "🌍"
                      : chapter.region === "Americas"
                        ? "🌎"
                        : chapter.region === "Asia"
                          ? "🌏"
                          : "🌍"}
                </span>
                <span className="text-sm font-medium text-[--foreground] group-hover:text-[#00ff88]">
                  {chapter.region}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Company Brief Form */}
        <section className="bg-[--card] rounded-2xl border border-[--border] overflow-hidden">
          <div className="p-8 border-b border-[--border] bg-gradient-to-r from-[#00ff88]/5 to-[#6366f1]/5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#00ff88] rounded-xl flex items-center justify-center">
                <Gift size={24} className="text-black" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-[--foreground]">
                  Submit a Company Brief
                </h2>
                <p className="text-[--muted-foreground]">
                  Describe your project and what you&apos;re looking for
                </p>
              </div>
            </div>
          </div>

          {formSubmitted ? (
            <div className="p-12 text-center">
              <CheckCircle size={48} className="mx-auto text-[#00ff88] mb-4" />
              <h3 className="text-xl font-semibold text-[--foreground] mb-2">Brief received!</h3>
              <p className="text-[--muted-foreground] mb-6">
                Our team will review your brief and get back to you within 48 hours.
              </p>
              <button
                onClick={() => {
                  setFormSubmitted(false);
                  setWantMatchmaking(false);
                  setFormData({
                    companyName: "",
                    contactEmail: "",
                    whatBuilding: "",
                    regionFocus: "",
                    eventFocus: "",
                    categoryFocus: [],
                    intentFocus: [],
                    whatCreatorsGet: "",
                    optionalSupport: "",
                    additionalNotes: "",
                  });
                }}
                className="text-[#00ff88] font-medium hover:underline"
              >
                Submit another brief
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {/* Company & Contact */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[--foreground] mb-2">
                    Company name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder="Your company or project name"
                    className="w-full px-4 py-3 border border-[--border] rounded-lg bg-[--background] text-[--foreground] focus:ring-2 focus:ring-[#00ff88] focus:border-transparent placeholder:text-[--muted-foreground]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[--foreground] mb-2">
                    Contact email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    placeholder="you@company.com"
                    className="w-full px-4 py-3 border border-[--border] rounded-lg bg-[--background] text-[--foreground] focus:ring-2 focus:ring-[#00ff88] focus:border-transparent placeholder:text-[--muted-foreground]"
                  />
                </div>
              </div>

              {/* What you're building */}
              <div>
                <label className="block text-sm font-medium text-[--foreground] mb-2">
                  What are you building? *
                </label>
                <textarea
                  required
                  value={formData.whatBuilding}
                  onChange={(e) => setFormData({ ...formData, whatBuilding: e.target.value })}
                  rows={3}
                  placeholder="Describe your product, protocol, or project in a few sentences..."
                  className="w-full px-4 py-3 border border-[--border] rounded-lg bg-[--background] text-[--foreground] focus:ring-2 focus:ring-[#00ff88] focus:border-transparent placeholder:text-[--muted-foreground]"
                />
              </div>

              {/* Matchmaking toggle - prominent option */}
              <div className="p-5 bg-[#6366f1]/10 border border-[#6366f1]/30 rounded-xl">
                <label className="flex items-start gap-4 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={wantMatchmaking}
                    onChange={(e) => setWantMatchmaking(e.target.checked)}
                    className="mt-1 w-5 h-5 rounded border-[--border] text-[#6366f1] focus:ring-[#6366f1] cursor-pointer"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Handshake size={18} className="text-[#6366f1]" />
                      <span className="font-semibold text-[--foreground]">
                        Let us find creators for you
                      </span>
                    </div>
                    <p className="text-sm text-[--muted-foreground]">
                      Don&apos;t have time to browse? Our curators will match you with relevant
                      creators based on your brief. We&apos;ll reach out with personalized
                      recommendations.
                    </p>
                  </div>
                </label>
              </div>

              {/* Region - optional */}
              {/* Region and Event in a grid */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[--foreground] mb-2">
                    Region focus
                    <span className="text-[--muted-foreground] font-normal ml-2">(optional)</span>
                  </label>
                  <select
                    value={formData.regionFocus}
                    onChange={(e) => setFormData({ ...formData, regionFocus: e.target.value })}
                    className="w-full px-4 py-3 border border-[--border] rounded-lg bg-[--background] text-[--foreground] focus:ring-2 focus:ring-[#00ff88]"
                  >
                    <option value="">All regions (global)</option>
                    {chapters.map((ch) => (
                      <option key={ch.id} value={ch.id}>
                        {ch.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[--foreground] mb-2">
                    <Calendar size={14} className="inline mr-1" />
                    Event focus
                    <span className="text-[--muted-foreground] font-normal ml-2">(optional)</span>
                  </label>
                  <p className="text-xs text-[--muted-foreground] mb-2">
                    Connect with creators attending a specific conference
                  </p>
                  <select
                    value={formData.eventFocus}
                    onChange={(e) => setFormData({ ...formData, eventFocus: e.target.value })}
                    className="w-full px-4 py-3 border border-[--border] rounded-lg bg-[--background] text-[--foreground] focus:ring-2 focus:ring-[#6366f1]"
                  >
                    <option value="">No specific event</option>
                    {upcomingEvents.map((ev) => (
                      <option key={ev.id} value={ev.id}>
                        {ev.name} ({new Date(ev.start_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })})
                        {ev.attendingCount > 0 ? ` - ${ev.attendingCount} creators` : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Category Focus - optional when matchmaking */}
              <div>
                <label className="block text-sm font-medium text-[--foreground] mb-2">
                  What type of creators?
                  {!wantMatchmaking && (
                    <span className="text-[--muted-foreground] font-normal ml-2">(select at least one, or enable matchmaking)</span>
                  )}
                  {wantMatchmaking && (
                    <span className="text-[--muted-foreground] font-normal ml-2">(optional - we&apos;ll help you decide)</span>
                  )}
                </label>
                <p className="text-xs text-[--muted-foreground] mb-3">
                  Select categories based on what creators do, not their follower count
                </p>
                <div className="flex flex-wrap gap-3">
                  {(Object.keys(CATEGORY_DESCRIPTIONS) as CreatorCategory[]).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => toggleCategory(cat)}
                      className={`group relative flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-xl transition-all cursor-pointer ${
                        formData.categoryFocus.includes(cat)
                          ? "bg-[#00ff88] text-black border-2 border-[#00ff88] shadow-[0_0_12px_rgba(0,255,136,0.3)]"
                          : "bg-[--card] text-[--foreground] border-2 border-[--border] hover:border-[#00ff88]/50 hover:bg-[#00ff88]/5"
                      }`}
                      title={CATEGORY_DESCRIPTIONS[cat]}
                    >
                      <span className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                        formData.categoryFocus.includes(cat)
                          ? "bg-black/20 border-black/30"
                          : "border-[--border] group-hover:border-[#00ff88]/50"
                      }`}>
                        {formData.categoryFocus.includes(cat) && (
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </span>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Intent Focus - optional */}
              <div>
                <label className="block text-sm font-medium text-[--foreground] mb-2">
                  What kind of engagement?
                  <span className="text-[--muted-foreground] font-normal ml-2">(optional)</span>
                </label>
                <p className="text-xs text-[--muted-foreground] mb-3">
                  Select what you&apos;re looking for from creators
                </p>
                <div className="flex flex-wrap gap-3">
                  {INTENT_OPTIONS.map((intent) => (
                    <button
                      key={intent.value}
                      type="button"
                      onClick={() => toggleIntent(intent.value)}
                      className={`group relative flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-xl transition-all cursor-pointer ${
                        formData.intentFocus.includes(intent.value)
                          ? "bg-[#6366f1] text-white border-2 border-[#6366f1] shadow-[0_0_12px_rgba(99,102,241,0.3)]"
                          : "bg-[--card] text-[--foreground] border-2 border-[--border] hover:border-[#6366f1]/50 hover:bg-[#6366f1]/5"
                      }`}
                    >
                      <span className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                        formData.intentFocus.includes(intent.value)
                          ? "bg-white/20 border-white/30"
                          : "border-[--border] group-hover:border-[#6366f1]/50"
                      }`}>
                        {formData.intentFocus.includes(intent.value) && (
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </span>
                      {intent.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* What creators get - optional */}
              <div>
                <label className="block text-sm font-medium text-[--foreground] mb-2">
                  What do creators get?
                  <span className="text-[--muted-foreground] font-normal ml-2">(optional)</span>
                </label>
                <p className="text-xs text-[--muted-foreground] mb-3">
                  Focus on access, learning, mentorship, early roadmap—not compensation
                </p>
                <textarea
                  value={formData.whatCreatorsGet}
                  onChange={(e) => setFormData({ ...formData, whatCreatorsGet: e.target.value })}
                  rows={3}
                  placeholder="e.g., Early access to our SDK, direct line to the founding team, feedback on our roadmap, co-creation opportunities..."
                  className="w-full px-4 py-3 border border-[--border] rounded-lg bg-[--background] text-[--foreground] focus:ring-2 focus:ring-[#00ff88] focus:border-transparent placeholder:text-[--muted-foreground]"
                />
              </div>

              {/* Optional support */}
              <div>
                <label className="block text-sm font-medium text-[--foreground] mb-2">
                  Optional support
                  <span className="text-[--muted-foreground] font-normal ml-2">(if any)</span>
                </label>
                <p className="text-xs text-[--muted-foreground] mb-3">
                  Not required—many creators participate for access alone.
                </p>
                <input
                  type="text"
                  value={formData.optionalSupport}
                  onChange={(e) => setFormData({ ...formData, optionalSupport: e.target.value })}
                  placeholder="e.g., Stipend for travel, tool credits, etc."
                  className="w-full px-4 py-3 border border-[--border] rounded-lg bg-[--background] text-[--foreground] focus:ring-2 focus:ring-[#00ff88] focus:border-transparent placeholder:text-[--muted-foreground]"
                />
              </div>

              {/* Anything else - freeform for matchmaking */}
              <div>
                <label className="block text-sm font-medium text-[--foreground] mb-2">
                  Anything else we should know?
                  <span className="text-[--muted-foreground] font-normal ml-2">(optional)</span>
                </label>
                <textarea
                  value={formData.additionalNotes}
                  onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                  rows={2}
                  placeholder="Timeline, specific verticals, languages, anything that helps us understand your needs..."
                  className="w-full px-4 py-3 border border-[--border] rounded-lg bg-[--background] text-[--foreground] focus:ring-2 focus:ring-[#00ff88] focus:border-transparent placeholder:text-[--muted-foreground]"
                />
              </div>

              {/* Submit */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={!wantMatchmaking && formData.categoryFocus.length === 0}
                  className="flex items-center justify-center gap-2 w-full md:w-auto px-8 py-4 bg-[#00ff88] text-black rounded-xl font-bold hover:bg-[#00ff88]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={18} />
                  {wantMatchmaking ? "Request matchmaking" : "Submit brief"}
                </button>
                {!wantMatchmaking && formData.categoryFocus.length === 0 && (
                  <p className="text-xs text-[#ff3366] mt-2">
                    Select at least one category, or enable &quot;Let us find creators for you&quot;
                  </p>
                )}
              </div>
            </form>
          )}
        </section>
      </main>
    </div>
  );
}
