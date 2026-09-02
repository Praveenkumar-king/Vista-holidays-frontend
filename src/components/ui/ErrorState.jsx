import React from 'react';
import { AlertCircle } from 'lucide-react';
import { RetryButton } from './RetryButton';

export const ErrorState = ({
  title = 'Something went wrong',
  message = 'We could not complete your request. Please try again.',
  onRetry,
  isRetrying = false,
  action,
  icon: Icon = AlertCircle,
  className = '',
  compact = false
}) => {
  if (compact) {
    return (
      <div
        className={`flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs ${className}`}
        role="alert"
      >
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span className="leading-snug">{message}</span>
        </div>
        {onRetry && (
          <RetryButton
            onRetry={onRetry}
            isRetrying={isRetrying}
            size="xs"
            className="flex-shrink-0"
          />
        )}
      </div>
    );
  }

  return (
    <div
      className={`bg-amber-50/90 border border-amber-200 rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-subtle ${className}`}
      role="alert"
    >
      <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-sm">
        <Icon className="w-6 h-6" />
      </div>

      <div className="space-y-1">
        <h4 className="font-display font-bold text-base sm:text-lg text-amber-950">
          {title}
        </h4>
        <p className="text-xs sm:text-sm text-amber-800/90 max-w-md mx-auto leading-relaxed">
          {message}
        </p>
      </div>

      <div className="pt-2 flex items-center justify-center gap-3">
        {onRetry && (
          <RetryButton
            onRetry={onRetry}
            isRetrying={isRetrying}
            variant="primary"
            size="md"
            className="bg-amber-600 hover:bg-amber-700 text-white shadow-sm"
          />
        )}
        {action}
      </div>
    </div>
  );
};

export default ErrorState;
