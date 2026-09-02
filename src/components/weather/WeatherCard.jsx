import React from 'react';
import { 
  CloudSun, 
  Sun, 
  CloudRain, 
  CloudSnow, 
  CloudLightning, 
  Wind, 
  Eye, 
  Droplets, 
  Gauge, 
  Thermometer, 
  MapPin, 
  Navigation, 
  RotateCcw,
  Sparkles,
  Cloud
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

// Helper to choose a suitable fallback Lucide icon
function getWeatherIcon(condition = '', iconCode = '') {
  const cond = condition.toLowerCase();
  if (cond.includes('rain') || cond.includes('drizzle')) return CloudRain;
  if (cond.includes('snow')) return CloudSnow;
  if (cond.includes('thunder') || cond.includes('storm')) return CloudLightning;
  if (cond.includes('wind') || cond.includes('mist') || cond.includes('fog')) return Wind;
  if (cond.includes('cloud')) return CloudSun;
  if (cond.includes('clear')) return Sun;
  return Cloud;
}

// Capitalize first letter of each word
function formatDescription(str = '') {
  if (!str) return '';
  return str
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export const WeatherCard = ({
  weather,
  locationInfo,
  onRefresh,
  isRefreshing = false,
  className = ''
}) => {
  if (!weather) return null;

  const {
    location,
    temperature,
    feelsLike,
    tempMin,
    tempMax,
    condition,
    description,
    humidity,
    windSpeed,
    pressure,
    visibility,
    icon,
    fetchedAt,
    coordinates
  } = weather;

  const FallbackIcon = getWeatherIcon(condition, icon);
  const formattedDesc = formatDescription(description || condition);

  const displayName = locationInfo?.displayName || 
    (location?.name ? `${location.name}${location.country ? `, ${location.country}` : ''}` : 'Target Coordinates');

  const isGps = locationInfo?.source === 'current';

  const metrics = [
    {
      label: 'Humidity',
      value: `${humidity}%`,
      icon: Droplets,
      color: 'text-sky-400 bg-sky-500/10'
    },
    {
      label: 'Wind Speed',
      value: `${windSpeed} m/s`,
      icon: Wind,
      color: 'text-teal-400 bg-teal-500/10'
    },
    {
      label: 'Visibility',
      value: visibility !== null ? `${visibility} km` : 'N/A',
      icon: Eye,
      color: 'text-indigo-400 bg-indigo-500/10'
    },
    {
      label: 'Atm. Pressure',
      value: `${pressure} hPa`,
      icon: Gauge,
      color: 'text-amber-400 bg-amber-500/10'
    }
  ];

  return (
    <Card
      variant="default"
      className={`relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-brand-950 text-white border-slate-800 shadow-float p-6 sm:p-8 lg:p-10 animate-fade-in ${className}`}
    >
      {/* Layered Atmospheric Ambient Lighting */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Card Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge
              variant="glass"
              size="sm"
              className="bg-white/10 text-white border-white/15 backdrop-blur-md"
            >
              {condition}
            </Badge>

            <span className="inline-flex items-center gap-1 text-xs font-semibold text-sky-300">
              {isGps ? (
                <>
                  <Navigation className="w-3 h-3 fill-current" />
                  Current Device Location
                </>
              ) : (
                <>
                  <MapPin className="w-3 h-3" />
                  Target Destination
                </>
              )}
            </span>

            {coordinates && (
              <span className="text-[11px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded">
                {coordinates.latitude.toFixed(2)}°, {coordinates.longitude.toFixed(2)}°
              </span>
            )}
          </div>

          <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
            {displayName}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
            {formattedDesc} · Real-time meteorological telemetry
          </p>
        </div>

        {/* Weather Icon Box */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center flex-shrink-0 shadow-sm transition-transform duration-300 hover:scale-105">
            {icon ? (
              <img
                src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
                alt={formattedDesc}
                className="w-14 h-14 object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <FallbackIcon className="w-8 h-8 text-amber-300" />
            )}
          </div>
        </div>
      </div>

      {/* Main Temperature Hero & Metrics Area */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-8">
        {/* Main Temperature Display */}
        <div className="lg:col-span-5 flex items-baseline gap-4">
          <div className="font-display font-extrabold text-6xl sm:text-7xl lg:text-8xl tracking-tighter text-white leading-none">
            {temperature}°<span className="text-2xl sm:text-3xl text-slate-400 font-normal">C</span>
          </div>

          <div className="space-y-1">
            <div className="text-sm font-semibold text-slate-200">
              Feels like <span className="text-white font-bold">{feelsLike}°C</span>
            </div>
            <div className="text-xs text-slate-400">
              High: <span className="text-slate-200 font-bold">{tempMax}°C</span> · Low: <span className="text-slate-200 font-bold">{tempMin}°C</span>
            </div>
          </div>
        </div>

        {/* 4-Item Weather Metrics Grid */}
        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {metrics.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-3.5 sm:p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm flex flex-col justify-between hover:bg-white/10 transition-colors duration-200"
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-2 ${item.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                    {item.label}
                  </span>
                  <span className="font-display font-bold text-sm sm:text-base text-white">
                    {item.value}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Card Footer: Metadata & Refresh Action */}
      <div className="relative z-10 pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>
            {fetchedAt ? `Live weather updated at ${new Date(fetchedAt).toLocaleTimeString()}` : 'Live weather data active'}
          </span>
        </div>

        {onRefresh && (
          <Button
            variant="ghost"
            size="xs"
            onClick={onRefresh}
            disabled={isRefreshing}
            iconLeft={RotateCcw}
            className="text-slate-300 hover:text-white hover:bg-white/10 self-start sm:self-auto"
          >
            {isRefreshing ? 'Refreshing...' : 'Refresh Forecast'}
          </Button>
        )}
      </div>
    </Card>
  );
};

export default WeatherCard;
