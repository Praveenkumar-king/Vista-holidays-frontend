import React, { useState } from 'react';
import { 
  Sparkles, 
  MapPin, 
  RotateCcw, 
  Trash2, 
  Calendar, 
  Compass, 
  DollarSign, 
  Users, 
  Gauge 
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ItineraryDay } from './ItineraryDay';

export const ItineraryResult = ({
  itinerary,
  onRegenerate,
  onClear,
  isRegenerating = false
}) => {
  if (!itinerary || !itinerary.days) return null;

  const {
    destination,
    daysCount,
    travelStyle,
    interests = [],
    budget,
    travelers,
    pace,
    days = []
  } = itinerary;

  const [activeDayTab, setActiveDayTab] = useState('all'); // 'all' or day number

  const filteredDays = activeDayTab === 'all'
    ? days
    : days.filter((d) => d.day === activeDayTab);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. Trip Summary Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
                AI Generated Itinerary
              </span>
              <Badge variant="brand" size="sm">
                {daysCount} {daysCount === 1 ? 'Day Plan' : 'Days Plan'}
              </Badge>
            </div>
            <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight flex items-center gap-2">
              <MapPin className="w-6 h-6 text-brand-600 flex-shrink-0" />
              <span>{destination.name}{destination.country ? `, ${destination.country}` : ''}</span>
            </h3>
          </div>

          {/* Action Buttons: Regenerate & Clear */}
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              iconLeft={RotateCcw}
              onClick={onRegenerate}
              disabled={isRegenerating}
              className="font-semibold"
            >
              {isRegenerating ? 'Regenerating...' : 'Regenerate'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              iconLeft={Trash2}
              onClick={onClear}
              className="text-slate-400 hover:text-rose-600"
              title="Clear current itinerary"
            >
              Clear
            </Button>
          </div>
        </div>

        {/* Preferences Pill Line */}
        <div className="flex flex-wrap items-center gap-2 pt-4">
          <Badge variant="secondary" size="sm" icon={Compass}>
            Style: {travelStyle}
          </Badge>
          {pace && (
            <Badge variant="secondary" size="sm" icon={Gauge}>
              Pace: {pace}
            </Badge>
          )}
          {budget && (
            <Badge variant="secondary" size="sm" icon={DollarSign}>
              Budget: {budget}
            </Badge>
          )}
          {travelers && (
            <Badge variant="secondary" size="sm" icon={Users}>
              {travelers}
            </Badge>
          )}
          {interests.map((int, idx) => (
            <span
              key={idx}
              className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-600"
            >
              #{int}
            </span>
          ))}
        </div>
      </div>

      {/* 2. Day Filter Tab Pills (if > 1 day) */}
      {days.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveDayTab('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeDayTab === 'all'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            All Days ({days.length})
          </button>
          {days.map((d) => (
            <button
              key={d.day}
              type="button"
              onClick={() => setActiveDayTab(d.day)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeDayTab === d.day
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Day {d.day}
            </button>
          ))}
        </div>
      )}

      {/* 3. Day by Day Timeline Cards */}
      <div className="space-y-6">
        {filteredDays.map((dayData) => (
          <ItineraryDay
            key={dayData.day}
            dayData={dayData}
            dayNumber={dayData.day}
          />
        ))}
      </div>
    </div>
  );
};

export default ItineraryResult;
