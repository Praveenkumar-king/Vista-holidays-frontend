import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Heart, Globe, ArrowUpRight } from 'lucide-react';
import { Container } from './Container';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <Container size="xl" className="py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2 flex flex-col">
            <Link to="/" className="flex items-center gap-2.5 mb-4 group">
              <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-sm">
                <Compass className="w-5 h-5" />
              </div>
              <span className="font-display font-bold text-xl text-slate-900 tracking-tight">
                Vista <span className="text-brand-600">Holidays</span>
              </span>
            </Link>

            <p className="text-sm text-slate-500 max-w-sm leading-relaxed mb-6">
              A premium, intelligent travel companion providing curated destination insights, AI itineraries, and real-time exploration tools.
            </p>

            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>All systems operational & ready</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-xs uppercase tracking-wider text-slate-900 mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/destinations" className="text-slate-600 hover:text-brand-600 transition-colors">
                  Top Destinations
                </Link>
              </li>
              <li>
                <Link to="/#places" className="text-slate-600 hover:text-brand-600 transition-colors">
                  Famous Places
                </Link>
              </li>
              <li>
                <Link to="/weather" className="text-slate-600 hover:text-brand-600 transition-colors">
                  Weather Insights
                </Link>
              </li>
              <li>
                <Link to="/#itinerary" className="text-slate-600 hover:text-brand-600 transition-colors">
                  Itinerary Planner
                </Link>
              </li>
            </ul>
          </div>

          {/* Planning */}
          <div>
            <h4 className="font-semibold text-xs uppercase tracking-wider text-slate-900 mb-4">
              AI Tools
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/#assistant" className="text-slate-600 hover:text-brand-600 transition-colors">
                  AI Travel Assistant
                </Link>
              </li>
              <li>
                <Link to="/#itinerary" className="text-slate-600 hover:text-brand-600 transition-colors">
                  Smart Trip Builder
                </Link>
              </li>
              <li>
                <span className="text-slate-400 text-xs italic">
                  Weather Forecasts (Phase 2)
                </span>
              </li>
              <li>
                <span className="text-slate-400 text-xs italic">
                  Live Currency (Phase 2)
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-12 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {currentYear} Vista Holidays. All rights reserved.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Crafted for Frontend Developer Assessment</span>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
