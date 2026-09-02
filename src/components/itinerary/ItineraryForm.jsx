import React, { useState } from 'react';
import { 
  Sparkles, 
  MapPin, 
  Calendar, 
  Compass, 
  SlidersHorizontal, 
  Loader2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { DESTINATIONS } from '../../data/destinations';
import { Button } from '../ui/Button';
import { ItineraryPreferences } from './ItineraryPreferences';

const TRAVEL_STYLES = [
  'Culture',
  'Adventure',
  'Relaxation',
  'Food',
  'Luxury',
  'Family',
  'Budget',
  'Nature',
  'Balanced'
];

const QUICK_DAYS = [1, 2, 3, 4, 5, 7, 10];

export const ItineraryForm = ({
  formData,
  onChangeForm,
  onSubmit,
  isLoading = false
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const {
    selectedDestinationId = 'paris',
    days = 3,
    travelStyle = 'Culture',
    interests = [],
    budget = 'Moderate',
    travelers = 'Couple',
    pace = 'Balanced'
  } = formData;

  const handleToggleInterest = (interest) => {
    const updated = interests.includes(interest)
      ? interests.filter((i) => i !== interest)
      : [...interests, interest];
    onChangeForm({ ...formData, interests: updated });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoading) return;
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" aria-label="Itinerary parameters form">
      {/* 1. Destination Dropdown Selector */}
      <div>
        <label
          htmlFor="itinerary-destination-select"
          className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 mb-2"
        >
          <MapPin className="w-3.5 h-3.5 text-brand-600" />
          <span>Target Destination *</span>
        </label>
        <select
          id="itinerary-destination-select"
          value={selectedDestinationId}
          onChange={(e) => onChangeForm({ ...formData, selectedDestinationId: e.target.value })}
          disabled={isLoading}
          className="w-full bg-slate-50 border border-slate-200/90 rounded-2xl px-4 py-3 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all cursor-pointer"
        >
          {DESTINATIONS.map((dest) => (
            <option key={dest.id} value={dest.id}>
              {dest.name}, {dest.country} ({dest.category})
            </option>
          ))}
        </select>
      </div>

      {/* 2. Number of Days Selector (Pills + Number) */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
            <Calendar className="w-3.5 h-3.5 text-brand-600" />
            <span>Trip Duration *</span>
          </label>
          <span className="text-xs font-extrabold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md border border-brand-200">
            {days} {days === 1 ? 'Day' : 'Days'}
          </span>
        </div>

        <div className="grid grid-cols-7 gap-1.5 sm:gap-2" role="group" aria-label="Select number of days">
          {QUICK_DAYS.map((d) => (
            <button
              key={d}
              type="button"
              disabled={isLoading}
              onClick={() => onChangeForm({ ...formData, days: d })}
              aria-pressed={days === d}
              aria-label={`${d} ${d === 1 ? 'day' : 'days'} duration`}
              className={`py-2 rounded-xl text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                days === d
                  ? 'bg-brand-600 text-white shadow-sm border border-brand-600'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/60'
              }`}
            >
              {d}d
            </button>
          ))}
        </div>
      </div>

      {/* 3. Travel Style Selection */}
      <div>
        <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
          <Compass className="w-3.5 h-3.5 text-brand-600" />
          <span>Travel Style</span>
        </label>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Select travel style">
          {TRAVEL_STYLES.map((style) => (
            <button
              key={style}
              type="button"
              disabled={isLoading}
              onClick={() => onChangeForm({ ...formData, travelStyle: style })}
              aria-pressed={travelStyle === style}
              className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                travelStyle === style
                  ? 'bg-slate-900 text-white shadow-sm border border-slate-900'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/60'
              }`}
            >
              {style}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Advanced Preferences Toggle */}
      <div>
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          aria-expanded={showAdvanced}
          aria-controls="itinerary-advanced-preferences"
          className="flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-lg p-1"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>{showAdvanced ? 'Hide Additional Preferences' : 'Customize Interests, Budget & Pace'}</span>
          {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showAdvanced && (
          <div id="itinerary-advanced-preferences">
            <ItineraryPreferences
              selectedInterests={interests}
              onToggleInterest={handleToggleInterest}
              budget={budget}
              onChangeBudget={(val) => onChangeForm({ ...formData, budget: val })}
              travelers={travelers}
              onChangeTravelers={(val) => onChangeForm({ ...formData, travelers: val })}
              pace={pace}
              onChangePace={(val) => onChangeForm({ ...formData, pace: val })}
            />
          </div>
        )}
      </div>

      {/* 5. Submit CTA Button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={isLoading}
        className="w-full justify-center shadow-md font-bold text-sm sm:text-base py-3.5"
        iconLeft={isLoading ? Loader2 : Sparkles}
      >
        {isLoading ? 'Crafting Your Itinerary with Gemini...' : 'Generate My Itinerary'}
      </Button>
    </form>
  );
};

export default ItineraryForm;
