import React from 'react';
import { SearchInput } from '../ui/SearchInput';

export const DestinationSearch = ({
  searchQuery = '',
  onSearchChange,
  onClearSearch,
  placeholder = 'Search by destination, country, keyword, or tag (e.g. "Paris", "India", "Beach")...',
  className = '',
  size = 'md'
}) => {
  return (
    <div className={`w-full ${className}`}>
      <label htmlFor="destination-search-input" className="sr-only">
        Search destinations
      </label>
      <SearchInput
        id="destination-search-input"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        onClear={onClearSearch}
        placeholder={placeholder}
        size={size}
        shortcutHint={true}
        aria-label="Search destinations by name, country, or keyword"
      />
    </div>
  );
};

export default DestinationSearch;
