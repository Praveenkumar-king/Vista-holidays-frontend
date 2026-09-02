import React, { useEffect } from 'react';
import { 
  X, 
  MapPin, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  Calendar,
  Compass
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export const PlaceDetailModal = ({
  place,
  isOpen,
  onClose
}) => {
  // Handle ESC key press and body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !place) return null;

  const {
    name,
    category,
    location,
    shortDescription,
    overview,
    estimatedVisitTime,
    bestTimeToVisit,
    highlights = [],
    featured
  } = place;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-slate-950/70 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="place-modal-title"
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-float border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header Banner */}
        <div className="relative p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-slate-800 to-brand-950 text-white flex-shrink-0">
          <div className="absolute top-4 right-4 z-10">
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label="Close landmark details dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge variant="glass" size="sm" className="bg-white/15 text-white border-white/20">
              {category}
            </Badge>
            {featured && (
              <Badge variant="dark" size="sm" icon={Sparkles} className="bg-amber-400 text-slate-950 font-bold">
                Must-Visit
              </Badge>
            )}
          </div>

          <h2 id="place-modal-title" className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {name}
          </h2>

          <div className="flex items-center gap-1.5 text-xs text-sky-200 mt-2">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{location}</span>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-700">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                Visit Duration
              </span>
              <span className="font-bold text-slate-900 flex items-center gap-1 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-brand-600" />
                {estimatedVisitTime || '1-2 Hours'}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                Best Timing
              </span>
              <span className="font-bold text-slate-900 flex items-center gap-1 mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-amber-600" />
                {bestTimeToVisit || 'Morning or Golden Hour'}
              </span>
            </div>
          </div>

          {/* Detailed Overview */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              About This Landmark
            </h4>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {overview || shortDescription}
            </p>
          </div>

          {/* Key Highlights */}
          {highlights && highlights.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                Key Experience Highlights
              </h4>
              <div className="space-y-2">
                {highlights.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs sm:text-sm text-slate-800"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-end flex-shrink-0">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PlaceDetailModal;
