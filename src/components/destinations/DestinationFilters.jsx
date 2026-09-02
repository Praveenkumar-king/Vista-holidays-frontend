import React from 'react';
import { SlidersHorizontal, RotateCcw, X, Filter } from 'lucide-react';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { getDistinctRegions, getDistinctCategories } from '../../data/destinations';

export const DestinationFilters = ({
  region = 'all',
  category = 'all',
  sortBy = 'featured',
  searchQuery = '',
  onRegionChange,
  onCategoryChange,
  onSortChange,
  onClearAll,
  onClearFilter,
  className = '',
  compact = false
}) => {
  const regions = ['all', ...getDistinctRegions()];
  const categories = ['all', ...getDistinctCategories()];

  const isAnyFilterActive = region !== 'all' || category !== 'all' || searchQuery.trim() !== '' || sortBy !== 'featured';

  const regionOptions = regions.map((r) => ({
    value: r,
    label: r === 'all' ? 'All Regions' : r
  }));

  const categoryOptions = categories.map((c) => ({
    value: c,
    label: c === 'all' ? 'All Categories' : c
  }));

  const sortOptions = [
    { value: 'featured', label: 'Featured First' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'name-asc', label: 'Name (A to Z)' },
    { value: 'name-desc', label: 'Name (Z to A)' },
    { value: 'price-low', label: 'Budget (Low to High)' },
    { value: 'price-high', label: 'Budget (High to Low)' }
  ];

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {/* Primary Selectors Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {/* Region Select */}
        <div>
          <label htmlFor="filter-region" className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
            Region
          </label>
          <Select
            id="filter-region"
            options={regionOptions}
            value={region}
            onChange={(e) => onRegionChange(e.target.value)}
            className="text-xs sm:text-sm font-medium"
          />
        </div>

        {/* Category Select */}
        <div>
          <label htmlFor="filter-category" className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
            Travel Style
          </label>
          <Select
            id="filter-category"
            options={categoryOptions}
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="text-xs sm:text-sm font-medium"
          />
        </div>

        {/* Sort Select */}
        <div className="sm:col-span-2 lg:col-span-1">
          <label htmlFor="filter-sort" className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
            Sort By
          </label>
          <Select
            id="filter-sort"
            options={sortOptions}
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="text-xs sm:text-sm font-medium"
          />
        </div>
      </div>

      {/* Active Filter Pills Bar */}
      {isAnyFilterActive && (
        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-slate-400 font-medium mr-1">Active filters:</span>

            {searchQuery.trim() && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-brand-50 text-brand-700 font-medium border border-brand-200/80">
                Search: "{searchQuery.trim()}"
                <button
                  type="button"
                  onClick={() => onClearFilter('search')}
                  className="p-0.5 hover:bg-brand-200/50 rounded-full"
                  aria-label="Clear search filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {region !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium border border-slate-200">
                Region: {region}
                <button
                  type="button"
                  onClick={() => onClearFilter('region')}
                  className="p-0.5 hover:bg-slate-200 rounded-full"
                  aria-label="Clear region filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {category !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium border border-slate-200">
                Style: {category}
                <button
                  type="button"
                  onClick={() => onClearFilter('category')}
                  className="p-0.5 hover:bg-slate-200 rounded-full"
                  aria-label="Clear category filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {sortBy !== 'featured' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium border border-slate-200">
                Sorted: {sortOptions.find((s) => s.value === sortBy)?.label}
                <button
                  type="button"
                  onClick={() => onClearFilter('sortBy')}
                  className="p-0.5 hover:bg-slate-200 rounded-full"
                  aria-label="Reset sorting"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>

          <Button
            variant="ghost"
            size="xs"
            onClick={onClearAll}
            iconLeft={RotateCcw}
            className="text-slate-500 hover:text-slate-900"
          >
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default DestinationFilters;
