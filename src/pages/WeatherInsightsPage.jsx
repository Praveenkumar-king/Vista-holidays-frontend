import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  CloudSun, 
  Sun, 
  CloudRain, 
  CloudSnow, 
  Wind, 
  Thermometer, 
  Droplets, 
  Compass, 
  Navigation, 
  MapPin, 
  Sparkles, 
  RotateCcw, 
  ArrowRight, 
  Shirt, 
  Umbrella, 
  AlertCircle, 
  CheckCircle2, 
  Calendar,
  MessageSquare,
  Search,
  Check,
  Send
} from 'lucide-react';
import { Container } from '../components/layout/Container';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { WeatherCard, WeatherSkeleton, WeatherError, WeatherNoLocation } from '../components/weather';
import { useLocation } from '../hooks/useLocation';
import { useTravelAssistant } from '../hooks/useTravelAssistant';
import { fetchCurrentWeather, fetchWeatherByQuery } from '../services/weatherService';
import { DESTINATIONS, getDestinationById } from '../data/destinations';

export const WeatherInsightsPage = () => {
  const { 
    selectedLocation, 
    setManualLocation, 
    requestCurrentLocation, 
    isLoading: isLocationLoading,
    isCurrentLocation 
  } = useLocation();
  const { openAssistant } = useTravelAssistant();

  const [weather, setWeather] = useState(null);
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const abortControllerRef = useRef(null);

  // City & Pincode Weather Lookup State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [searchStatus, setSearchStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [searchError, setSearchError] = useState('');
  const [isSearchRefreshing, setIsSearchRefreshing] = useState(false);
  const searchAbortRef = useRef(null);

  // If no location is selected initially, default to Paris
  useEffect(() => {
    if (!selectedLocation) {
      const defaultDest = getDestinationById('paris') || DESTINATIONS[0];
      if (defaultDest) {
        setManualLocation(defaultDest);
      }
    }
  }, [selectedLocation, setManualLocation]);

  // Load weather for active location
  const loadWeather = useCallback(async (forceRefresh = false) => {
    if (!selectedLocation || selectedLocation.latitude === undefined || selectedLocation.longitude === undefined) {
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    if (forceRefresh) {
      setIsRefreshing(true);
    } else {
      setStatus('loading');
    }
    setErrorMessage('');

    try {
      const res = await fetchCurrentWeather(
        selectedLocation.latitude,
        selectedLocation.longitude,
        { signal: controller.signal, forceRefresh }
      );

      if (res.success && res.data) {
        setWeather(res.data);
        setStatus('success');
      } else {
        throw new Error(res.message || 'Unable to retrieve meteorological data.');
      }
    } catch (err) {
      if (err.name === 'AbortError') return;
      console.warn('Weather fetch failed:', err.message);
      setErrorMessage(
        err.data?.message || err.message || 'Weather data is temporarily unavailable. Please try again.'
      );
      setStatus('error');
    } finally {
      setIsRefreshing(false);
    }
  }, [selectedLocation]);

  useEffect(() => {
    loadWeather(false);

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [selectedLocation?.latitude, selectedLocation?.longitude, loadWeather]);

  const [searchParams] = useSearchParams();

  // Handle City Name or Pincode Search
  const handleCityOrPincodeSearch = useCallback(async (queryToSearch, forceRefresh = false) => {
    const targetQuery = (typeof queryToSearch === 'string' ? queryToSearch : searchQuery).trim();
    if (!targetQuery) return;

    if (searchAbortRef.current) {
      searchAbortRef.current.abort();
    }
    const controller = new AbortController();
    searchAbortRef.current = controller;

    if (forceRefresh) {
      setIsSearchRefreshing(true);
    } else {
      setSearchStatus('loading');
    }
    setSearchError('');

    try {
      const res = await fetchWeatherByQuery(targetQuery, {
        signal: controller.signal,
        forceRefresh
      });

      if (res.success && res.data) {
        setSearchResult(res.data);
        setSearchStatus('success');
      } else {
        throw new Error(res.message || `No weather data found for "${targetQuery}".`);
      }
    } catch (err) {
      if (err.name === 'AbortError') return;
      setSearchError(
        err.data?.message || err.message || `Could not find weather for "${targetQuery}". Please verify the city name or pincode.`
      );
      setSearchStatus('error');
    } finally {
      setSearchStatus((prev) => (prev === 'loading' ? 'idle' : prev));
      setIsSearchRefreshing(false);
    }
  }, [searchQuery]);

  // Auto-search if ?q= or ?search= is provided in URL
  useEffect(() => {
    const q = searchParams.get('q') || searchParams.get('search');
    if (q && q.trim()) {
      setSearchQuery(q.trim());
      handleCityOrPincodeSearch(q.trim());
    }
  }, [searchParams, handleCityOrPincodeSearch]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    handleCityOrPincodeSearch(searchQuery);
  };

  const handleQuickSearch = (query) => {
    setSearchQuery(query);
    handleCityOrPincodeSearch(query);
  };

  // Handle asking AI Assistant about weather and packing
  const handleAskAI = (targetWeather = weather, targetLocation = selectedLocation?.displayName) => {
    const locName = targetLocation || 'this destination';
    const tempStr = targetWeather ? `${targetWeather.temperature}°C with ${targetWeather.condition.toLowerCase()} skies` : '';
    const starter = `What should I pack and what are the best outdoor vs. indoor activities for ${locName} given the current climate${tempStr ? ` (${tempStr})` : ''}?`;
    
    openAssistant(starter, {
      destination: { name: locName },
      weather: targetWeather || null
    });
  };

  // Curated list of major worldwide hubs for quick exploration
  const quickHubs = [
    { id: 'paris', name: 'Paris', country: 'France', lat: 48.8566, lon: 2.3522 },
    { id: 'tokyo', name: 'Tokyo', country: 'Japan', lat: 35.6762, lon: 139.6503 },
    { id: 'dubai', name: 'Dubai', country: 'UAE', lat: 25.2048, lon: 55.2708 },
    { id: 'bali', name: 'Bali', country: 'Indonesia', lat: -8.3405, lon: 115.0920 },
    { id: 'rome', name: 'Rome', country: 'Italy', lat: 41.9028, lon: 12.4964 },
    { id: 'london', name: 'London', country: 'UK', lat: 51.5074, lon: -0.1278 },
    { id: 'new-york', name: 'New York', country: 'USA', lat: 40.7128, lon: -74.0060 },
    { id: 'goa', name: 'Goa', country: 'India', lat: 15.2993, lon: 74.1240 },
    { id: 'singapore', name: 'Singapore', country: 'Singapore', lat: 1.3521, lon: 103.8198 },
    { id: 'chennai', name: 'Chennai', country: 'India', lat: 13.0827, lon: 80.2707 }
  ];

  // Sample quick search pills for the bottom lookup section
  const sampleSearchPills = [
    { label: 'Chennai', query: 'Chennai' },
    { label: 'Mumbai', query: 'Mumbai' },
    { label: 'Pincode 600001', query: '600001' },
    { label: 'Bengaluru', query: 'Bengaluru' },
    { label: 'Pincode 560001', query: '560001' },
    { label: 'Delhi', query: 'Delhi' },
    { label: 'Pincode 110001', query: '110001' },
    { label: 'New York (10001)', query: '10001' },
    { label: 'London', query: 'London' },
    { label: 'Sydney', query: 'Sydney' }
  ];

  // Dynamic climate & packing insights based on telemetry
  const getClimateAdvice = (temp, condition = '') => {
    const cond = condition.toLowerCase();
    const isRainy = cond.includes('rain') || cond.includes('drizzle') || cond.includes('thunder');

    if (temp >= 28) {
      return {
        level: 'Tropical Warmth',
        badgeVariant: 'accent',
        summary: 'Warm and sunny climate conditions ideal for outdoor water sports, beaches, and early morning sightseeing.',
        packing: [
          'Lightweight, breathable linen or cotton garments',
          'Broad-spectrum UV sunglasses & sunscreen (SPF 50+)',
          'Wide-brimmed sun hat and reusable hydration flask',
          isRainy ? 'Compact travel umbrella or light poncho' : 'Breathable sandals or light walking sneakers'
        ],
        timing: 'Schedule walking tours before 11:00 AM or after 4:30 PM to enjoy comfortable temperatures.'
      };
    } else if (temp >= 18) {
      return {
        level: 'Mild & Pleasant',
        badgeVariant: 'success',
        summary: 'Peak sightseeing weather. Extremely comfortable for city walks, cafe-hopping, and panoramic viewpoints.',
        packing: [
          'Comfortable walking shoes or trail sneakers',
          'Light layers: T-shirts with an evening cardigan or overshirt',
          'Compact daypack for sightseeing essentials',
          isRainy ? 'Water-resistant windbreaker jacket' : 'Sunglasses and light scarf'
        ],
        timing: 'Full-day outdoor explorations are ideal throughout the morning and afternoon.'
      };
    } else if (temp >= 8) {
      return {
        level: 'Cool & Crisp',
        badgeVariant: 'brand',
        summary: 'Crisp, refreshing air ideal for exploring historic districts, art museums, and cozy local bistros.',
        packing: [
          'Mid-weight jacket, fleece, or wool coat',
          'Thermal base layer or light merino sweater',
          'Comfortable insulated walking boots',
          isRainy ? 'Waterproof hooded jacket & sturdy umbrella' : 'Warm scarf and light gloves for the evening'
        ],
        timing: 'Afternoon Golden Hour offers the most comfortable temperatures for scenic outdoor photography.'
      };
    } else {
      return {
        level: 'Cold Climate',
        badgeVariant: 'dark',
        summary: 'Cold atmospheric conditions. Dress in warm layers to enjoy winter landmarks, hot beverages, and cultural sights.',
        packing: [
          'Heavy insulated winter coat or down parka',
          'Thermal undergarments, wool socks, and beanie',
          'Insulated waterproof boots with good grip',
          'Touchscreen-compatible thermal winter gloves'
        ],
        timing: 'Midday hours (11:00 AM - 3:00 PM) offer the warmest outdoor window.'
      };
    }
  };

  const advice = weather ? getClimateAdvice(weather.temperature, weather.condition) : null;

  return (
    <div className="py-8 sm:py-12 lg:py-16">
      <Container size="xl" className="space-y-10 sm:space-y-14">
        
        {/* ========================================================================= */}
        {/* 1. PAGE HEADER                                                            */}
        {/* ========================================================================= */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200/80 mb-3 shadow-subtle">
            <CloudSun className="w-3.5 h-3.5 text-brand-600" />
            <span>Atmospheric Telemetry & Climate Intelligence</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
            Weather Insights
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Real-time meteorological analytics, dynamic packing recommendations, and live atmospheric conditions powered by OpenWeather across handpicked global destinations.
          </p>
        </div>

        {/* ========================================================================= */}
        {/* 2. QUICK DESTINATION SWITCHER BAR                                         */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Select Destination
              </span>
              <p className="text-xs text-slate-400 mt-0.5">
                Switch instantly between global travel hubs or use device GPS.
              </p>
            </div>

            <Button
              variant={isCurrentLocation ? 'accent' : 'secondary'}
              size="sm"
              iconLeft={Navigation}
              onClick={requestCurrentLocation}
              isLoading={isLocationLoading}
              className="self-start sm:self-auto text-xs font-semibold"
            >
              {isCurrentLocation ? 'Current Device GPS' : 'Use My GPS Location'}
            </Button>
          </div>

          {/* Destination Pills */}
          <div className="flex flex-wrap gap-2 pt-1" role="tablist" aria-label="Quick destination selector">
            {quickHubs.map((hub) => {
              const isSelected = selectedLocation?.destinationId === hub.id;
              return (
                <button
                  key={hub.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => {
                    const dest = getDestinationById(hub.id) || {
                      id: hub.id,
                      name: hub.name,
                      country: hub.country,
                      latitude: hub.lat,
                      longitude: hub.lon
                    };
                    setManualLocation(dest);
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-brand-600 text-white shadow-sm ring-2 ring-brand-400/30 scale-102'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/70'
                  }`}
                >
                  <MapPin className={`w-3 h-3 ${isSelected ? 'text-white' : 'text-brand-500'}`} />
                  <span>{hub.name}</span>
                  <span className={`text-[10px] ${isSelected ? 'text-brand-100' : 'text-slate-400'}`}>
                    ({hub.country})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. LIVE WEATHER DISPLAY & DYNAMIC PACKING INSIGHTS                         */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Weather Card Column */}
          <div className="lg:col-span-7 xl:col-span-8">
            {status === 'loading' ? (
              <WeatherSkeleton />
            ) : status === 'error' ? (
              <WeatherError
                message={errorMessage}
                onRetry={() => loadWeather(true)}
              />
            ) : weather ? (
              <WeatherCard
                weather={weather}
                locationInfo={{
                  displayName: selectedLocation?.displayName || 
                    (selectedLocation?.city ? `${selectedLocation.city}, ${selectedLocation.country}` : 'Selected Destination'),
                  source: selectedLocation?.source || 'manual',
                  destinationId: selectedLocation?.destinationId
                }}
                onRefresh={() => loadWeather(true)}
                isRefreshing={isRefreshing}
              />
            ) : (
              <WeatherNoLocation onSelectManual={requestCurrentLocation} />
            )}
          </div>

          {/* Right Sidebar: Dynamic Packing & Travel Recommendations */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-6">
            
            {/* Packing & Climate Guidance Card */}
            <Card variant="default" className="p-6 shadow-card border-slate-200/90">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
                    <Shirt className="w-4 h-4" />
                  </div>
                  <h3 className="font-display font-bold text-base text-slate-900">
                    Packing Advice
                  </h3>
                </div>
                {advice && (
                  <Badge variant={advice.badgeVariant} size="sm">
                    {advice.level}
                  </Badge>
                )}
              </div>

              {advice ? (
                <div className="space-y-4">
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {advice.summary}
                  </p>

                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                      Essential Gear to Pack
                    </span>
                    <ul className="space-y-2">
                      {advice.packing.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Optimal Sightseeing Timing
                    </span>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {advice.timing}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="py-6 text-center text-xs text-slate-400">
                  Select a destination to view tailored packing recommendations.
                </div>
              )}
            </Card>

            {/* AI Assistant Weather Consultation Card */}
            <Card variant="subtle" className="p-6 bg-gradient-to-br from-brand-50 to-indigo-50 border-brand-100 shadow-card space-y-3.5 text-center">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-sm">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-display font-bold text-base text-slate-900">
                  Vista Holidays Assistant
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Need personalized packing checklists or rain contingency itineraries for {selectedLocation?.displayName || 'your trip'}?
                </p>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleAskAI(weather, selectedLocation?.displayName)}
                className="w-full justify-center shadow-sm font-bold text-xs"
                iconLeft={MessageSquare}
              >
                Chat About {selectedLocation?.displayName ? selectedLocation.displayName.split(',')[0] : 'Weather'}
              </Button>
            </Card>

            {/* View Full Destination Guide Link */}
            {selectedLocation?.destinationId && (
              <div className="text-center">
                <Link
                  to={`/destinations/${selectedLocation.destinationId}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors"
                >
                  <span>Explore full travel guide for {selectedLocation.displayName?.split(',')[0]}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}

          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. GLOBAL CLIMATE SNAPSHOT COMPARISON GRID                                 */}
        {/* ========================================================================= */}
        <section aria-labelledby="global-snapshot-title" className="pt-6 border-t border-slate-200/80">
          <div className="mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
              Comparative Analysis
            </span>
            <h2 id="global-snapshot-title" className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight mt-1">
              Global Climate Telemetry
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mt-1 leading-relaxed">
              Explore and compare typical climate zones, seasonal travel windows, and estimated temperatures across top travel regions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {DESTINATIONS.slice(0, 8).map((dest) => {
              const isCurrent = selectedLocation?.destinationId === dest.id;
              return (
                <Card
                  key={dest.id}
                  variant="interactive"
                  onClick={() => setManualLocation(dest)}
                  className={`p-4 transition-all duration-200 cursor-pointer ${
                    isCurrent 
                      ? 'ring-2 ring-brand-500 bg-brand-50/40 border-brand-200' 
                      : 'hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h4 className="font-display font-bold text-sm text-slate-900">
                        {dest.name}
                      </h4>
                      <span className="text-[11px] text-slate-500">
                        {dest.country} · {dest.region}
                      </span>
                    </div>
                    <Badge variant={dest.category === 'Beach' ? 'accent' : 'default'} size="xs">
                      {dest.category}
                    </Badge>
                  </div>

                  <p className="text-[11px] text-slate-600 line-clamp-2 mb-3 leading-relaxed">
                    {dest.climate}
                  </p>

                  <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-100 text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-amber-500" />
                      {dest.bestTime?.split('&')[0]?.trim()}
                    </span>
                    <span className="font-semibold text-brand-600">
                      {isCurrent ? 'Active' : 'Inspect →'}
                    </span>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. SEARCH WEATHER BY CITY NAME OR PINCODE (AT LAST OF PAGE)               */}
        {/* ========================================================================= */}
        <section 
          id="city-pincode-weather" 
          aria-labelledby="city-pincode-title" 
          className="pt-8 border-t-2 border-slate-200/80"
        >
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 mb-2 shadow-subtle">
              <Search className="w-3.5 h-3.5 text-emerald-600" />
              <span>Instant Meteorological Search</span>
            </div>
            <h2 id="city-pincode-title" className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
              Live Weather by City Name or Pincode
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mt-1 leading-relaxed">
              Enter any global city name (e.g., Chennai, Mumbai, London, Tokyo) or postal/pincode (e.g., 600001, 560001, 10001) to fetch instant temperature, humidity, wind, pressure, and atmospheric conditions.
            </p>
          </div>

          {/* Search Bar & Quick Suggestion Tags */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-card mb-8">
            <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter city name or pincode (e.g., Chennai, 600001, London, 10001)..."
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 text-sm sm:text-base focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all shadow-inner"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={searchStatus === 'loading'}
                disabled={!searchQuery.trim()}
                iconRight={Search}
                className="font-bold text-sm px-6 py-3.5 rounded-2xl shadow-sm justify-center"
              >
                Check Weather
              </Button>
            </form>

            {/* Quick Sample Queries */}
            <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 mr-1">
                Quick Search:
              </span>
              {sampleSearchPills.map((pill, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleQuickSearch(pill.query)}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 hover:bg-brand-50 hover:text-brand-700 hover:border-brand-200 border border-transparent transition-colors"
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search Result Display */}
          {searchStatus === 'loading' ? (
            <WeatherSkeleton />
          ) : searchStatus === 'error' ? (
            <div className="p-6 rounded-3xl bg-amber-50/70 border border-amber-200 text-amber-900 flex items-start gap-3 shadow-card animate-fade-in">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-amber-950">
                  Weather Search Unsuccessful
                </h4>
                <p className="text-xs sm:text-sm text-amber-800 leading-relaxed">
                  {searchError}
                </p>
                <p className="text-xs text-amber-700 pt-1">
                  Tip: For Indian postal codes, enter 6 digits (e.g. <code>600001</code>). For international locations, try typing the city name (e.g. <code>London</code>, <code>Tokyo</code>, <code>Paris</code>).
                </p>
              </div>
            </div>
          ) : searchResult ? (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-emerald-50/60 border border-emerald-100 px-5 py-3 rounded-2xl">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Showing real-time weather results for: <strong>{searchResult.location?.name}{searchResult.location?.country ? `, ${searchResult.location.country}` : ''}</strong></span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="xs"
                    iconLeft={MapPin}
                    onClick={() => {
                      setManualLocation({
                        name: searchResult.location?.name || searchQuery,
                        country: searchResult.location?.country || '',
                        latitude: searchResult.coordinates?.latitude,
                        longitude: searchResult.coordinates?.longitude
                      });
                    }}
                    className="text-xs font-semibold hover:border-emerald-300"
                  >
                    Set as Active Destination
                  </Button>

                  <Button
                    variant="primary"
                    size="xs"
                    iconLeft={MessageSquare}
                    onClick={() => handleAskAI(searchResult, searchResult.location?.name)}
                    className="text-xs font-semibold"
                  >
                    Ask AI Concierge
                  </Button>
                </div>
              </div>

              {/* Full Detailed Weather Card for Searched City / Pincode */}
              <WeatherCard
                weather={searchResult}
                locationInfo={{
                  displayName: `${searchResult.location?.name || searchQuery}${searchResult.location?.country ? `, ${searchResult.location.country}` : ''}`,
                  source: 'search'
                }}
                onRefresh={() => handleCityOrPincodeSearch(searchQuery, true)}
                isRefreshing={isSearchRefreshing}
              />
            </div>
          ) : null}
        </section>

      </Container>
    </div>
  );
};

export default WeatherInsightsPage;
