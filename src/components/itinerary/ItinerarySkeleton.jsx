import React from 'react';
import { Sparkles } from 'lucide-react';

export const ItinerarySkeleton = ({ daysCount = 3 }) => {
  const renderedDays = Math.min(Math.max(1, daysCount), 3);

  return (
    <div className="space-y-6 animate-pulse" role="status" aria-label="Generating your itinerary">
      {/* Header Skeleton */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-brand-200" />
            <div className="w-32 h-4 bg-slate-200 rounded" />
          </div>
          <div className="w-48 h-6 bg-slate-300 rounded-lg" />
        </div>
        <div className="flex gap-2">
          <div className="w-20 h-7 bg-slate-200 rounded-xl" />
          <div className="w-24 h-7 bg-slate-200 rounded-xl" />
        </div>
      </div>

      {/* Days Skeletons */}
      {Array.from({ length: renderedDays }).map((_, dIdx) => (
        <div
          key={dIdx}
          className="bg-slate-50/80 rounded-3xl border border-slate-200 p-6 space-y-5"
        >
          {/* Day Header */}
          <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
            <div className="w-10 h-10 rounded-2xl bg-slate-300" />
            <div className="space-y-1.5">
              <div className="w-20 h-3 bg-slate-200 rounded" />
              <div className="w-40 h-5 bg-slate-300 rounded" />
            </div>
          </div>

          {/* Activities */}
          <div className="space-y-4 pl-4">
            {[1, 2, 3].map((actIdx) => (
              <div key={actIdx} className="bg-white rounded-2xl p-4 border border-slate-200 space-y-2">
                <div className="flex justify-between">
                  <div className="w-24 h-4 bg-slate-200 rounded-md" />
                  <div className="w-16 h-4 bg-slate-200 rounded-md" />
                </div>
                <div className="w-3/4 h-4 bg-slate-300 rounded" />
                <div className="w-full h-3 bg-slate-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ItinerarySkeleton;
