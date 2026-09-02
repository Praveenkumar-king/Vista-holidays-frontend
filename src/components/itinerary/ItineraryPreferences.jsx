import React from 'react';
import { Sparkles, DollarSign, Users, Gauge, Heart } from 'lucide-react';

const INTEREST_OPTIONS = [
  'Landmarks',
  'History',
  'Food & Dining',
  'Shopping',
  'Nature & Outdoors',
  'Museums & Art',
  'Nightlife',
  'Beaches',
  'Photography',
  'Local Culture'
];

const BUDGET_OPTIONS = [
  { value: 'Budget', label: 'Budget-Friendly' },
  { value: 'Moderate', label: 'Moderate / Balanced' },
  { value: 'Premium', label: 'Luxury / Premium' }
];

const TRAVELER_OPTIONS = [
  { value: 'Solo', label: 'Solo Traveler' },
  { value: 'Couple', label: 'Couple / Duo' },
  { value: 'Friends', label: 'Group of Friends' },
  { value: 'Family', label: 'Family with Kids' }
];

const PACE_OPTIONS = [
  { value: 'Relaxed', label: 'Relaxed (Leisurely)' },
  { value: 'Balanced', label: 'Balanced (Standard)' },
  { value: 'Packed', label: 'Action-Packed (See Everything)' }
];

export const ItineraryPreferences = ({
  selectedInterests = [],
  onToggleInterest,
  budget = 'Moderate',
  onChangeBudget,
  travelers = 'Couple',
  onChangeTravelers,
  pace = 'Balanced',
  onChangePace
}) => {
  return (
    <div className="space-y-5 pt-4 border-t border-slate-200/80">
      {/* 1. Interests Multi-Select Chips */}
      <div>
        <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
          <Heart className="w-3.5 h-3.5 text-brand-600" />
          <span>Interests & Activities (Optional)</span>
        </label>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Select interests">
          {INTEREST_OPTIONS.map((interest) => {
            const isSelected = selectedInterests.includes(interest);
            return (
              <button
                key={interest}
                type="button"
                onClick={() => onToggleInterest(interest)}
                aria-pressed={isSelected}
                className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                  isSelected
                    ? 'bg-brand-600 text-white shadow-sm border border-brand-600 scale-102'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/60'
                }`}
              >
                {isSelected && '✓ '}
                {interest}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Three Column Preferences Grid (Budget, Travelers, Pace) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Budget */}
        <div>
          <label
            htmlFor="itinerary-budget-select"
            className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5"
          >
            <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
            <span>Budget</span>
          </label>
          <select
            id="itinerary-budget-select"
            value={budget}
            onChange={(e) => onChangeBudget(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200/90 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
          >
            {BUDGET_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Travelers */}
        <div>
          <label
            htmlFor="itinerary-travelers-select"
            className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5"
          >
            <Users className="w-3.5 h-3.5 text-indigo-600" />
            <span>Travelers</span>
          </label>
          <select
            id="itinerary-travelers-select"
            value={travelers}
            onChange={(e) => onChangeTravelers(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200/90 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
          >
            {TRAVELER_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Pace */}
        <div>
          <label
            htmlFor="itinerary-pace-select"
            className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5"
          >
            <Gauge className="w-3.5 h-3.5 text-amber-600" />
            <span>Pace</span>
          </label>
          <select
            id="itinerary-pace-select"
            value={pace}
            onChange={(e) => onChangePace(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200/90 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
          >
            {PACE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default ItineraryPreferences;
