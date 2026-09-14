import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  ArrowRight,
  Eye,
  X
} from 'lucide-react';
import { Button } from '../ui/Button';
import { productUpdateService } from '../../services/productUpdateService';
import { useToast } from '../../context/ToastContext';

/**
 * UserProductUpdateModal:
 * Presents newly published feature announcements as an interactive carousel.
 * - STRICT zero-dismissal policy for regular users (no X, no Escape, no backdrop click).
 * - Multi-slide carousel navigation with dot indicators.
 * - Final slide displays completion button that marks the update as seen in the database.
 * - Supports `isPreview` prop for admin testing with an explicit close preview button.
 */
export const UserProductUpdateModal = ({ 
  update, 
  isOpen, 
  onClose, 
  isPreview = false 
}) => {
  const toast = useToast();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // Reset to first slide whenever a new update is opened
  useEffect(() => {
    if (isOpen) {
      setCurrentSlideIndex(0);
    }
  }, [isOpen, update?._id]);

  // Trap keyboard Escape for users (prevent dismissal unless in preview mode)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isPreview) {
          onClose();
        } else {
          // Intentionally block escape dismissal
          e.preventDefault();
          e.stopPropagation();
        }
      } else if (e.key === 'ArrowLeft') {
        setCurrentSlideIndex(prev => Math.max(0, prev - 1));
      } else if (e.key === 'ArrowRight') {
        const maxIndex = (update?.slides?.length || 1) - 1;
        setCurrentSlideIndex(prev => Math.min(maxIndex, prev + 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isPreview, onClose, update?.slides?.length]);

  if (!isOpen || !update) return null;

  const slides = update.slides || [];
  const totalSlides = slides.length;
  const currentSlide = slides[currentSlideIndex] || {};
  const isFirstSlide = currentSlideIndex === 0;
  const isLastSlide = currentSlideIndex === totalSlides - 1 || totalSlides === 0;

  const handleNext = () => {
    if (!isLastSlide) {
      setCurrentSlideIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirstSlide) {
      setCurrentSlideIndex(prev => prev - 1);
    }
  };

  const handleFinish = async () => {
    if (isPreview) {
      onClose();
      return;
    }

    setSubmitting(true);
    try {
      await productUpdateService.markUpdateSeen(update._id);
      onClose();
    } catch (err) {
      console.warn('Could not record update view:', err);
      // Still close modal gracefully so the user is never permanently stuck if network blips
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/85 backdrop-blur-md animate-fade-in select-none"
      // Disallow backdrop click dismissal
      onClick={(e) => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-update-title"
    >
      <div 
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-100 max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Preview Mode Banner for Admins */}
        {isPreview && (
          <div className="bg-amber-500/15 border-b border-amber-500/30 px-4 py-2 flex items-center justify-between text-amber-300 text-xs font-medium">
            <div className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" />
              <span>Admin Preview Mode — This is how travelers will experience this update.</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded hover:bg-amber-500/20 text-amber-300 transition-colors flex items-center gap-1 text-[11px] font-semibold"
            >
              <X className="w-3.5 h-3.5" />
              <span>Close Preview</span>
            </button>
          </div>
        )}

        {/* Modal Header */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-800/80 bg-slate-900/95 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-400">
                  What's New in Vista Holidays
                </span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30">
                  v{update.version}
                </span>
              </div>
              <h2 id="product-update-title" className="text-base sm:text-lg font-display font-extrabold text-white tracking-tight leading-tight mt-0.5">
                {update.title}
              </h2>
            </div>
          </div>
        </div>

        {/* Carousel Body */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col">
          {totalSlides > 0 ? (
            <div className="flex flex-col flex-1">
              {/* Slide Image Container */}
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner flex items-center justify-center mb-5 group">
                <img
                  key={currentSlide.imageUrl || currentSlideIndex}
                  src={currentSlide.imageUrl}
                  alt={currentSlide.title || 'Feature highlight'}
                  className="w-full h-full object-cover animate-fade-in transition-all duration-300"
                  loading="eager"
                />

                {/* Cloudinary Authenticity Pill */}
                <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md border border-white/10 text-[10px] font-medium text-slate-300 flex items-center gap-1 shadow-sm">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Vista Holidays Cloud</span>
                </div>
              </div>

              {/* Slide Content */}
              <div className="flex-1 flex flex-col justify-center animate-fade-in">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-brand-400">
                    Feature {currentSlideIndex + 1} of {totalSlides}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-display font-extrabold text-white tracking-tight">
                  {currentSlide.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-2">
                  {currentSlide.description || update.description}
                </p>
              </div>
            </div>
          ) : (
            // Fallback for single overview update without multiple slides
            <div className="flex-1 flex flex-col justify-center py-8">
              <h3 className="text-lg font-display font-extrabold text-white mb-2">
                {update.title}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {update.description}
              </p>
            </div>
          )}
        </div>

        {/* Carousel Footer Controls */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between gap-4">
          {/* Previous Slide Button */}
          <div className="w-24">
            {!isFirstSlide ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                iconLeft={ChevronLeft}
                onClick={handlePrev}
                className="text-xs text-slate-300 hover:text-white hover:bg-slate-800"
              >
                Back
              </Button>
            ) : null}
          </div>

          {/* Dot Indicators */}
          {totalSlides > 1 && (
            <div className="flex items-center gap-2" role="tablist" aria-label="Slide indicators">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentSlideIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 focus:outline-none ${
                    idx === currentSlideIndex
                      ? 'w-6 bg-brand-500 shadow-sm shadow-brand-500/50'
                      : 'w-2 bg-slate-700 hover:bg-slate-600'
                  }`}
                  aria-label={`Jump to slide ${idx + 1}`}
                  aria-selected={idx === currentSlideIndex}
                  role="tab"
                />
              ))}
            </div>
          )}

          {/* Next / Completion Button */}
          <div className="w-auto min-w-24 flex justify-end">
            {isLastSlide ? (
              <Button
                type="button"
                variant="primary"
                size="sm"
                iconRight={ArrowRight}
                onClick={handleFinish}
                loading={submitting}
                className="text-xs font-semibold shadow-md shadow-brand-500/30 px-4"
              >
                {isPreview ? 'Close Preview' : 'Explore Vista Holidays'}
              </Button>
            ) : (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                iconRight={ChevronRight}
                onClick={handleNext}
                className="text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100"
              >
                Next
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProductUpdateModal;
