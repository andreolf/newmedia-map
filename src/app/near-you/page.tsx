"use client";

import { useState, useEffect, useMemo } from "react";
import { Header } from "@/components/Header";
import { CreatorCard } from "@/components/CreatorCard";
import { getCreatorsNearLocation, chapters } from "@/lib/chapters";
import { CATEGORY_DESCRIPTIONS, CreatorCategory } from "@/types";
import {
  MapPin,
  Navigation,
  Loader2,
  AlertCircle,
  Filter,
  X,
  Users,
} from "lucide-react";

// Major cities for fallback selection
const MAJOR_CITIES = [
  { name: "Lagos, Nigeria", lat: 6.5244, lng: 3.3792 },
  { name: "Nairobi, Kenya", lat: -1.2921, lng: 36.8219 },
  { name: "Berlin, Germany", lat: 52.52, lng: 13.405 },
  { name: "Lisbon, Portugal", lat: 38.7223, lng: -9.1393 },
  { name: "Singapore", lat: 1.3521, lng: 103.8198 },
  { name: "Tokyo, Japan", lat: 35.6762, lng: 139.6503 },
  { name: "São Paulo, Brazil", lat: -23.5505, lng: -46.6333 },
  { name: "Mexico City, Mexico", lat: 19.4326, lng: -99.1332 },
  { name: "London, UK", lat: 51.5074, lng: -0.1278 },
  { name: "Dubai, UAE", lat: 25.2048, lng: 55.2708 },
];

const RADIUS_OPTIONS = [
  { label: "25 km", value: 25 },
  { label: "50 km", value: 50 },
  { label: "100 km", value: 100 },
  { label: "250 km", value: 250 },
  { label: "500 km", value: 500 },
  { label: "Any distance", value: 20000 },
];

