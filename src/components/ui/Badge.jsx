import React from 'react';

const badgeVariantStyles = {
  default: 'bg-slate-100 text-slate-700 border-slate-200',
  brand: 'bg-brand-50 text-brand-700 border-brand-200/80',
  accent: 'bg-amber-50 text-amber-800 border-amber-200/80',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
  danger: 'bg-rose-50 text-rose-700 border-rose-200/80',
  dark: 'bg-slate-900 text-white border-transparent',
  outline: 'bg-transparent text-slate-700 border-slate-300',
  glass: 'bg-white/80 backdrop-blur-md text-slate-800 border-white/40 shadow-sm'
};

const badgeSizeStyles = {
  sm: 'text-[11px] px-2 py-0.5 rounded-md gap-1',
  md: 'text-xs font-medium px-2.5 py-1 rounded-lg gap-1.5',
  lg: 'text-sm font-medium px-3 py-1.5 rounded-lg gap-2'
};

export const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  dotColor,
  icon: Icon,
  className = '',
  ...props
}) => {
  const variantClass = badgeVariantStyles[variant] || badgeVariantStyles.default;
  const sizeClass = badgeSizeStyles[size] || badgeSizeStyles.md;

  return (
    <span
      className={`inline-flex items-center font-medium border tracking-tight transition-colors ${variantClass} ${sizeClass} ${className}`}
      {...props}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            dotColor || (variant === 'success' ? 'bg-emerald-500' : variant === 'brand' ? 'bg-brand-500' : 'bg-current')
          }`}
        />
      )}

      {Icon && <Icon className="w-3.5 h-3.5 flex-shrink-0" />}

      {children}
    </span>
  );
};

export default Badge;
