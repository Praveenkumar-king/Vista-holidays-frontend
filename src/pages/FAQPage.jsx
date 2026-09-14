import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  ChevronDown,
  Sparkles,
  UserCheck,
  MapPin,
  CloudSun,
  Bot,
  CalendarDays,
  Navigation,
  Bookmark,
  BellRing,
  Headphones,
  ShieldCheck,
  HelpCircle,
  Compass,
  ArrowRight,
  X,
  ChevronsDown,
  ChevronsUp,
  MessageSquare,
  HelpCircle as QuestionIcon
} from 'lucide-react';
import { Container } from '../components/layout/Container';
import { Button } from '../components/ui/Button';
import { FAQ_CATEGORIES, FAQ_ITEMS } from '../data/faqData';

// Map string icon names to Lucide component references
const CATEGORY_ICON_MAP = {
  Compass,
  Sparkles,
  UserCheck,
  MapPin,
  CloudSun,
  Bot,
  CalendarDays,
  Navigation,
  Bookmark,
  BellRing,
  Headphones,
  ShieldCheck,
  HelpCircle
};

export const FAQPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [openItems, setOpenItems] = useState(() => {
    // Open first 2 items by default on page load for immediate engagement
    return new Set(['gs-1', 'gs-2']);
  });

  const searchInputRef = useRef(null);

  // Set document title
  useEffect(() => {
    document.title = 'Frequently Asked Questions | Vista Holidays';
  }, []);

  // Compute question count per category for badges
  const categoryCounts = useMemo(() => {
    const counts = { all: FAQ_ITEMS.length };
    FAQ_ITEMS.forEach((item) => {
      counts[item.categoryId] = (counts[item.categoryId] || 0) + 1;
    });
    return counts;
  }, []);

  // Filter items by category and search query
  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return FAQ_ITEMS.filter((item) => {
      // Category filter
      if (selectedCategory !== 'all' && item.categoryId !== selectedCategory) {
        return false;
      }

      // Search filter
      if (!query) return true;

      const matchesQuestion = item.question.toLowerCase().includes(query);
      const matchesAnswer = item.answer.toLowerCase().includes(query);
      const matchesCategory = item.categoryName.toLowerCase().includes(query);
      const matchesTags = item.tags && item.tags.some((tag) => tag.toLowerCase().includes(query));

      return matchesQuestion || matchesAnswer || matchesCategory || matchesTags;
    });
  }, [searchQuery, selectedCategory]);

  // Toggle individual accordion item
  const toggleItem = (id) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Expand all currently filtered items
  const handleExpandAll = () => {
    setOpenItems(new Set(filteredItems.map((item) => item.id)));
  };

  // Collapse all items
  const handleCollapseAll = () => {
    setOpenItems(new Set());
  };

  // Clear search and reset category
  const handleClearSearch = () => {
    setSearchQuery('');
    searchInputRef.current?.focus();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-brand-500 selection:text-white">
      {/* 1. Branded Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-slate-800/80 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        {/* Subtle Background Glow */}
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-brand-600/15 blur-[120px] rounded-full pointer-events-none"
          aria-hidden="true" 
        />

        <Container size="xl" className="relative z-10 text-center">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-bold uppercase tracking-wider mb-6 backdrop-blur-sm animate-fade-in">
            <Compass className="w-3.5 h-3.5" />
            <span>Help Center &amp; Documentation</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-extrabold text-white tracking-tight leading-tight sm:leading-none max-w-4xl mx-auto mb-5">
            Frequently Asked <span className="text-brand-400">Questions</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Everything you need to know about Vista Holidays—from destination exploration and AI itineraries to weather forecasting and account security.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative flex items-center bg-slate-900/90 border border-slate-700/80 rounded-2xl shadow-float focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20 transition-all p-1.5 backdrop-blur-md">
              <div className="pl-4 pr-2 text-slate-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by topic, feature, or keyword (e.g. weather, verify, AI)..."
                className="w-full bg-transparent border-0 text-white placeholder-slate-400 text-sm sm:text-base focus:ring-0 focus:outline-none py-2.5 pr-3"
                aria-label="Search frequently asked questions"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors mr-1"
                  aria-label="Clear search query"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Live Search Stats */}
            <div className="flex items-center justify-between mt-3 px-2 text-xs text-slate-400">
              <span>
                Showing <strong className="text-white">{filteredItems.length}</strong> of {FAQ_ITEMS.length} questions
              </span>
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="text-brand-400 hover:underline font-medium"
                >
                  Clear search
                </button>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* 2. Main Content Area */}
      <section className="py-12 sm:py-16">
        <Container size="xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left Column: Category Navigation Tabs (Desktop Sticky Sidebar / Mobile Horizontal Scroll) */}
            <div className="lg:col-span-4 xl:col-span-3">
              <div className="sticky top-24 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">
                    Categories
                  </h2>
                  <span className="text-xs text-brand-400 font-semibold bg-brand-500/10 px-2 py-0.5 rounded-full border border-brand-500/20">
                    {FAQ_CATEGORIES.length - 1} Topics
                  </span>
                </div>

                {/* Horizontal scroll on mobile, vertical list on desktop */}
                <div className="flex lg:flex-col gap-2 overflow-x-auto pb-3 lg:pb-0 scrollbar-none">
                  {FAQ_CATEGORIES.map((category) => {
                    const IconComponent = CATEGORY_ICON_MAP[category.icon] || HelpCircle;
                    const isActive = selectedCategory === category.id;
                    const count = categoryCounts[category.id] || 0;

                    return (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl text-left text-sm font-medium transition-all flex-shrink-0 whitespace-nowrap lg:whitespace-normal ${
                          isActive
                            ? 'bg-brand-600 text-white shadow-md font-semibold'
                            : 'bg-slate-900/60 text-slate-400 hover:bg-slate-850 hover:text-white border border-slate-800/80'
                        }`}
                        aria-pressed={isActive}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <IconComponent className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-brand-400'}`} />
                          <span className="truncate">{category.name}</span>
                        </div>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-mono font-bold ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Quick Assistance Card */}
                <div className="hidden lg:block bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-5 mt-6 shadow-sm">
                  <div className="w-9 h-9 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 mb-3">
                    <Headphones className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">Still have questions?</h4>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    Our traveler support team is available to assist with bookings, itineraries, and technical inquiries.
                  </p>
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-400 hover:text-brand-300 group"
                  >
                    <span>Contact Support Team</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Column: Accordion Questions & Controls */}
            <div className="lg:col-span-8 xl:col-span-9">
              {/* Controls Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-6 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {selectedCategory === 'all'
                      ? 'All Topics'
                      : FAQ_CATEGORIES.find((c) => c.id === selectedCategory)?.name}
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-xs text-slate-400">
                    {filteredItems.length} {filteredItems.length === 1 ? 'result' : 'results'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleExpandAll}
                    iconLeft={ChevronsDown}
                    className="text-xs text-slate-400 hover:text-white border border-slate-800 hover:bg-slate-850"
                  >
                    Expand All
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCollapseAll}
                    iconLeft={ChevronsUp}
                    className="text-xs text-slate-400 hover:text-white border border-slate-800 hover:bg-slate-850"
                  >
                    Collapse All
                  </Button>
                </div>
              </div>

              {/* Accordion Questions List */}
              {filteredItems.length > 0 ? (
                <div className="space-y-3.5" role="region" aria-label="FAQ Accordion">
                  {filteredItems.map((item, index) => {
                    const isOpen = openItems.has(item.id);
                    const itemControlId = `faq-control-${item.id}`;
                    const itemContentId = `faq-content-${item.id}`;

                    return (
                      <div
                        key={item.id}
                        className={`border rounded-2xl transition-all duration-200 overflow-hidden ${
                          isOpen
                            ? 'bg-slate-900/90 border-slate-700 shadow-md ring-1 ring-brand-500/20'
                            : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700/80 hover:bg-slate-900/70'
                        }`}
                      >
                        <button
                          id={itemControlId}
                          type="button"
                          onClick={() => toggleItem(item.id)}
                          aria-expanded={isOpen}
                          aria-controls={itemContentId}
                          className="w-full flex items-start justify-between gap-4 p-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-2xl"
                        >
                          <div className="flex-1 pr-2">
                            {/* Category Pill */}
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-brand-400 border border-slate-700/60">
                                {item.categoryName}
                              </span>
                            </div>

                            <span className="text-base sm:text-lg font-display font-semibold text-white tracking-tight leading-snug">
                              {item.question}
                            </span>
                          </div>

                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 mt-0.5 ${
                              isOpen
                                ? 'bg-brand-600 text-white rotate-180'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                            aria-hidden="true"
                          >
                            <ChevronDown className="w-4 h-4" />
                          </div>
                        </button>

                        {/* Collapsible Answer Body */}
                        {isOpen && (
                          <div
                            id={itemContentId}
                            role="region"
                            aria-labelledby={itemControlId}
                            className="px-5 pb-5 pt-1 text-slate-300 text-sm sm:text-base leading-relaxed border-t border-slate-800/80 mt-1 animate-fade-in"
                          >
                            <p className="mt-2 text-slate-300">
                              {item.answer}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Empty Search State */
                <div className="text-center py-16 px-4 bg-slate-900/50 border border-slate-800 rounded-3xl animate-fade-in">
                  <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 mx-auto mb-4 border border-slate-700">
                    <QuestionIcon className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-display font-bold text-white mb-2">
                    0 questions found
                  </h3>
                  <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
                    No results matched your search "{searchQuery}". Try using broader keywords or explore all topics.
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleClearSearch}
                      className="text-slate-900 font-bold"
                    >
                      Reset Search
                    </Button>
                    <Link to="/contact">
                      <Button variant="primary" size="sm">
                        Contact Support
                      </Button>
                    </Link>
                  </div>
                </div>
              )}

              {/* Bottom Support Banner */}
              <div className="mt-12 bg-gradient-to-r from-brand-950 via-slate-900 to-brand-950 border border-brand-900/40 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-float">
                <div className="flex items-center gap-4 text-center sm:text-left">
                  <div className="w-12 h-12 rounded-2xl bg-brand-600 flex items-center justify-center text-white flex-shrink-0 shadow-glow mx-auto sm:mx-0">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-display font-bold text-white mb-1">
                      Need Personalized Travel Support?
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400">
                      Submit a support ticket or track an existing request in real-time.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0 w-full sm:w-auto">
                  <Link to="/contact" className="w-full sm:w-auto">
                    <Button variant="primary" size="md" className="w-full font-bold shadow-sm">
                      Submit Ticket
                    </Button>
                  </Link>
                  <Link to="/track-status" className="w-full sm:w-auto">
                    <Button variant="secondary" size="md" className="w-full text-slate-900 font-bold">
                      Track Status
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default FAQPage;
