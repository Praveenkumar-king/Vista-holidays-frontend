import React, { useState, useEffect } from 'react';
import { Camera } from 'lucide-react';
import { useRemoteImage } from '../../hooks/useImages';
import { ImageSkeleton } from './ImageSkeleton';
import { ImageFallback } from './ImageFallback';

export const RemoteImage = ({
  query,
  alt = 'Travel photograph',
  aspectRatio = 'aspect-[16/10]',
  fallbackTitle = 'Destination',
  fallbackCategory = 'Landmark',
  priority = false,
  showAttribution = false,
  className = '',
  imgClassName = ''
}) => {
  const { photo, loading, error } = useRemoteImage(query);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Reset image element decoding state when query or photo changes
  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
  }, [photo?.url, query]);

  // 1. Loading State (render skeleton only while actively loading without error)
  if (loading && !photo && !error) {
    return <ImageSkeleton aspectRatio={aspectRatio} className={className} />;
  }

  // 2. Error or No Photo Found State
  if (error || !photo || !photo.url || imageError) {
    return (
      <ImageFallback
        title={fallbackTitle}
        category={fallbackCategory}
        aspectRatio={aspectRatio}
        className={className}
      />
    );
  }

  // 3. Remote Image Rendered
  return (
    <div className={`relative w-full ${aspectRatio} overflow-hidden bg-slate-900 ${className}`}>
      {/* Background Skeleton while actual image file decodes */}
      {!imageLoaded && (
        <div className="absolute inset-0 bg-slate-800 animate-pulse" />
      )}

      <img
        src={photo.mediumUrl || photo.url}
        alt={alt || photo.alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageError(true)}
        className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        } ${imgClassName}`}
      />

      {/* Subtle Directional Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

      {/* Optional Photographer Credit Badge */}
      {showAttribution && photo.photographer && (
        <div className="absolute bottom-2 right-2 z-20 pointer-events-auto">
          {photo.photographerUrl ? (
            <a
              href={photo.photographerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[10px] text-white/80 hover:text-white bg-slate-950/70 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10 transition-colors"
              title={`Photo by ${photo.photographer} on Pexels`}
            >
              <Camera className="w-2.5 h-2.5" />
              <span className="truncate max-w-[100px]">{photo.photographer}</span>
            </a>
          ) : (
            <span className="inline-flex items-center gap-1 text-[10px] text-white/80 bg-slate-950/70 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10">
              <Camera className="w-2.5 h-2.5" />
              <span className="truncate max-w-[100px]">{photo.photographer}</span>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default RemoteImage;
