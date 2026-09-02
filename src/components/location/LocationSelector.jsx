import React from 'react';
import { 
  MapPin, 
  Navigation, 
  Search, 
  RotateCcw, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  Compass, 
  Sparkles,
  Layers
} from 'lucide-react';
import { useLocation } from '../../hooks/useLocation';
import { Container } from '../layout/Container';
import { SectionHeader } from '../ui/SectionHeader';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { LocationSearch } from './LocationSearch';

export const LocationSelector = ({ className = '' }) => {
  const {
    selectedLocation,
    status,
    error,
    isLoading,
    isError,
    isCurrentLocation,
    isManualLocation,
    requestCurrentLocation,
    clearLocation
  } = useLocation();

  return (
    <section id="location-awareness" aria-label="Location Awareness & Destination Selection" className={`w-full ${className}`}>
      <Container size="xl">
        {/* Section Header */}
        <SectionHeader
          eyebrow="Geographic Intelligence"
          title="Where are you exploring from?"
          description="Detect your real-time browser location or manually pick a destination to personalize weather forecasts and travel planning."
        />

        {/* Main Location Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-card p-6 sm:p-8 lg:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Action Column: Geolocation Detection & Manual Search */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-brand-600" />
                  Option 1: Detect Browser Location
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mb-4">
                  Use your device GPS coordinates to prepare real-time weather forecasts and local recommendations.
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    variant={isCurrentLocation ? 'secondary' : 'primary'}
                    size="md"
                    onClick={requestCurrentLocation}
                    disabled={isLoading}
                    iconLeft={isLoading ? Loader2 : Navigation}
                    className="shadow-sm"
                  >
                    {isLoading ? 'Detecting Location...' : isCurrentLocation ? 'Refresh GPS Location' : 'Use My Location'}
                  </Button>

                  {selectedLocation && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearLocation}
                      iconLeft={RotateCcw}
                      className="text-slate-500 hover:text-slate-900"
                    >
                      Clear Location
                    </Button>
                  )}
                </div>
              </div>

              {/* Subtle Divider */}
              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-4 text-xs uppercase font-bold tracking-wider text-slate-400">
                  Or Search Manually
                </span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              {/* Option 2: Manual Search */}
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
                  <Search className="w-4 h-4 text-brand-600" />
                  Option 2: Search a Travel Destination
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mb-3">
                  Select from our catalog of 20+ worldwide destinations to inspect coordinates and future forecasts.
                </p>

                <LocationSearch />
              </div>

              {/* Error Alert Display */}
              {isError && error && (
                <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 flex items-start gap-3 animate-fade-in text-xs sm:text-sm">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-grow">
                    <p className="font-semibold">{error.userFriendly}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <Button
                        variant="secondary"
                        size="xs"
                        onClick={requestCurrentLocation}
                        className="bg-white text-amber-950 border-amber-300"
                      >
                        Try Again
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Status Column: Active Location State Card */}
            <div className="lg:col-span-5">
              <Card
                variant="default"
                className={`p-6 sm:p-7 border transition-all duration-300 ${
                  selectedLocation
                    ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-brand-950 text-white border-slate-800 shadow-card-hover'
                    : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
                  <div className="flex items-center gap-2">
                    <Compass className={`w-5 h-5 ${selectedLocation ? 'text-amber-300' : 'text-slate-400'}`} />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Active Geographic Target
                    </span>
                  </div>

                  {selectedLocation ? (
                    <Badge
                      variant={isCurrentLocation ? 'accent' : 'brand'}
                      size="sm"
                      className="font-bold uppercase tracking-wider"
                    >
                      {isCurrentLocation ? 'GPS Active' : 'Manual Target'}
                    </Badge>
                  ) : (
                    <Badge variant="default" size="sm">
                      No Target Set
                    </Badge>
                  )}
                </div>

                {selectedLocation ? (
                  <div className="space-y-4">
                    <div>
                      <div className="text-xs text-slate-300 font-medium">
                        {isCurrentLocation ? 'Device Location' : `${selectedLocation.country || 'Destination'} (${selectedLocation.region || 'Global'})`}
                      </div>
                      <div className="font-display text-2xl font-extrabold text-white tracking-tight mt-0.5">
                        {selectedLocation.displayName}
                      </div>
                    </div>

                    {/* Coordinates Grid */}
                    <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                          Latitude
                        </span>
                        <span className="font-mono font-bold text-white text-sm">
                          {selectedLocation.latitude}° N
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                          Longitude
                        </span>
                        <span className="font-mono font-bold text-white text-sm">
                          {selectedLocation.longitude}° E
                        </span>
                      </div>
                    </div>

                    {selectedLocation.accuracy && (
                      <div className="text-[11px] text-slate-300 flex items-center justify-between pt-1">
                        <span>Estimated GPS Accuracy</span>
                        <span className="font-semibold text-emerald-300">±{selectedLocation.accuracy} meters</span>
                      </div>
                    )}

                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>Ready for live OpenWeather & AI itinerary services in Phase 2</span>
                    </div>
                  </div>
                ) : (
                  <div className="py-6 text-center text-slate-500 space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-slate-400 mx-auto border border-slate-200 shadow-sm">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">
                        No Target Location Selected
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                        Click "Use My Location" or select a destination from the search field to set your exploration base.
                      </p>
                    </div>
                  </div>
                )}
              </Card>
            </div>

          </div>
        </div>
      </Container>
    </section>
  );
};

export default LocationSelector;
