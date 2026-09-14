import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  Mail, 
  MessageSquare, 
  Sparkles, 
  ShieldCheck, 
  ExternalLink, 
  LogOut,
  LayoutDashboard 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Container } from './Container';

export const AdminNavHeader = () => {
  const { logout, currentUser } = useAuth();

  const navItems = [
    { name: 'Dashboard Hub', path: '/admin', icon: LayoutDashboard, exact: true },
    { name: 'Contact Tickets', path: '/admin/contact', icon: Mail },
    { name: 'Feedback & Reviews', path: '/admin/feedback', icon: MessageSquare },
    { name: "What's New / Releases", path: '/admin/whats-new', icon: Sparkles }
  ];

  return (
    <div className="bg-slate-900 border-b border-slate-800 text-slate-200 sticky top-0 z-40">
      <Container size="xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 py-3">
          {/* Logo & Branding */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
            <Link to="/admin" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-500 to-rose-700 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-display font-extrabold text-white text-base tracking-tight">
                  Vista <span className="text-rose-500">Admin</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30">
                  Portal
                </span>
              </div>
            </Link>

            {/* Mobile Actions */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={logout}
                className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto w-full md:w-auto py-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.exact}
                  className={({ isActive }) =>
                    `inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-rose-600 text-white shadow-sm shadow-rose-900/40'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`
                  }
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Quick External & Logout Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Return to Public Website"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Public Website</span>
            </Link>

            <button
              onClick={logout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 transition-colors"
              title="Sign Out of Admin"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default AdminNavHeader;
