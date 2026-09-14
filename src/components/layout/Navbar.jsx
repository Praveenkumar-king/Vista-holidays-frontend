import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation as useRouterLocation } from 'react-router-dom';
import { 
  Compass, 
  MapPin, 
  Sparkles, 
  CloudSun, 
  CalendarDays, 
  Menu, 
  X, 
  ArrowRight,
  LogOut,
  User as UserIcon,
  Headphones
} from 'lucide-react';
import { Container } from './Container';
import { Button } from '../ui/Button';
import { LocationIndicator } from '../location/LocationIndicator';
import { useAuth } from '../../context/AuthContext';

export const Navbar = () => {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuButtonRef = useRef(null);
  const routerLocation = useRouterLocation();

  const isHomeTop = routerLocation.pathname === '/' && !isScrolled;

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [routerLocation.pathname]);

  // Handle ESC key to dismiss mobile menu
  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

  // Track scroll position for header transitions
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/', exact: true },
    { name: 'Destinations', path: '/destinations', icon: MapPin },
    { name: 'Famous Places', path: '/#places', icon: Compass },
    { name: 'Weather', path: '/weather', icon: CloudSun },
    { name: 'AI Assistant', path: '/#assistant', icon: Sparkles, badge: 'AI' },
    { name: 'Itinerary', path: '/#itinerary', icon: CalendarDays },
    { name: 'Support', path: '/contact', icon: Headphones }
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isHomeTop
          ? 'bg-slate-950/80 backdrop-blur-md border-b border-white/10 text-white py-4'
          : isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-subtle border-b border-slate-200/80 py-3 text-slate-900'
          : 'bg-white border-b border-slate-100 py-4 text-slate-900'
      }`}
    >
      <Container size="xl">
        <div className="flex items-center justify-between">
          {/* Logo / Brand */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-xl"
            aria-label="Vista Holidays Home"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5 text-white stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <span className={`font-display font-extrabold text-lg sm:text-xl tracking-tight leading-none transition-colors ${
                isHomeTop ? 'text-white' : 'text-slate-900 group-hover:text-brand-600'
              }`}>
                Vista <span className="text-brand-400">Holidays</span>
              </span>
              <span className="text-[10px] font-semibold tracking-wider uppercase text-slate-400">
                Explore The World
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isHome = link.path === '/';
              const isActive = isHome
                ? routerLocation.pathname === '/' && !routerLocation.hash
                : routerLocation.pathname === link.path || (link.path.startsWith('/#') && routerLocation.hash === link.path.replace('/', ''));

              return (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs xl:text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? isHomeTop
                        ? 'text-white bg-white/20 font-semibold'
                        : 'text-brand-600 bg-brand-50/80 font-semibold'
                      : isHomeTop
                      ? 'text-slate-200 hover:text-white hover:bg-white/10'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4 opacity-80" />}
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold bg-amber-400/90 text-slate-950 rounded-full">
                      {link.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Right Action CTA, Auth & Location Indicator Area */}
          <div className="hidden sm:flex items-center gap-2.5">
            <LocationIndicator
              className={isHomeTop ? 'bg-white/10 text-white border-white/20' : ''}
            />

            <Link to="/destinations">
              <Button
                variant={isHomeTop ? 'accent' : 'primary'}
                size="sm"
                iconRight={ArrowRight}
                className="shadow-sm font-semibold"
              >
                Plan Trip
              </Button>
            </Link>

            {/* Authentication Action or User Profile */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200/50">
                <div
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold ${
                    isHomeTop ? 'bg-white/15 text-white' : 'bg-slate-100 text-slate-800'
                  }`}
                  title={`Signed in as ${currentUser?.name} (${currentUser?.email})`}
                >
                  <div className="w-5 h-5 rounded-full bg-brand-500 text-white flex items-center justify-center text-[10px] font-bold">
                    {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="max-w-[80px] truncate">{currentUser?.name?.split(' ')[0]}</span>
                </div>
                <button
                  type="button"
                  onClick={logout}
                  className={`p-2 rounded-xl text-xs transition-colors ${
                    isHomeTop
                      ? 'text-slate-300 hover:text-white hover:bg-white/10'
                      : 'text-slate-500 hover:text-rose-600 hover:bg-rose-50'
                  }`}
                  title="Sign Out"
                  aria-label="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link to="/users/login" className="pl-1">
                <Button
                  variant={isHomeTop ? 'ghost' : 'secondary'}
                  size="sm"
                  className={isHomeTop ? 'text-white hover:bg-white/10' : ''}
                >
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Trigger Button */}
          <div className="flex items-center lg:hidden gap-2">
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2.5 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                isHomeTop
                  ? 'text-white hover:bg-white/10'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation"
              aria-label={isMobileMenuOpen ? 'Close main navigation menu' : 'Open main navigation menu'}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div
            id="mobile-navigation"
            className={`lg:hidden mt-4 pt-4 border-t animate-fade-in ${
              isHomeTop
                ? 'border-white/10 bg-slate-950/95 text-white rounded-2xl p-4'
                : 'border-slate-200/80 bg-white text-slate-900'
            }`}
            role="region"
            aria-label="Mobile Navigation Menu"
          >
            {/* User Session Banner in Mobile Drawer */}
            {isAuthenticated ? (
              <div className={`p-3 rounded-2xl flex items-center justify-between mb-3 ${
                isHomeTop ? 'bg-white/10 text-white' : 'bg-slate-50 text-slate-900'
              }`}>
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                    {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-semibold truncate">{currentUser?.name}</span>
                    <span className="text-[11px] text-slate-400 truncate">{currentUser?.email}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={logout}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors flex-shrink-0"
                  title="Sign Out"
                  aria-label="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 mb-3">
                <Link to="/users/login" className="flex-1">
                  <Button variant={isHomeTop ? 'secondary' : 'secondary'} size="sm" className="w-full justify-center">
                    Sign In
                  </Button>
                </Link>
                <Link to="/users/register" className="flex-1">
                  <Button variant="outline" size="sm" className="w-full justify-center">
                    Register
                  </Button>
                </Link>
              </div>
            )}

            <div className="pb-3 mb-2 border-b border-slate-100/10 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-slate-400">Target Location:</span>
              <LocationIndicator className="text-xs" />
            </div>

            <nav className="flex flex-col gap-1 pb-3" aria-label="Mobile Navigation Links">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isHome = link.path === '/';
                const isActive = isHome
                  ? routerLocation.pathname === '/' && !routerLocation.hash
                  : routerLocation.pathname === link.path;

                return (
                  <NavLink
                    key={link.name}
                    to={link.path}
                    className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? isHomeTop
                          ? 'bg-white/20 text-white font-semibold'
                          : 'bg-brand-50 text-brand-700 font-semibold'
                        : isHomeTop
                        ? 'text-slate-200 hover:bg-white/10'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {Icon && <Icon className="w-4 h-4 opacity-70" />}
                      <span>{link.name}</span>
                    </div>
                    {link.badge && (
                      <span className="px-1.5 py-0.5 text-[10px] font-bold bg-amber-400 text-slate-950 rounded-full">
                        {link.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </nav>

            <div className={`pt-3 border-t flex flex-col gap-2 ${
              isHomeTop ? 'border-white/10' : 'border-slate-100'
            }`}>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <Link to="/contact" className="p-2.5 rounded-xl bg-slate-800/60 text-center font-medium hover:bg-slate-800">
                  Contact Us
                </Link>
                <Link to="/track-status" className="p-2.5 rounded-xl bg-slate-800/60 text-center font-medium hover:bg-slate-800">
                  Track Ticket
                </Link>
              </div>
              <Link to="/destinations" className="w-full mt-1">
                <Button variant="accent" size="md" className="w-full justify-center text-slate-950 font-bold">
                  Plan Trip with AI
                </Button>
              </Link>
            </div>
          </div>
        )}
      </Container>
    </header>
  );
};

export default Navbar;
