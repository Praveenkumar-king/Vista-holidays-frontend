import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Sparkles, 
  MapPin, 
  Calendar, 
  SlidersHorizontal 
} from 'lucide-react';
import { DESTINATIONS, getDestinationById } from '../../data/destinations';
import { getFamousPlacesByDestination } from '../../data/famousPlaces';
import { generateItineraryPlan } from '../../services/aiService';
import { useLocation } from '../../hooks/useLocation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { ItineraryForm } from './ItineraryForm';
import { ItineraryResult } from './ItineraryResult';
import { ItinerarySkeleton } from './ItinerarySkeleton';
import { ItineraryEmptyState } from './ItineraryEmptyState';
import { ItineraryError } from './ItineraryError';

const LOCAL_STORAGE_ITINERARY_KEY = 'travel_app_saved_itinerary';

export const ItineraryPlanner = ({
  initialDestinationId = 'paris',
  initialDays = 3,
  className = ''
}) => {
  const { selectedLocation } = useLocation();

  const [formData, setFormData] = useState({
    selectedDestinationId: initialDestinationId || 'paris',
    days: initialDays || 3,
    travelStyle: 'Culture',
    interests: ['Landmarks', 'Food & Dining'],
    budget: 'Moderate',
    travelers: 'Couple',
    pace: 'Balanced'
  });

  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [error, setError] = useState(null);

  const abortRef = useRef(null);

  // Sync initialDestinationId if it changes from external triggers
  useEffect(() => {
    if (initialDestinationId) {
      setFormData((prev) => ({
        ...prev,
        selectedDestinationId: initialDestinationId
      }));
    }
  }, [initialDestinationId]);

  // Safe localStorage hydration
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_ITINERARY_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.days) && parsed.days.length > 0) {
          setItinerary(parsed);
        }
      }
    } catch (e) {
      console.warn('Could not parse saved itinerary from localStorage:', e);
      localStorage.removeItem(LOCAL_STORAGE_ITINERARY_KEY);
    }
  }, []);

  const handleGenerate = useCallback(async (isRetry = false) => {
    const destination = getDestinationById(formData.selectedDestinationId) || DESTINATIONS[0];
    const famousPlaces = getFamousPlacesByDestination(destination.id).map((p) => p.name);

    if (abortRef.current) {
      abortRef.current.abort();
    }
    const controller = new AbortController();
    abortRef.current = controller;

    if (isRetry || itinerary) {
      setIsRegenerating(true);
    } else {
      setLoading(true);
    }
    setError(null);

    const payload = {
      destination: {
        name: destination.name,
        country: destination.country
      },
      days: formData.days,
      travelStyle: formData.travelStyle,
      interests: formData.interests,
      budget: formData.budget,
      travelers: formData.travelers,
      pace: formData.pace,
      famousPlaces
    };

    try {
      const res = await generateItineraryPlan(payload, { signal: controller.signal });

      if (res.success && res.data) {
        setItinerary(res.data);
        try {
          localStorage.setItem(LOCAL_STORAGE_ITINERARY_KEY, JSON.stringify(res.data));
        } catch (e) {
          // Ignore quota limits
        }
      } else {
        throw new Error(res.message || 'Failed to generate itinerary plan.');
      }
    } catch (err) {
      if (err.name === 'AbortError') return;

      console.warn('Itinerary generation error:', err.message);
      const friendlyError = err.data?.message || err.message || 'Unable to generate your itinerary. Please check server configuration or try again.';
      setError(friendlyError);
    } finally {
      setLoading(false);
      setIsRegenerating(false);
    }
  }, [formData, itinerary]);

  const handleClear = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
    }
    setItinerary(null);
    setError(null);
    try {
      localStorage.removeItem(LOCAL_STORAGE_ITINERARY_KEY);
    } catch (e) {
      // Ignore
    }
  }, []);

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-start ${className}`}>
      {/* Left Column: Form Controls (4 cols on desktop) */}
      <div className="lg:col-span-4 lg:sticky lg:top-24">
        <Card variant="default" className="p-6 sm:p-7 shadow-card bg-white border-slate-200/90">
          <CardHeader className="p-0 pb-5 mb-5 border-b border-slate-100">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600">
                Custom Schedule Builder
              </span>
            </div>
            <CardTitle as="h3" className="text-xl font-extrabold text-slate-900">
              Trip Parameters
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 mt-0.5 leading-relaxed">
              Configure destination, duration, and style to craft a custom schedule.
            </CardDescription>
          </CardHeader>

          <ItineraryForm
            formData={formData}
            onChangeForm={setFormData}
            onSubmit={() => handleGenerate(false)}
            isLoading={loading || isRegenerating}
          />
        </Card>
      </div>

      {/* Right Column: Output / Skeleton / Error / Empty State (8 cols on desktop) */}
      <div className="lg:col-span-8">
        {loading ? (
          <ItinerarySkeleton daysCount={formData.days} />
        ) : error && !itinerary ? (
          <ItineraryError
            message={error}
            onRetry={() => handleGenerate(true)}
          />
        ) : itinerary ? (
          <div className="space-y-4">
            {error && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 flex items-center justify-between">
                <span>{error}</span>
                <button
                  type="button"
                  onClick={() => setError(null)}
                  className="text-amber-700 font-bold ml-2 underline"
                >
                  Dismiss
                </button>
              </div>
            )}
            <ItineraryResult
              itinerary={itinerary}
              onRegenerate={() => handleGenerate(true)}
              onClear={handleClear}
              isRegenerating={isRegenerating}
            />
          </div>
        ) : (
          <ItineraryEmptyState />
        )}
      </div>
    </div>
  );
};

export default ItineraryPlanner;
