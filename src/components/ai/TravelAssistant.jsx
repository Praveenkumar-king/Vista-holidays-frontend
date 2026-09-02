import React, { useEffect, useRef } from 'react';
import { Sparkles } from 'lucide-react';
import { useTravelAssistant } from '../../hooks/useTravelAssistant';
import { ChatWindow } from './ChatWindow';

export const TravelAssistant = () => {
  const { isOpen, closeAssistant, toggleAssistant, messages } = useTravelAssistant();
  const triggerButtonRef = useRef(null);
  const wasOpenRef = useRef(false);

  // Restore focus to launcher trigger when chat is closed
  useEffect(() => {
    if (wasOpenRef.current && !isOpen) {
      triggerButtonRef.current?.focus();
    }
    wasOpenRef.current = isOpen;
  }, [isOpen]);

  // Handle ESC key to dismiss assistant
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeAssistant();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeAssistant]);

  return (
    <>
      {/* Floating Action Trigger Button (Always visible in bottom-right) */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-40 animate-fade-in">
          <button
            ref={triggerButtonRef}
            type="button"
            onClick={toggleAssistant}
            className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-brand-600 via-indigo-600 to-brand-700 text-white shadow-float hover:shadow-glow hover:scale-105 transition-all duration-300 border border-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            aria-label="Open Vista Holidays Assistant dialog"
          >
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            </div>
            <span className="font-display font-bold text-xs sm:text-sm tracking-tight pr-1">
              Vista Holidays Assistant
            </span>

            {messages.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-emerald-400" aria-label="Active conversation in progress" />
            )}
          </button>
        </div>
      )}

      {/* Floating Modal / Drawer when open */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-end sm:p-6 bg-slate-950/50 backdrop-blur-xs sm:bg-transparent animate-fade-in"
          onClick={closeAssistant}
          role="dialog"
          aria-modal="true"
          aria-labelledby="assistant-title"
        >
          {/* Main Chat Panel Container */}
          <div
            className="relative w-full sm:w-[450px] lg:w-[480px] h-[88vh] sm:h-[620px] max-h-[92vh] flex flex-col animate-slide-up shadow-float"
            onClick={(e) => e.stopPropagation()}
          >
            <ChatWindow onClose={closeAssistant} />
          </div>
        </div>
      )}
    </>
  );
};

export default TravelAssistant;
