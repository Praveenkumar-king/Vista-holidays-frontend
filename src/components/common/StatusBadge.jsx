import React from 'react';
import { CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

export const StatusBadge = ({
  status = 'connected', // 'connected' | 'loading' | 'error'
  message = 'API Operational',
  className = ''
}) => {
  if (status === 'loading') {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200 ${className}`}>
        <RefreshCw className="w-3.5 h-3.5 animate-spin text-brand-500" />
        <span>Checking service status...</span>
      </div>
    );
  }

  if (status === 'connected') {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200/80 ${className}`}>
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span>{message}</span>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200/80 ${className}`}>
      <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
      <span>{message}</span>
    </div>
  );
};

export default StatusBadge;
