import React from 'react';
import { MapPin, Star, Sparkles, Compass, Check, Navigation, Camera } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { DestinationBackButton } from './DestinationBackButton';
import { useLocation } from '../../hooks/useLocation';
import { useRemoteImage } from '../../hooks/useImages';
import { getDestinationImageQuery } from '../../utils/imageQueries';

export const DestinationHero = ({ destination }) => {
  const { selectedLocation, setManualLocation } = useLocation();

  if (!destination) return null;

  const {
    id,
    name,
    country,
    region,
    category,
    shortDescription,
    rating = 4.8,
    reviewsCount = 1200,
    tags = [],
    featured,
    latitude,
    longitude
  } = destination;

  const isCurrentTarget = selectedLocation?.destinationId === id;
  const imageQuery = getDestinationImageQuery(destination);
  const { photo } = useRemoteImage(imageQuery, { perPage: 1 });

  return (
    <div className="relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 text-white p-6 sm:p-10 lg:p-12 shadow-float mb-10 min-h-[380px] flex flex-col justify-between">
      {/* Remote Background Image if available */}
      {photo?.url ? (
        <div className="absolute inset-0 z-0">
          <img
            src={photo.url}
            alt={`${name}, ${country} panoramic landscape`}
            loading="eager"
            className="w-full h-full object-cover object-center transform scale-105 filter brightness-50 contrast-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/50" />
        </div>
      ) : (
        /* Cinematic Ambient Glow Fallback */
        <>
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900 to-brand-950 pointer-events-none" />
          <div className="absolute -right-24 -top-24 w-96 h-96 bg-brand-500/15 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />
        </>
      )}

      {/* Hero Content Layer */}
      <div className="relative z-10 max-w-4xl">
        {/* Navigation Back & Breadcrumb area */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <DestinationBackButton
            className="text-slate-300 hover:text-white"
          />

          {/* Set Location Trigger Button */}
          {latitude && longitude && (
            <Button
              variant={isCurrentTarget ? 'accent' : 'secondary'}
              size="sm"
              iconLeft={isCurrentTarget ? Check : Navigation}
              onClick={() => setManualLocation(destination)}
              className={isCurrentTarget ? 'text-slate-950 font-bold' : 'bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-md'}
            >
              {isCurrentTarget ? 'Active Target Location' : 'Set as Active Location'}
            </Button>
          )}
        </div>

        {/* Badges & Rating */}
        <div className="flex flex-wrap items-center gap-2.5 mb-4">
          <Badge
            variant="glass"
            size="sm"
            className="bg-white/15 text-white border-white/20 backdrop-blur-md font-semibold"
          >
            {category}
          </Badge>

          {featured && (
            <Badge
              variant="dark"
              size="sm"
              icon={Sparkles}
              className="bg-amber-500/20 text-amber-300 border-amber-500/30 font-semibold"
            >
              Featured Destination
            </Badge>
          )}

          <span className="inline-flex items-center gap-1 text-xs font-semibold text-sky-300">
            <MapPin className="w-3.5 h-3.5" />
            {country} · {region}
          </span>

          <div className="inline-flex items-center gap-1 text-xs font-bold text-amber-300 bg-white/10 px-2.5 py-1 rounded-lg border border-white/15 shadow-sm">
            <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
            <span>{rating}</span>
            <span className="text-slate-300 font-normal">
              ({reviewsCount?.toLocaleString()} reviews)
            </span>
          </div>

          {latitude && longitude && (
            <span className="text-xs font-mono text-slate-300 bg-white/10 border border-white/15 px-2.5 py-0.5 rounded-lg">
              {latitude.toFixed(2)}° N, {longitude.toFixed(2)}° E
            </span>
          )}
        </div>

        {/* Main Destination Title */}
        <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-4">
          {name}
        </h1>

        {/* Short Description */}
        <p className="text-base sm:text-lg text-slate-200 leading-relaxed max-w-3xl mb-6 drop-shadow-sm">
          {shortDescription}
        </p>

        {/* Searchable Tags / Feature Pills */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-white/10">
            {tags.map((tag, idx) => (
              <span
                key={idx}
                className="text-xs px-2.5 py-1 rounded-lg bg-white/10 border border-white/10 text-slate-200 backdrop-blur-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Photographer Attribution in bottom corner if available */}
      {photo?.photographer && (
        <div className="relative z-10 self-end pt-4">
          <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 bg-slate-950/60 px-2.5 py-1 rounded-lg backdrop-blur-md border border-white/10">
            <Camera className="w-3 h-3 text-slate-300" />
            Photo by {photo.photographer} on Pexels
          </span>
        </div>
      )}
    </div>
  );
};

export default DestinationHero;
