import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const DestinationBackButton = ({
  to = '/destinations',
  label = 'Back to All Destinations',
  className = ''
}) => {
  return (
    <Link
      to={to}
      className={`inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-brand-600 transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-lg py-1 pr-2 ${className}`}
    >
      <div className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-brand-50 flex items-center justify-center text-slate-500 group-hover:text-brand-600 transition-colors border border-slate-200 group-hover:border-brand-200">
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
      </div>
      <span>{label}</span>
    </Link>
  );
};

export default DestinationBackButton;
