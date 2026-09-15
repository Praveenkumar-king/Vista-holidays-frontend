import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  HelpCircle,
  Mail,
  MessageSquare,
  Sparkles,
  Megaphone,
  Wrench,
  Settings,
  BarChart3,
  ExternalLink,
  LogOut,
  Shield,
  Menu,
  X,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { adminService } from '../services/adminService';

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
  { name: 'Users', path: '/admin/users', icon: Users },
  { name: 'Support Tickets', path: '/admin/support-tickets', icon: HelpCircle },
  { name: 'Contact Messages', path: '/admin/contact', icon: Mail },
  { name: 'Feedback Messages', path: '/admin/feedback', icon: MessageSquare },
  { name: "What's New / Product Updates", path: '/admin/whats-new', icon: Sparkles },
  { name: 'Platform Announcements', path: '/admin/announcements', icon: Megaphone },
  { name: 'Maintenance Mode', path: '/admin/maintenance', icon: Wrench },
  { name: 'Platform Settings', path: '/admin/platform-settings', icon: Settings },
  { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 }
];

export const AdminLayout = ({ children, title, subtitle, badgeText, primaryAction, onRefresh, refreshing }) => {
  const { logout, currentUser } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const location = useLocation();

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Check maintenance status periodically
  useEffect(() => {
    let isMounted = true;
    const checkStatus = async () => {
      try {
        const res = await adminService.getPublicPlatformStatus();
        if (isMounted && res.success && res.data) {
          setMaintenanceMode(Boolean(res.data.maintenanceMode));
        }
      } catch {
        // Non-blocking
      }
    };
    checkStatus();
    const interval = setInterval(checkStatus, 30000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Compute IST Date and Greeting for dynamic header
  const getISTDateTime = () => {
    const now = new Date();
    // Use Intl.DateTimeFormat in Asia/Kolkata timezone
    const istTimeStr = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Kolkata',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false
    }).format(now);

    const istHour = parseInt(istTimeStr.split(':')[0], 10);

    let greeting = 'Good Morning';
    let greetingIcon = '☀️';
    if (istHour >= 12 && istHour < 17) {
      greeting = 'Good Afternoon';
      greetingIcon = '☀️';
    } else if (istHour >= 17 || istHour < 0) {
      greeting = 'Good Evening';
      greetingIcon = '🌙';
    }

    const dateOptions = {
      timeZone: 'Asia/Kolkata',
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    const formattedDate = new Intl.DateTimeFormat('en-US', dateOptions).format(now).toUpperCase();

    return { formattedDate, greeting, greetingIcon };
  };

  const { formattedDate, greeting, greetingIcon } = getISTDateTime();
  const isDashboard = location.pathname === '/admin';

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100 flex flex-col md:flex-row antialiased selection:bg-rose-500 selection:text-white">
      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-[#0d1322] border-b border-slate-800/80 sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-600 to-rose-700 flex items-center justify-center text-white shadow-md shadow-rose-950/40">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <span className="font-extrabold text-white text-sm tracking-tight block">Vista Admin</span>
            <span className="text-[10px] text-rose-400 font-bold uppercase tracking-wider block">Super Admin</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {maintenanceMode && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              Maint.
            </span>
          )}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-300 hover:text-white"
            aria-label="Toggle navigation drawer"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Backdrop for mobile drawer */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 bottom-0 h-screen w-64 bg-[#0a0f1d] border-r border-slate-800/80 flex flex-col z-50 transition-transform duration-200 ease-in-out shrink-0 overflow-y-auto ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Card at top */}
        <div className="p-5 pb-3">
          <div className="p-3 rounded-2xl bg-[#0e1629] border border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 via-rose-600 to-rose-700 flex items-center justify-center text-white shadow-lg shadow-rose-950/50 shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="font-extrabold text-white text-sm tracking-tight truncate">
                Super Admin
              </h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">
                  Administrator
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="px-4 py-2 flex-grow">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-2 mb-1">
            Administration
          </div>

          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.exact}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-md shadow-rose-950/40 font-bold'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Actions */}
        <div className="p-4 border-t border-slate-800/80 bg-[#080d19]/80 space-y-1.5">
          <Link
            to="/"
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Public Application</span>
          </Link>

          <button
            onClick={logout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <main className="flex-1 flex flex-col min-w-0 min-h-screen bg-[#070b12] overflow-x-hidden">
        {/* Consistent Top Page Header */}
        <div className="border-b border-slate-800/80 bg-[#090e1b]/70 backdrop-blur-md sticky top-0 md:top-0 z-30 px-6 sm:px-10 py-5">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Title & Context */}
            <div>
              {isDashboard ? (
                <>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    {formattedDate}
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
                    <span>{greetingIcon}</span>
                    <span>{greeting}, {currentUser?.name?.split(' ')[0] || 'Super Admin'}!</span>
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Welcome to the Vista Holidays Management Control Center. Monitor platform operations, manage travelers, and oversee travel intelligence.
                  </p>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                      {title}
                    </h1>
                    {badgeText && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700">
                        {badgeText}
                      </span>
                    )}
                  </div>
                  {subtitle && (
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">
                      {subtitle}
                    </p>
                  )}
                </>
              )}
            </div>

            {/* Right Status Badges & Action Buttons */}
            <div className="flex items-center gap-2.5 flex-wrap">
              {/* ADMIN ACCESS Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-slate-900 border border-slate-700/80 text-slate-300">
                <span>ADMIN ACCESS</span>
              </div>

              {/* Live System Status Indicator */}
              {maintenanceMode ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-500/15 border border-amber-500/30 text-amber-300">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <span>Maintenance Mode</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>System Online</span>
                </div>
              )}

              {/* Refresh button if provided */}
              {onRefresh && (
                <button
                  onClick={onRefresh}
                  disabled={refreshing}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 transition-colors"
                  title="Refresh data"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">Refresh</span>
                </button>
              )}

              {/* Page-specific Primary Action button */}
              {primaryAction}
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="max-w-7xl w-full mx-auto px-6 sm:px-10 py-8 flex-grow">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
