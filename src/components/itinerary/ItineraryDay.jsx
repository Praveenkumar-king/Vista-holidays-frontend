import React from 'react';
import { Calendar, Compass } from 'lucide-react';
import { ItineraryActivity } from './ItineraryActivity';

export const ItineraryDay = ({ dayData, dayNumber }) => {
  if (!dayData) return null;

  const {
    day = dayNumber,
    title = `Day ${dayNumber} Exploration`,
    summary = '',
    activities = []
  } = dayData;

  return (
    <div className="bg-slate-50/80 rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-subtle mb-6 last:mb-0">
      {/* Day Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 mb-5 border-b border-slate-200/80">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white font-display font-extrabold text-base flex items-center justify-center flex-shrink-0 shadow-sm">
            D{day}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600">
                Day {day} Schedule
              </span>
            </div>
            <h3 className="font-display font-extrabold text-base sm:text-lg text-slate-900 leading-tight">
              {title}
            </h3>
          </div>
        </div>

        {summary && (
          <p className="text-xs sm:text-sm text-slate-500 sm:max-w-md sm:text-right leading-relaxed italic">
            "{summary}"
          </p>
        )}
      </div>

      {/* Activities Timeline */}
      <div className="pt-2">
        {activities.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No scheduled activities for this day.</p>
        ) : (
          activities.map((act, idx) => (
            <ItineraryActivity
              key={idx}
              activity={act}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ItineraryDay;
