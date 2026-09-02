import React from 'react';
import { Sparkles, MapPin, CloudSun } from 'lucide-react';
import { SuggestedQuestions } from './SuggestedQuestions';
import { Badge } from '../ui/Badge';

export const EmptyChatState = ({
  activeContext,
  onSelectSuggestion
}) => {
  const destinationName = activeContext?.destination?.name || activeContext?.location?.displayName;
  const weatherTemp = activeContext?.weather?.temperature;

  return (
    <div className="flex flex-col items-center justify-center p-6 text-center max-w-lg mx-auto my-auto space-y-5 animate-fade-in">
      {/* Icon */}
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white flex items-center justify-center shadow-float">
        <Sparkles className="w-7 h-7" />
      </div>

      {/* Headings */}
      <div>
        <h3 className="font-display font-extrabold text-xl text-slate-900 tracking-tight">
          How can I help plan your trip?
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
          Ask me about must-see landmarks, food recommendations, trip lengths, or local culture worldwide.
        </p>
      </div>

      {/* Active Context Indicators */}
      {(destinationName || weatherTemp !== undefined) && (
        <div className="flex flex-wrap items-center justify-center gap-2 p-2 rounded-xl bg-slate-100/80 border border-slate-200/60 text-xs">
          {destinationName && (
            <div className="flex items-center gap-1 text-slate-700 font-semibold">
              <MapPin className="w-3.5 h-3.5 text-brand-600" />
              <span>{destinationName}</span>
            </div>
          )}
          {weatherTemp !== undefined && (
            <div className="flex items-center gap-1 text-slate-700 font-semibold border-l border-slate-300 pl-2">
              <CloudSun className="w-3.5 h-3.5 text-amber-600" />
              <span>{weatherTemp}°C · {activeContext.weather.condition}</span>
            </div>
          )}
        </div>
      )}

      {/* Suggested Questions */}
      <SuggestedQuestions
        onSelectQuestion={onSelectSuggestion}
        className="text-left w-full pt-2"
      />
    </div>
  );
};

export default EmptyChatState;
