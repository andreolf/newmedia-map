"use client";

import { useSession } from "next-auth/react";
import { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { Avatar } from "@/components/Avatar";
import { Badge, BadgeRow } from "@/components/Badge";
import creatorsData from "@/data/creators.json";
import {
  Creator,
  BadgeType,
  BADGE_CONFIG,
  Badge as BadgeData,
} from "@/types";
import { ShieldCheck, Search, Plus, X, Copy, Check } from "lucide-react";

const creators = creatorsData as Creator[];

export default function AdminBadgesPage() {
  const { data: session, status } = useSession();
  const [search, setSearch] = useState("");
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [copied, setCopied] = useState(false);

  // For demo purposes, check role from session
  const userRole = session?.user?.role;
  const isAuthorized = userRole === "admin" || userRole === "curator";

  // Filter creators
  const filteredCreators = useMemo(() => {
    if (!search) return creators;
    const q = search.toLowerCase();
    return creators.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.primary_signal.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q)
    );
  }, [search]);

  // Loading state
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[--background]">
        <Header />
        <main className="max-w-6xl mx-auto px-4 py-12">
          <div className="animate-pulse">Loading...</div>
        </main>
      </div>
    );
  }

  // Not authorized
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[--background]">
        <Header />
        <main className="max-w-2xl mx-auto px-4 py-12 text-center">
          <ShieldCheck size={48} className="mx-auto text-[--muted-foreground] mb-4" />
          <h1 className="text-2xl font-bold mb-2">Admin Access Required</h1>
          <p className="text-[--muted-foreground]">
            You need to be signed in as an admin or curator to manage badges.
          </p>
          {!session && (
            <p className="text-sm text-[--muted-foreground] mt-4">
              Please sign in with X (Twitter) to continue.
            </p>
          )}
          {session && (
            <p className="text-sm text-[--muted-foreground] mt-4">
              Signed in as @{session.user?.twitterHandle} (role: {userRole || "user"})
            </p>
          )}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[--background]">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <ShieldCheck size={24} className="text-[#00ff88]" />
              Badge Management
            </h1>
            <p className="text-[--muted-foreground] mt-1">
              Assign quality badges to creators • Signed in as @{session?.user?.twitterHandle}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[--muted-foreground]"
          />
          <input
            type="text"
            placeholder="Search creators..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-[--card] border border-[--border] rounded-xl text-[--foreground] placeholder:text-[--muted-foreground] focus:outline-none focus:ring-2 focus:ring-[#00ff88]/50"
          />
        </div>

        {/* Creators list */}
        <div className="grid gap-3">
          {filteredCreators.map((creator) => (
            <div
              key={creator.id}
              className="flex items-center gap-4 p-4 bg-[--card] border border-[--border] rounded-xl hover:border-[#00ff88]/50 transition-colors"
            >
              <Avatar
                name={creator.name}
                avatarUrl={creator.avatar_url}
                primarySignal={creator.primary_signal}
                size="md"
              />

              <div className="flex-1 min-w-0">
                <div className="font-semibold">{creator.name}</div>
                <div className="text-sm text-[--muted-foreground]">
                  {creator.primary_signal} • {creator.country}
                </div>
              </div>

              {/* Current badges */}
              <div className="flex-shrink-0">
                {creator.badges && creator.badges.length > 0 ? (
                  <BadgeRow badges={creator.badges} maxShow={3} size="sm" />
                ) : (
                  <span className="text-xs text-[--muted-foreground]">No badges</span>
                )}
              </div>

              {/* Add badge button */}
              <button
                onClick={() => {
                  setSelectedCreator(creator);
                  setShowAddModal(true);
                }}
                className="flex items-center gap-1 px-3 py-1.5 text-sm bg-[#00ff88]/10 text-[#00ff88] rounded-lg hover:bg-[#00ff88]/20 transition-colors"
              >
                <Plus size={14} />
                Add Badge
              </button>
            </div>
          ))}
        </div>

        {filteredCreators.length === 0 && (
          <div className="text-center py-12 text-[--muted-foreground]">
            No creators found matching "{search}"
          </div>
        )}
      </main>

      {/* Add Badge Modal */}
      {showAddModal && selectedCreator && (
        <AddBadgeModal
          creator={selectedCreator}
          onClose={() => {
            setShowAddModal(false);
            setSelectedCreator(null);
          }}
          copied={copied}
          setCopied={setCopied}
        />
      )}
    </div>
  );
}

function AddBadgeModal({
  creator,
  onClose,
  copied,
  setCopied,
}: {
  creator: Creator;
  onClose: () => void;
  copied: boolean;
  setCopied: (v: boolean) => void;
}) {
  const [badgeType, setBadgeType] = useState<BadgeType>("chapter_pick");
  const [context, setContext] = useState("");

  const newBadge: BadgeData = {
    type: badgeType,
    awarded_at: new Date().toISOString(),
    context: context || undefined,
  };

  const jsonSnippet = JSON.stringify(newBadge, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[--card] border border-[--border] rounded-2xl max-w-lg w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold">Add Badge to {creator.name}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[--muted] rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Badge type selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Badge Type</label>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(BADGE_CONFIG) as BadgeType[]).map((type) => {
              const config = BADGE_CONFIG[type];
              return (
                <button
                  key={type}
                  onClick={() => setBadgeType(type)}
                  className={`flex items-center gap-2 p-3 rounded-xl border text-left transition-all ${
                    badgeType === type
                      ? "border-[#00ff88] bg-[#00ff88]/10"
                      : "border-[--border] hover:border-[--muted-foreground]"
                  }`}
                >
                  <span className="text-xl">{config.emoji}</span>
                  <div>
                    <div className="font-medium text-sm">{config.label}</div>
                    <div className="text-xs text-[--muted-foreground]">
                      {config.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Context input */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Context <span className="text-[--muted-foreground]">(optional)</span>
          </label>
          <input
            type="text"
            placeholder="e.g., ETH Denver 2026 speaker"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            className="w-full px-4 py-2 bg-[--background] border border-[--border] rounded-xl text-[--foreground] placeholder:text-[--muted-foreground] focus:outline-none focus:ring-2 focus:ring-[#00ff88]/50"
          />
        </div>

        {/* Preview */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Preview</label>
          <div className="p-4 bg-[--background] rounded-xl">
            <Badge badge={newBadge} size="md" />
          </div>
        </div>

        {/* JSON output */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            JSON (add to creator's badges array in creators.json)
          </label>
          <div className="relative">
            <pre className="p-4 bg-[--background] rounded-xl text-xs overflow-x-auto">
              {jsonSnippet}
            </pre>
            <button
              onClick={handleCopy}
              className="absolute top-2 right-2 p-2 bg-[--card] border border-[--border] rounded-lg hover:bg-[--muted] transition-colors"
            >
              {copied ? (
                <Check size={14} className="text-[#00ff88]" />
              ) : (
                <Copy size={14} />
              )}
            </button>
          </div>
        </div>

        {/* Note about persistence */}
        <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-sm text-amber-600 dark:text-amber-400">
          <strong>Note:</strong> Currently using JSON files. To persist badges, add
          this JSON to the creator's <code>badges</code> array in{" "}
          <code>src/data/creators.json</code> and redeploy.
        </div>

        {/* Close button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[--muted] text-[--foreground] rounded-xl hover:bg-[--border] transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
