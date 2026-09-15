import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Navigation,
  MapPin,
  Compass,
  LocateFixed,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Globe,
  Radio,
  Clock,
  ArrowRight,
  Bot
} from 'lucide-react';
import { useLocationContext } from '../../context/LocationContext';
import { useTravelAssistant } from '../../hooks/useTravelAssistant';
import { DESTINATIONS } from '../../data/destinations';

export const UserRecentLocationsPage = () => {
  const {
    selectedLocation,
    requestCurrentLocation,
    status: locStatus,
    error: locError
  } = useLocationContext();

  const { openAssistant } = useTravelAssistant();

  // Helper to compute approximate distance between coordinates (Haversine formula in km)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return null;
    const R = 6371; // km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  };

  const userLat = selectedLocation?.latitude;
  const userLon = selectedLocation?.longitude;

  // Compute nearby destinations from dataset
  const destinationsWithDistance = DESTINATIONS.map((dest) => {
    const dist =
      userLat && userLon
        ? calculateDistance(userLat, userLon, dest.latitude, dest.longitude)
        : null;
    return { ...dest, distanceKm: dist };
  });

  // Sort by distance if GPS active, else show popular
  const sortedDestinations = [...destinationsWithDistance].sort((a, b) => {
    if (a.distanceKm !== null && b.distanceKm !== null) {
      return a.distanceKm - b.distanceKm;
    }
    return (b.rating || 0) - (a.rating || 0);
  });

  return (
    <div className="py-6 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-brand-600 uppercase mb-1">
            <Navigation className="w-4 h-4" />
            <span>Geographic Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 tracking-tight">
            Recent Locations & Proximity Explorer
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Inspect your GPS coordinates, detect nearby holiday getaways, and browse recently charted locations.
          </p>
        </div>

        <button
          type="button"
          onClick={requestCurrentLocation}
          disabled={locStatus === 'loading'}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-sm shadow-brand-500/20 transition-all hover:scale-102 cursor-pointer"
        >
          <LocateFixed className="w-4 h-4" />
          <span>{locStatus === 'loading' ? 'Requesting GPS...' : 'Acquire Live Location'}</span>
        </button>
      </div>

      {/* 2. Live GPS Telemetry Billboard */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>
                {selectedLocation ? 'Active Coordinates Detected' : 'Coordinates Pending Acquisition'}
              </span>
            </div>

            <h2 className="text-2xl font-display font-bold text-slate-900">
              {selectedLocation?.displayName || selectedLocation?.city || 'Location Not Fixed Yet'}
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              {selectedLocation
                ? 'Your device geolocation is active. Proximity estimates and localized weather calculations are synchronized with this position.'
                : 'Click "Acquire Live Location" above to authorize browser coordinates and unlock real-time distance calculations.'}
            </p>

            {locError && (
              <p className="text-xs text-rose-600 font-medium">
                {locError.userFriendly || locError.message}
              </p>
            )}
          </div>

          {/* Coordinate Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Latitude
              </span>
              <span className="text-base font-mono font-extrabold text-slate-900 mt-0.5 block">
                {userLat ? userLat.toFixed(4) : '—'}°
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Longitude
              </span>
              <span className="text-base font-mono font-extrabold text-slate-900 mt-0.5 block">
                {userLon ? userLon.toFixed(4) : '—'}°
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 text-center col-span-2 sm:col-span-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Accuracy
              </span>
              <span className="text-base font-mono font-extrabold text-emerald-600 mt-0.5 block">
                {userLat ? 'High (GPS)' : 'Standard'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Proximity Destinations Explorer */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-display font-bold text-slate-900">
              {userLat ? 'Destinations Nearest to Your Location' : 'Top Curated Destinations by Popularity'}
            </h3>
            <p className="text-xs text-slate-500">
              {userLat
                ? 'Calculated using geodesic Haversine distance from your coordinates'
                : 'Browse premier tourist hubs across India'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedDestinations.slice(0, 6).map((dest) => (
            <div
              key={dest.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col group"
            >
              <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                <img
                  src={
                    dest.image ||
                    `https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80`
                  }
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                {/* Distance Badge */}
                {dest.distanceKm !== null && (
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-brand-600 text-white shadow-xs">
                      <Navigation className="w-3 h-3" />
                      ~{dest.distanceKm.toLocaleString()} km away
                    </span>
                  </div>
                )}

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                  <span className="text-xs font-semibold flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-brand-400" />
                    {dest.country}
                  </span>
                  <span className="text-xs font-mono font-bold bg-black/40 px-2 py-0.5 rounded backdrop-blur-xs">
                    {dest.latitude?.toFixed(2)}°, {dest.longitude?.toFixed(2)}°
                  </span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h4 className="font-display font-bold text-base text-slate-900 group-hover:text-brand-600 transition-colors">
                    {dest.name}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {dest.shortDescription || dest.overview}
                  </p>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <Link
                    to={`/destinations/${dest.id}`}
                    className="flex-1 text-center py-2 px-3 rounded-xl bg-slate-50 hover:bg-brand-50 text-slate-700 hover:text-brand-700 text-xs font-bold border border-slate-200/60 transition-colors"
                  >
                    View Destination
                  </Link>

                  <button
                    type="button"
                    onClick={() =>
                      openAssistant(
                        `How can I travel to ${dest.name} from my current location, and how long does it take by flight or train?`
                      )
                    }
                    className="p-2 rounded-xl text-slate-500 hover:text-brand-600 hover:bg-brand-50 border border-slate-200/60 transition-colors"
                    title="Transit advice from AI"
                  >
                    <Bot className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserRecentLocationsPage;
