"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { AuthButton } from "@/components/AuthButton";
import { allSignals, allCountries, allContentFormats, allTrajectories } from "@/lib/constants";
import { getSignalColor } from "@/lib/utils";
import {
  ArrowLeft,
  Plus,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

interface Artifact {
  type: string;
  title: string;
  url: string;
}

interface FormData {
  name: string;
  xHandle: string;
  country: string;
  city: string;
  primarySignal: string;
  signals: string[];
  contentFormats: string[];
  trajectory: string;
  noConferenceCircuit: boolean;
  editorialReason: string;
  artifacts: Artifact[];
  websiteUrl: string;
}

const initialFormData: FormData = {
  name: "",
  xHandle: "",
  country: "",
  city: "",
  primarySignal: "",
  signals: [],
  contentFormats: [],
  trajectory: "",
  noConferenceCircuit: false,
  editorialReason: "",
  artifacts: [],
  websiteUrl: "",
};

const artifactTypes = [
  { value: "youtube", label: "YouTube" },
  { value: "x", label: "X/Twitter" },
  { value: "github", label: "GitHub" },
  { value: "substack", label: "Substack" },
  { value: "website", label: "Website" },
  { value: "talk", label: "Talk/Presentation" },
  { value: "podcast", label: "Podcast" },
  { value: "article", label: "Article" },
];

export default function SubmitPage() {
  const { data: session } = useSession();
  const [formData, setFormData] = useState<FormData>(() => {
    // Pre-fill from session if available
    if (session?.user) {
      return {
        ...initialFormData,
        name: session.user.name || "",
        xHandle: (session.user as { twitterHandle?: string }).twitterHandle || "",
      };
    }
    return initialFormData;
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [newArtifact, setNewArtifact] = useState<Artifact>({ type: "youtube", title: "", url: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      // For now, just simulate a submission
      // In production, this would POST to /api/submissions
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Store in localStorage for demo purposes
      const submissions = JSON.parse(localStorage.getItem("nmm_submissions") || "[]");
      submissions.push({
        ...formData,
        id: Date.now().toString(),
        submittedAt: new Date().toISOString(),
        status: "pending",
      });
      localStorage.setItem("nmm_submissions", JSON.stringify(submissions));
      
      setSubmitStatus("success");
      setFormData(initialFormData);
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleSignal = (signal: string) => {
    setFormData((prev) => ({
      ...prev,
      signals: prev.signals.includes(signal)
        ? prev.signals.filter((s) => s !== signal)
        : [...prev.signals, signal],
      // Auto-set primary signal if it's the first one
      primarySignal: prev.signals.length === 0 && !prev.signals.includes(signal) ? signal : prev.primarySignal,
    }));
  };

  const toggleContentFormat = (format: string) => {
    setFormData((prev) => ({
      ...prev,
      contentFormats: prev.contentFormats.includes(format)
        ? prev.contentFormats.filter((f) => f !== format)
        : [...prev.contentFormats, format],
    }));
  };

  const addArtifact = () => {
    if (newArtifact.title && newArtifact.url) {
      setFormData((prev) => ({
        ...prev,
        artifacts: [...prev.artifacts, newArtifact],
      }));
      setNewArtifact({ type: "youtube", title: "", url: "" });
    }
  };

  const removeArtifact = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      artifacts: prev.artifacts.filter((_, i) => i !== index),
    }));
  };

  if (submitStatus === "success") {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-stone-900">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-16">
          <div className="bg-white dark:bg-stone-800 rounded-xl shadow-sm border border-stone-200 dark:border-stone-700 p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-950/30 flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100 mb-2">
              Profile Submitted!
            </h1>
            <p className="text-stone-500 dark:text-stone-400 mb-6">
              Thank you for submitting your profile. Our team will review it and you'll be notified once it's published.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/creators"
                className="px-4 py-2 text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
              >
                Back to directory
              </Link>
              <button
                onClick={() => setSubmitStatus("idle")}
                className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Submit another
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-900">
      <Header />

      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link
          href="/creators"
          className="inline-flex items-center gap-2 text-sm text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 mb-6"
        >
          <ArrowLeft size={16} />
          Back to directory
        </Link>

        <div className="bg-white dark:bg-stone-800 rounded-xl shadow-sm border border-stone-200 dark:border-stone-700 p-8">
          <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100 mb-2">
            Submit Your Profile
          </h1>
          <p className="text-stone-500 dark:text-stone-400 mb-6">
            Join the New Media Map as a Web3 creator or contributor. All submissions are reviewed before publishing.
          </p>

          {!session && (
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                Sign in with X to pre-fill your profile and claim it later.
              </p>
              <AuthButton />
            </div>
          )}

          {submitStatus === "error" && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2 text-red-700 dark:text-red-400">
              <AlertCircle size={16} />
              <span>Something went wrong. Please try again.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-stone-800 dark:text-stone-200">Basic Info</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-200 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
                    X Handle
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">@</span>
                    <input
                      type="text"
                      value={formData.xHandle}
                      onChange={(e) => setFormData({ ...formData, xHandle: e.target.value.replace("@", "") })}
                      className="w-full pl-8 pr-3 py-2 border border-stone-200 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="username"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
                    Country *
                  </label>
                  <select
                    required
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-200 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select country</option>
                    {allCountries.map((country) => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-200 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your city"
                  />
                </div>
              </div>
            </div>

            {/* Signals */}
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-stone-800 dark:text-stone-200">Signals & Focus Areas *</h2>
              <p className="text-sm text-stone-500 dark:text-stone-400">
                Select the topics you focus on (select at least one)
              </p>
              <div className="flex flex-wrap gap-2">
                {allSignals.map((signal) => (
                  <button
                    key={signal}
                    type="button"
                    onClick={() => toggleSignal(signal)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      formData.signals.includes(signal)
                        ? "text-white"
                        : "bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-600"
                    }`}
                    style={
                      formData.signals.includes(signal)
                        ? { backgroundColor: getSignalColor(signal) }
                        : undefined
                    }
                  >
                    {signal}
                  </button>
                ))}
              </div>
              
              {formData.signals.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
                    Primary Signal
                  </label>
                  <select
                    value={formData.primarySignal}
                    onChange={(e) => setFormData({ ...formData, primarySignal: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-200 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {formData.signals.map((signal) => (
                      <option key={signal} value={signal}>{signal}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Content Formats */}
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-stone-800 dark:text-stone-200">Content Formats</h2>
              <div className="flex flex-wrap gap-2">
                {allContentFormats.map((format) => (
                  <button
                    key={format}
                    type="button"
                    onClick={() => toggleContentFormat(format)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      formData.contentFormats.includes(format)
                        ? "bg-blue-600 text-white"
                        : "bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-600"
                    }`}
                  >
                    {format}
                  </button>
                ))}
              </div>
            </div>

            {/* Trajectory */}
            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
                Trajectory
              </label>
              <select
                value={formData.trajectory}
                onChange={(e) => setFormData({ ...formData, trajectory: e.target.value })}
                className="w-full px-3 py-2 border border-stone-200 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select trajectory</option>
                {allTrajectories.map((trajectory) => (
                  <option key={trajectory} value={trajectory}>{trajectory}</option>
                ))}
              </select>
            </div>

            {/* Editorial Reason */}
            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
                One-liner Description *
              </label>
              <textarea
                required
                value={formData.editorialReason}
                onChange={(e) => setFormData({ ...formData, editorialReason: e.target.value })}
                rows={2}
                maxLength={200}
                className="w-full px-3 py-2 border border-stone-200 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="What makes your work unique? (e.g., 'Building wallets for emerging markets with a focus on UX')"
              />
              <p className="text-xs text-stone-400 mt-1">{formData.editorialReason.length}/200</p>
            </div>

            {/* Artifacts */}
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-stone-800 dark:text-stone-200">Proof of Work</h2>
              <p className="text-sm text-stone-500 dark:text-stone-400">
                Add links to your best work (articles, videos, repos, etc.)
              </p>
              
              {formData.artifacts.length > 0 && (
                <div className="space-y-2">
                  {formData.artifacts.map((artifact, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 bg-stone-50 dark:bg-stone-700 rounded-lg"
                    >
                      <span className="text-xs font-medium text-stone-500 dark:text-stone-400 uppercase">
                        {artifact.type}
                      </span>
                      <span className="flex-1 text-sm text-stone-700 dark:text-stone-300 truncate">
                        {artifact.title}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeArtifact(index)}
                        className="text-stone-400 hover:text-red-500"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                <select
                  value={newArtifact.type}
                  onChange={(e) => setNewArtifact({ ...newArtifact, type: e.target.value })}
                  className="px-3 py-2 border border-stone-200 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {artifactTypes.map((type) => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={newArtifact.title}
                  onChange={(e) => setNewArtifact({ ...newArtifact, title: e.target.value })}
                  placeholder="Title"
                  className="px-3 py-2 border border-stone-200 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="url"
                  value={newArtifact.url}
                  onChange={(e) => setNewArtifact({ ...newArtifact, url: e.target.value })}
                  placeholder="https://..."
                  className="px-3 py-2 border border-stone-200 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={addArtifact}
                  disabled={!newArtifact.title || !newArtifact.url}
                  className="flex items-center justify-center gap-1 px-3 py-2 bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus size={16} />
                  Add
                </button>
              </div>
            </div>

            {/* No Conference */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="noConference"
                checked={formData.noConferenceCircuit}
                onChange={(e) => setFormData({ ...formData, noConferenceCircuit: e.target.checked })}
                className="w-4 h-4 rounded border-stone-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="noConference" className="text-sm text-stone-600 dark:text-stone-400">
                I'm not on the conference circuit (working quietly, focused on building)
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-stone-200 dark:border-stone-700">
              <button
                type="submit"
                disabled={isSubmitting || formData.signals.length === 0}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Profile for Review"
                )}
              </button>
              <p className="text-xs text-stone-400 dark:text-stone-500 text-center mt-2">
                Submissions are reviewed within 48 hours
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

