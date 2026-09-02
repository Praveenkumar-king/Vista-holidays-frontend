import React from 'react';
import { AlertCircle, RotateCcw, CloudOff } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';

export const WeatherError = ({
  message = 'Weather data is temporarily unavailable.',
  onRetry,
  className = ''
}) => {
  return (
    <Card
      variant="default"
      className={`p-6 sm:p-8 bg-slate-900 border-slate-800 text-white shadow-card ${className}`}
      role="alert"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0 mt-1 sm:mt-0">
            <CloudOff className="w-6 h-6" />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Weather Service Alert
              </span>
            </div>
            <h3 className="font-display font-bold text-lg text-white">
              Unable to Retrieve Live Weather
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        {onRetry && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onRetry}
            iconLeft={RotateCcw}
            className="flex-shrink-0 bg-white/10 text-white hover:bg-white/20 border-white/20"
          >
            Try Again
          </Button>
        )}
      </div>
    </Card>
  );
};

export default WeatherError;
