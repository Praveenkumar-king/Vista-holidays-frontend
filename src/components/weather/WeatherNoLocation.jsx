import React from 'react';
import { CloudSun, Navigation, Search, MapPin } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { useLocation } from '../../hooks/useLocation';

export const WeatherNoLocation = ({ className = '' }) => {
  const { requestCurrentLocation, isLoading } = useLocation();

  const handleScrollToLocation = () => {
    const el = document.getElementById('location-awareness');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Card
      variant="default"
      className={`p-8 sm:p-10 text-center bg-gradient-to-br from-slate-900 to-slate-950 text-white border-slate-800 shadow-card ${className}`}
    >
      <div className="w-16 h-16 rounded-3xl bg-white/10 flex items-center justify-center text-amber-300 mx-auto mb-4 border border-white/15 shadow-sm">
        <CloudSun className="w-8 h-8" />
      </div>

      <h3 className="font-display font-extrabold text-xl sm:text-2xl text-white tracking-tight mb-2">
        Select a Destination for Live Weather
      </h3>

      <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed mb-6">
        Detect your current device coordinates or search any of our 20+ global destinations to unlock real-time temperatures, wind, and forecast conditions.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button
          variant="primary"
          size="md"
          iconLeft={Navigation}
          onClick={requestCurrentLocation}
          disabled={isLoading}
          className="shadow-sm"
        >
          {isLoading ? 'Detecting GPS...' : 'Use My Location'}
        </Button>

        <Button
          variant="secondary"
          size="md"
          iconLeft={Search}
          onClick={handleScrollToLocation}
          className="bg-white/10 text-white hover:bg-white/20 border-white/20"
        >
          Search Destination
        </Button>
      </div>
    </Card>
  );
};

export default WeatherNoLocation;
