import React, { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

const variantStyles = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800 shadow-sm hover:shadow active:scale-[0.98] border border-transparent',
  secondary: 'bg-white text-slate-700 hover:bg-slate-50 active:bg-slate-100 border border-slate-200 shadow-subtle hover:border-slate-300 active:scale-[0.98]',
  outline: 'bg-transparent text-brand-600 border border-brand-600/30 hover:bg-brand-50/70 active:bg-brand-100/70 active:scale-[0.98]',
  ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200/60 active:scale-[0.98]',
  dark: 'bg-slate-900 text-white hover:bg-slate-800 active:bg-slate-950 shadow-sm hover:shadow active:scale-[0.98] border border-transparent',
  accent: 'bg-amber-500 text-slate-950 hover:bg-amber-400 active:bg-amber-600 font-semibold shadow-sm hover:shadow active:scale-[0.98] border border-transparent',
  destructive: 'bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 shadow-sm active:scale-[0.98] border border-transparent'
};

const sizeStyles = {
  xs: 'text-xs px-2.5 py-1.5 rounded-lg gap-1.5',
  sm: 'text-sm px-3 py-1.5 rounded-xl gap-1.5',
  md: 'text-sm font-medium px-4 py-2.5 rounded-xl gap-2',
  lg: 'text-base font-medium px-5 py-3 rounded-2xl gap-2.5',
  icon: 'p-2.5 rounded-xl'
};

export const Button = forwardRef(({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  iconLeft: IconLeft,
  iconRight: IconRight,
  as: Component = 'button',
  ...props
}, ref) => {
  const baseClasses = 'inline-flex items-center justify-center font-sans tracking-tight transition-all duration-150 ease-smooth select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none disabled:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2';
  const variantClass = variantStyles[variant] || variantStyles.primary;
  const sizeClass = sizeStyles[size] || sizeStyles.md;

  return (
    <Component
      ref={ref}
      type={Component === 'button' ? type : undefined}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClass} ${sizeClass} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : IconLeft ? (
        <IconLeft className="w-4 h-4 flex-shrink-0" />
      ) : null}
      
      {children}

      {!loading && IconRight && (
        <IconRight className="w-4 h-4 flex-shrink-0" />
      )}
    </Component>
  );
});

Button.displayName = 'Button';

export default Button;
