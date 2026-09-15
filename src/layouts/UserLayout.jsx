import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  Bell,
  Sparkles,
  Search,
  Calendar,
  Clock,
  ChevronRight,
  ShieldCheck,
  Compass,
  User as UserIcon,
  LogOut,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTravelAssistant } from '../hooks/useTravelAssistant';
import { UserSidebar, USER_NAV_SECTIONS } from '../components/user/UserSidebar';
import { PlatformNotificationBar } from '../components/common';

export const UserLayout = ({ children }) => {
  const { currentUser, logout } = useAuth();
  const { openAssistant } = useTravelAssistant();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [location.pathname]);

  // ESC key listener for mobile drawer
  useEffect(() => {
    if (!mobileSidebarOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setMobileSidebarOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileSidebarOpen]);

  // Live IST Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = { timeZone: 'Asia/Kolkata' };

      const dateStr = new Intl.DateTimeFormat('en-US', {
        ...options,
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      }).format(now);
      setCurrentDate(dateStr);

      const timeStr = new Intl.DateTimeFormat('en-US', {
        ...options,
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }).format(now);
      setCurrentTime(timeStr);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Determine current page title from navigation sections
  const getCurrentPageMeta = () => {
    const path = location.pathname;
    for (const section of USER_NAV_SECTIONS) {
      for (const item of section.items) {
        if (item.exact ? path === item.path : path.startsWith(item.path)) {
          return { title: item.name, section: section.title };
        }
      }
    }
    if (path.includes('profile')) return { title: 'My Profile', section: 'ACCOUNT' };
    if (path.includes('booking')) return { title: 'My Bookings', section: 'OVERVIEW' };
    if (path.includes('trip')) return { title: 'My Trips', section: 'OVERVIEW' };
    return { title: 'Traveler Dashboard', section: 'USER PORTAL' };
  };

  const pageMeta = getCurrentPageMeta();
  const userInitial = currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'T';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased selection:bg-brand-500 selection:text-white">
      {/* Top Platform Announcement & Maintenance Notification Bar */}
      <PlatformNotificationBar />

      {/* Skip link for accessibility */}
      <a href="#user-main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Mobile Top Header Bar */}
      <header className="md:hidden sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(true)}
            className="p-2 -ml-1.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white shadow-xs">
              <Compass className="w-4 h-4" />
            </div>
            <span className="font-display font-black text-slate-900 text-sm tracking-tight">
              Vista <span className="text-brand-600">Holidays</span>
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Quick AI Trigger */}
          <button
            type="button"
            onClick={() => openAssistant()}
            className="p-2 rounded-xl text-brand-600 hover:bg-brand-50 transition-colors"
            title="Open AI Assistant"
            aria-label="Open AI Assistant"
          >
            <Sparkles className="w-4 h-4" />
          </button>

          {/* Notifications Quick Link */}
          <Link
            to="/user/notifications"
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors relative"
            title="Notifications"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-600 ring-2 ring-white" />
          </Link>

          {/* User Profile Avatar Link */}
          <Link
            to="/user/profile"
            className="w-8 h-8 rounded-full overflow-hidden bg-brand-600 text-white flex items-center justify-center text-xs font-bold ring-2 ring-slate-100"
            title="Profile"
          >
            {currentUser?.profileImage?.url ? (
              <img
                src={currentUser.profileImage.url}
                alt={currentUser.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{userInitial}</span>
            )}
          </Link>
        </div>
      </header>

      {/* Layout Wrapper: Sidebar + Content */}
      <div className="flex flex-1 relative">
        {/* Mobile Slide-Over Drawer with Backdrop */}
        {mobileSidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs md:hidden transition-opacity"
            onClick={() => setMobileSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        <div
          className={`fixed inset-y-0 left-0 z-50 w-64 lg:w-72 md:hidden transform transition-transform duration-250 ease-in-out ${
            mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <UserSidebar onCloseMobile={() => setMobileSidebarOpen(false)} />
        </div>

        {/* Desktop Sticky Sidebar */}
        <aside className="hidden md:block w-64 lg:w-72 flex-shrink-0 sticky top-0 h-screen z-20">
          <UserSidebar />
        </aside>

        {/* Main Content Viewport */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Desktop Topbar Header */}
          <header className="hidden md:flex items-center justify-between px-6 lg:px-8 py-3.5 bg-white border-b border-slate-200/80 sticky top-0 z-10">
            {/* Breadcrumbs & Active Title */}
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                {pageMeta.section}
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
              <h1 className="text-sm font-bold text-slate-900 truncate">
                {pageMeta.title}
              </h1>
            </div>

            {/* Desktop Quick Actions & Status Telemetry */}
            <div className="flex items-center gap-3.5">
              {/* IST Clock Widget */}
              <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/60 text-xs text-slate-600 font-medium">
                <Calendar className="w-3.5 h-3.5 text-brand-600" />
                <span>{currentDate}</span>
                <span className="text-slate-300">•</span>
                <Clock className="w-3.5 h-3.5 text-brand-600" />
                <span className="font-mono text-slate-700">{currentTime} IST</span>
              </div>

              {/* AI Assistant Quick Launcher */}
              <button
                type="button"
                onClick={() => openAssistant()}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200/70 text-xs font-semibold transition-colors group cursor-pointer"
                title="Launch Gemini AI Travel Assistant"
              >
                <Sparkles className="w-3.5 h-3.5 text-brand-600 group-hover:rotate-12 transition-transform" />
                <span>Ask AI Concierge</span>
              </button>

              {/* Notifications Icon with Badge */}
              <Link
                to="/user/notifications"
                className="relative p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-600 ring-2 ring-white" />
              </Link>

              {/* User Profile Mini Dropdown/Link */}
              <Link
                to="/user/profile"
                className="flex items-center gap-2.5 pl-2 pr-3 py-1 rounded-full hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
              >
                <div className="w-7 h-7 rounded-full overflow-hidden bg-brand-600 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                  {currentUser?.profileImage?.url ? (
                    <img
                      src={currentUser.profileImage.url}
                      alt={currentUser.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{userInitial}</span>
                  )}
                </div>
                <div className="text-left hidden xl:block">
                  <p className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[120px]">
                    {currentUser?.name || 'Traveler'}
                  </p>
                  <p className="text-[10px] text-emerald-600 font-medium">Verified</p>
                </div>
              </Link>
            </div>
          </header>

          {/* Main Content Area */}
          <main id="user-main-content" className="flex-1 focus:outline-none" tabIndex={-1}>
            {children || <Outlet />}
          </main>

          {/* Clean User Area Footer */}
          <footer className="py-4 px-6 border-t border-slate-200/60 text-center text-xs text-slate-400 bg-white/50">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
              <p>© {new Date().getFullYear()} Vista Holidays Travel Portal. All rights reserved.</p>
              <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                <Link to="/destinations" className="hover:text-brand-600 transition-colors">
                  Explore
                </Link>
                <Link to="/contact" className="hover:text-brand-600 transition-colors">
                  Support
                </Link>
                <Link to="/faq" className="hover:text-brand-600 transition-colors">
                  FAQ
                </Link>
                <Link to="/terms" className="hover:text-brand-600 transition-colors">
                  Terms & Privacy
                </Link>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default UserLayout;
