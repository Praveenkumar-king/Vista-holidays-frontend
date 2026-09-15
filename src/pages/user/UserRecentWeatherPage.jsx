import React, { useState, useEffect } from 'react';
import {
  CloudSun,
  Search,
  MapPin,
  Compass,
  Wind,
  Droplets,
  Eye,
  Thermometer,
  Sunrise,
  Sunset,
  RefreshCw,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Navigation
} from 'lucide-react';
import { useLocationContext } from '../../context/LocationContext';
import { fetchCurrentWeather, fetchWeatherByQuery } from '../../services/weatherService';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

const POPULAR_HUBS = [
  { name: 'Goa', query: 'Goa, India', lat: 15.2993, lon: 74.124 },
  { name: 'Manali', query: 'Manali, India', lat: 32.2432, lon: 77.1892 },
  { name: 'Ooty', query: 'Ooty, India', lat: 11.4102, lon: 76.695 },
  { name: 'Jaipur', query: 'Jaipur, India', lat: 26.9124, lon: 75.7873 },
  { name: 'Munnar', query: 'Munnar, India', lat: 10.0889, lon: 77.0595 }
];

export const UserRecentWeatherPage = () => {
  const { selectedLocation, requestCurrentLocation, status: locStatus } = useLocationContext();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeWeather, setActiveWeather] = useState(null);
  const [popularWeather, setPopularWeather] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingPopular, setLoadingPopular] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // 1. Fetch live weather for current detected location on load
  useEffect(() => {
    const loadCurrentLocationWeather = async () => {
      if (selectedLocation?.latitude && selectedLocation?.longitude) {
        try {
          const res = await fetchCurrentWeather(
            selectedLocation.latitude,
            selectedLocation.longitude
          );
          if (res.success && res.data) {
            setActiveWeather({
              ...res.data,
              locationName: selectedLocation.displayName || selectedLocation.city || 'Your Location'
            });
          }
        } catch (err) {
          console.warn('Could not fetch weather for current location:', err);
        }
      }
    };
    loadCurrentLocationWeather();
  }, [selectedLocation]);

  // 2. Fetch popular tourist hubs weather
  useEffect(() => {
    const loadHubs = async () => {
      setLoadingPopular(true);
      try {
        const promises = POPULAR_HUBS.map(async (hub) => {
          try {
            const res = await fetchCurrentWeather(hub.lat, hub.lon);
            if (res.success && res.data) {
              return { ...res.data, hubName: hub.name };
            }
          } catch {
            return null;
          }
          return null;
        });
        const results = await Promise.all(promises);
        setPopularWeather(results.filter(Boolean));

        // If no active weather selected yet, set first hub
        if (!activeWeather && results[0]) {
          setActiveWeather({ ...results[0], locationName: results[0].hubName });
        }
      } catch (e) {
        console.warn('Error loading popular weather hubs:', e);
      } finally {
        setLoadingPopular(false);
      }
    };
    loadHubs();
  }, []);

  // Handle city search
  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!searchQuery.trim()) return;
    setLoadingSearch(true);
    setErrorMessage('');
    try {
      const res = await fetchWeatherByQuery(searchQuery.trim(), { forceRefresh: true });
      if (res.success && res.data) {
        setActiveWeather({
          ...res.data,
          locationName: res.data.location?.name || searchQuery
        });
      } else {
        setErrorMessage(`Unable to find weather for "${searchQuery}". Please check the spelling.`);
      }
    } catch (err) {
      setErrorMessage(err.message || `No weather data found for "${searchQuery}".`);
    } finally {
      setLoadingSearch(false);
    }
  };

  const getTravelAdvice = (temp, condition) => {
    const cond = (condition || '').toLowerCase();
    if (cond.includes('rain') || cond.includes('storm')) {
      return 'Carry a sturdy waterproof jacket and umbrella. Plan indoor museum visits or cozy cafe experiences.';
    }
    if (temp > 32) {
      return 'Light breathable cotton wear recommended. Stay hydrated and schedule outdoor activities during early morning or sunset.';
    }
    if (temp < 15) {
      return 'Chilly temperatures expected! Layer up with woolens, fleece, and carry a warm thermal layer.';
    }
    return 'Splendid weather for sightseeing, outdoor hiking, and heritage exploration. Great travel conditions!';
  };

  return (
    <div className="py-6 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-amber-600 uppercase mb-1">
            <CloudSun className="w-4 h-4 text-amber-500" />
            <span>Live Meteorological Telemetry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 tracking-tight">
            Recent Weather & Climate Radar
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time atmospheric insights, forecasts, and packing recommendations across holiday destinations.
          </p>
        </div>

        <button
          type="button"
          onClick={requestCurrentLocation}
          disabled={locStatus === 'loading'}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold border border-slate-200 shadow-xs transition-all cursor-pointer"
        >
          <Navigation className="w-4 h-4 text-brand-600" />
          <span>{locStatus === 'loading' ? 'Detecting GPS...' : 'Detect My Location'}</span>
        </button>
      </div>

      {/* 2. City Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs max-w-2xl">
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search any destination weather (e.g., 'Shimla', 'Kochi', 'Varanasi')..."
              className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
            />
          </div>
          <button
            type="submit"
            disabled={loadingSearch || !searchQuery.trim()}
            className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold text-xs transition-colors shrink-0 cursor-pointer"
          >
            {loadingSearch ? 'Checking...' : 'Check Weather'}
          </button>
        </form>

        {errorMessage && (
          <div className="mt-3 flex items-center gap-2 text-xs text-rose-600">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* 3. Featured Active Weather Billboard */}
      {activeWeather && (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-brand-950 to-indigo-950 text-white p-6 sm:p-8 shadow-xl">
          <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-xs font-bold text-amber-300 mb-3">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>{activeWeather.locationName || activeWeather.location?.name || 'Live Station'}</span>
              </div>
              <div className="flex items-baseline gap-4">
                <span className="text-5xl sm:text-6xl font-display font-black tracking-tight">
                  {Math.round(activeWeather.temperature || activeWeather.current?.temp || 24)}°C
                </span>
                <div>
                  <p className="text-lg font-bold capitalize text-white">
                    {activeWeather.condition || activeWeather.current?.weather?.[0]?.description || 'Pleasant'}
                  </p>
                  <p className="text-xs text-slate-300">
                    Feels like {Math.round(activeWeather.feelsLike || activeWeather.current?.feels_like || 25)}°C
                  </p>
                </div>
              </div>

              {/* Travel Packing Advice Box */}
              <div className="mt-6 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 max-w-xl">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300 mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Traveler Weather Advisory</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {getTravelAdvice(
                    activeWeather.temperature || 24,
                    activeWeather.condition || 'Clear'
                  )}
                </p>
              </div>
            </div>

            {/* Weather Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 shrink-0 sm:min-w-[280px]">
              <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10 space-y-1">
                <div className="flex items-center gap-2 text-[11px] text-slate-300">
                  <Droplets className="w-3.5 h-3.5 text-sky-400" />
                  <span>Humidity</span>
                </div>
                <p className="text-base font-bold text-white">
                  {activeWeather.humidity || activeWeather.current?.humidity || 65}%
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10 space-y-1">
                <div className="flex items-center gap-2 text-[11px] text-slate-300">
                  <Wind className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Wind Speed</span>
                </div>
                <p className="text-base font-bold text-white">
                  {activeWeather.windSpeed || activeWeather.current?.wind_speed || 12} km/h
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10 space-y-1">
                <div className="flex items-center gap-2 text-[11px] text-slate-300">
                  <Eye className="w-3.5 h-3.5 text-amber-400" />
                  <span>Visibility</span>
                </div>
                <p className="text-base font-bold text-white">
                  {activeWeather.visibility ? `${activeWeather.visibility / 1000} km` : '10 km'}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10 space-y-1">
                <div className="flex items-center gap-2 text-[11px] text-slate-300">
                  <Sunrise className="w-3.5 h-3.5 text-amber-300" />
                  <span>Sunrise</span>
                </div>
                <p className="text-base font-bold text-white">
                  {activeWeather.sunrise || '06:15 AM'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Popular Tourist Destinations Weather Hub */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-display font-bold text-slate-900">
              Popular Holiday Destinations Live Radar
            </h2>
            <p className="text-xs text-slate-500">
              Live conditions across India's premier tourist destinations
            </p>
          </div>
        </div>

        {loadingPopular ? (
          <div className="py-12 flex items-center justify-center gap-3">
            <LoadingSpinner size="md" />
            <span className="text-xs text-slate-500">Syncing live atmospheric stations...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {popularWeather.map((hub, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveWeather({ ...hub, locationName: hub.hubName })}
                className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-brand-500 hover:shadow-md transition-all text-left group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                    {hub.hubName}
                  </span>
                  <CloudSun className="w-4 h-4 text-amber-500" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-display font-black text-slate-900">
                    {Math.round(hub.temperature || 24)}°C
                  </span>
                  <span className="text-[11px] text-slate-500 capitalize line-clamp-1">
                    {hub.condition || 'Clear'}
                  </span>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Humidity: {hub.humidity || 60}%</span>
                  <span className="text-brand-600 font-bold">Select</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserRecentWeatherPage;
