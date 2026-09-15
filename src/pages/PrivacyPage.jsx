import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  ShieldCheck,
  Scale,
  Globe,
  Ban,
  AlertTriangle,
  Gavel,
  Sparkles,
  HelpCircle,
  FileText,
  Printer,
  Share2,
  ArrowRight,
  Search,
  ExternalLink,
  Lock,
  CheckCircle2,
  Clock,
  ArrowUp,
  Mail,
  Compass,
  ChevronRight,
  Info,
  Cookie,
  Shield,
  Copy,
  Check,
  X,
  Building2,
  UserCheck,
  Smartphone,
  Server,
  KeyRound
} from 'lucide-react';
import { Container } from '../components/layout/Container';
import { Button } from '../components/ui/Button';
import { useToast } from '../context/ToastContext';
import {
  PRIVACY_METADATA,
  PRIVACY_DEFINITIONS,
  PRIVACY_SECTIONS,
  COOKIE_CATEGORIES
} from '../data/termsData';

const ICON_MAP = {
  BookOpen,
  ShieldCheck,
  Scale,
  Globe,
  Ban,
  AlertTriangle,
  Gavel,
  Sparkles,
  HelpCircle,
  FileText,
  Lock,
  Building2,
  UserCheck,
  Smartphone,
  Server,
  Cookie,
  KeyRound
};

