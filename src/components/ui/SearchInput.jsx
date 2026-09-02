import React, { forwardRef } from 'react';
import { Search, X } from 'lucide-react';

export const SearchInput = forwardRef(({
  value = '',
  onChange,
  onClear,
  placeholder = 'Search destinations, cities, or activities...',
  className = '',
  size = 'md',
  shortcutHint = false,
  autoFocus = false,
  disabled = false,
  ...props
}, ref) => {
  const sizeStyles = {
    sm: 'py-2 pl-9 pr-8 text-xs',
    md: 'py-3 pl-11 pr-10 text-sm',
    lg: 'py-4 pl-12 pr-12 text-base'
  };

  const iconSizes = {
    sm: 'w-4 h-4 left-3',
    md: 'w-4 h-4 left-4',
    lg: 'w-5 h-5 left-4'
  };

  return (
    <div className="relative w-full flex items-center">
      <div className={`absolute pointer-events-none text-slate-400 flex items-center ${iconSizes[size] || iconSizes.md}`}>
        <Search className="w-full h-full" />
      </div>

      <input
        ref={ref}
        type="search"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        autoFocus={autoFocus}
        className={`w-full bg-white text-slate-800 placeholder:text-slate-400 border border-slate-200/90 rounded-2xl transition-all duration-200 shadow-card hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 disabled:bg-slate-50 disabled:cursor-not-allowed ${
          sizeStyles[size] || sizeStyles.md
        } ${className}`}
        {...props}
      />

      <div className="absolute right-3.5 flex items-center space-x-2">
        {value && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Clear search input"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        {shortcutHint && !value && (
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-slate-100 border border-slate-200 rounded">
            ⌘K
          </kbd>
        )}
      </div>
    </div>
  );
});

SearchInput.displayName = 'SearchInput';

export default SearchInput;
