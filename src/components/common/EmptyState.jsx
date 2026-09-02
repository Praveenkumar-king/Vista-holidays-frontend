import React from 'react';
import { MapPinOff } from 'lucide-react';
import { Button } from '../ui/Button';

export const EmptyState = ({
  icon: Icon = MapPinOff,
  title = 'No results found',
  description = 'Try adjusting your search criteria or filters to explore more destinations.',
  actionLabel,
  onAction,
  className = ''
}) => {
  return (
    <div className={`text-center py-12 px-4 max-w-md mx-auto flex flex-col items-center justify-center ${className}`}>
      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-4 border border-slate-200">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="font-display font-bold text-lg text-slate-900 mb-1">
        {title}
      </h3>
      <p className="text-sm text-slate-500 mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
