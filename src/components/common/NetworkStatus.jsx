import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';

export const NetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [showRestored, setShowRestored] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowRestored(true);
      const timer = setTimeout(() => setShowRestored(false), 3500);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowRestored(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline && !showRestored) return null;

  return (
    <div
      className="fixed bottom-4 left-4 z-50 animate-slide-up max-w-sm"
      role="status"
      aria-live="polite"
    >
      {!isOnline ? (
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-950/90 backdrop-blur-md text-amber-300 border border-amber-500/30 shadow-float text-xs font-semibold">
          <WifiOff className="w-4 h-4 text-amber-400 flex-shrink-0 animate-pulse" />
          <span>You're currently offline. Live weather & AI features may be limited.</span>
        </div>
      ) : showRestored ? (
        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-emerald-950/90 backdrop-blur-md text-emerald-300 border border-emerald-500/30 shadow-float text-xs font-semibold animate-fade-in">
          <Wifi className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>Connection restored</span>
        </div>
      ) : null}
    </div>
  );
};

export default NetworkStatus;
