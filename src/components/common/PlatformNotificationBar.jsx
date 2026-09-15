import React, { useState, useEffect } from 'react';
import { AlertTriangle, Megaphone, X } from 'lucide-react';
import { adminService } from '../../services/adminService';

export const PlatformNotificationBar = () => {
  const [platformStatus, setPlatformStatus] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [dismissedIds, setDismissedIds] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const fetchStatusAndAnnouncements = async () => {
      try {
        const [statusRes, annRes] = await Promise.allSettled([
          adminService.getPublicPlatformStatus(),
          adminService.getActiveAnnouncements()
        ]);

        if (isMounted) {
          if (statusRes.status === 'fulfilled' && statusRes.value?.data) {
            setPlatformStatus(statusRes.value.data);
          }
          if (annRes.status === 'fulfilled' && annRes.value?.data?.announcements) {
            setAnnouncements(annRes.value.data.announcements);
          }
        }
      } catch {
        // Non-blocking
      }
    };

    fetchStatusAndAnnouncements();
    const interval = setInterval(fetchStatusAndAnnouncements, 30000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleDismissAnnouncement = (id) => {
    setDismissedIds(prev => [...prev, id]);
  };

  const isMaintenanceActive = Boolean(platformStatus?.maintenanceMode);
  const visibleAnnouncements = announcements.filter(a => !dismissedIds.includes(a._id));

  // If maintenance is on, show high-priority maintenance notice
  if (isMaintenanceActive) {
    return (
      <aside
        aria-label="System Under Maintenance Notice"
        className="bg-amber-500/95 text-slate-950 px-4 py-2.5 text-xs font-bold shadow-md sticky top-0 z-50 flex items-center justify-center gap-2"
      >
        <AlertTriangle className="w-4 h-4 shrink-0 text-slate-950 animate-pulse" />
        <span className="text-center leading-tight">
          System Under Maintenance: {platformStatus?.maintenanceHeadline || 'Scheduled Maintenance in Progress'}. Please note that user registration and standard logins are temporarily paused.
        </span>
      </aside>
    );
  }

  // Otherwise, show the topmost active announcement if any
  if (visibleAnnouncements.length > 0) {
    const ann = visibleAnnouncements[0];
    return (
      <aside
        aria-label="Platform Announcement Notice"
        className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white px-4 py-2 text-xs font-medium shadow-md sticky top-0 z-50 flex items-center justify-between gap-3"
      >
        <div className="flex items-center gap-2 max-w-5xl mx-auto truncate">
          <Megaphone className="w-3.5 h-3.5 shrink-0 text-blue-200" />
          <strong className="font-bold text-white shrink-0">{ann.title}:</strong>
          <span className="truncate text-blue-100">{ann.message}</span>
        </div>

        <button
          onClick={() => handleDismissAnnouncement(ann._id)}
          className="p-1 text-blue-200 hover:text-white rounded-lg hover:bg-white/10 transition-colors shrink-0"
          aria-label="Dismiss platform announcement"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </aside>
    );
  }

  return null;
};

export default PlatformNotificationBar;
