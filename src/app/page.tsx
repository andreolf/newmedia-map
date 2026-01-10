import Link from "next/link";
import { ArrowRight, Users, Sparkles, Globe, FileCheck, MapPin, Zap, Radio } from "lucide-react";
import { chapters, creators, getRegionEmoji } from "@/lib/chapters";
import { CreatorCard } from "@/components/CreatorCard";

// Get featured creators from different chapters for diversity
function getFeaturedCreators(limit = 6) {
  return [...creators]
    .sort((a, b) => {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, limit);
}

export default function HomePage() {
  const featuredCreators = getFeaturedCreators(6);
  const featuredChapters = chapters.slice(0, 4);

  return (
    <main className="min-h-screen bg-[--background] relative">
      {/* Grain overlay */}
      <div className="grain" />
      
      {/* Mesh gradient background */}
      <div className="fixed inset-0 mesh-gradient pointer-events-none" />

      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center">
        {/* Animated orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00ff88] rounded-full blur-[150px] opacity-20 animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#6366f1] rounded-full blur-[120px] opacity-15 animate-pulse-glow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-[#ff3366] rounded-full blur-[100px] opacity-10 animate-pulse-glow" style={{ animationDelay: '1s' }} />

        <div className="relative max-w-6xl mx-auto px-6 py-20 sm:py-28 w-full">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[--card] border border-[--border] rounded-full text-sm text-[--muted-foreground] mb-8 backdrop-blur">
              <Radio size={14} className="text-[#00ff88]" />
              <span className="uppercase tracking-wider text-xs font-medium">Signal over clout</span>
            </div>

            {/* Title */}
            <h1 className="font-display text-6xl sm:text-7xl lg:text-8xl font-bold text-[--foreground] tracking-tight leading-[0.95]">
              <span className="gradient-text">New Media</span>
              <br />
              <span className="text-[--foreground]">Map</span>
            </h1>

            {/* Tagline */}
            <p className="mt-8 text-xl sm:text-2xl text-[--muted-foreground] max-w-2xl mx-auto leading-relaxed font-light">
              A living map of emerging <span className="text-[#00ff88]">Web3 voices</span>, curated by signal and contribution—not followers.
            </p>

            {/* CTAs */}
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/creators"
                className="group flex items-center gap-3 px-8 py-4 bg-[#00ff88] text-[#0a0a0f] rounded-xl font-semibold hover:bg-[#00cc6f] transition-all glow-accent"
              >
                <Users size={20} />
                Explore creators
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
              <Link
                href="/near-you"
                className="group flex items-center gap-3 px-8 py-4 bg-[--card] text-[--foreground] rounded-xl font-semibold border border-[--border] hover:border-[#00ff88]/50 transition-all"
              >
                <MapPin size={20} />
                Near you
              </Link>
            </div>

            {/* Stats row */}
            <div className="mt-16 flex flex-wrap items-center justify-center gap-8 sm:gap-12 text-sm">
              <div className="text-center">
                <div className="text-3xl font-bold text-[--foreground]">{creators.length}</div>
                <div className="text-[--muted-foreground] uppercase tracking-wider text-xs mt-1">Creators</div>
              </div>
              <div className="w-px h-10 bg-[--border]" />
              <div className="text-center">
                <div className="text-3xl font-bold text-[--foreground]">{chapters.length}</div>
                <div className="text-[--muted-foreground] uppercase tracking-wider text-xs mt-1">Chapters</div>
              </div>
              <div className="w-px h-10 bg-[--border]" />
              <div className="text-center">
                <div className="text-3xl font-bold text-[#00ff88]">∞</div>
                <div className="text-[--muted-foreground] uppercase tracking-wider text-xs mt-1">Signal</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Creators Section */}
      <section className="relative py-24 border-t border-[--border]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12">
            <div>
              <h2 className="font-display text-3xl sm:text-4xl text-[--foreground] font-bold">
                Featured <span className="text-[#00ff88]">Creators</span>
              </h2>
              <p className="mt-2 text-[--muted-foreground]">
                Recently added voices from around the world
              </p>
            </div>
            <Link
              href="/creators"
              className="flex items-center gap-2 text-[#00ff88] font-medium hover:underline underline-offset-4"
            >
              View all
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCreators.map((creator) => (
              <CreatorCard key={creator.id} creator={creator} />
            ))}
          </div>
        </div>
      </section>

      {/* Chapters Section */}
      <section className="relative py-24 bg-[--card]/50 border-y border-[--border]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12">
            <div>
              <h2 className="font-display text-3xl sm:text-4xl text-[--foreground] font-bold">
                Regional <span className="text-[#6366f1]">Chapters</span>
              </h2>
              <p className="mt-2 text-[--muted-foreground]">
                Local communities curating emerging voices
              </p>
            </div>
            <Link
              href="/chapters"
              className="flex items-center gap-2 text-[#6366f1] font-medium hover:underline underline-offset-4"
            >
              All chapters
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredChapters.map((chapter) => {
              const creatorCount = creators.filter((c) =>
                c.chapter_ids?.includes(chapter.id)
              ).length;
              return (
                <Link
                  key={chapter.id}
                  href={`/chapters/${chapter.slug}`}
                  className="group gradient-border p-5 hover:scale-[1.02] transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[--muted] rounded-xl flex items-center justify-center text-2xl">
                      {getRegionEmoji(chapter.region)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-[--foreground] group-hover:text-[#00ff88] transition-colors truncate">
                        {chapter.name}
                      </h3>
                      <p className="text-sm text-[--muted-foreground]">
                        {creatorCount} creator{creatorCount !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Local Discovery CTA */}
      <section className="relative py-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="relative overflow-hidden gradient-border p-10 sm:p-14 text-center">
            {/* Background glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#ff3366] rounded-full blur-[150px] opacity-20" />
            
            <div className="relative">
              <div className="w-16 h-16 mx-auto mb-6 bg-[#ff3366]/20 border border-[#ff3366]/30 rounded-2xl flex items-center justify-center">
                <Zap size={28} className="text-[#ff3366]" />
              </div>
              <h2 className="font-display text-4xl sm:text-5xl text-[--foreground] font-bold mb-4">
                Find creators <span className="text-[#ff3366]">near you</span>
              </h2>
              <p className="text-[--muted-foreground] text-lg max-w-xl mx-auto mb-8">
                Connect with Web3 voices in your city. Collaborate locally, build together.
              </p>
              <Link
                href="/near-you"
                className="inline-flex items-center gap-3 px-8 py-4 bg-[#ff3366] text-white rounded-xl font-semibold hover:bg-[#cc2952] transition-all glow-accent-secondary"
              >
                <MapPin size={20} />
                Discover nearby
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Manifesto Section */}
      <section className="relative py-24 border-t border-[--border]">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-display text-3xl sm:text-4xl text-[--foreground] font-bold text-center mb-16">
            What we <span className="gradient-text">believe</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Principle 1 */}
            <div className="text-center gradient-border p-6">
              <div className="w-14 h-14 mx-auto mb-6 rounded-2xl bg-[#00ff88]/10 border border-[#00ff88]/30 flex items-center justify-center">
                <FileCheck size={24} className="text-[#00ff88]" />
              </div>
              <h3 className="font-semibold text-lg text-[--foreground] mb-3">
                Contribution over clout
              </h3>
              <p className="text-[--muted-foreground] text-sm leading-relaxed">
                We surface creators by what they've built, written, and taught—not by follower counts.
              </p>
            </div>

            {/* Principle 2 */}
            <div className="text-center gradient-border p-6">
              <div className="w-14 h-14 mx-auto mb-6 rounded-2xl bg-[#6366f1]/10 border border-[#6366f1]/30 flex items-center justify-center">
                <Globe size={24} className="text-[#6366f1]" />
              </div>
              <h3 className="font-semibold text-lg text-[--foreground] mb-3">
                Global by default
              </h3>
              <p className="text-[--muted-foreground] text-sm leading-relaxed">
                The best ideas come from everywhere. We look beyond the conference circuit.
              </p>
            </div>

            {/* Principle 3 */}
            <div className="text-center gradient-border p-6">
              <div className="w-14 h-14 mx-auto mb-6 rounded-2xl bg-[#ff3366]/10 border border-[#ff3366]/30 flex items-center justify-center">
                <Sparkles size={24} className="text-[#ff3366]" />
              </div>
              <h3 className="font-semibold text-lg text-[--foreground] mb-3">
                Artifact-first profiles
              </h3>
              <p className="text-[--muted-foreground] text-sm leading-relaxed">
                Every creator is represented by their work. Proof over claims.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-16 border-t border-[--border]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00ff88] to-[#6366f1] flex items-center justify-center">
                <Radio size={16} className="text-[#0a0a0f]" />
              </div>
              <span className="font-display font-bold text-[--foreground]">New Media Map</span>
            </div>
            <div className="flex items-center gap-8 text-sm">
              <Link
                href="/chapters"
                className="text-[--muted-foreground] hover:text-[#00ff88] transition-colors"
              >
                Chapters
              </Link>
              <Link
                href="/creators"
                className="text-[--muted-foreground] hover:text-[#00ff88] transition-colors"
              >
                Directory
              </Link>
              <Link
                href="/submit"
                className="text-[--muted-foreground] hover:text-[#00ff88] transition-colors"
              >
                Submit
              </Link>
            </div>
          </div>
          <p className="mt-8 text-center text-[--muted-foreground] text-sm">
            © 2026 New Media Map. Built for the culture.
          </p>
        </div>
      </footer>
    </main>
  );
}
