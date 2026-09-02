import React from 'react';
import { AlertCircle } from 'lucide-react';

export const InlineError = ({
  message,
  className = ''
}) => {
  if (!message) return null;

  return (
    <div
      className={`flex items-center gap-1.5 text-xs text-rose-600 font-medium mt-1.5 animate-fade-in ${className}`}
      role="alert"
    >
      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
};

export default InlineError;
