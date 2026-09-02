import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from '../ui/Button';

export const ItineraryError = ({
  message = 'We could not generate your itinerary right now. Please try again.',
  onRetry
}) => {
  return (
    <div
      className="bg-amber-50 border border-amber-200 rounded-3xl p-6 sm:p-8 text-center space-y-4 animate-fade-in"
      role="alert"
    >
      <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-sm">
        <AlertCircle className="w-6 h-6" />
      </div>

      <div>
        <h4 className="font-display font-bold text-base sm:text-lg text-amber-950">
          Itinerary Generation Issue
        </h4>
        <p className="text-xs sm:text-sm text-amber-800 mt-1 max-w-md mx-auto leading-relaxed">
          {message}
        </p>
      </div>

      {onRetry && (
        <div className="pt-2">
          <Button
            variant="primary"
            size="md"
            iconLeft={RotateCcw}
            onClick={onRetry}
            className="bg-amber-600 hover:bg-amber-700 text-white shadow-sm"
          >
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
};

export default ItineraryError;
