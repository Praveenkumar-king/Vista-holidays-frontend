import React from 'react';
import { Compass, RotateCcw } from 'lucide-react';
import { Button } from '../ui/Button';

export const EmptyDestinationState = ({
  searchQuery = '',
  region = 'all',
  category = 'all',
  onClearFilters
}) => {
  return (
    <div className="text-center py-16 px-4 max-w-lg mx-auto flex flex-col items-center justify-center bg-white rounded-3xl border border-slate-200/80 shadow-subtle my-8">
      <div className="w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-600 mb-5 border border-brand-100 shadow-sm">
        <Compass className="w-8 h-8 text-brand-600" />
      </div>

      <h3 className="font-display font-extrabold text-xl text-slate-900 mb-2 tracking-tight">
        No Destinations Found
      </h3>

      <p className="text-sm text-slate-500 max-w-sm mb-6 leading-relaxed">
        {searchQuery ? (
          <>
            No travel destinations matched your search query <span className="font-semibold text-slate-700">"{searchQuery}"</span>
            {region !== 'all' || category !== 'all' ? ' with the selected filters.' : '.'}
          </>
        ) : (
          'No destinations match your currently applied filters. Try adjusting the region or travel style.'
        )}
      </p>

      {onClearFilters && (
        <Button
          variant="primary"
          size="md"
          iconLeft={RotateCcw}
          onClick={onClearFilters}
          className="shadow-sm"
        >
          Reset All Filters
        </Button>
      )}
    </div>
  );
};

export default EmptyDestinationState;
