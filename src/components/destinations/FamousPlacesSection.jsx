import React, { useState } from 'react';
import { Compass, Sparkles } from 'lucide-react';
import { SectionHeader } from '../ui/SectionHeader';
import { FamousPlaceCard } from './FamousPlaceCard';
import { PlaceDetailModal } from './PlaceDetailModal';
import { getFamousPlacesByDestinationId } from '../../data/famousPlaces';

export const FamousPlacesSection = ({
  destinationId,
  destinationName = 'Destination',
  className = ''
}) => {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const places = getFamousPlacesByDestinationId(destinationId);

  return (
    <section id="famous-places" aria-label={`Famous Places in ${destinationName}`} className={`w-full ${className}`}>
      {/* Section Header */}
      <SectionHeader
        eyebrow="Iconic Landmarks"
        title={`Famous Places to Explore in ${destinationName}`}
        description={`Discover notable historical monuments, architectural wonders, and natural landmarks in ${destinationName}.`}
      />

      {/* Grid or Empty State */}
      {places && places.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {places.map((place) => (
            <FamousPlaceCard
              key={place.id}
              place={place}
              onSelectPlace={(p) => setSelectedPlace(p)}
            />
          ))}
        </div>
      ) : (
        <div className="p-8 sm:p-12 text-center bg-white rounded-3xl border border-slate-200/80 shadow-subtle max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-4 border border-slate-200">
            <Compass className="w-7 h-7" />
          </div>
          <h3 className="font-display font-bold text-lg text-slate-900 mb-1">
            No Famous Places Cataloged Yet
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Curated famous landmarks for {destinationName} are currently in editorial curation and will appear here shortly.
          </p>
        </div>
      )}

      {/* Interactive Place Detail Dialog Modal */}
      <PlaceDetailModal
        place={selectedPlace}
        isOpen={Boolean(selectedPlace)}
        onClose={() => setSelectedPlace(null)}
      />
    </section>
  );
};

export default FamousPlacesSection;
