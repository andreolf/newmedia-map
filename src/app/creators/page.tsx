"use client";

import { useState, useMemo, useEffect, useCallback, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Header } from "@/components/Header";
import { CreatorListItem } from "@/components/CreatorListItem";
import { SignalIcon } from "@/components/SignalIcon";
import { allSignals } from "@/lib/constants";
import {
  creators,
  chapters,
  getAllCountries,
  filterCreatorsAdvanced,
} from "@/lib/chapters";
import { Creator, CreatorIntent, INTENT_LABELS } from "@/types";
import {
  Map,
  EyeOff,
  Search,
  Filter,
  X,
  ChevronDown,
  Users,
  RefreshCw,
} from "lucide-react";

// Dynamic import for Leaflet map (no SSR)
const CreatorsMap = dynamic(
  () => import("@/components/CreatorsMap").then((mod) => mod.CreatorsMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-[--muted] flex items-center justify-center">
        <div className="text-[--muted-foreground]">Loading map...</div>
      </div>
    ),
  }
);

const countriesInData = getAllCountries();

const trajectoryOptions = [
  { value: "", label: "All trajectories" },
  { value: "emerging", label: "Emerging" },
  { value: "breakout", label: "Breakout" },
  { value: "quiet-contributor", label: "Quiet Contributor" },
  { value: "builder-educator", label: "Builder → Educator" },
];

const intentOptions: { value: CreatorIntent; label: string }[] = [
  { value: "collaboration", label: "Collaboration" },
  { value: "local_meetups", label: "Local meetups" },
  { value: "events_workshops", label: "Events/workshops" },
  { value: "product_feedback", label: "Product feedback" },
  { value: "research_interviews", label: "Research" },
  { value: "mentorship", label: "Mentorship" },
];

function TrajectoryDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption =
    trajectoryOptions.find((opt) => opt.value === value) || trajectoryOptions[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-1.5 text-sm border border-[--border] rounded-lg bg-[--card] text-[--foreground] focus:outline-none focus:ring-2 focus:ring-[#00ff88] flex items-center justify-between"
      >
        <span>{selectedOption.label}</span>
        <ChevronDown
          size={14}
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-[--card] border border-[--border] rounded-lg shadow-lg overflow-hidden">
          {trajectoryOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full px-3 py-2 text-sm text-left hover:bg-[--muted] transition-colors ${
                option.value === value
                  ? "bg-[#00ff88]/10 text-[#00ff88]"
                  : "text-[--foreground]"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

interface Filters {
  signals: string[];
  intents: CreatorIntent[];
  countries: string[];
  trajectories: string[];
  chapterId: string;
  noConferenceCircuit: boolean;
  search: string;
}

const defaultFilters: Filters = {
  signals: [],
  intents: [],
  countries: [],
  trajectories: [],
  chapterId: "",
  noConferenceCircuit: false,
  search: "",
};

// Parse filters from URL search params
function parseFiltersFromURL(searchParams: URLSearchParams): Filters {
  return {
    signals: searchParams.get("signals")?.split(",").filter(Boolean) || [],
    intents: (searchParams.get("intents")?.split(",").filter(Boolean) || []) as CreatorIntent[],
    countries: searchParams.get("countries")?.split(",").filter(Boolean) || [],
    trajectories: searchParams.get("trajectory")?.split(",").filter(Boolean) || [],
    chapterId: searchParams.get("chapter") || "",
    noConferenceCircuit: searchParams.get("noConference") === "true",
    search: searchParams.get("q") || "",
  };
}

// Build URL search params from filters
function buildURLFromFilters(filters: Filters, sortBy: string, showMap: boolean): string {
  const params = new URLSearchParams();

  if (filters.signals.length > 0) params.set("signals", filters.signals.join(","));
  if (filters.intents.length > 0) params.set("intents", filters.intents.join(","));
  if (filters.countries.length > 0) params.set("countries", filters.countries.join(","));
  if (filters.trajectories.length > 0) params.set("trajectory", filters.trajectories.join(","));
  if (filters.chapterId) params.set("chapter", filters.chapterId);
  if (filters.noConferenceCircuit) params.set("noConference", "true");
  if (filters.search) params.set("q", filters.search);
  if (sortBy !== "recent") params.set("sort", sortBy);
  if (!showMap) params.set("map", "false");

  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
}

// Skeleton loader for creator list
function CreatorSkeleton() {
  return (
    <div className="animate-pulse p-4 border-b border-[--border]">
      <div className="flex gap-4">
        <div className="w-12 h-12 bg-[--muted] rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-[--muted] rounded w-1/3" />
          <div className="h-3 bg-[--muted] rounded w-1/4" />
          <div className="h-3 bg-[--muted] rounded w-3/4" />
        </div>
      </div>
    </div>
  );
}

function CreatorsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const listRef = useRef<HTMLDivElement>(null);

  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Initialize state from URL
  const [filters, setFilters] = useState<Filters>(() => parseFiltersFromURL(searchParams));
  const [showMap, setShowMap] = useState(() => {
    const mapParam = searchParams.get("map");
    if (mapParam === "true") return true;
    if (mapParam === "false") return false;
    return typeof window !== "undefined" ? window.innerWidth >= 768 : true;
  });
  const [sortBy, setSortBy] = useState<"recent" | "az">(
    () => (searchParams.get("sort") as "recent" | "az") || "recent"
  );
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  // Update URL when filters change
  const updateURL = useCallback(
    (newFilters: Filters, newSortBy: string, newShowMap: boolean) => {
      const url = buildURLFromFilters(newFilters, newSortBy, newShowMap);
      router.replace(`/creators${url}`, { scroll: false });
    },
    [router]
  );

  // Sync URL on filter changes
  useEffect(() => {
    updateURL(filters, sortBy, showMap);
  }, [filters, sortBy, showMap, updateURL]);

  const filteredCreators = useMemo(() => {
    const filtered = filterCreatorsAdvanced(creators, {
      signals: filters.signals.length ? filters.signals : undefined,
      intents: filters.intents.length ? filters.intents : undefined,
      countries: filters.countries.length ? filters.countries : undefined,
      trajectories: filters.trajectories.length ? filters.trajectories : undefined,
      chapterId: filters.chapterId || undefined,
      noConferenceCircuit: filters.noConferenceCircuit || undefined,
      search: filters.search || undefined,
    });

    // Sort
    return [...filtered].sort((a, b) => {
      if (sortBy === "az") {
        return a.name.localeCompare(b.name);
      }
      // Recent
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return dateB - dateA;
    });
  }, [filters, sortBy]);

  // Reset selection when filters change
  useEffect(() => {
    setSelectedIndex(-1);
  }, [filters, sortBy]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      switch (e.key) {
        case "j":
          e.preventDefault();
          setSelectedIndex((prev) => {
            const next = Math.min(prev + 1, filteredCreators.length - 1);
            scrollToCreator(next);
            return next;
          });
          break;
        case "k":
          e.preventDefault();
          setSelectedIndex((prev) => {
            const next = Math.max(prev - 1, 0);
            scrollToCreator(next);
            return next;
          });
          break;
        case "Enter":
          if (selectedIndex >= 0 && selectedIndex < filteredCreators.length) {
            e.preventDefault();
            router.push(`/creators/${filteredCreators[selectedIndex].id}`);
          }
          break;
        case "Escape":
          e.preventDefault();
          setSelectedIndex(-1);
          break;
      }
    };

    const scrollToCreator = (index: number) => {
      if (index >= 0 && index < filteredCreators.length) {
        const element = document.getElementById(`creator-${filteredCreators[index].id}`);
        element?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [filteredCreators, selectedIndex, router]);

  const toggleSignal = (signal: string) => {
    setFilters((prev) => ({
      ...prev,
      signals: prev.signals.includes(signal)
        ? prev.signals.filter((s) => s !== signal)
        : [...prev.signals, signal],
    }));
  };

  const toggleIntent = (intent: CreatorIntent) => {
    setFilters((prev) => ({
      ...prev,
      intents: prev.intents.includes(intent)
        ? prev.intents.filter((i) => i !== intent)
        : [...prev.intents, intent],
    }));
  };

  const toggleCountry = (country: string) => {
    setFilters((prev) => ({
      ...prev,
      countries: prev.countries.includes(country)
        ? prev.countries.filter((c) => c !== country)
        : [...prev.countries, country],
    }));
  };

  const clearFilters = () => {
    setFilters(defaultFilters);
  };

  const hasActiveFilters =
    filters.signals.length > 0 ||
    filters.intents.length > 0 ||
    filters.countries.length > 0 ||
    filters.trajectories.length > 0 ||
    filters.chapterId ||
    filters.noConferenceCircuit ||
    filters.search.length > 0;

  return (
    <div className="h-screen flex flex-col bg-[--background] relative">
      {/* Grain overlay */}
      <div className="grain" />

      <Header />

      {/* Top Filter Bar */}
      <div className="relative bg-[--card] border-b border-[--border] px-4 py-3">
        {/* Title Row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <h1 className="font-display text-lg font-bold text-[--foreground]">
              Web3 Creators
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 text-xs text-[--muted-foreground]">
              <kbd className="px-1.5 py-0.5 bg-[--muted] rounded text-[10px] font-mono">j</kbd>
              <kbd className="px-1.5 py-0.5 bg-[--muted] rounded text-[10px] font-mono">k</kbd>
              to navigate
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowMap(!showMap)}
              className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                showMap
                  ? "bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/30"
                  : "text-[--muted-foreground] hover:text-[--foreground]"
              }`}
            >
              {showMap ? (
                <>
                  <EyeOff size={16} />
                  <span className="hidden sm:inline">Hide map</span>
                </>
              ) : (
                <>
                  <Map size={16} />
                  <span className="hidden sm:inline">Show map</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Signal Icons Row */}
        <div className="flex items-center gap-1 overflow-x-auto pb-2 scrollbar-hide">
          {allSignals.map((signal) => (
            <SignalIcon
              key={signal}
              signal={signal}
              selected={filters.signals.includes(signal)}
              onClick={() => toggleSignal(signal)}
              size="sm"
            />
          ))}

          <button
            onClick={() => setShowMoreFilters(!showMoreFilters)}
            className={`flex items-center gap-1 px-4 py-2 ml-2 rounded-lg text-sm font-medium transition-colors flex-shrink-0 ${
              showMoreFilters
                ? "bg-[#6366f1] text-white"
                : "bg-[--muted] text-[--muted-foreground] hover:text-[--foreground]"
            }`}
          >
            <Filter size={16} />
            More
          </button>
        </div>

        {/* Intent Pills Row */}
        <div className="flex items-center gap-2 mt-3 overflow-x-auto scrollbar-hide">
          {intentOptions.map((intent) => (
            <button
              key={intent.value}
              onClick={() => toggleIntent(intent.value)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors flex-shrink-0 ${
                filters.intents.includes(intent.value)
                  ? "bg-[#6366f1] text-white"
                  : "bg-[--muted] text-[--muted-foreground] hover:text-[--foreground] border border-[--border]"
              }`}
            >
              {intent.label}
            </button>
          ))}
        </div>

        {/* Location Pills Row */}
        <div className="flex items-center gap-2 mt-3 overflow-x-auto scrollbar-hide">
          {countriesInData.slice(0, 10).map((country) => (
            <button
              key={country}
              onClick={() => toggleCountry(country)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors flex-shrink-0 ${
                filters.countries.includes(country)
                  ? "bg-[#00ff88] text-[#0a0a0f]"
                  : "bg-[--muted] text-[--muted-foreground] hover:text-[--foreground] border border-[--border]"
              }`}
            >
              {country}
            </button>
          ))}
        </div>

        {/* More Filters Panel */}
        {showMoreFilters && (
          <div className="mt-3 pt-3 border-t border-[--border] grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="col-span-2 md:col-span-1">
              <label className="text-xs font-medium text-[--muted-foreground] mb-1 block">
                Search
              </label>
              <div className="relative">
                <Search
                  size={14}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[--muted-foreground]"
                />
                <input
                  type="text"
                  placeholder="Name, signal..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="w-full pl-8 pr-3 py-1.5 text-sm border border-[--border] rounded-lg bg-[--background] text-[--foreground] focus:outline-none focus:ring-2 focus:ring-[#00ff88] placeholder:text-[--muted-foreground]"
                />
              </div>
            </div>

            {/* Chapter */}
            <div>
              <label className="text-xs font-medium text-[--muted-foreground] mb-1 block">
                Chapter
              </label>
              <select
                value={filters.chapterId}
                onChange={(e) => setFilters({ ...filters, chapterId: e.target.value })}
                className="w-full px-3 py-1.5 text-sm border border-[--border] rounded-lg bg-[--card] text-[--foreground] focus:outline-none focus:ring-2 focus:ring-[#00ff88]"
              >
                <option value="">All chapters</option>
                {chapters.map((ch) => (
                  <option key={ch.id} value={ch.id}>
                    {ch.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Trajectory */}
            <div>
              <label className="text-xs font-medium text-[--muted-foreground] mb-1 block">
                Trajectory
              </label>
              <TrajectoryDropdown
                value={filters.trajectories[0] || ""}
                onChange={(value) =>
                  setFilters({ ...filters, trajectories: value ? [value] : [] })
                }
              />
            </div>

            {/* No Conference */}
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.noConferenceCircuit}
                  onChange={(e) =>
                    setFilters({ ...filters, noConferenceCircuit: e.target.checked })
                  }
                  className="w-4 h-4 rounded border-[--border] bg-[--background] text-[#00ff88] focus:ring-[#00ff88]"
                />
                <span className="text-sm text-[--muted-foreground]">No conference circuit</span>
              </label>
            </div>

            {/* Clear */}
            {hasActiveFilters && (
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 text-sm text-[--muted-foreground] hover:text-[#ff3366]"
                >
                  <X size={14} />
                  Clear all
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Content: List + Map */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Creator List */}
        <div
          ref={listRef}
          className={`flex flex-col bg-[--card] ${
            showMap && !isMobile ? "w-1/2 lg:w-2/5 border-r border-[--border]" : "w-full"
          }`}
        >
          {/* Results Header */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-[--border] bg-[--muted]">
            <span className="text-sm text-[--muted-foreground]">
              <Users size={14} className="inline mr-1" />
              {filteredCreators.length} creator{filteredCreators.length !== 1 ? "s" : ""}
              {selectedIndex >= 0 && (
                <span className="ml-2 text-[#00ff88]">
                  ({selectedIndex + 1} of {filteredCreators.length})
                </span>
              )}
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "recent" | "az")}
              className="text-sm border-0 bg-transparent text-[--muted-foreground] focus:ring-0 cursor-pointer"
            >
              <option value="recent">Recently added</option>
              <option value="az">A–Z</option>
            </select>
          </div>

          {/* Scrollable List */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              // Skeleton loading state
              <>
                {Array.from({ length: 6 }).map((_, i) => (
                  <CreatorSkeleton key={i} />
                ))}
              </>
            ) : error ? (
              // Error state with retry
              <div className="flex flex-col items-center justify-center h-full text-[--muted-foreground] p-4">
                <p className="text-red-400 mb-2">{error}</p>
                <button
                  onClick={() => {
                    setError(null);
                    setIsLoading(true);
                    // Simulate retry
                    setTimeout(() => setIsLoading(false), 500);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-[#00ff88]/10 text-[#00ff88] rounded-lg hover:bg-[#00ff88]/20"
                >
                  <RefreshCw size={16} />
                  Retry
                </button>
              </div>
            ) : filteredCreators.length > 0 ? (
              filteredCreators.map((creator, index) => (
                <CreatorListItem
                  key={creator.id}
                  creator={creator}
                  isSelected={index === selectedIndex}
                />
              ))
            ) : (
              // Empty state
              <div className="flex flex-col items-center justify-center h-full text-[--muted-foreground] p-4">
                <p>No creators match your filters.</p>
                <button
                  onClick={clearFilters}
                  className="mt-2 text-sm text-[#00ff88] hover:underline underline-offset-4"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Map Panel - hidden on mobile */}
        {showMap && !isMobile && (
          <div className="flex-1 relative">
            <CreatorsMap creators={filteredCreators} />
          </div>
        )}
      </div>
    </div>
  );
}

export default function CreatorsPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex flex-col bg-[--background]">
          <Header />
          <div className="flex-1 flex flex-col">
            {/* Filter bar skeleton */}
            <div className="bg-[--card] border-b border-[--border] px-4 py-3">
              <div className="animate-pulse">
                <div className="h-6 bg-[--muted] rounded w-32 mb-3" />
                <div className="flex gap-2">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="h-8 w-16 bg-[--muted] rounded-lg" />
                  ))}
                </div>
              </div>
            </div>
            {/* List skeleton */}
            <div className="flex-1">
              {Array.from({ length: 8 }).map((_, i) => (
                <CreatorSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      }
    >
      <CreatorsPageContent />
    </Suspense>
  );
}
