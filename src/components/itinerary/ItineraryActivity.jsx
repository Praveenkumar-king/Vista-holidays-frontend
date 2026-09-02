import React from 'react';
import { Sun, Sunset, Moon, Clock, Compass, MapPin } from 'lucide-react';
import { Badge } from '../ui/Badge';

export const ItineraryActivity = ({ activity }) => {
  if (!activity) return null;

  const {
    time = 'Activity',
    title,
    description,
    duration,
    category
  } = activity;

  // Icon and theme mapping based on time of day
  const timeLower = time.toLowerCase();
  let TimeIcon = Compass;
  let timeBadgeColor = 'bg-brand-50 text-brand-700 border-brand-200';

  if (timeLower.includes('morning')) {
    TimeIcon = Sun;
    timeBadgeColor = 'bg-amber-50 text-amber-800 border-amber-200';
  } else if (timeLower.includes('afternoon')) {
    TimeIcon = Sunset;
    timeBadgeColor = 'bg-sky-50 text-sky-800 border-sky-200';
  } else if (timeLower.includes('evening') || timeLower.includes('night')) {
    TimeIcon = Moon;
    timeBadgeColor = 'bg-indigo-50 text-indigo-800 border-indigo-200';
  }

  return (
    <div className="relative pl-6 sm:pl-8 pb-8 last:pb-2 group">
      {/* Vertical Timeline Track & Node */}
      <div className="absolute left-0 top-1.5 bottom-0 w-0.5 bg-slate-200 group-last:bg-transparent" />
      <div className="absolute -left-[7px] top-1.5 w-4 h-4 rounded-full bg-white border-2 border-brand-500 shadow-sm flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
        <div className="w-1.5 h-1.5 rounded-full bg-brand-600" />
      </div>

      {/* Activity Card Content */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-subtle hover:shadow-card hover:border-slate-300 transition-all duration-200 ease-smooth">
        {/* Top Meta Line: Time + Category + Duration */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-md border ${timeBadgeColor}`}
            >
              <TimeIcon className="w-3 h-3" />
              <span>{time}</span>
            </span>

            {category && (
              <Badge variant="secondary" size="xs">
                {category}
              </Badge>
            )}
          </div>

          {duration && (
            <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 font-medium">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>{duration}</span>
            </span>
          )}
        </div>

        {/* Activity Title */}
        <h4 className="font-display font-bold text-sm sm:text-base text-slate-900 group-hover:text-brand-600 transition-colors duration-150">
          {title}
        </h4>

        {/* Description */}
        {description && (
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-1.5">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

export default ItineraryActivity;
