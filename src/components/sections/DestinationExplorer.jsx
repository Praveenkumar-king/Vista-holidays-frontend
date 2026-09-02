import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowRight } from 'lucide-react';
import { Container } from '../layout/Container';
import { SectionHeader } from '../ui/SectionHeader';
import { Button } from '../ui/Button';
import { DestinationSearch } from '../destinations/DestinationSearch';
import { DestinationFilters } from '../destinations/DestinationFilters';
import { DestinationGrid } from '../destinations/DestinationGrid';
import { DESTINATIONS, filterDestinations } from '../../data/destinations';

export const DestinationExplorer = ({
  initialLimit,
  showViewAllLink = true,
  className = ''
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [region, setRegion] = useState('all');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

  // Filter destinations based on active search and filter states
  const filteredDestinations = useMemo(() => {
    const results = filterDestinations(DESTINATIONS, {
      search: searchQuery,
      region,
      category,
      sortBy
    });

    if (initialLimit && !searchQuery && region === 'all' && category === 'all') {
      return results.slice(0, initialLimit);
    }

    return results;
  }, [searchQuery, region, category, sortBy, initialLimit]);

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
    <section id="explorer" aria-label="Destination Explorer" className={`w-full ${className}`}>
      <Container size="xl">
        {/* Section Header */}
        <SectionHeader
          eyebrow="Interactive Discovery"
          title="Explore Global Destinations"
          description="Filter and search through curated worldwide escapes tailored to your travel preference, budget, and season."
          action={
            showViewAllLink && (
              <Link to="/destinations">
                <Button variant="secondary" size="sm" iconRight={ArrowRight}>
                  View All ({DESTINATIONS.length})
                </Button>
              </Link>
            )
          }
        />

        {/* Search & Filter Control Panel */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-card mb-8">
          {/* Search Bar */}
          <div className="mb-5">
            <DestinationSearch
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onClearSearch={() => setSearchQuery('')}
              size="lg"
            />
          </div>

          {/* Filters Bar */}
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

        {/* Filtered Destination Grid */}
        <DestinationGrid
          destinations={filteredDestinations}
          searchQuery={searchQuery}
          region={region}
          category={category}
          onClearFilters={handleClearAll}
          columns="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        />
      </Container>
    </section>
  );
};

export default DestinationExplorer;
