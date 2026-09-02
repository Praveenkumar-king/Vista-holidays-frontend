import React, { forwardRef } from 'react';

export const Textarea = forwardRef(({
  label,
  id,
  rows = 4,
  error,
  helperText,
  maxLength,
  value,
  className = '',
  containerClassName = '',
  disabled = false,
  required = false,
  ...props
}, ref) => {
  const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`w-full ${containerClassName}`}>
      <div className="flex justify-between items-center mb-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
          >
            {label}
            {required && <span className="text-rose-500 ml-1">*</span>}
          </label>
        )}

        {maxLength && (
          <span className="text-[11px] text-slate-400">
            {typeof value === 'string' ? value.length : 0}/{maxLength}
          </span>
        )}
      </div>

      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        maxLength={maxLength}
        value={value}
        disabled={disabled}
        required={required}
        className={`w-full bg-white text-slate-800 text-sm placeholder:text-slate-400 border rounded-xl p-3.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed shadow-subtle resize-y ${
          error
            ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20 text-rose-900'
            : 'border-slate-200 hover:border-slate-300'
        } ${className}`}
        {...props}
      />

      {error ? (
        <p className="mt-1 text-xs text-rose-600 font-medium" role="alert">
          {error}
        </p>
      ) : helperText ? (
        <p className="mt-1 text-xs text-slate-500">{helperText}</p>
      ) : null}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;
