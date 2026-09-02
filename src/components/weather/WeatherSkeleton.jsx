import React from 'react';
import { Card, CardHeader, CardContent } from '../ui/Card';

export const WeatherSkeleton = ({ className = '' }) => {
  return (
    <Card
      variant="default"
      className={`p-6 sm:p-8 bg-slate-900 border-slate-800 text-white animate-pulse shadow-card ${className}`}
      aria-label="Loading real-time weather data"
    >
      {/* Header Skeleton */}
      <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-6">
        <div className="space-y-2">
          <div className="h-4 w-28 bg-white/20 rounded-lg"></div>
          <div className="h-7 w-48 bg-white/30 rounded-xl"></div>
          <div className="h-3.5 w-36 bg-white/10 rounded-md"></div>
        </div>
        <div className="w-14 h-14 rounded-2xl bg-white/10 flex-shrink-0"></div>
      </div>

      {/* Main Temperature Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-6 mb-8">
        <div className="space-y-2">
          <div className="h-16 w-32 bg-white/30 rounded-2xl"></div>
          <div className="h-4 w-44 bg-white/20 rounded-lg"></div>
        </div>

        {/* Small Metric Pills Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full sm:w-auto">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 w-full sm:w-24 bg-white/5 border border-white/10 rounded-2xl p-3">
              <div className="h-3 w-10 bg-white/20 rounded mx-auto mb-2"></div>
              <div className="h-5 w-12 bg-white/30 rounded mx-auto"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Status Skeleton */}
      <div className="h-10 bg-white/5 border border-white/10 rounded-xl"></div>
    </Card>
  );
};

export default WeatherSkeleton;
