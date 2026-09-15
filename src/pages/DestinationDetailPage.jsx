import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Compass, 
  Sparkles, 
  CalendarDays,
  ShieldCheck,
  Send,
  CloudSun,
  MessageSquare,
  Bot,
  Luggage
} from 'lucide-react';
import { getDestinationById } from '../data/destinations';
import { fetchCurrentWeather } from '../services/weatherService';
import { useTravelAssistant } from '../hooks/useTravelAssistant';
import { Container } from '../components/layout/Container';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { 
  DestinationHero, 
  DestinationOverview, 
  DestinationMeta, 
  FamousPlacesSection, 
  DestinationBackButton 
} from '../components/destinations';
import { WeatherCard, WeatherSkeleton, WeatherError } from '../components/weather';
import { ItineraryPlanner } from '../components/itinerary';
import { DestinationBookingCard } from '../components/booking/DestinationBookingCard';

export const DestinationDetailPage = () => {
  const { id } = useParams();
  const destination = getDestinationById(id);
  const { openAssistant } = useTravelAssistant();

  const [weather, setWeather] = useState(null);
  const [weatherStatus, setWeatherStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [weatherError, setWeatherError] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const abortRef = useRef(null);

  const loadDestinationWeather = useCallback(async (force = false) => {
    if (!destination || destination.latitude === undefined || destination.longitude === undefined) {
      return;
    }

    if (abortRef.current) {
      abortRef.current.abort();
    }
    const controller = new AbortController();
    abortRef.current = controller;

    if (force) {
      setIsRefreshing(true);
    } else {
      setWeatherStatus('loading');
    }
    setWeatherError('');

    try {
      const res = await fetchCurrentWeather(
        destination.latitude,
        destination.longitude,
        { signal: controller.signal, forceRefresh: force }
      );

      if (res.success && res.data) {
        setWeather(res.data);
        setWeatherStatus('success');
      } else {
        throw new Error(res.message || 'Unable to load weather data.');
      }
    } catch (err) {
      if (err.name === 'AbortError') return;
      setWeatherError(
        err.data?.message || err.message || 'Weather data is temporarily unavailable.'
      );
      setWeatherStatus('error');
    } finally {
      setIsRefreshing(false);
    }
  }, [destination]);

  useEffect(() => {
    loadDestinationWeather(false);

    return () => {
      if (abortRef.current) {
        abortRef.current.abort();
      }
    };
  }, [destination?.id, loadDestinationWeather]);

  const handleAskAI = (prompt = '') => {
    const starter = prompt || `What are the top must-visit experiences, authentic restaurants, and cultural tips for ${destination?.name || 'this destination'}?`;
    openAssistant(starter, {
      destination: destination ? { name: destination.name, country: destination.country } : null,
      weather: weather || null
    });
  };

  const scrollToBooking = () => {
    document.getElementById('book-destination')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToPlanner = () => {
    document.getElementById('plan-trip')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Invalid Destination ID -> Polished Not-Found State
  if (!destination) {
    return (
      <div className="min-h-[65vh] flex items-center justify-center py-16">
        <Container size="sm">
          <Card variant="default" className="text-center p-8 sm:p-12 shadow-card">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 mx-auto mb-6 border border-amber-100">
              <Compass className="w-8 h-8 text-amber-600" />
            </div>

            <Badge variant="accent" size="sm" className="mb-3 mx-auto">
              Destination Not Found
            </Badge>

            <CardTitle as="h1" className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3">
              Unknown Destination
            </CardTitle>

            <CardDescription className="text-slate-500 max-w-sm mx-auto mb-8 text-sm sm:text-base leading-relaxed">
              We could not find a destination with the identifier <code className="text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded font-mono text-xs">"{id}"</code>. It may have been removed or relocated.
            </CardDescription>

            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Link to="/destinations">
                <Button variant="primary" size="md" iconLeft={ArrowLeft}>
                  Back to All Destinations
                </Button>
              </Link>
              <Link to="/">
                <Button variant="secondary" size="md">
                  Go to Home
                </Button>
              </Link>
            </div>
          </Card>
        </Container>
      </div>
    );
  }

  const { name } = destination;

  return (
    <div className="py-8 sm:py-12 lg:py-16">
      <Container size="xl" className="space-y-12 sm:space-y-16">
        {/* ========================================================================= */}
        {/* 1. DESTINATION HERO BANNER                                                */}
        {/* ========================================================================= */}
        <DestinationHero destination={destination} />

        {/* ========================================================================= */}
        {/* 2. DESTINATION OVERVIEW & TRAVEL ESSENTIALS META                          */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column: About & Key Experience Highlights */}
          <div className="lg:col-span-2">
            <DestinationOverview destination={destination} />
          </div>

          {/* Sidebar Column: Quick Essentials & AI Assistant Action */}
          <div className="space-y-6">
            <DestinationMeta destination={destination} />

            {/* Direct Booking Action Card matching Vista Holidays Design System */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-brand-600 to-indigo-700 text-white shadow-card space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white">
                  <Luggage className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-base text-white leading-tight">
                    Ready to Visit {name}?
                  </h4>
                  <p className="text-xs text-white/80">
                    Curated packages starting at ₹5,000/day
                  </p>
                </div>
              </div>
              <Button
                variant="accent"
                size="md"
                onClick={scrollToBooking}
                className="w-full justify-center shadow-lg font-bold"
                iconLeft={Luggage}
              >
                Book Now
              </Button>
            </div>

            {/* AI Trip Assistant Action Card */}
            <Card variant="subtle" className="p-6 text-center bg-gradient-to-br from-brand-50 to-indigo-50 border-brand-100 shadow-card space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-sm">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-display font-bold text-base text-slate-900">
                  AI Trip Concierge
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Generate a day-by-day itinerary or ask questions about {name}.
                </p>
              </div>
              <div className="flex flex-col gap-2 pt-1">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={scrollToPlanner}
                  className="w-full justify-center shadow-sm font-bold"
                  iconLeft={CalendarDays}
                >
                  Plan {name} Itinerary
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleAskAI()}
                  className="w-full justify-center text-slate-700"
                  iconLeft={MessageSquare}
                >
                  Chat with Assistant
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2.5. BOOK DESTINATION PACKAGE (Direct Booking Configuration & Checkout)   */}
        {/* ========================================================================= */}
        <section id="book-destination" className="scroll-mt-24" aria-label={`Book Trip to ${name}`}>
          <DestinationBookingCard destination={destination} />
        </section>

        {/* ========================================================================= */}
        {/* 3. FAMOUS PLACES TO EXPLORE IN THIS DESTINATION                           */}
        {/* ========================================================================= */}
        <FamousPlacesSection
          destinationId={destination.id}
          destinationName={name}
        />

        {/* ========================================================================= */}
        {/* 4. REAL-TIME WEATHER FOR THIS DESTINATION                                 */}
        {/* ========================================================================= */}
        <section id="destination-weather" aria-label={`Real-Time Weather for ${name}`}>
          <div className="mb-4">
            <h3 className="font-display font-bold text-xl text-slate-900">
              Live Weather in {name}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Current meteorological conditions and climate telemetry powered by OpenWeather.
            </p>
          </div>

          {weatherStatus === 'loading' ? (
            <WeatherSkeleton />
          ) : weatherStatus === 'error' ? (
            <WeatherError
              message={weatherError}
              onRetry={() => loadDestinationWeather(true)}
            />
          ) : (
            <WeatherCard
              weather={weather}
              locationInfo={{
                displayName: `${name}, ${destination.country}`,
                source: 'manual',
                destinationId: destination.id
              }}
              onRefresh={() => loadDestinationWeather(true)}
              isRefreshing={isRefreshing}
            />
          )}
        </section>

        {/* ========================================================================= */}
        {/* 5. AI ITINERARY PLANNER (Pre-loaded with this Destination)                */}
        {/* ========================================================================= */}
        <section id="plan-trip" className="pt-4">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
                AI Schedule Generator
              </span>
              <Badge variant="brand" size="sm">
                Tailored for {name}
              </Badge>
            </div>
            <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
              Create a Day-by-Day Itinerary for {name}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mt-1 leading-relaxed">
              Let Gemini design a realistic multi-day schedule connecting the top landmarks, dining spots, and cultural highlights in {name}.
            </p>
          </div>

          <ItineraryPlanner initialDestinationId={destination.id} />
        </section>
      </Container>
    </div>
  );
};

export default DestinationDetailPage;
