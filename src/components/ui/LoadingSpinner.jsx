import React from 'react';
import { Loader2 } from 'lucide-react';

const SIZE_MAP = {
  xs: 'w-3.5 h-3.5',
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-10 h-10'
};

export const LoadingSpinner = ({
  size = 'md',
  label = 'Loading...',
  showLabel = false,
  className = '',
  color = 'text-brand-600'
}) => {
  return (
    <div
      className={`inline-flex items-center justify-center gap-2 ${className}`}
      role="status"
      aria-live="polite"
    >
      <Loader2 className={`${SIZE_MAP[size] || SIZE_MAP.md} animate-spin ${color}`} />
      <span className={showLabel ? 'text-xs sm:text-sm font-medium text-slate-600' : 'sr-only'}>
        {label}
      </span>
    </div>
  );
};

export default LoadingSpinner;
