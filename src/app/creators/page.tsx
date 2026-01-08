"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Header } from "@/components/Header";
import { CreatorListItem } from "@/components/CreatorListItem";
import { SignalIcon } from "@/components/SignalIcon";
import { filterCreators, sortCreators } from "@/lib/utils";
import { allSignals } from "@/lib/constants";
import creatorsData from "@/data/creators.json";
import { Creator } from "@/types";
import { Map, EyeOff, Search, Filter, X, ChevronDown } from "lucide-react";

// Dynamic import for Leaflet map (no SSR)
const CreatorsMap = dynamic(
  () => import("@/components/CreatorsMap").then((mod) => mod.CreatorsMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center">
        <div className="text-stone-400">Loading map...</div>
      </div>
    ),
  }
);

const creators = creatorsData as Creator[];

// Get unique countries from actual data
const countriesInData = [...new Set(creators.map(c => c.country))].sort();

const trajectoryOptions = [
  { value: "", label: "All" },
  { value: "emerging", label: "Emerging" },
  { value: "breakout", label: "Breakout" },
  { value: "quiet-contributor", label: "Quiet Contributor" },
  { value: "builder-educator", label: "Builder → Educator" },
];

function TrajectoryDropdown({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = trajectoryOptions.find(opt => opt.value === value) || trajectoryOptions[0];

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
        className="w-full px-3 py-1.5 text-sm border border-stone-200 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between"
      >
        <span>{selectedOption.label}</span>
        <ChevronDown size={14} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-600 rounded-lg shadow-lg overflow-hidden">
          {trajectoryOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full px-3 py-2 text-sm text-left hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors ${option.value === value
                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                  : "text-stone-900 dark:text-stone-100"
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
  contentFormats: string[];
  countries: string[];
  trajectories: string[];
  noConferenceCircuit: boolean;
  search: string;
}

const defaultFilters: Filters = {
  signals: [],
  contentFormats: [],
  countries: [],
  trajectories: [],
  noConferenceCircuit: false,
  search: "",
};

// Parse filters from URL search params
function parseFiltersFromURL(searchParams: URLSearchParams): Filters {
  return {
    signals: searchParams.get("signals")?.split(",").filter(Boolean) || [],
    contentFormats: searchParams.get("formats")?.split(",").filter(Boolean) || [],
    countries: searchParams.get("countries")?.split(",").filter(Boolean) || [],
    trajectories: searchParams.get("trajectory")?.split(",").filter(Boolean) || [],
    noConferenceCircuit: searchParams.get("noConference") === "true",
    search: searchParams.get("q") || "",
  };
}

// Build URL search params from filters
function buildURLFromFilters(filters: Filters, sortBy: string, showMap: boolean): string {
  const params = new URLSearchParams();

  if (filters.signals.length > 0) params.set("signals", filters.signals.join(","));
  if (filters.contentFormats.length > 0) params.set("formats", filters.contentFormats.join(","));
  if (filters.countries.length > 0) params.set("countries", filters.countries.join(","));
  if (filters.trajectories.length > 0) params.set("trajectory", filters.trajectories.join(","));
  if (filters.noConferenceCircuit) params.set("noConference", "true");
  if (filters.search) params.set("q", filters.search);
  if (sortBy !== "recent") params.set("sort", sortBy);
  if (!showMap) params.set("map", "false");

  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
}

export default function CreatorsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const listRef = useRef<HTMLDivElement>(null);

  // Initialize state from URL
  const [filters, setFilters] = useState<Filters>(() => parseFiltersFromURL(searchParams));
  const [showMap, setShowMap] = useState(() => searchParams.get("map") !== "false");
  const [sortBy, setSortBy] = useState<"recent" | "az">(() =>
    (searchParams.get("sort") as "recent" | "az") || "recent"
  );
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  // Update URL when filters change
  const updateURL = useCallback((newFilters: Filters, newSortBy: string, newShowMap: boolean) => {
    const url = buildURLFromFilters(newFilters, newSortBy, newShowMap);
    router.replace(`/creators${url}`, { scroll: false });
  }, [router]);

  // Sync URL on filter changes
  useEffect(() => {
    updateURL(filters, sortBy, showMap);
  }, [filters, sortBy, showMap, updateURL]);

  const filteredCreators = useMemo(() => {
    const filtered = filterCreators(creators, filters);
    return sortCreators(filtered, sortBy);
  }, [filters, sortBy]);

  // Reset selection when filters change
  useEffect(() => {
    setSelectedIndex(-1);
  }, [filters, sortBy]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) {
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
    filters.countries.length > 0 ||
    filters.trajectories.length > 0 ||
    filters.noConferenceCircuit ||
    filters.search.length > 0;

  return (
    <div className="h-screen flex flex-col bg-stone-50 dark:bg-stone-900">
      <Header />

      {/* Top Filter Bar */}
      <div className="bg-white dark:bg-stone-800 border-b border-stone-200 dark:border-stone-700 px-4 py-3">
        {/* Title Row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
              Web3 Creators & Contributors
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 text-xs text-stone-400 dark:text-stone-500">
              <kbd className="px-1.5 py-0.5 bg-stone-100 dark:bg-stone-700 rounded text-[10px] font-mono">j</kbd>
              <kbd className="px-1.5 py-0.5 bg-stone-100 dark:bg-stone-700 rounded text-[10px] font-mono">k</kbd>
              to navigate
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Map Toggle */}
            <button
              onClick={() => setShowMap(!showMap)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
            >
              {showMap ? (
                <>
                  <EyeOff size={16} />
                  Hide map
                </>
              ) : (
                <>
                  <Map size={16} />
                  Show map
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
            className="flex items-center gap-1 px-4 py-2 ml-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex-shrink-0"
          >
            <Filter size={16} />
            More Filters
          </button>
        </div>

        {/* Location Pills Row */}
        <div className="flex items-center gap-2 mt-3 overflow-x-auto scrollbar-hide">
          {countriesInData.slice(0, 10).map((country) => (
            <button
              key={country}
              onClick={() => toggleCountry(country)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors flex-shrink-0 ${filters.countries.includes(country)
                  ? "bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900"
                  : "bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-600"
                }`}
            >
              {country}
            </button>
          ))}
        </div>

        {/* More Filters Panel */}
        {showMoreFilters && (
          <div className="mt-3 pt-3 border-t border-stone-200 dark:border-stone-700 grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="col-span-2 md:col-span-1">
              <label className="text-xs font-medium text-stone-500 dark:text-stone-400 mb-1 block">Search</label>
              <div className="relative">
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Name, signal..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="w-full pl-8 pr-3 py-1.5 text-sm border border-stone-200 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Trajectory */}
            <div>
              <label className="text-xs font-medium text-stone-500 dark:text-stone-400 mb-1 block">Trajectory</label>
              <TrajectoryDropdown
                value={filters.trajectories[0] || ""}
                onChange={(value) => setFilters({ ...filters, trajectories: value ? [value] : [] })}
              />
            </div>

            {/* No Conference */}
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.noConferenceCircuit}
                  onChange={(e) => setFilters({ ...filters, noConferenceCircuit: e.target.checked })}
                  className="w-4 h-4 rounded border-stone-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-stone-600 dark:text-stone-400">No conference circuit</span>
              </label>
            </div>

            {/* Clear */}
            {hasActiveFilters && (
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 text-sm text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200"
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
      <div className="flex-1 flex overflow-hidden">
        {/* Creator List */}
        <div
          ref={listRef}
          className={`flex flex-col bg-white dark:bg-stone-800 border-r border-stone-200 dark:border-stone-700 ${showMap ? "w-1/2 lg:w-2/5" : "w-full"}`}
        >
          {/* Results Header */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900">
            <span className="text-sm text-stone-600 dark:text-stone-400">
              {filteredCreators.length} creator{filteredCreators.length !== 1 ? "s" : ""}
              {selectedIndex >= 0 && (
                <span className="ml-2 text-blue-600">
                  ({selectedIndex + 1} of {filteredCreators.length})
                </span>
              )}
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "recent" | "az")}
              className="text-sm border-0 bg-transparent text-stone-600 dark:text-stone-400 focus:ring-0 cursor-pointer"
            >
              <option value="recent">Recently added</option>
              <option value="az">A–Z</option>
            </select>
          </div>

          {/* Scrollable List */}
          <div className="flex-1 overflow-y-auto">
            {filteredCreators.length > 0 ? (
              filteredCreators.map((creator, index) => (
                <CreatorListItem
                  key={creator.id}
                  creator={creator}
                  isSelected={index === selectedIndex}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-stone-500 dark:text-stone-400">
                <p>No creators match your filters.</p>
                <button
                  onClick={clearFilters}
                  className="mt-2 text-sm text-blue-600 hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Map Panel */}
        {showMap && (
          <div className="flex-1 relative">
            <CreatorsMap creators={filteredCreators} />
          </div>
        )}
      </div>
    </div>
  );
}
