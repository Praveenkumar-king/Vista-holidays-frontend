import React from 'react';
import { Sparkles, CheckCircle2, Compass } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';

export const DestinationOverview = ({ destination, className = '' }) => {
  if (!destination) return null;

  const {
    name,
    overview,
    highlights = []
  } = destination;

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Comprehensive Overview Card */}
      <Card variant="default">
        <CardHeader>
          <CardTitle as="h2" className="text-xl sm:text-2xl">
            About {name}
          </CardTitle>
          <CardDescription>
            Historical background, culture, and what makes this destination unique
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2 text-sm sm:text-base text-slate-700 leading-relaxed space-y-4">
          <p>{overview}</p>
        </CardContent>
      </Card>

      {/* Key Highlights Card */}
      {highlights && highlights.length > 0 && (
        <Card variant="default">
          <CardHeader>
            <CardTitle as="h2" className="text-xl flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-600" />
              Must-Experience Highlights
            </CardTitle>
            <CardDescription>
              Signature sights and activities recommended for first-time and returning visitors.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {highlights.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs sm:text-sm text-slate-800 hover:border-slate-200 transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span className="font-semibold text-slate-800">{item}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DestinationOverview;
