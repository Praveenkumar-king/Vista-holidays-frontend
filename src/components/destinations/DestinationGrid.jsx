import React from 'react';
import { DestinationCard } from './DestinationCard';
import { EmptyDestinationState } from './EmptyDestinationState';
import { Badge } from '../ui/Badge';

export const DestinationGrid = ({
  destinations = [],
  searchQuery = '',
  region = 'all',
  category = 'all',
  onClearFilters,
  columns = 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
}) => {
  const count = destinations.length;
  const countLabel = count === 1 ? '1 destination found' : `${count} destinations available`;

  if (count === 0) {
    return (
      <EmptyDestinationState
        searchQuery={searchQuery}
        region={region}
        category={category}
        onClearFilters={onClearFilters}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Result Count and Quick Indicator Bar */}
      <div className="flex items-center justify-between text-xs sm:text-sm text-slate-500 pb-2 border-b border-slate-200/60">
        <span className="font-semibold text-slate-800">
          Showing <span className="text-brand-600 font-bold">{countLabel}</span>
        </span>
        <span className="text-slate-400 text-xs hidden sm:inline">
          Click "Explore Guide" for deep insights
        </span>
      </div>

      {/* Grid of Destination Cards */}
      <div className={`grid ${columns} gap-6 sm:gap-8`}>
        {destinations.map((destination) => (
          <DestinationCard
            key={destination.id}
            destination={destination}
          />
        ))}
      </div>
    </div>
  );
};

export default DestinationGrid;
