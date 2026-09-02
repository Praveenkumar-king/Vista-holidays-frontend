import React from 'react';

export const ImageSkeleton = ({
  className = '',
  aspectRatio = 'aspect-[16/10]'
}) => {
  return (
    <div
      className={`relative w-full ${aspectRatio} overflow-hidden bg-slate-800/80 animate-pulse rounded-t-2xl flex items-center justify-center ${className}`}
      aria-label="Loading photograph"
    >
      <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-white/30">
        <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white/80 animate-spin" />
      </div>
    </div>
  );
};

export default ImageSkeleton;
