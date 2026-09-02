import React from 'react';

export const SectionHeader = ({
  eyebrow,
  title,
  description,
  action,
  align = 'left',
  className = '',
  titleAs: TitleTag = 'h2',
  titleClassName = '',
}) => {
  const alignClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center mx-auto',
    right: 'text-right items-end'
  };

  return (
    <div
      className={`flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-10 ${
        align === 'center' ? 'text-center' : ''
      } ${className}`}
    >
      <div className={`max-w-2xl flex flex-col ${alignClasses[align] || alignClasses.left}`}>
        {eyebrow && (
          <span className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-brand-600 mb-2">
            {eyebrow}
          </span>
        )}

        {title && (
          <TitleTag
            className={`font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight ${titleClassName}`}
          >
            {title}
          </TitleTag>
        )}

        {description && (
          <p className="text-sm sm:text-base text-slate-500 mt-2.5 leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {action && (
        <div className="flex-shrink-0 md:self-end pt-2 md:pt-0">
          {action}
        </div>
      )}
    </div>
  );
};

export default SectionHeader;
