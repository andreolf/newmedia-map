"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { chapters } from "@/lib/chapters";
import {
  CATEGORY_DESCRIPTIONS,
  CreatorCategory,
  CreatorIntent,
  INTENT_LABELS,
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
  AlertCircle,
} from "lucide-react";

const INTENT_OPTIONS: { value: CreatorIntent; label: string }[] = [
  { value: "collaboration", label: "Open to collaboration" },
  { value: "product_feedback", label: "Product feedback/co-creation" },
  { value: "research_interviews", label: "Research/interviews" },
  { value: "events_workshops", label: "Events/workshops" },
  { value: "mentorship", label: "Mentorship" },
];

export default function CompaniesPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    contactEmail: "",
    whatBuilding: "",
    regionFocus: "",
    categoryFocus: [] as CreatorCategory[],
    intentFocus: [] as CreatorIntent[],
    whatCreatorsGet: "",
    optionalSupport: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would submit to an API
    console.log("Company Brief submission:", formData);
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
                  setFormData({
                    companyName: "",
                    contactEmail: "",
                    whatBuilding: "",
                    regionFocus: "",
                    categoryFocus: [],
                    intentFocus: [],
                    whatCreatorsGet: "",
                    optionalSupport: "",
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

              {/* Region */}
              <div>
                <label className="block text-sm font-medium text-[--foreground] mb-2">
                  Region or chapter focus
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

              {/* Category Focus */}
              <div>
                <label className="block text-sm font-medium text-[--foreground] mb-2">
                  What type of creators? *
                </label>
                <p className="text-xs text-[--muted-foreground] mb-3">
                  Select categories based on what creators do, not their follower count
                </p>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(CATEGORY_DESCRIPTIONS) as CreatorCategory[]).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => toggleCategory(cat)}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                        formData.categoryFocus.includes(cat)
                          ? "bg-[#00ff88] text-black"
                          : "bg-[--muted] text-[--muted-foreground] hover:text-[--foreground]"
                      }`}
                      title={CATEGORY_DESCRIPTIONS[cat]}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Intent Focus */}
              <div>
                <label className="block text-sm font-medium text-[--foreground] mb-2">
                  What kind of engagement?
                </label>
                <p className="text-xs text-[--muted-foreground] mb-3">
                  Select what you&apos;re looking for from creators
                </p>
                <div className="flex flex-wrap gap-2">
                  {INTENT_OPTIONS.map((intent) => (
                    <button
                      key={intent.value}
                      type="button"
                      onClick={() => toggleIntent(intent.value)}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                        formData.intentFocus.includes(intent.value)
                          ? "bg-[#6366f1] text-white"
                          : "bg-[--muted] text-[--muted-foreground] hover:text-[--foreground]"
                      }`}
                    >
                      {intent.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* What creators get */}
              <div>
                <label className="block text-sm font-medium text-[--foreground] mb-2">
                  What do creators get? *
                </label>
                <p className="text-xs text-[--muted-foreground] mb-3">
                  Focus on access, learning, mentorship, early roadmap—not compensation
                </p>
                <textarea
                  required
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
                  Optional support (if any)
                </label>
                <p className="text-xs text-[--muted-foreground] mb-3">
                  Not required—many creators participate for access alone. Don&apos;t make this
                  the headline.
                </p>
                <input
                  type="text"
                  value={formData.optionalSupport}
                  onChange={(e) => setFormData({ ...formData, optionalSupport: e.target.value })}
                  placeholder="e.g., Stipend for travel, tool credits, etc."
                  className="w-full px-4 py-3 border border-[--border] rounded-lg bg-[--background] text-[--foreground] focus:ring-2 focus:ring-[#00ff88] focus:border-transparent placeholder:text-[--muted-foreground]"
                />
              </div>

              {/* Submit */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={formData.categoryFocus.length === 0}
                  className="flex items-center justify-center gap-2 w-full md:w-auto px-8 py-4 bg-[#00ff88] text-black rounded-xl font-bold hover:bg-[#00ff88]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={18} />
                  Submit brief
                </button>
                {formData.categoryFocus.length === 0 && (
                  <p className="text-xs text-[#ff3366] mt-2">
                    Please select at least one category focus
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
