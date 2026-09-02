import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, X, Globe, Sparkles } from 'lucide-react';
import { DESTINATIONS, filterDestinations } from '../../data/destinations';
import { useLocation } from '../../hooks/useLocation';

export const LocationSearch = ({
  placeholder = 'Search by city or country (e.g. "Paris", "Tokyo", "Chennai")...',
  className = '',
  onLocationSelected
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const { setManualLocation, selectedLocation } = useLocation();
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Filter matching destinations
  const matches = query.trim()
    ? filterDestinations(DESTINATIONS, { search: query }).slice(0, 6)
    : [];

  // Handle click outside to close suggestion dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (destination) => {
    setManualLocation(destination);
    setQuery('');
    setIsOpen(false);
    setHighlightedIndex(-1);
    if (onLocationSelected) {
      onLocationSelected(destination);
    }
  };

  const handleKeyDown = (e) => {
    if (!isOpen || matches.length === 0) {
      if (e.key === 'ArrowDown' && matches.length > 0) {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < matches.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : matches.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < matches.length) {
        handleSelect(matches[highlightedIndex]);
      } else if (matches.length > 0) {
        handleSelect(matches[0]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setHighlightedIndex(-1);
    }
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Input Field */}
      <div className="relative flex items-center">
        <div className="absolute left-3.5 pointer-events-none text-slate-400 flex items-center">
          <Search className="w-4 h-4" />
        </div>

        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setHighlightedIndex(-1);
          }}
          onFocus={() => {
            if (query.trim()) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full bg-white text-slate-800 text-sm placeholder:text-slate-400 border border-slate-200/90 rounded-2xl pl-10 pr-10 py-3 shadow-subtle hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
          aria-label="Search destination or location"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          role="combobox"
        />

        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setIsOpen(false);
              inputRef.current?.focus();
            }}
            className="absolute right-3.5 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Clear location search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Suggestion Dropdown */}
      {isOpen && query.trim() && (
        <div
          className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-card-hover border border-slate-200/90 overflow-hidden z-50 animate-fade-in max-h-80 overflow-y-auto"
          role="listbox"
        >
          {matches.length > 0 ? (
            <div className="p-1.5 space-y-1">
              <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Matching Destinations ({matches.length})
              </div>
              {matches.map((dest, index) => {
                const isSelected = selectedLocation?.destinationId === dest.id;
                const isHighlighted = highlightedIndex === index;

                return (
                  <button
                    key={dest.id}
                    type="button"
                    onClick={() => handleSelect(dest)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs sm:text-sm flex items-center justify-between transition-colors ${
                      isHighlighted || isSelected
                        ? 'bg-brand-50 text-brand-900 font-semibold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                    role="option"
                    aria-selected={isHighlighted}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-brand-100/70 text-brand-600 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 leading-tight">
                          {dest.name}, <span className="text-slate-500 font-normal">{dest.country}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {dest.region} · {dest.category}
                        </div>
                      </div>
                    </div>

                    <div className="text-[11px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                      {dest.latitude.toFixed(2)}°, {dest.longitude.toFixed(2)}°
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-slate-500">
              No matching destinations found for <span className="font-semibold text-slate-700">"{query}"</span>.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LocationSearch;