export const PrivacyPage = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeSectionId, setActiveSectionId] = useState('interpretation-definitions');
  const [copied, setCopied] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Set document title
  useEffect(() => {
    document.title = 'Privacy Policy | Vista Holidays';
  }, []);

  // Track scroll reading progress and active section
  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      setScrollProgress(scrolled);
      setShowBackToTop(winScroll > 400);

      const sections = PRIVACY_SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean);
      const scrollPosition = winScroll + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.offsetTop <= scrollPosition) {
          setActiveSectionId(section.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filter sections by search query
  const filteredSections = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return PRIVACY_SECTIONS;

    return PRIVACY_SECTIONS.filter((section) => {
      const matchTitle = section.title.toLowerCase().includes(query);
      const matchSummary = section.summary.toLowerCase().includes(query);
      const matchContent = section.content.some(
        (c) => c.subtitle.toLowerCase().includes(query) || c.text.toLowerCase().includes(query)
      );
      const matchDefs =
        section.showDefinitionsGrid &&
        PRIVACY_DEFINITIONS.some(
          (d) => d.term.toLowerCase().includes(query) || d.definition.toLowerCase().includes(query)
        );

      return matchTitle || matchSummary || matchContent || matchDefs;
    });
  }, [searchQuery]);

  // Smooth scroll to section
  const scrollToSection = (id) => {
    setActiveSectionId(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -90;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Print Document Action
  const handlePrint = () => {
    window.print();
  };

  // Copy Policy URL to clipboard
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success('Privacy Policy link copied to clipboard!', 'Link Shared');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.info('Share URL: ' + window.location.href, 'Policy Link');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 selection:bg-brand-500 selection:text-white pb-24">
      {/* 1. Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 z-[60] bg-transparent">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-brand-500 transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* 2. Hero Header */}
      <header className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white pt-10 pb-16 sm:pt-14 sm:pb-20 overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-emerald-600/15 blur-[120px] rounded-full pointer-events-none" />

        <Container size="xl" className="relative z-10">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-slate-400 mb-6" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-white transition-colors flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-brand-400" />
              <span>Home</span>
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className="text-slate-400">Legal &amp; Compliance</span>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className="text-emerald-300 font-semibold">{PRIVACY_METADATA.shortTitle}</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-2.5 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  Data Privacy Standard
                </span>

                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800/80 text-slate-300 border border-slate-700">
                  <Clock className="w-3 h-3 text-slate-400" />
                  Last Updated: {PRIVACY_METADATA.effectiveDate}
                </span>

                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  {PRIVACY_METADATA.status}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight text-white leading-[1.15] mb-4">
                Privacy Policy for <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-300 to-sky-200">Vista Holidays</span>
              </h1>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl font-sans">
                This Privacy Policy describes Our policies and procedures on the collection, use, and disclosure of Your personal information when You use the Application or the Website and tells You about Your privacy rights and how the law protects You.
              </p>

              <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-wrap gap-y-3 gap-x-6 text-xs text-slate-400">
                <div>
                  <span className="text-slate-400">Jurisdiction: </span>
                  <strong className="text-slate-200 font-semibold">{PRIVACY_METADATA.country}</strong>
                </div>
                <div className="hidden sm:block text-slate-700">•</div>
                <div>
                  <span className="text-slate-400">Read Duration: </span>
                  <strong className="text-slate-200 font-semibold">{PRIVACY_METADATA.estimatedReadTime}</strong>
                </div>
                <div className="hidden sm:block text-slate-700">•</div>
                <div>
                  <span className="text-slate-400">Platform Version: </span>
                  <strong className="text-slate-200 font-semibold">v{PRIVACY_METADATA.version}</strong>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center gap-2.5 lg:flex-col lg:items-end">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handlePrint}
                  iconLeft={Printer}
                  className="bg-slate-800/90 hover:bg-slate-700 text-white border-slate-700 shadow-sm text-xs font-semibold"
                  title="Print privacy policy"
                >
                  Print PDF
                </Button>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleCopyLink}
                  iconLeft={copied ? Check : Share2}
                  className="bg-slate-800/90 hover:bg-slate-700 text-white border-slate-700 shadow-sm text-xs font-semibold"
                  title="Copy link to clipboard"
                >
                  {copied ? 'Copied!' : 'Share Policy'}
                </Button>
              </div>

              <Link
                to="/contact"
                className="inline-flex items-center gap-1.5 text-xs text-emerald-300 hover:text-emerald-200 font-semibold transition-colors mt-2"
              >
                <span>Have data rights questions? Contact Support</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mt-10 flex items-center gap-2 border-b border-slate-800 overflow-x-auto scrollbar-none pb-px">
            <Link
              to="/terms"
              className="flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/20 rounded-t-xl transition-all whitespace-nowrap"
            >
              <FileText className="w-4 h-4 text-brand-400" />
              <span>Terms &amp; Conditions</span>
            </Link>

            <button
              className="flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 border-emerald-400 text-white bg-slate-800/50 rounded-t-xl transition-all whitespace-nowrap cursor-default"
            >
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>Privacy Policy</span>
            </button>

            <Link
              to="/cookie-policy"
              className="flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/20 rounded-t-xl transition-all whitespace-nowrap"
            >
              <Cookie className="w-4 h-4 text-amber-400" />
              <span>Cookie Policy</span>
            </Link>
          </div>
        </Container>
      </header>

      {/* 3. Main Content Section */}
      <main className="py-10 sm:py-14">
        <Container size="xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column: Table of Contents & Search */}
            <aside className="lg:col-span-4 xl:col-span-3">
              <div className="sticky top-20 space-y-6">
                {/* Search in Privacy */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-subtle">
                  <label htmlFor="privacy-search" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Search In Privacy Policy
                  </label>
                  <div className="relative flex items-center">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                    <input
                      id="privacy-search"
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search privacy topics (e.g. erasure, cookies, sharing)..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-8 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2.5 text-slate-400 hover:text-slate-600 p-1"
                        title="Clear search"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  {searchQuery && (
                    <p className="text-[11px] text-emerald-600 font-semibold mt-2">
                      Found {filteredSections.length} matching section{filteredSections.length !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>

                {/* Table of Contents */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-subtle">
                  <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Table of Contents
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      {PRIVACY_SECTIONS.length} Sections
                    </span>
                  </div>

                  <nav className="space-y-1 max-h-[55vh] overflow-y-auto pr-1 text-xs font-medium">
                    {PRIVACY_SECTIONS.map((section, idx) => {
                      const isActive = activeSectionId === section.id;
                      return (
                        <button
                          key={section.id}
                          onClick={() => scrollToSection(section.id)}
                          className={`w-full text-left px-3 py-2 rounded-xl transition-all flex items-center justify-between group ${
                            isActive
                              ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200/60 shadow-xs'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                          }`}
                        >
                          <span className="truncate pr-2">
                            <span className="text-slate-400 mr-1.5 font-mono text-[10px]">
                              {(idx + 1).toString().padStart(2, '0')}
                            </span>
                            {section.navTitle}
                          </span>
                          <ChevronRight
                            className={`w-3.5 h-3.5 transition-transform flex-shrink-0 ${
                              isActive ? 'text-emerald-600 translate-x-0.5' : 'text-slate-300 group-hover:text-slate-400'
                            }`}
                          />
                        </button>
                      );
                    })}
                  </nav>
                </div>

                {/* Quick Assistance Card */}
                <div className="bg-gradient-to-br from-emerald-700 to-teal-900 rounded-2xl p-5 text-white shadow-card">
                  <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center mb-3">
                    <Lock className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="font-bold text-sm mb-1 font-display">Data Privacy Desk</h4>
                  <p className="text-xs text-emerald-100 mb-4 leading-relaxed font-sans">
                    Need to request account data export or exercise your right to erasure? Our data controller team is here to assist.
                  </p>
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center gap-1.5 w-full bg-white hover:bg-emerald-50 text-emerald-950 text-xs font-bold py-2 px-3 rounded-xl transition-colors shadow-sm"
                  >
                    <span>Contact Privacy Desk</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </aside>

            {/* Right Column: Full Privacy Sections */}
            <div className="lg:col-span-8 xl:col-span-9 space-y-8">
              {/* Notice Alert Card */}
              <div className="bg-emerald-500/10 border-2 border-emerald-500/30 rounded-3xl p-6 sm:p-7 shadow-subtle flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-emerald-950 font-display mb-1.5">
                    Your Privacy Rights at Vista Holidays
                  </h2>
                  <p className="text-xs sm:text-sm text-emerald-900/90 leading-relaxed font-sans">
                    We value your personal trust and ensure that all travel itineraries, search queries, profile credentials, and session tokens are encrypted and handled in strict accordance with the Information Technology Laws of India.
                  </p>
                </div>
              </div>

              {filteredSections.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-card">
                  <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-slate-800 mb-1 font-display">No Clauses Found</h3>
                  <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
                    No matching clauses were found for "{searchQuery}". Try searching for words like "erasure", "cookies", "transfer", or "retention".
                  </p>
                  <Button variant="secondary" size="sm" onClick={() => setSearchQuery('')}>
                    Clear Search Query
                  </Button>
                </div>
              ) : (
                filteredSections.map((section) => {
                  const IconComponent = ICON_MAP[section.iconName] || Lock;

                  return (
                    <article
                      key={section.id}
                      id={section.id}
                      className="bg-white rounded-3xl border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all p-6 sm:p-8 relative scroll-mt-24"
                    >
                      {/* Section Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 mb-6 border-b border-slate-100">
                        <div className="flex items-center gap-3.5">
                          <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0 shadow-xs">
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <div>
                            <h2 className="text-lg sm:text-xl font-bold font-display text-slate-900 tracking-tight">
                              {section.title}
                            </h2>
                            <p className="text-xs text-slate-500 font-sans mt-0.5">
                              {section.summary}
                            </p>
                          </div>
                        </div>

                        {section.badge && (
                          <span className="self-start sm:self-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                            {section.badge}
                          </span>
                        )}
                      </div>

                      {/* Section Content Paragraphs */}
                      <div className="space-y-4 text-sm text-slate-600 leading-relaxed font-sans">
                        {section.content.map((item, idx) => (
                          <div key={idx} className="space-y-1.5">
                            {item.subtitle && (
                              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                                {item.subtitle}
                              </h3>
                            )}

                            {item.highlight ? (
                              <div
                                className={`p-4 rounded-2xl border text-xs sm:text-sm font-medium leading-relaxed my-2 ${
                                  item.highlightType === 'warning'
                                    ? 'bg-rose-50 border-rose-200 text-rose-900'
                                    : 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                                }`}
                              >
                                {item.text}
                              </div>
                            ) : (
                              <p className="text-slate-700">{item.text}</p>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Special Block: Definitions Grid (Section 1) */}
                      {section.showDefinitionsGrid && (
                        <div className="mt-6 pt-6 border-t border-slate-100">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                            Privacy Definitions Catalog ({PRIVACY_DEFINITIONS.length} Key Terms)
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            {PRIVACY_DEFINITIONS.map((def) => (
                              <div
                                key={def.term}
                                className="p-4 rounded-2xl bg-slate-50/90 border border-slate-200/70 hover:border-emerald-300 hover:bg-white transition-all group shadow-xs"
                              >
                                <span className="inline-block font-bold text-xs text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md mb-2 group-hover:bg-emerald-100">
                                  {def.term}
                                </span>
                                <p className="text-xs text-slate-600 leading-relaxed">
                                  {def.definition}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Special Block: Personal Data List (Section 2) */}
                      {section.showPersonalDataList && section.personalDataItems && (
                        <div className="mt-5 p-5 bg-slate-50/90 border border-slate-200/80 rounded-2xl">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Categories of Personal Information Requested:</span>
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {section.personalDataItems.map((item, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-2 text-xs font-medium text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200/60"
                              >
                                <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                                <span>{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Special Block: Cookie Categories Grid (Section 4) */}
                      {section.showCookieCategoriesGrid && (
                        <div className="mt-6 pt-6 border-t border-slate-100">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                            Platform Cookie Categories
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                            {COOKIE_CATEGORIES.map((cookie, idx) => (
                              <div
                                key={idx}
                                className="p-4 rounded-2xl bg-slate-50/90 border border-slate-200/70 hover:border-emerald-300 hover:bg-white transition-all shadow-xs"
                              >
                                <span className="inline-block text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md mb-2">
                                  {cookie.type}
                                </span>
                                <h5 className="text-xs font-bold text-slate-900 mb-1">
                                  {cookie.name}
                                </h5>
                                <p className="text-xs text-slate-600 leading-relaxed">
                                  {cookie.description}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Special Block: Contact Us (Section 15) */}
                      {section.showContactCard && (
                        <div className="mt-6 pt-6 border-t border-slate-100">
                          <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-2xl p-6 shadow-float border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
                            <div className="space-y-2 text-center sm:text-left">
                              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                                Official Privacy &amp; Data Portal
                              </span>
                              <h4 className="text-lg font-bold font-display text-white">
                                Contact If Any Queries
                              </h4>
                              <p className="text-xs text-slate-300 max-w-md">
                                Exercise your right to inspect, correct, or erase personal data by opening a ticket with our compliance desk.
                              </p>
                              <p className="text-xs text-slate-400 flex items-center justify-center sm:justify-start gap-1.5 pt-1">
                                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Email: <strong className="text-white">{PRIVACY_METADATA.supportEmail}</strong></span>
                              </p>
                            </div>

                            <Link
                              to="/contact"
                              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-lg flex-shrink-0 group"
                            >
                              <span>Contact Support Desk</span>
                              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                          </div>
                        </div>
                      )}

                      {/* Special Block: View Other Legal Policies (Section 16) */}
                      {section.showOtherPoliciesCard && (
                        <div className="mt-6 pt-6 border-t border-slate-100">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                            View Other Legal Policies
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                            {/* 1. Privacy Policy */}
                            <button
                              type="button"
                              onClick={() => scrollToSection('interpretation-definitions')}
                              className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 hover:bg-emerald-100/60 transition-all text-left group flex flex-col justify-between"
                            >
                              <div>
                                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-2.5 shadow-xs">
                                  <Lock className="w-4 h-4" />
                                </div>
                                <span className="font-bold text-xs text-emerald-900 block mb-1">
                                  ➔ View Privacy Policy
                                </span>
                                <p className="text-[11px] text-emerald-800/80 leading-snug">
                                  Active document explaining user data rights, encryption protocols, and telemetry storage.
                                </p>
                              </div>
                              <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1 mt-3 group-hover:underline">
                                Active View <ArrowUp className="w-3 h-3" />
                              </span>
                            </button>

                            {/* 2. Terms & Conditions */}
                            <Link
                              to="/terms"
                              className="p-4 rounded-2xl bg-brand-50/60 border border-brand-200/80 hover:bg-brand-100/60 transition-all text-left group flex flex-col justify-between"
                            >
                              <div>
                                <div className="w-8 h-8 rounded-xl bg-brand-600 text-white flex items-center justify-center mb-2.5 shadow-xs">
                                  <FileText className="w-4 h-4" />
                                </div>
                                <span className="font-bold text-xs text-brand-900 block mb-1">
                                  ➔ View Terms &amp; Conditions
                                </span>
                                <p className="text-[11px] text-brand-800/80 leading-snug">
                                  Governing contract on traveler liability, age requirements, and service warranties.
                                </p>
                              </div>
                              <span className="text-[11px] font-bold text-brand-700 flex items-center gap-1 mt-3 group-hover:underline">
                                Read Terms <ArrowRight className="w-3 h-3" />
                              </span>
                            </Link>

                            {/* 3. Cookie Policy */}
                            <Link
                              to="/cookie-policy"
                              className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 hover:bg-amber-100/60 transition-all text-left group flex flex-col justify-between"
                            >
                              <div>
                                <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center mb-2.5 shadow-xs">
                                  <Cookie className="w-4 h-4" />
                                </div>
                                <span className="font-bold text-xs text-amber-900 block mb-1">
                                  ➔ View Cookie Policy
                                </span>
                                <p className="text-[11px] text-amber-800/80 leading-snug">
                                  Guidelines on session tokens, persistent preferences, and third-party analytics.
                                </p>
                              </div>
                              <span className="text-[11px] font-bold text-amber-700 flex items-center gap-1 mt-3 group-hover:underline">
                                Read Policy <ArrowRight className="w-3 h-3" />
                              </span>
                            </Link>
                          </div>
                        </div>
                      )}
                    </article>
                  );
                })
              )}
            </div>
          </div>
        </Container>
      </main>

      {/* 4. Floating Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-40 p-3 rounded-2xl bg-slate-900 hover:bg-emerald-600 text-white shadow-float transition-all duration-200 hover:scale-105 active:scale-95 group"
          aria-label="Back to top of document"
          title="Back to Top"
        >
          <ArrowUp className="w-5 h-5 transition-transform group-hover:-translate-y-0.5" />
        </button>
      )}
    </div>
  );
};

export default PrivacyPage;
