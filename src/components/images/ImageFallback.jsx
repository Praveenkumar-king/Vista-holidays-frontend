import React from 'react';
import { Compass, MapPin } from 'lucide-react';

export const ImageFallback = ({
  title = 'Destination',
  category = 'Travel Landmark',
  aspectRatio = 'aspect-[16/10]',
  className = ''
}) => {
  return (
    <div
      className={`relative w-full ${aspectRatio} overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-brand-950 flex items-center justify-center p-4 text-center select-none ${className}`}
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,135,234,0.25),transparent_60%)]" />
      <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center justify-center">
        <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white mb-2 border border-white/15 shadow-sm">
          <Compass className="w-5 h-5 text-amber-300" />
        </div>
        <span className="font-display font-bold text-sm sm:text-base text-white tracking-tight drop-shadow-sm line-clamp-1">
          {title}
        </span>
        {category && (
          <span className="text-[11px] font-medium text-slate-300 mt-0.5">
            {category}
          </span>
        )}
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
    </div>
  );
};

export default ImageFallback;
