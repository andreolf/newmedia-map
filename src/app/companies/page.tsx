"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { chapters } from "@/lib/chapters";
import { CATEGORY_DESCRIPTIONS, CreatorCategory } from "@/types";
import {
  Building2,
  Sparkles,
  Users,
  ArrowRight,
  Send,
  CheckCircle,
  Globe,
  Gift,
  FileText,
} from "lucide-react";

export default function CompaniesPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    email: "",
    region: "",
    categoryFocus: [] as CreatorCategory[],
    whatParticipantsGet: "",
    expectedOutputs: "",
    compensation: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would submit to an API
    console.log("Experience Drop submission:", formData);
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

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-900">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-full text-sm text-stone-600 dark:text-stone-300 mb-6">
            <Building2 size={14} />
            <span>For Companies & Projects</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-stone-900 dark:text-stone-100 mb-4">
            Connect with emerging creators
          </h1>
          <p className="text-xl text-stone-500 dark:text-stone-400 max-w-2xl mx-auto">
            No influencer marketplace. No paid promos. Just authentic
            collaboration with builders and educators.
          </p>
        </div>

        {/* How it works */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 p-6">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-4">
              <Globe size={24} className="text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-2">
              Browse by chapter
            </h3>
            <p className="text-stone-500 dark:text-stone-400 text-sm">
              Find creators in specific regions. Each chapter has curated voices
              from Africa, Europe, Americas, Asia, and MENA.
            </p>
          </div>

          <div className="bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 p-6">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center mb-4">
              <Sparkles size={24} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-2">
              Experience Drops
            </h3>
            <p className="text-stone-500 dark:text-stone-400 text-sm">
              Propose collaboration experiences—early access, mentorship,
              workshops—not ads. Creators apply if interested.
            </p>
          </div>

          <div className="bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 p-6">
            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center mb-4">
              <Users size={24} className="text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-2">
              Authentic content
            </h3>
            <p className="text-stone-500 dark:text-stone-400 text-sm">
              No forced talking points. Creators share genuine perspectives
              based on real experiences with your product.
            </p>
          </div>
        </div>

        {/* Chapters Browse */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-stone-900 dark:text-stone-100 mb-6">
            Browse by chapter
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {chapters.map((chapter) => (
              <Link
                key={chapter.id}
                href={`/chapters/${chapter.slug}`}
                className="group flex flex-col items-center p-4 bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600 transition-all text-center"
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
                <span className="text-sm font-medium text-stone-900 dark:text-stone-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  {chapter.region}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Experience Drop Form */}
        <section className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 overflow-hidden">
          <div className="p-8 border-b border-stone-200 dark:border-stone-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                <Gift size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-stone-900 dark:text-stone-100">
                  Propose an Experience Drop
                </h2>
                <p className="text-stone-500 dark:text-stone-400">
                  Create collaboration opportunities with curated creators
                </p>
              </div>
            </div>
          </div>

          {formSubmitted ? (
            <div className="p-12 text-center">
              <CheckCircle size={48} className="mx-auto text-emerald-600 mb-4" />
              <h3 className="text-xl font-semibold text-stone-900 dark:text-stone-100 mb-2">
                Proposal received!
              </h3>
              <p className="text-stone-500 dark:text-stone-400 mb-6">
                Our team will review your Experience Drop and get back to you
                within 48 hours.
              </p>
              <button
                onClick={() => {
                  setFormSubmitted(false);
                  setFormData({
                    title: "",
                    company: "",
                    email: "",
                    region: "",
                    categoryFocus: [],
                    whatParticipantsGet: "",
                    expectedOutputs: "",
                    compensation: "",
                  });
                }}
                className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
              >
                Submit another proposal
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {/* Title & Company */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                    Experience title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="e.g., Early Access to our SDK"
                    className="w-full px-4 py-3 border border-stone-200 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                    Company/Project name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) =>
                      setFormData({ ...formData, company: e.target.value })
                    }
                    placeholder="Your company name"
                    className="w-full px-4 py-3 border border-stone-200 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Email & Region */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                    Contact email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="you@company.com"
                    className="w-full px-4 py-3 border border-stone-200 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                    Target region or chapter
                  </label>
                  <select
                    value={formData.region}
                    onChange={(e) =>
                      setFormData({ ...formData, region: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-stone-200 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All regions</option>
                    {chapters.map((ch) => (
                      <option key={ch.id} value={ch.id}>
                        {ch.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Category Focus */}
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                  Category focus
                </label>
                <p className="text-xs text-stone-500 dark:text-stone-400 mb-3">
                  What type of creators are you looking for?
                </p>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(CATEGORY_DESCRIPTIONS) as CreatorCategory[]).map(
                    (cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => toggleCategory(cat)}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                          formData.categoryFocus.includes(cat)
                            ? "bg-blue-600 text-white"
                            : "bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-600"
                        }`}
                        title={CATEGORY_DESCRIPTIONS[cat]}
                      >
                        {cat}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* What participants get */}
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                  What participants get *
                </label>
                <p className="text-xs text-stone-500 dark:text-stone-400 mb-3">
                  Early access, mentorship, workshops, exclusive product access, etc.
                </p>
                <textarea
                  required
                  value={formData.whatParticipantsGet}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      whatParticipantsGet: e.target.value,
                    })
                  }
                  rows={3}
                  placeholder="Describe what creators will gain from this experience..."
                  className="w-full px-4 py-3 border border-stone-200 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Expected outputs */}
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                  Expected outputs (optional)
                </label>
                <textarea
                  value={formData.expectedOutputs}
                  onChange={(e) =>
                    setFormData({ ...formData, expectedOutputs: e.target.value })
                  }
                  rows={2}
                  placeholder="e.g., Tutorial video, thread, feedback report..."
                  className="w-full px-4 py-3 border border-stone-200 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Compensation */}
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                  Compensation (optional)
                </label>
                <p className="text-xs text-stone-500 dark:text-stone-400 mb-3">
                  Not required—many creators participate for access and experience alone.
                </p>
                <input
                  type="text"
                  value={formData.compensation}
                  onChange={(e) =>
                    setFormData({ ...formData, compensation: e.target.value })
                  }
                  placeholder="e.g., $500 per participant, tokens, etc."
                  className="w-full px-4 py-3 border border-stone-200 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Submit */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 w-full md:w-auto px-8 py-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                >
                  <Send size={18} />
                  Submit proposal
                </button>
              </div>
            </form>
          )}
        </section>

        {/* No paid promos notice */}
        <div className="mt-12 text-center">
          <p className="text-sm text-stone-500 dark:text-stone-400">
            <strong>Note:</strong> New Media Map does not facilitate paid
            promotions, sponsored content, or influencer marketing. Experience
            Drops are about authentic collaboration and mutual value.
          </p>
        </div>
      </main>
    </div>
  );
}