export default function NearYouPage() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [locationName, setLocationName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [radius, setRadius] = useState(100);
  const [showFilters, setShowFilters] = useState(false);
  const [openToCollabOnly, setOpenToCollabOnly] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<
    CreatorCategory[]
  >([]);
  const [selectedChapter, setSelectedChapter] = useState<string>("");

  // Try to get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLocationName("Your location");
          setLoading(false);
        },
        () => {
          // Fallback to first city
          setLocation(MAJOR_CITIES[0]);
          setLocationName(MAJOR_CITIES[0].name);
          setLoading(false);
          setError(
            "Could not detect your location. Choose a city or enable location access."
          );
        },
        { timeout: 5000, maximumAge: 60000 } // 5 second timeout
      );
    } else {
      setLocation(MAJOR_CITIES[0]);
      setLocationName(MAJOR_CITIES[0].name);
      setLoading(false);
    }
  }, []);

  const nearbyCreators = useMemo(() => {
    if (!location) return [];
    return getCreatorsNearLocation(location.lat, location.lng, radius, {
      intents: openToCollabOnly ? ["local_meetups"] : undefined,
      categories: selectedCategories.length ? selectedCategories : undefined,
      chapterId: selectedChapter || undefined,
    });
  }, [
    location,
    radius,
    openToCollabOnly,
    selectedCategories,
    selectedChapter,
  ]);

  const selectCity = (city: (typeof MAJOR_CITIES)[0]) => {
    setLocation({ lat: city.lat, lng: city.lng });
    setLocationName(city.name);
    setError(null);
  };

  const toggleCategory = (cat: CreatorCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const clearFilters = () => {
    setOpenToCollabOnly(false);
    setSelectedCategories([]);
    setSelectedChapter("");
  };

  const hasActiveFilters =
    openToCollabOnly || selectedCategories.length > 0 || selectedChapter;

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-stone-900">
        <Header />
        <div className="flex flex-col items-center justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="mt-4 text-stone-500 dark:text-stone-400">
            Detecting your location...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-900">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100 mb-2">
            Creators Near You
          </h1>
          <p className="text-stone-500 dark:text-stone-400">
            Discover Web3 creators in your area who are open to local
            collaboration.
          </p>
        </div>

        {/* Location & Filters Bar */}
        <div className="bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            {/* Location selector */}
            <div className="flex items-center gap-2">
              <MapPin size={18} className="text-blue-600 dark:text-blue-400" />
              <select
                value={locationName}
                onChange={(e) => {
                  const city = MAJOR_CITIES.find((c) => c.name === e.target.value);
                  if (city) selectCity(city);
                }}
                className="bg-transparent border-0 text-stone-900 dark:text-stone-100 font-medium focus:ring-0 cursor-pointer"
              >
                {locationName === "Your location" && (
                  <option value="Your location">Your location</option>
                )}
                {MAJOR_CITIES.map((city) => (
                  <option key={city.name} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Radius selector */}
            <div className="flex items-center gap-2 border-l border-stone-200 dark:border-stone-700 pl-4">
              <Navigation size={16} className="text-stone-400" />
              <select
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                className="bg-transparent border-0 text-stone-700 dark:text-stone-300 text-sm focus:ring-0 cursor-pointer"
              >
                {RADIUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                showFilters || hasActiveFilters
                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                  : "bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-600"
              }`}
            >
              <Filter size={14} />
              Filters
              {hasActiveFilters && (
                <span className="w-2 h-2 bg-blue-600 rounded-full" />
              )}
            </button>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-sm text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
              >
                <X size={14} />
                Clear
              </button>
            )}

            {/* Results count */}
            <div className="ml-auto flex items-center gap-2 text-sm text-stone-500 dark:text-stone-400">
              <Users size={14} />
              {nearbyCreators.length} creator
              {nearbyCreators.length !== 1 ? "s" : ""} found
            </div>
          </div>

          {/* Expanded filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-stone-200 dark:border-stone-700 grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Open to collab */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={openToCollabOnly}
                  onChange={(e) => setOpenToCollabOnly(e.target.checked)}
                  className="w-4 h-4 rounded border-stone-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-stone-700 dark:text-stone-300">
                  Open to local collaboration
                </span>
              </label>

              {/* Categories */}
              <div>
                <label className="text-xs font-medium text-stone-500 dark:text-stone-400 mb-2 block">
                  Categories
                </label>
                <div className="flex flex-wrap gap-2">
                  {(
                    Object.keys(CATEGORY_DESCRIPTIONS) as CreatorCategory[]
                  ).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => toggleCategory(cat)}
                      className={`px-2.5 py-1 text-xs font-medium rounded-full transition-colors ${
                        selectedCategories.includes(cat)
                          ? "bg-blue-600 text-white"
                          : "bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-600"
                      }`}
                      title={CATEGORY_DESCRIPTIONS[cat]}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chapter */}
              <div>
                <label className="text-xs font-medium text-stone-500 dark:text-stone-400 mb-2 block">
                  Chapter
                </label>
                <select
                  value={selectedChapter}
                  onChange={(e) => setSelectedChapter(e.target.value)}
                  className="w-full px-3 py-1.5 text-sm border border-stone-200 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 focus:ring-blue-500"
                >
                  <option value="">All chapters</option>
                  {chapters.map((ch) => (
                    <option key={ch.id} value={ch.id}>
                      {ch.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Error message */}
        {error && (
          <div className="flex items-center gap-2 p-4 mb-6 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg text-amber-700 dark:text-amber-400 text-sm">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Results */}
        {nearbyCreators.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nearbyCreators.map((creator) => (
              <div key={creator.id} className="relative">
                <CreatorCard
                  creator={creator}
                  userLocation={location || undefined}
                  showWhySurfaced={true}
                />
                {/* Distance badge */}
                <div className="absolute top-3 right-3 px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
                  {creator.distance_km} km
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700">
            <MapPin
              size={48}
              className="mx-auto text-stone-300 dark:text-stone-600 mb-4"
            />
            <h3 className="text-lg font-medium text-stone-900 dark:text-stone-100 mb-2">
              No creators found nearby
            </h3>
            <p className="text-stone-500 dark:text-stone-400 mb-4">
              Try increasing your search radius or selecting a different city.
            </p>
            <button
              onClick={() => setRadius(500)}
              className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
            >
              Expand to 500 km
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
