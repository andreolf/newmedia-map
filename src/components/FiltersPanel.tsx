"use client";

import { useState } from "react";
import { ChevronDown, X, Search, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  allSignals,
  allContentFormats,
  allTrajectories,
  allCountries,
  trajectoryLabels,
  contentFormatLabels,
} from "@/lib/constants";

interface FiltersPanelProps {
  filters: {
    signals: string[];
    contentFormats: string[];
    countries: string[];
    trajectories: string[];
    noConferenceCircuit: boolean;
    search: string;
  };
  onFiltersChange: (filters: FiltersPanelProps["filters"]) => void;
  isMobile?: boolean;
}

function FilterSection({
  title,
  options,
  selected,
  onToggle,
  labelMap,
}: {
  title: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
  labelMap?: Record<string, string>;
}) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="border-b border-stone-200 pb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-2 text-sm font-medium text-stone-700 hover:text-stone-900"
      >
        {title}
        <ChevronDown
          size={16}
          className={cn("transition-transform", isOpen && "rotate-180")}
        />
      </button>
      {isOpen && (
        <div className="space-y-1 mt-1">
          {options.map((option) => (
            <label
              key={option}
              className="flex items-center gap-2 py-1 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={selected.includes(option)}
                onChange={() => onToggle(option)}
                className="w-4 h-4 rounded border-stone-300 text-stone-900 focus:ring-stone-500 focus:ring-offset-0"
              />
              <span className="text-sm text-stone-600 group-hover:text-stone-900 capitalize">
                {labelMap?.[option] || option}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export function FiltersPanel({
  filters,
  onFiltersChange,
  isMobile = false,
}: FiltersPanelProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleFilter = (
    key: "signals" | "contentFormats" | "countries" | "trajectories",
    value: string
  ) => {
    const current = filters[key];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onFiltersChange({ ...filters, [key]: updated });
  };

  const clearFilters = () => {
    onFiltersChange({
      signals: [],
      contentFormats: [],
      countries: [],
      trajectories: [],
      noConferenceCircuit: false,
      search: "",
    });
  };

  const hasActiveFilters =
    filters.signals.length > 0 ||
    filters.contentFormats.length > 0 ||
    filters.countries.length > 0 ||
    filters.trajectories.length > 0 ||
    filters.noConferenceCircuit ||
    filters.search.length > 0;

  const content = (
    <div className="space-y-4">
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
        <input
          type="text"
          placeholder="Search creators..."
          value={filters.search}
          onChange={(e) =>
            onFiltersChange({ ...filters, search: e.target.value })
          }
          className="w-full pl-9 pr-4 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent"
        />
      </div>

      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="flex items-center gap-1 text-sm text-stone-500 hover:text-stone-700"
        >
          <X size={14} />
          Clear all filters
        </button>
      )}

      <FilterSection
        title="Signals"
        options={allSignals}
        selected={filters.signals}
        onToggle={(v) => toggleFilter("signals", v)}
      />

      <FilterSection
        title="Content Format"
        options={allContentFormats}
        selected={filters.contentFormats}
        onToggle={(v) => toggleFilter("contentFormats", v)}
        labelMap={contentFormatLabels}
      />

      <FilterSection
        title="Trajectory"
        options={allTrajectories}
        selected={filters.trajectories}
        onToggle={(v) => toggleFilter("trajectories", v)}
        labelMap={trajectoryLabels}
      />

      <FilterSection
        title="Geography"
        options={allCountries}
        selected={filters.countries}
        onToggle={(v) => toggleFilter("countries", v)}
      />

      <div className="pt-2">
        <label className="flex items-center gap-2 cursor-pointer group">
          <input
            type="checkbox"
            checked={filters.noConferenceCircuit}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                noConferenceCircuit: e.target.checked,
              })
            }
            className="w-4 h-4 rounded border-stone-300 text-stone-900 focus:ring-stone-500"
          />
          <span className="text-sm text-stone-600 group-hover:text-stone-900">
            No conference circuit
          </span>
        </label>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        <button
          onClick={() => setMobileOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-50"
        >
          <Filter size={16} />
          Filters
          {hasActiveFilters && (
            <span className="w-5 h-5 flex items-center justify-center bg-stone-900 text-white text-xs rounded-full">
              {filters.signals.length +
                filters.contentFormats.length +
                filters.countries.length +
                filters.trajectories.length +
                (filters.noConferenceCircuit ? 1 : 0)}
            </span>
          )}
        </button>

        {mobileOpen && (
          <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setMobileOpen(false)}>
            <div
              className="absolute inset-y-0 right-0 w-80 bg-white p-6 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-1 hover:bg-stone-100 rounded"
                >
                  <X size={20} />
                </button>
              </div>
              {content}
            </div>
          </div>
        )}
      </>
    );
  }

  return <div className="bg-white p-6 rounded-xl border border-stone-200">{content}</div>;
}

