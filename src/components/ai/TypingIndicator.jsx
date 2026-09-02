import React from 'react';
import { Sparkles } from 'lucide-react';

export const TypingIndicator = ({ label = 'Vista Holidays Assistant is thinking...' }) => {
  return (
    <div className="flex items-start gap-3 w-full animate-fade-in" role="status" aria-live="polite">
      {/* Avatar Icon */}
      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-brand-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm animate-pulse">
        <Sparkles className="w-4 h-4" />
      </div>

      {/* Bubble with bouncing dots */}
      <div className="bg-white border border-slate-200/90 rounded-2xl rounded-tl-none p-3.5 shadow-subtle flex items-center gap-2">
        <span className="text-xs font-semibold text-slate-500">
          {label}
        </span>
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
