import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

const VARIANT_MAP = {
  info: {
    bg: 'bg-brand-50 border-brand-200 text-brand-900',
    icon: Info,
    iconColor: 'text-brand-600'
  },
  success: {
    bg: 'bg-emerald-50 border-emerald-200 text-emerald-900',
    icon: CheckCircle2,
    iconColor: 'text-emerald-600'
  },
  warning: {
    bg: 'bg-amber-50 border-amber-200 text-amber-900',
    icon: AlertTriangle,
    iconColor: 'text-amber-600'
  },
  error: {
    bg: 'bg-rose-50 border-rose-200 text-rose-900',
    icon: AlertCircle,
    iconColor: 'text-rose-600'
  }
};

export const StatusMessage = ({
  variant = 'info',
  title,
  message,
  onDismiss,
  className = ''
}) => {
  const currentVariant = VARIANT_MAP[variant] || VARIANT_MAP.info;
  const Icon = currentVariant.icon;

  return (
    <div
      className={`flex items-start justify-between gap-3 p-4 rounded-2xl border ${currentVariant.bg} text-xs sm:text-sm animate-fade-in ${className}`}
      role={variant === 'error' ? 'alert' : 'status'}
    >
      <div className="flex items-start gap-2.5">
        <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${currentVariant.iconColor}`} />
        <div>
          {title && <div className="font-bold mb-0.5">{title}</div>}
          <div className="leading-relaxed opacity-90">{message}</div>
        </div>
      </div>

      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="p-1 rounded-lg opacity-60 hover:opacity-100 transition-opacity"
          aria-label="Dismiss message"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

export default StatusMessage;
