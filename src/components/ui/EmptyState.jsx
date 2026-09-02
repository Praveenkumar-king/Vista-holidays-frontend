import React from 'react';
import { Search } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = Search,
  title = 'No results found',
  description = 'Try adjusting your search query or filters to find what you are looking for.',
  action,
  className = '',
  compact = false
}) => {
  if (compact) {
    return (
      <div
        className={`text-center py-6 px-4 bg-slate-50/80 border border-slate-200/80 rounded-2xl ${className}`}
      >
        <Icon className="w-5 h-5 text-slate-400 mx-auto mb-1.5" />
        <p className="font-semibold text-xs text-slate-800">{title}</p>
        {description && (
          <p className="text-[11px] text-slate-500 mt-0.5 max-w-xs mx-auto">{description}</p>
        )}
        {action && <div className="mt-3">{action}</div>}
      </div>
    );
  }

  return (
    <div
      className={`bg-white border border-slate-200/90 rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-card ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto shadow-subtle border border-slate-200/60">
        <Icon className="w-7 h-7" />
      </div>

      <div className="space-y-1">
        <h3 className="font-display font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight">
          {title}
        </h3>
        {description && (
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {action && <div className="pt-2">{action}</div>}
    </div>
  );
};

export default EmptyState;
