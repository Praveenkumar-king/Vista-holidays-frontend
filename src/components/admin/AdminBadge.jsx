import React from 'react';

const VARIANTS = {
  success: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  warning: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  error: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
  danger: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
  info: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
  primary: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
  neutral: 'bg-slate-800/80 text-slate-400 border-slate-700/80'
};

export const AdminBadge = ({ variant = 'neutral', children, className = '', dot = false }) => {
  const chosenVariant = VARIANTS[variant] || VARIANTS.neutral;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border ${chosenVariant} ${className}`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            variant === 'success'
              ? 'bg-emerald-400'
              : variant === 'warning'
              ? 'bg-amber-400'
              : variant === 'error' || variant === 'danger'
              ? 'bg-rose-400'
              : variant === 'info'
              ? 'bg-sky-400'
              : 'bg-slate-400'
          }`}
        />
      )}
      {children}
    </span>
  );
};

export default AdminBadge;
