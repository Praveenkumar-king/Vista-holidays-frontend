import React from 'react';
import { Sparkles, CalendarDays, Compass, MapPin } from 'lucide-react';
import { Badge } from '../ui/Badge';

export const ItineraryEmptyState = () => {
  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-brand-950 text-white rounded-3xl p-8 sm:p-10 lg:p-12 text-center flex flex-col items-center justify-center space-y-6 shadow-float border border-slate-800 h-full min-h-[420px]">
      <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-glow">
        <CalendarDays className="w-8 h-8 text-amber-300" />
      </div>

      <div className="max-w-md space-y-2">
        <Badge variant="glass" size="sm" className="bg-white/10 text-amber-300 border-white/20 mx-auto">
          AI Smart Scheduler
        </Badge>
        <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
          Plan Your Next Adventure
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Select a destination and trip duration to generate an optimized, day-by-day itinerary featuring iconic sights, authentic dining, and realistic pacing.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-lg text-left text-xs pt-2">
        <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
          <span className="font-bold text-sky-300 block mb-0.5">Day-by-Day</span>
          <span className="text-slate-400 text-[11px]">Morning, afternoon & evening timelines</span>
        </div>
        <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
          <span className="font-bold text-amber-300 block mb-0.5">Smart Grouping</span>
          <span className="text-slate-400 text-[11px]">Geographically organized activities</span>
        </div>
        <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
          <span className="font-bold text-emerald-300 block mb-0.5">Custom Pace</span>
          <span className="text-slate-400 text-[11px]">Relaxed, balanced, or action-packed</span>
        </div>
      </div>
    </div>
  );
};

export default ItineraryEmptyState;
