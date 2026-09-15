import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Luggage,
  ShieldCheck,
  Sparkles,
  Trash2,
  CheckCheck,
  Clock,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { userService } from '../../services/userService';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export const UserNotificationsPage = () => {
  const { currentUser } = useAuth();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'booking' | 'security' | 'system'
  const [readIds, setReadIds] = useState(new Set());

  // Load notifications from dashboard summary
  const loadNotifications = async () => {
    try {
      setLoading(true);
      const res = await userService.getDashboardSummary();
      if (res.success && res.data?.notifications) {
        setNotifications(res.data.notifications);
      } else {
        // Fallback realistic user notifications if none returned
        setNotifications([
          {
            id: 'notif-1',
            type: 'booking',
            title: 'Welcome to Vista Holidays!',
            message: 'Your account is verified and ready for booking unforgettable tours across India.',
            timestamp: new Date().toISOString(),
            link: '/destinations'
          },
          {
            id: 'notif-2',
            type: 'security',
            title: 'Account Security Active',
            message: 'Your email address is registered and secured with encrypted credentials.',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            link: '/user/security'
          },
          {
            id: 'notif-3',
            type: 'system',
            title: 'Gemini AI Assistant Online',
            message: 'Need help planning your holiday? The AI concierge is available 24/7.',
            timestamp: new Date(Date.now() - 86400000).toISOString(),
            link: '/user/ai-assistant'
          }
        ]);
      }
    } catch (err) {
      console.warn('Error loading notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkAllRead = () => {
    const all = new Set(notifications.map((n) => n.id || n._id));
    setReadIds(all);
    toast.success('All notifications marked as read.');
  };

  const handleToggleRead = (id) => {
    setReadIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const getIconForType = (type) => {
    switch (type) {
      case 'booking':
        return <Luggage className="w-4 h-4 text-brand-600" />;
      case 'security':
        return <ShieldCheck className="w-4 h-4 text-emerald-600" />;
      case 'system':
      default:
        return <Sparkles className="w-4 h-4 text-amber-500" />;
    }
  };

  const filteredNotifications = notifications.filter((item) => {
    if (activeFilter === 'all') return true;
    return item.type === activeFilter;
  });

  const unreadCount = notifications.filter((n) => !readIds.has(n.id || n._id)).length;

  return (
    <div className="py-6 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-brand-600 uppercase mb-1">
            <Bell className="w-4 h-4" />
            <span>Communications Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 tracking-tight">
            Notifications & Announcements ({unreadCount} New)
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Stay updated on booking confirmations, trip reminders, security alerts, and holiday discounts.
          </p>
        </div>

        {notifications.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleMarkAllRead}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            >
              <CheckCheck className="w-4 h-4 text-emerald-600" />
              <span>Mark All as Read</span>
            </button>
          </div>
        )}
      </div>

      {/* 2. Filter Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200">
        {[
          { id: 'all', label: 'All Notifications' },
          { id: 'booking', label: 'Bookings & Trips' },
          { id: 'security', label: 'Security & Auth' },
          { id: 'system', label: 'Platform & AI' }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveFilter(tab.id)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeFilter === tab.id
                ? 'bg-brand-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3. Notification List */}
      {loading ? (
        <div className="py-16 flex flex-col items-center justify-center gap-3">
          <LoadingSpinner size="lg" />
          <p className="text-xs text-slate-500">Checking for new notifications...</p>
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xs space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center mx-auto shadow-xs">
            <Bell className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-display font-bold text-slate-900">
              No notifications found
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              You're all caught up! When there are updates about your bookings or account, they will appear here.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notif) => {
            const notifId = notif.id || notif._id;
            const isRead = readIds.has(notifId);

            return (
              <div
                key={notifId}
                className={`p-4 sm:p-5 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                  isRead
                    ? 'bg-white/80 border-slate-200/70 text-slate-600'
                    : 'bg-white border-brand-200/80 shadow-xs ring-1 ring-brand-500/10'
                }`}
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                      isRead ? 'bg-slate-100' : 'bg-brand-50'
                    }`}
                  >
                    {getIconForType(notif.type)}
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-display font-bold text-sm text-slate-900 leading-tight">
                        {notif.title}
                      </h4>
                      {!isRead && (
                        <span className="w-2 h-2 rounded-full bg-brand-600 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{notif.message}</p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
                      <Clock className="w-3 h-3" />
                      <span>
                        {new Date(notif.timestamp || Date.now()).toLocaleString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Notification Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {notif.link && (
                    <Link
                      to={notif.link}
                      className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-brand-50 text-brand-700 text-xs font-bold border border-slate-200/70 transition-colors"
                    >
                      View
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={() => handleToggleRead(notifId)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                    title={isRead ? 'Mark unread' : 'Mark read'}
                  >
                    <CheckCircle2
                      className={`w-4 h-4 ${isRead ? 'text-slate-300' : 'text-emerald-500'}`}
                    />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UserNotificationsPage;
