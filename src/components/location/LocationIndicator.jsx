import React from 'react';
import { MapPin, Navigation, Compass } from 'lucide-react';
import { useLocation } from '../../hooks/useLocation';

export const LocationIndicator = ({ className = '', onClick }) => {
  const { selectedLocation, isCurrentLocation } = useLocation();

  if (!selectedLocation) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-100/70 border border-slate-200/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${className}`}
        aria-label="Set active travel location"
      >
        <MapPin className="w-3.5 h-3.5 text-slate-400" />
        <span>Set Location</span>
      </button>
    );
  }

  const label = selectedLocation.displayName || `${selectedLocation.latitude}, ${selectedLocation.longitude}`;

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold bg-brand-50/80 text-brand-900 border border-brand-200/80 shadow-subtle ${className}`}
      title={`Active Coordinates: ${selectedLocation.latitude}°, ${selectedLocation.longitude}° (${isCurrentLocation ? 'Browser GPS' : 'Manual Destination'})`}
    >
      <div className="w-4 h-4 rounded-full bg-brand-600 text-white flex items-center justify-center flex-shrink-0">
        {isCurrentLocation ? (
          <Navigation className="w-2.5 h-2.5 fill-current" />
        ) : (
          <MapPin className="w-2.5 h-2.5 fill-current" />
        )}
      </div>

      <span className="truncate max-w-[140px] sm:max-w-[180px]">
        {label}
      </span>

      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white text-brand-700 border border-brand-200 uppercase tracking-wider">
        {isCurrentLocation ? 'GPS' : 'Manual'}
      </span>
    </div>
  );
};

export default LocationIndicator;
