import React, { forwardRef } from 'react';

const cardVariantStyles = {
  default: 'bg-white border border-slate-200/80 shadow-card',
  elevated: 'bg-white border border-slate-100 shadow-card-hover',
  subtle: 'bg-slate-50/70 border border-slate-200/60 shadow-subtle',
  outline: 'bg-transparent border border-slate-200 shadow-none',
  dark: 'bg-slate-900 border border-slate-800 text-white shadow-card',
  interactive: 'bg-white border border-slate-200/80 shadow-card hover:shadow-card-hover hover:border-slate-300 hover:-translate-y-1 transition-all duration-300 cursor-pointer'
};

export const Card = forwardRef(({
  children,
  variant = 'default',
  className = '',
  as: Component = 'div',
  ...props
}, ref) => {
  const variantClass = cardVariantStyles[variant] || cardVariantStyles.default;
  return (
    <Component
      ref={ref}
      className={`rounded-2xl overflow-hidden transition-all duration-200 ${variantClass} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
});
Card.displayName = 'Card';

export const CardHeader = ({ children, className = '', ...props }) => (
  <div className={`p-5 sm:p-6 pb-2 ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle = ({
  children,
  as: Component = 'h3',
  className = '',
  ...props
}) => (
  <Component
    className={`font-display text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-snug ${className}`}
    {...props}
  >
    {children}
  </Component>
);

export const CardDescription = ({ children, className = '', ...props }) => (
  <p className={`text-sm text-slate-500 mt-1 leading-relaxed ${className}`} {...props}>
    {children}
  </p>
);

export const CardContent = ({ children, className = '', ...props }) => (
  <div className={`p-5 sm:p-6 pt-2 ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '', ...props }) => (
  <div
    className={`p-5 sm:p-6 pt-0 mt-auto flex items-center justify-between text-sm text-slate-500 ${className}`}
    {...props}
  >
    {children}
  </div>
);

export const CardImage = ({
  src,
  alt = 'Card media',
  aspectRatio = 'aspect-[16/10]',
  overlay = true,
  badge,
  className = '',
  ...props
}) => (
  <div className={`relative w-full overflow-hidden bg-slate-100 ${aspectRatio} ${className}`}>
    {src ? (
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
        {...props}
      />
    ) : (
      <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
        <span className="text-xs uppercase tracking-wider font-semibold">Image Placeholder</span>
      </div>
    )}

    {overlay && (
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />
    )}

    {badge && (
      <div className="absolute top-3 right-3 z-10">
        {badge}
      </div>
    )}
  </div>
);

export default Card;
