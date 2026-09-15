import React from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Compass,
  MapPin,
  Luggage,
  Bot,
  CalendarDays,
  Heart,
  CloudSun,
  Navigation,
  Bell,
  Headphones,
  HelpCircle,
  User as UserIcon,
  ShieldCheck,
  Settings,
  FileText,
  LogOut,
  Sparkles,
  ArrowUpRight,
  Shield,
  CheckCircle2,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTravelAssistant } from '../../hooks/useTravelAssistant';

export const USER_NAV_SECTIONS = [
  {
    title: 'OVERVIEW',
    items: [
      {
        name: 'Dashboard',
        path: '/user/dashboard',
        icon: LayoutDashboard,
        exact: true
      },
      {
        name: 'Explore Destinations',
        path: '/destinations',
        icon: Compass,
        badge: 'Explorer'
      },
      {
        name: 'My Trips',
        path: '/user/trips',
        icon: MapPin
      },
      {
        name: 'My Bookings',
        path: '/user/bookings',
        icon: Luggage
      }
    ]
  },
  {
    title: 'PLAN YOUR TRIP',
    items: [
      {
        name: 'AI Travel Assistant',
        path: '/user/ai-assistant',
        icon: Bot,
        badge: 'Gemini AI',
        badgeColor: 'bg-brand-50 text-brand-600 border-brand-200'
      },
      {
        name: 'My AI Plans',
        path: '/user/ai-plans',
        icon: CalendarDays
      },
      {
        name: 'Saved Destinations',
        path: '/user/saved-destinations',
        icon: Heart
      }
    ]
  },
  {
    title: 'DISCOVER',
    items: [
      {
        name: 'Recent Weather',
        path: '/user/recent-weather',
        icon: CloudSun,
        badge: 'Live'
      },
      {
        name: 'Recent Locations',
        path: '/user/recent-locations',
        icon: Navigation
      }
    ]
  },
  {
    title: 'SUPPORT',
    items: [
      {
        name: 'Notifications',
        path: '/user/notifications',
        icon: Bell
      },
      {
        name: 'Support & Tickets',
        path: '/contact',
        icon: Headphones
      },
      {
        name: 'Help & FAQs',
        path: '/faq',
        icon: HelpCircle
      }
    ]
  },
  {
    title: 'ACCOUNT',
    items: [
      {
        name: 'My Profile',
        path: '/user/profile',
        icon: UserIcon
      },
      {
        name: 'Security',
        path: '/user/security',
        icon: ShieldCheck
      },
      {
        name: 'Settings',
        path: '/user/settings',
        icon: Settings
      },
      {
        name: 'Terms & Privacy',
        path: '/terms',
        icon: FileText
      }
    ]
  }
];

export const UserSidebar = ({ onCloseMobile, className = '' }) => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();

  const savedCount = currentUser?.savedDestinations?.length || 0;
  const userInitial = currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'T';

  return (
    <aside
      className={`w-64 lg:w-72 bg-white border-r border-slate-200/80 flex flex-col h-full select-none ${className}`}
      aria-label="User Navigation Sidebar"
    >
      {/* 1. Brand & Header Card */}
      <div className="p-4 sm:p-5 pb-3 border-b border-slate-100 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-xl"
          onClick={onCloseMobile}
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform flex-shrink-0">
            <Compass className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="font-display font-black text-slate-900 text-base tracking-tight block leading-tight">
              Vista <span className="text-brand-600">Holidays</span>
            </span>
            <span className="text-[10px] font-bold tracking-wider uppercase text-brand-600 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Traveler Portal
            </span>
          </div>
        </Link>

        {/* Mobile Close Button */}
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Close user sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* 2. User Profile Ribbon */}
      <div className="p-4 mx-3 my-2 rounded-2xl bg-gradient-to-br from-slate-50 to-brand-50/40 border border-slate-200/60 flex items-center gap-3">
        <div className="relative flex-shrink-0">
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-brand-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
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
          {currentUser?.emailVerified && (
            <div
              className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center border-2 border-white shadow-xs"
              title="Verified Account"
            >
              <CheckCircle2 className="w-2.5 h-2.5 stroke-[3]" />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-slate-900 truncate">
            {currentUser?.name || 'Vista Traveler'}
          </p>
          <p className="text-[11px] text-slate-500 truncate font-mono">
            {currentUser?.email || 'traveler@vistaholidays.com'}
          </p>
        </div>
      </div>

      {/* 3. Navigation Sections (Scrollable) */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-5 scrollbar-thin scrollbar-thumb-slate-200">
        {USER_NAV_SECTIONS.map((section) => (
          <div key={section.title} className="space-y-1">
            <h3 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-3 py-1">
              {section.title}
            </h3>

            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isExact = item.exact;
                const isActive = isExact
                  ? location.pathname === item.path
                  : location.pathname === item.path ||
                    (item.path !== '/' && item.path !== '/user' && location.pathname.startsWith(item.path));

                return (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    end={isExact}
                    onClick={onCloseMobile}
                    className={({ isActive: linkActive }) => {
                      const active = isActive || linkActive;
                      return `flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-xs transition-all group ${
                        active
                          ? 'bg-brand-50 text-brand-700 font-bold border border-brand-200/80 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 font-medium'
                      }`;
                    }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon
                        className={`w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110 ${
                          isActive ? 'text-brand-600' : 'text-slate-400 group-hover:text-slate-600'
                        }`}
                      />
                      <span className="truncate">{item.name}</span>
                    </div>

                    {/* Dynamic Badges */}
                    {item.name === 'Saved Destinations' && savedCount > 0 ? (
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200/60">
                        {savedCount}
                      </span>
                    ) : item.badge ? (
                      <span
                        className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          item.badgeColor || 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        {item.badge}
                      </span>
                    ) : null}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* 4. Bottom Footer Actions */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/60 space-y-1">
        <Link
          to="/"
          className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-white border border-transparent hover:border-slate-200/60 transition-all group"
          onClick={onCloseMobile}
        >
          <div className="flex items-center gap-2">
            <Compass className="w-3.5 h-3.5 text-brand-600" />
            <span>Public Website</span>
          </div>
          <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>

        <button
          type="button"
          onClick={() => {
            if (onCloseMobile) onCloseMobile();
            logout();
          }}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-100/60 transition-colors text-left"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default UserSidebar;
