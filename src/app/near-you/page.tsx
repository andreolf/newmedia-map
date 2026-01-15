"use client";

import { useState, useEffect, useMemo, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { CreatorCard } from "@/components/CreatorCard";
import { getCreatorsNearLocation, chapters } from "@/lib/chapters";
import {
  CATEGORY_DESCRIPTIONS,
  CreatorCategory,
  CreatorIntent,
  INTENT_LABELS,
} from "@/types";
import {
  MapPin,
  Navigation,
  Loader2,
  AlertCircle,
  Filter,
  X,
  Users,
  Shield,
  Info,
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
  { name: "Paris, France", lat: 48.8566, lng: 2.3522 },
  { name: "Amsterdam, Netherlands", lat: 52.3676, lng: 4.9041 },
  { name: "Barcelona, Spain", lat: 41.3851, lng: 2.1734 },
  { name: "Toronto, Canada", lat: 43.6532, lng: -79.3832 },
  { name: "Austin, USA", lat: 30.2672, lng: -97.7431 },
  { name: "Melbourne, Australia", lat: -37.8136, lng: 144.9631 },
  { name: "Seoul, South Korea", lat: 37.5665, lng: 126.978 },
  { name: "Ho Chi Minh City, Vietnam", lat: 10.8231, lng: 106.6297 },
  { name: "Bangalore, India", lat: 12.9716, lng: 77.5946 },
  { name: "Cape Town, South Africa", lat: -33.9249, lng: 18.4241 },
  { name: "Cairo, Egypt", lat: 30.0444, lng: 31.2357 },
  { name: "Buenos Aires, Argentina", lat: -34.6037, lng: -58.3816 },
];

const RADIUS_OPTIONS = [
  { label: "10 km", value: 10 },
  { label: "25 km", value: 25 },
  { label: "50 km", value: 50 },
  { label: "100 km", value: 100 },
  { label: "250 km", value: 250 },
  { label: "500 km", value: 500 },
];

const INTENT_OPTIONS: { value: CreatorIntent; label: string }[] = [
  { value: "collaboration", label: "Collaboration" },
  { value: "local_meetups", label: "Local meetups" },
  { value: "events_workshops", label: "Events/workshops" },
  { value: "product_feedback", label: "Product feedback" },
  { value: "research_interviews", label: "Research" },
  { value: "mentorship", label: "Mentorship" },
];

function NearYouContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Location state
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationName, setLocationName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locationDenied, setLocationDenied] = useState(false);

  // Filter state
  const [radius, setRadius] = useState(() => {
    const r = searchParams.get("radius");
    return r ? parseInt(r, 10) : 50;
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedIntents, setSelectedIntents] = useState<CreatorIntent[]>(() => {
    const intents = searchParams.get("intents");
    return intents ? (intents.split(",") as CreatorIntent[]) : [];
  });
  const [selectedCategories, setSelectedCategories] = useState<CreatorCategory[]>(() => {
    const cats = searchParams.get("categories");
    return cats ? (cats.split(",") as CreatorCategory[]) : [];
  });
  const [selectedChapter, setSelectedChapter] = useState<string>(() => {
    return searchParams.get("chapter") || "";
  });

  // Update URL with filters
  const updateURL = useCallback(
    (
      newRadius: number,
      newIntents: CreatorIntent[],
      newCategories: CreatorCategory[],
      newChapter: string,
      newCity?: string
    ) => {
      const params = new URLSearchParams();
      if (newRadius !== 50) params.set("radius", String(newRadius));
      if (newIntents.length) params.set("intents", newIntents.join(","));
      if (newCategories.length) params.set("categories", newCategories.join(","));
      if (newChapter) params.set("chapter", newChapter);
      if (newCity) params.set("city", newCity);

      const queryString = params.toString();
      router.replace(`/near-you${queryString ? `?${queryString}` : ""}`, { scroll: false });
    },
    [router]
  );

  // Try to get user location on mount
  useEffect(() => {
    // Check if city is specified in URL
    const cityParam = searchParams.get("city");
    if (cityParam) {
      const city = MAJOR_CITIES.find((c) => c.name === cityParam);
      if (city) {
        setLocation({ lat: city.lat, lng: city.lng });
        setLocationName(city.name);
        setLoading(false);
        return;
      }
    }

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
          setLocationDenied(true);
          setError(
            "Location access denied. Select a city or enable location in your browser settings."
          );
        }
      );
    } else {
      setLocation(MAJOR_CITIES[0]);
      setLocationName(MAJOR_CITIES[0].name);
      setLoading(false);
    }
  }, [searchParams]);

  // Get nearby creators with filters
  const nearbyCreators = useMemo(() => {
    if (!location) return [];
    return getCreatorsNearLocation(location.lat, location.lng, radius, {
      intents: selectedIntents.length ? selectedIntents : undefined,
      categories: selectedCategories.length ? selectedCategories : undefined,
      chapterId: selectedChapter || undefined,
    });
  }, [location, radius, selectedIntents, selectedCategories, selectedChapter]);

  const selectCity = (city: (typeof MAJOR_CITIES)[0]) => {
    setLocation({ lat: city.lat, lng: city.lng });
    setLocationName(city.name);
    setError(null);
    updateURL(radius, selectedIntents, selectedCategories, selectedChapter, city.name);
  };

  const toggleIntent = (intent: CreatorIntent) => {
    const newIntents = selectedIntents.includes(intent)
      ? selectedIntents.filter((i) => i !== intent)
      : [...selectedIntents, intent];
    setSelectedIntents(newIntents);
    updateURL(radius, newIntents, selectedCategories, selectedChapter);
  };

  const toggleCategory = (cat: CreatorCategory) => {
    const newCats = selectedCategories.includes(cat)
      ? selectedCategories.filter((c) => c !== cat)
      : [...selectedCategories, cat];
    setSelectedCategories(newCats);
    updateURL(radius, selectedIntents, newCats, selectedChapter);
  };

  const handleRadiusChange = (newRadius: number) => {
    setRadius(newRadius);
    updateURL(newRadius, selectedIntents, selectedCategories, selectedChapter);
  };

  const handleChapterChange = (newChapter: string) => {
    setSelectedChapter(newChapter);
    updateURL(radius, selectedIntents, selectedCategories, newChapter);
  };

  const clearFilters = () => {
    setSelectedIntents([]);
    setSelectedCategories([]);
    setSelectedChapter("");
    updateURL(radius, [], [], "");
  };

  const hasActiveFilters =
    selectedIntents.length > 0 || selectedCategories.length > 0 || selectedChapter;

  if (loading) {
    return (
      <div className="min-h-screen bg-[--background]">
        <Header />
        <div className="flex flex-col items-center justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-[#00ff88]" />
          <p className="mt-4 text-[--muted-foreground]">Detecting your location...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[--background]">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-[--foreground] mb-2">
            Creators Near You
          </h1>
          <p className="text-[--muted-foreground]">
            Discover Web3 creators in your area who are open to local collaboration.
          </p>
        </div>

        {/* Privacy notice */}
        <div className="flex items-start gap-3 p-4 mb-6 bg-[#00ff88]/5 border border-[#00ff88]/20 rounded-xl">
          <Shield size={20} className="text-[#00ff88] mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-[--foreground] font-medium">Privacy-first discovery</p>
            <p className="text-sm text-[--muted-foreground] mt-1">
              We never show exact locations. Creators control their visibility and only those who
              opted into &quot;Near me&quot; discovery appear here. Distances are approximate.
            </p>
          </div>
        </div>

        {/* Location & Filters Bar */}
        <div className="bg-[--card] rounded-xl border border-[--border] p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            {/* Location selector */}
            <div className="flex items-center gap-2">
              <MapPin size={18} className="text-[#00ff88]" />
              <select
                value={locationName}
                onChange={(e) => {
                  const city = MAJOR_CITIES.find((c) => c.name === e.target.value);
                  if (city) selectCity(city);
                }}
                className="bg-transparent border-0 text-[--foreground] font-medium focus:ring-0 cursor-pointer"
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
            <div className="flex items-center gap-2 border-l border-[--border] pl-4">
              <Navigation size={16} className="text-[--muted-foreground]" />
              <select
                value={radius}
                onChange={(e) => handleRadiusChange(Number(e.target.value))}
                className="bg-transparent border-0 text-[--muted-foreground] text-sm focus:ring-0 cursor-pointer"
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
                  ? "bg-[#6366f1] text-white"
                  : "bg-[--muted] text-[--muted-foreground] hover:text-[--foreground]"
              }`}
            >
              <Filter size={14} />
              Filters
              {hasActiveFilters && <span className="w-2 h-2 bg-white rounded-full" />}
            </button>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-sm text-[--muted-foreground] hover:text-[#ff3366]"
              >
                <X size={14} />
                Clear
              </button>
            )}

            {/* Results count */}
            <div className="ml-auto flex items-center gap-2 text-sm text-[--muted-foreground]">
              <Users size={14} />
              {nearbyCreators.length} creator
              {nearbyCreators.length !== 1 ? "s" : ""} found
            </div>
          </div>

          {/* Intent Pills Row */}
          <div className="flex items-center gap-2 mt-4 overflow-x-auto scrollbar-hide">
            {INTENT_OPTIONS.map((intent) => (
              <button
                key={intent.value}
                onClick={() => toggleIntent(intent.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex-shrink-0 ${
                  selectedIntents.includes(intent.value)
                    ? "bg-[#6366f1] text-white"
                    : "bg-[--muted] text-[--muted-foreground] hover:text-[--foreground] border border-[--border]"
                }`}
              >
                {intent.label}
              </button>
            ))}
          </div>

          {/* Expanded filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-[--border] grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Categories */}
              <div>
                <label className="text-xs font-medium text-[--muted-foreground] mb-2 block">
                  Categories
                </label>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(CATEGORY_DESCRIPTIONS) as CreatorCategory[]).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => toggleCategory(cat)}
                      className={`px-2.5 py-1 text-xs font-medium rounded-full transition-colors ${
                        selectedCategories.includes(cat)
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

              {/* Chapter */}
              <div>
                <label className="text-xs font-medium text-[--muted-foreground] mb-2 block">
                  Chapter
                </label>
                <select
                  value={selectedChapter}
                  onChange={(e) => handleChapterChange(e.target.value)}
                  className="w-full px-3 py-1.5 text-sm border border-[--border] rounded-lg bg-[--card] text-[--foreground] focus:ring-[#00ff88]"
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
          <div className="flex items-center gap-2 p-4 mb-6 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400 text-sm">
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
                <div className="absolute top-3 right-3 px-2 py-1 bg-[#00ff88] text-black text-xs font-bold rounded-full">
                  ~{creator.distance_km} km
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-[--card] rounded-xl border border-[--border]">
            <MapPin size={48} className="mx-auto text-[--muted-foreground] mb-4" />
            <h3 className="text-lg font-medium text-[--foreground] mb-2">
              No creators found nearby
            </h3>
            <p className="text-[--muted-foreground] mb-4">
              {hasActiveFilters
                ? "Try removing some filters or expanding your search radius."
                : "Try increasing your search radius or selecting a different city."}
            </p>
            <div className="flex items-center justify-center gap-4">
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-[#6366f1] font-medium hover:underline"
                >
                  Clear filters
                </button>
              )}
              <button
                onClick={() => handleRadiusChange(500)}
                className="text-[#00ff88] font-medium hover:underline"
              >
                Expand to 500 km
              </button>
            </div>
          </div>
        )}

        {/* Info about opting in */}
        <div className="mt-12 text-center">
          <p className="text-sm text-[--muted-foreground]">
            <Info size={14} className="inline mr-1" />
            Only creators who opted into local discovery appear here.{" "}
            <a href="/submit" className="text-[#00ff88] hover:underline">
              Add your profile
            </a>{" "}
            to be discovered.
          </p>
        </div>
      </main>
    </div>
  );
}

export default function NearYouPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[--background]">
          <Header />
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-[#00ff88]" />
            <p className="mt-4 text-[--muted-foreground]">Loading...</p>
          </div>
        </div>
      }
    >
      <NearYouContent />
    </Suspense>
  );
}
