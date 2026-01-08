import Link from "next/link";
import { ArrowRight, Users, Map, Sparkles, Globe, FileCheck } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-stone-50 dark:bg-zinc-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-stone-100 via-stone-50 to-amber-50/30 dark:from-zinc-800 dark:via-zinc-900 dark:to-zinc-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-stone-200/40 via-transparent to-transparent dark:from-zinc-700/20" />

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div
          className="absolute inset-0 opacity-0 dark:opacity-[0.08]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative max-w-5xl mx-auto px-6 py-24 sm:py-32">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-zinc-800/90 backdrop-blur border border-stone-200 dark:border-zinc-700 rounded-full text-sm text-stone-600 dark:text-zinc-300 mb-8">
              <Sparkles size={14} className="text-amber-500" />
              <span>Contribution over clout</span>
            </div>

            {/* Title */}
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-medium text-stone-900 dark:text-zinc-50 tracking-tight leading-[1.1]">
              New Media Map
            </h1>

            {/* Tagline */}
            <p className="mt-6 text-xl sm:text-2xl text-stone-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              A living map of emerging Web3 voices, curated by signal and
              contribution, not followers.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/creators"
                className="group flex items-center gap-2 px-8 py-4 bg-stone-900 dark:bg-zinc-50 text-white dark:text-zinc-900 rounded-xl font-medium hover:bg-stone-800 dark:hover:bg-zinc-200 transition-colors shadow-lg shadow-stone-900/10 dark:shadow-black/30"
              >
                <Users size={20} />
                Explore creators
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
              <Link
                href="/map"
                className="group flex items-center gap-2 px-8 py-4 bg-white dark:bg-zinc-800 text-stone-900 dark:text-zinc-100 rounded-xl font-medium border border-stone-200 dark:border-zinc-600 hover:border-stone-300 dark:hover:border-zinc-500 hover:shadow-sm transition-all"
              >
                <Map size={20} />
                View map
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Manifesto Section */}
      <section className="py-20 border-t border-stone-200 dark:border-zinc-700">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-serif text-3xl text-stone-900 dark:text-zinc-50 text-center mb-16">
            What we believe
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Principle 1 */}
            <div className="text-center">
              <div className="w-14 h-14 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-emerald-500/20 dark:to-emerald-600/10 flex items-center justify-center">
                <FileCheck size={24} className="text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="font-serif text-xl text-stone-900 dark:text-zinc-100 mb-3">
                Contribution over clout
              </h3>
              <p className="text-stone-600 dark:text-zinc-400 leading-relaxed">
                We surface creators by what they've built, written, and taught—not
                by follower counts or engagement metrics.
              </p>
            </div>

            {/* Principle 2 */}
            <div className="text-center">
              <div className="w-14 h-14 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-500/20 dark:to-blue-600/10 flex items-center justify-center">
                <Globe size={24} className="text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-serif text-xl text-stone-900 dark:text-zinc-100 mb-3">
                Global by default
              </h3>
              <p className="text-stone-600 dark:text-zinc-400 leading-relaxed">
                The best ideas come from everywhere. We look beyond the conference
                circuit to find voices across the world.
              </p>
            </div>

            {/* Principle 3 */}
            <div className="text-center">
              <div className="w-14 h-14 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-500/20 dark:to-amber-600/10 flex items-center justify-center">
                <Sparkles size={24} className="text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="font-serif text-xl text-stone-900 dark:text-zinc-100 mb-3">
                Artifact-first profiles
              </h3>
              <p className="text-stone-600 dark:text-zinc-400 leading-relaxed">
                Every creator is represented by their work—articles, repos,
                videos, and podcasts. Proof over claims.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats/Trust Section */}
      <section className="py-16 bg-white dark:bg-zinc-800/50 border-y border-stone-200 dark:border-zinc-700">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="font-serif text-4xl text-stone-900 dark:text-zinc-50 mb-1">20+</div>
              <div className="text-sm text-stone-500 dark:text-zinc-400">Curated creators</div>
            </div>
            <div>
              <div className="font-serif text-4xl text-stone-900 dark:text-zinc-50 mb-1">15+</div>
              <div className="text-sm text-stone-500 dark:text-zinc-400">Countries</div>
            </div>
            <div>
              <div className="font-serif text-4xl text-stone-900 dark:text-zinc-50 mb-1">0</div>
              <div className="text-sm text-stone-500 dark:text-zinc-400">Vanity metrics</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center text-stone-500 dark:text-zinc-400 text-sm">
        <p>
          New Media Map — Discovering emerging voices in Web3
        </p>
      </footer>
    </main>
  );
}
