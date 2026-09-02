import React, { useState, useMemo } from 'react';
import { Compass } from 'lucide-react';
import { Container } from '../components/layout/Container';
import { DestinationSearch } from '../components/destinations/DestinationSearch';
import { DestinationFilters } from '../components/destinations/DestinationFilters';
import { DestinationGrid } from '../components/destinations/DestinationGrid';
import { DESTINATIONS, filterDestinations } from '../data/destinations';

export const DestinationsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [region, setRegion] = useState('all');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

  // Dynamically filter destinations based on search, region, category, and sort state
  const filteredDestinations = useMemo(() => {
    return filterDestinations(DESTINATIONS, {
      search: searchQuery,
      region,
      category,
      sortBy
    });
  }, [searchQuery, region, category, sortBy]);

  const handleClearAll = () => {
    setSearchQuery('');
    setRegion('all');
    setCategory('all');
    setSortBy('featured');
  };

  const handleClearFilter = (filterKey) => {
    if (filterKey === 'search') setSearchQuery('');
    if (filterKey === 'region') setRegion('all');
    if (filterKey === 'category') setCategory('all');
    if (filterKey === 'sortBy') setSortBy('featured');
  };

  return (
    <div className="py-8 sm:py-12 lg:py-16">
      <Container size="xl">
        {/* Page Header */}
        <div className="max-w-3xl mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200/80 mb-3 shadow-subtle">
            <Compass className="w-3.5 h-3.5" />
            <span>Curated Global Catalog</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
            Explore All Destinations
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Discover {DESTINATIONS.length} handpicked worldwide destinations with detailed travel guides, seasonal insights, and personalized planning essentials.
          </p>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-card mb-10">
          {/* Search Input */}
          <div className="mb-5">
            <DestinationSearch
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onClearSearch={() => setSearchQuery('')}
              size="lg"
            />
          </div>

          {/* Filters Toolbar */}
          <DestinationFilters
            region={region}
            category={category}
            sortBy={sortBy}
            searchQuery={searchQuery}
            onRegionChange={setRegion}
            onCategoryChange={setCategory}
            onSortChange={setSortBy}
            onClearAll={handleClearAll}
            onClearFilter={handleClearFilter}
          />
        </div>

        {/* Destination Cards Grid or Empty State */}
        <DestinationGrid
          destinations={filteredDestinations}
          searchQuery={searchQuery}
          region={region}
          category={category}
          onClearFilters={handleClearAll}
          columns="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        />
      </Container>
    </div>
  );
};

export default DestinationsPage;
