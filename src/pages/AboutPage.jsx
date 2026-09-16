import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  Globe,
  Sparkles,
  CalendarDays,
  CloudSun,
  Luggage,
  CreditCard,
  Receipt,
  Headphones,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Target,
  Eye,
  Zap,
  Server,
  Database,
  Code2,
  Cpu,
  Lock,
  Layers,
  Bot,
  MapPin,
  Clock,
  Sparkle
} from 'lucide-react';
import { Container } from '../components/layout/Container';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { useTravelAssistant } from '../hooks/useTravelAssistant';

// Platform Technologies actually used in Vista Holidays
const TECHNOLOGIES = [
  { name: 'React 18', role: 'Frontend UI Engine', icon: Code2, category: 'Frontend' },
  { name: 'Vite', role: 'Next-Gen Build Tool', icon: Zap, category: 'Tooling' },
  { name: 'Tailwind CSS', role: 'Design System & Utility UI', icon: Layers, category: 'Styling' },
  { name: 'Node.js', role: 'Server Runtime Environment', icon: Server, category: 'Backend' },
  { name: 'Express.js', role: 'RESTful API Architecture', icon: Server, category: 'Backend' },
  { name: 'MongoDB', role: 'Database & Data Modeling', icon: Database, category: 'Database' },
  { name: 'Gemini AI', role: 'Intelligent Travel Concierge', icon: Bot, category: 'AI' },
  { name: 'OpenWeather', role: 'Live Weather Telemetry', icon: CloudSun, category: 'Weather' },
  { name: 'Pexels', role: 'Curated Landscape Photography', icon: Globe, category: 'Media' },
  { name: 'Razorpay', role: 'Payment Gateway Integration', icon: CreditCard, category: 'Payments' },
  { name: 'Cloudinary', role: 'Cloud Asset Optimization', icon: Layers, category: 'Media' },
  { name: 'Brevo SMTP', role: 'Transactional Email Service', icon: Headphones, category: 'Communication' }
];

// Core Platform Offerings
const OFFERINGS = [
  {
    icon: Globe,
    title: 'Destination Discovery',
    description: 'Explore curated global destinations and discover iconic landmarks and famous places with rich cultural insights.',
    tag: 'Explore',
    accentColor: 'from-blue-500/10 to-brand-500/10 text-brand-600 border-brand-200/60'
  },
  {
    icon: Bot,
    title: 'AI Travel Assistant',
    description: 'Get instant, intelligent travel guidance, local tips, packing recommendations, and destination assistance from Gemini AI.',
    tag: 'Intelligent',
    accentColor: 'from-purple-500/10 to-indigo-500/10 text-purple-600 border-purple-200/60'
  },
  {
    icon: CalendarDays,
    title: 'AI Itinerary Planning',
    description: 'Generate personalized, day-by-day travel schedules structured around your travel style, budget, and stay duration.',
    tag: 'Personalized',
    accentColor: 'from-amber-500/10 to-orange-500/10 text-amber-600 border-amber-200/60'
  },
  {
    icon: CloudSun,
    title: 'Real-Time Weather',
    description: 'Check live weather conditions, temperatures, humidity, and forecasts to pack smartly and pick optimal travel windows.',
    tag: 'Live Data',
    accentColor: 'from-emerald-500/10 to-teal-500/10 text-emerald-600 border-emerald-200/60'
  },
  {
    icon: Luggage,
    title: 'Travel Booking',
    description: 'Choose flexible packages, select travelers, choose trip durations, and view transparent dynamic pricing calculations.',
    tag: 'Seamless',
    accentColor: 'from-brand-500/10 to-cyan-500/10 text-brand-600 border-brand-200/60'
  },
  {
    icon: CreditCard,
    title: 'Secure Payments',
    description: 'Complete reservations with confidence through enterprise-grade Razorpay payment integration and instant receipts.',
    tag: 'Encrypted',
    accentColor: 'from-rose-500/10 to-pink-500/10 text-rose-600 border-rose-200/60'
  },
  {
    icon: Receipt,
    title: 'Booking Management',
    description: 'Access, monitor, and manage your active and past travel reservations easily through the dedicated My Bookings hub.',
    tag: 'Dashboard',
    accentColor: 'from-indigo-500/10 to-blue-500/10 text-indigo-600 border-indigo-200/60'
  },
  {
    icon: Headphones,
    title: 'Travel Support',
    description: 'Contact our operations desk, share traveler feedback, and track support tickets with transparent progression timelines.',
    tag: 'Dedicated',
    accentColor: 'from-teal-500/10 to-emerald-500/10 text-teal-600 border-teal-200/60'
  }
];

// Why Vista Holidays Value Pillars
const VALUE_PILLARS = [
  {
    title: 'Smart Travel Planning',
    description: 'Technology-assisted trip preparation that eliminates guesswork through structured insights and AI itineraries.',
    icon: Zap
  },
  {
    title: 'Personalized Experiences',
    description: 'Custom travel information, recommendations, and schedules tailored directly to individual traveler needs.',
    icon: Target
  },
  {
    title: 'Real-Time Information',
    description: 'Current meteorological conditions and up-to-date landmark data available whenever you need them.',
    icon: CloudSun
  },
  {
    title: 'Connected Journey',
    description: 'Discovery, AI planning, and verified booking united seamlessly inside a single high-performance platform.',
    icon: Globe
  },
  {
    title: 'Secure Experience',
    description: 'Protected user sessions, cryptographic token authentication, and secure payment processing at every step.',
    icon: Lock
  },
  {
    title: 'Continuous Improvement',
    description: 'Regular product updates, performance enhancements, and platform announcements to ensure ongoing quality.',
    icon: Sparkles
  }
];

// 4-Step How It Works Journey
const JOURNEY_STEPS = [
  {
    number: '01',
    title: 'Discover',
    subtitle: 'Explore Destinations & Landmarks',
    description: 'Browse curated world destinations, filter by region and travel category, and examine famous landmarks with historical overviews.'
  },
  {
    number: '02',
    title: 'Plan',
    subtitle: 'AI Itinerary & Live Telemetry',
    description: 'Leverage our Gemini AI assistant to craft day-by-day itineraries and inspect real-time weather forecasts before your trip.'
  },
  {
    number: '03',
    title: 'Book',
    subtitle: 'Packages & Secure Checkout',
    description: 'Select your preferred package tier, customize traveler count and duration, and complete checkout securely with Razorpay.'
  },
  {
    number: '04',
    title: 'Experience',
    subtitle: 'Manage & Embark',
    description: 'Access complete booking confirmations in My Bookings, track support inquiries, and enjoy an unforgettable, informed adventure.'
  }
];

// Experience Highlights
const HIGHLIGHTS = [
  { label: 'AI-Powered Planning', desc: 'Gemini AI Assistant & Itineraries', icon: Bot },
  { label: 'Real-Time Weather', desc: 'Live OpenWeather Telemetry', icon: CloudSun },
  { label: 'Secure Online Booking', desc: 'Razorpay Payment Gateway', icon: ShieldCheck },
  { label: 'Personalized Dashboard', desc: 'Trips, Bookings & Preferences', icon: Compass },
  { label: 'Cloud-Powered Media', desc: 'Fast, Optimized Photography', icon: Layers },
  { label: 'Integrated Support', desc: 'Trackable Tickets & Inquiries', icon: Headphones }
];

export const AboutPage = () => {
  const { openAssistant } = useTravelAssistant();
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const videoRef = useRef(null);

  // Reduced motion preference detection
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Video playback controller
  useEffect(() => {
    if (videoRef.current) {
      if (prefersReducedMotion) {
        videoRef.current.pause();
      } else {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Autoplay permitted or handled
          });
        }
      }
    }
  }, [prefersReducedMotion]);

  // Update meta description for SEO
  useEffect(() => {
    const metaDesc = document.querySelector('meta[name="description"]');
    const prevDesc = metaDesc ? metaDesc.getAttribute('content') : '';
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Learn about Vista Holidays, an AI-powered travel platform designed to make destination discovery, travel planning, real-time information, and booking simple and connected.'
      );
    }
    return () => {
      if (metaDesc && prevDesc) {
        metaDesc.setAttribute('content', prevDesc);
      }
    };
  }, []);

  const handleStartPlanning = () => {
    openAssistant('Hello! I am exploring Vista Holidays. Can you suggest an inspiring travel itinerary and recommend top worldwide destinations?');
  };

  return (
    <div className="flex flex-col bg-slate-50 text-slate-900 selection:bg-brand-500 selection:text-white pb-24">
      {/* ========================================================================= */}
      {/* 1. CINEMATIC HERO SECTION                                                 */}
      {/* ========================================================================= */}
      <section
        id="about-hero"
        aria-label="About Vista Holidays Hero"
        className="relative w-full min-h-[75vh] lg:min-h-[82vh] flex items-center justify-center overflow-hidden bg-slate-950 text-white"
      >
        {/* Background Visual Layer */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
          {/* Ambient Lighting & Color Accents */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-brand-950">
            <div className="absolute top-1/4 -left-20 w-96 h-96 bg-brand-600/20 rounded-full blur-[120px] animate-pulse-subtle" />
            <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-amber-500/15 rounded-full blur-[140px] animate-pulse-subtle" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(14,135,234,0.18),rgba(255,255,255,0))]" />
          </div>

          {/* Looping HTML5 Background Video */}
          {!videoError && !prefersReducedMotion && (
            <video
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              onLoadedData={() => setVideoLoaded(true)}
              onError={() => setVideoError(true)}
              className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 scale-105 ${
                videoLoaded ? 'opacity-65' : 'opacity-0'
              }`}
              aria-hidden="true"
            >
              <source src="/videos/hero-travel.mp4" type="video/mp4" />
            </video>
          )}

          {/* Directional Overlay Gradients for High Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/65 to-slate-950/75" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-slate-950/70" />
        </div>

        {/* Hero Content */}
        <Container size="xl" className="relative z-10 pt-20 pb-20 sm:pt-24 sm:pb-24 lg:py-28 flex flex-col items-center text-center">
          <div className="max-w-3xl flex flex-col items-center">
            {/* Small Pill Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold uppercase tracking-wider text-brand-300 mb-6 shadow-sm">
              <Compass className="w-3.5 h-3.5 text-brand-400" />
              <span>About Vista Holidays</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight mb-6">
              Travel. Discover.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 via-brand-400 to-amber-300">
                Experience.
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg lg:text-xl text-slate-200 leading-relaxed max-w-2xl mb-10 font-normal">
              Discover how Vista Holidays brings destination discovery, intelligent travel planning, real-time information, and seamless booking together in one modern travel experience.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Link to="/destinations" className="w-full sm:w-auto">
                <Button
                  variant="primary"
                  size="lg"
                  iconRight={ArrowRight}
                  className="w-full sm:w-auto shadow-glow font-semibold"
                >
                  Explore Destinations
                </Button>
              </Link>
              <Button
                variant="secondary"
                size="lg"
                iconLeft={Sparkles}
                onClick={handleStartPlanning}
                className="w-full sm:w-auto font-semibold bg-white/15 text-white hover:bg-white/25 border-white/20 backdrop-blur-xs"
              >
                Start Planning
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* 2. BRAND STORY SECTION                                                    */}
      {/* ========================================================================= */}
      <section className="py-20 lg:py-28 bg-white border-b border-slate-200/80">
        <Container size="xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 flex flex-col">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-600 mb-3">
                <Sparkles className="w-4 h-4" />
                <span>Our Story</span>
              </div>

              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
                Travel Planning Reimagined in One Connected Platform
              </h2>

              <div className="space-y-4 text-base sm:text-lg text-slate-600 leading-relaxed">
                <p>
                  Vista Holidays was created with a simple idea:{' '}
                  <strong className="text-slate-900 font-semibold">
                    Travel planning should be easier, smarter, and more enjoyable.
                  </strong>
                </p>
                <p>
                  Instead of moving between multiple disconnected platforms to research destinations, check weather forecasts, plan daily itineraries, ask travel questions, and manage reservations, Vista Holidays brings these experiences together in one connected platform.
                </p>
                <p>
                  By combining rich worldwide destination insights, live meteorological telemetry from OpenWeather, intelligent generative assistance from Gemini AI, and secure online bookings with Razorpay, we empower travelers to make better, more confident decisions from initial discovery to journey's end.
                </p>
              </div>

              {/* Four Trust Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-slate-100">
                <div className="flex flex-col">
                  <span className="font-display text-xl font-bold text-brand-600">Global</span>
                  <span className="text-xs text-slate-500 mt-0.5">Worldwide Destinations</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-display text-xl font-bold text-brand-600">Real-Time</span>
                  <span className="text-xs text-slate-500 mt-0.5">Live Weather Telemetry</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-display text-xl font-bold text-brand-600">AI-Guided</span>
                  <span className="text-xs text-slate-500 mt-0.5">Intelligent Itineraries</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-display text-xl font-bold text-brand-600">Verified</span>
                  <span className="text-xs text-slate-500 mt-0.5">Encrypted Bookings</span>
                </div>
              </div>
            </div>

            {/* Right Visual Graphic Card */}
            <div className="lg:col-span-5">
              <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white shadow-card overflow-hidden border border-slate-800">
                {/* Background Ambient Glow */}
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-brand-500/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl" />

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                    <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-sm">
                      <Compass className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-base text-white">Vista Holidays Core Pillars</h3>
                      <p className="text-xs text-slate-400">Integrated Travel Ecosystem</p>
                    </div>
                  </div>

                  <ul className="space-y-4">
                    <li className="flex items-start gap-3.5 p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                      <Globe className="w-5 h-5 text-brand-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-bold text-white">Curated Destination Catalog</h4>
                        <p className="text-xs text-slate-300 mt-0.5">Famous landmarks, cultural guides, and rich travel metadata.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3.5 p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                      <Bot className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-bold text-white">AI Travel Concierge</h4>
                        <p className="text-xs text-slate-300 mt-0.5">Gemini AI provides context-aware guidance and instant itineraries.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3.5 p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                      <CloudSun className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-bold text-white">Live Meteorological Data</h4>
                        <p className="text-xs text-slate-300 mt-0.5">Real-time weather insights, humidity, and seasonal forecasts.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3.5 p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                      <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-bold text-white">Secure End-to-End Booking</h4>
                        <p className="text-xs text-slate-300 mt-0.5">Razorpay checkout, customer portal, and email notifications.</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* 3. MISSION & VISION SECTION                                               */}
      {/* ========================================================================= */}
      <section className="py-20 lg:py-28 bg-slate-50 border-b border-slate-200/80">
        <Container size="xl">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-brand-600 mb-2">
              <Target className="w-3.5 h-3.5" />
              <span>Purpose &amp; Ambition</span>
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Guided by a Clear Mission and Vision
            </h2>
            <p className="text-sm sm:text-base text-slate-500 mt-3 leading-relaxed">
              Every feature we build is designed to make global exploration more accessible, informed, and seamless.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {/* Our Mission Card */}
            <Card variant="default" className="p-8 sm:p-10 border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600 mb-6 shadow-xs">
                  <Target className="w-7 h-7" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600 block mb-2">
                  Our Mission
                </span>
                <h3 className="font-display text-2xl font-bold text-slate-900 tracking-tight mb-4">
                  Informed, Personal &amp; Seamless Planning
                </h3>
                <p className="text-base text-slate-600 leading-relaxed mb-6">
                  To make travel planning more personal, informed, and seamless by combining modern technology with the excitement of discovering the world.
                </p>
              </div>

              <div className="pt-6 border-t border-slate-100 flex flex-wrap gap-2 text-xs font-semibold text-slate-700">
                <span className="px-3 py-1.5 rounded-xl bg-brand-50 text-brand-700">Personalized Insights</span>
                <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700">Informed Decisions</span>
                <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700">Seamless Journey</span>
              </div>
            </Card>

            {/* Our Vision Card */}
            <Card variant="default" className="p-8 sm:p-10 border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 mb-6 shadow-xs">
                  <Eye className="w-7 h-7" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 block mb-2">
                  Our Vision
                </span>
                <h3 className="font-display text-2xl font-bold text-slate-900 tracking-tight mb-4">
                  A Smarter, Connected Travel Future
                </h3>
                <p className="text-base text-slate-600 leading-relaxed mb-6">
                  To build a smarter travel experience where discovering destinations, planning journeys, and booking adventures feel simple, connected, and personalized.
                </p>
              </div>

              <div className="pt-6 border-t border-slate-100 flex flex-wrap gap-2 text-xs font-semibold text-slate-700">
                <span className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700">Unified Architecture</span>
                <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700">Intelligent Guidance</span>
                <span className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700">Memorable Adventures</span>
              </div>
            </Card>
          </div>
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* 4. WHAT VISTA HOLIDAYS OFFERS                                             */}
      {/* ========================================================================= */}
      <section className="py-20 lg:py-28 bg-white border-b border-slate-200/80">
        <Container size="xl">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-brand-600 mb-2">
              <Layers className="w-3.5 h-3.5" />
              <span>Comprehensive Capabilities</span>
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Everything You Need for Your Next Journey
            </h2>
            <p className="text-sm sm:text-base text-slate-500 mt-3 leading-relaxed">
              Explore the core features crafted to guide you through every step of your travel experience.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {OFFERINGS.map((offering) => {
              const Icon = offering.icon;
              return (
                <div
                  key={offering.title}
                  className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-subtle hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${offering.accentColor} flex items-center justify-center border shadow-xs`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                        {offering.tag}
                      </span>
                    </div>

                    <h3 className="font-display text-lg font-bold text-slate-900 tracking-tight mb-2">
                      {offering.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                      {offering.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* 5. WHY VISTA HOLIDAYS                                                     */}
      {/* ========================================================================= */}
      <section className="py-20 lg:py-28 bg-slate-50 border-b border-slate-200/80">
        <Container size="xl">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-brand-600 mb-2">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>The Vista Advantage</span>
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Why Vista Holidays?
            </h2>
            <p className="text-sm sm:text-base text-slate-500 mt-3 leading-relaxed">
              Designed for modern travelers who value clarity, confidence, and intelligent planning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {VALUE_PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="p-7 rounded-2xl bg-white border border-slate-200/80 shadow-subtle hover:shadow-card hover:border-slate-300 transition-all duration-200 flex flex-col"
                >
                  <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600 mb-4 shadow-xs">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-slate-900 tracking-tight mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* 6. HOW IT WORKS (Horizontal Stepper on Desktop, Vertical on Mobile)       */}
      {/* ========================================================================= */}
      <section className="py-20 lg:py-28 bg-white border-b border-slate-200/80">
        <Container size="xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-brand-600 mb-2">
              <Clock className="w-3.5 h-3.5" />
              <span>Simple 4-Step Process</span>
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              How It Works
            </h2>
            <p className="text-sm sm:text-base text-slate-500 mt-3 leading-relaxed">
              From initial inspiration to departure, your journey is streamlined in four intuitive steps.
            </p>
          </div>

          {/* Stepper Grid with Connector */}
          <div className="relative">
            {/* Desktop Connector Line */}
            <div className="hidden lg:block absolute top-7 left-12 right-12 h-0.5 bg-gradient-to-r from-brand-200 via-brand-400 to-emerald-300 z-0" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
              {JOURNEY_STEPS.map((step) => (
                <div key={step.number} className="flex flex-col items-start bg-slate-50/60 lg:bg-transparent p-6 lg:p-0 rounded-2xl lg:rounded-none border lg:border-none border-slate-200/60">
                  {/* Number Badge */}
                  <div className="w-14 h-14 rounded-2xl bg-white border-2 border-brand-500 text-brand-600 font-display font-extrabold text-lg flex items-center justify-center shadow-md mb-5">
                    {step.number}
                  </div>

                  <h3 className="font-display text-xl font-bold text-slate-900 tracking-tight mb-1">
                    {step.title}
                  </h3>
                  <span className="text-xs font-semibold text-brand-600 uppercase tracking-wider mb-2.5">
                    {step.subtitle}
                  </span>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* 7. TECHNOLOGY SECTION                                                     */}
      {/* ========================================================================= */}
      <section className="py-20 lg:py-28 bg-slate-900 text-white border-b border-slate-800 relative overflow-hidden">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

        <Container size="xl" className="relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-brand-400 mb-2">
              <Cpu className="w-3.5 h-3.5" />
              <span>Engineering Excellence</span>
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Powered by Modern Technology
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-3 leading-relaxed">
              Vista Holidays is engineered with modern, full-stack tools to ensure lightning-fast discovery, resilience, and security.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {TECHNOLOGIES.map((tech) => {
              const Icon = tech.icon;
              return (
                <div
                  key={tech.name}
                  className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-brand-400/50 transition-all duration-200 flex items-center gap-3.5 shadow-sm"
                >
                  <div className="w-10 h-10 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center flex-shrink-0 border border-brand-400/20">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-white truncate">{tech.name}</div>
                    <div className="text-[11px] text-slate-400 truncate">{tech.role}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* 8. TRUST & PLATFORM INTEGRITY SECTION                                     */}
      {/* ========================================================================= */}
      <section className="py-20 lg:py-28 bg-white border-b border-slate-200/80">
        <Container size="xl">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-brand-600 mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Platform Integrity</span>
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-6">
              Built for Better Travel Decisions
            </h2>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto mb-12">
              Vista Holidays bridges the gap between trip inspiration and practical reality. By synthesizing verified destination information, real-time weather alerts, generative AI assistance, secure booking reservations, user account tracking, and customer ticket resolution, our platform provides a single trustworthy environment for all your travel requirements.
            </p>

            {/* Experience Highlights Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 text-left">
              {HIGHLIGHTS.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 shadow-xs flex items-start gap-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-brand-100/80 text-brand-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 leading-snug">{item.label}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* 9. FINAL CALL TO ACTION                                                   */}
      {/* ========================================================================= */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-brand-600 via-brand-700 to-slate-900 text-white relative overflow-hidden">
        {/* Ambient Overlay Lights */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        <Container size="xl" className="relative z-10 text-center">
          <div className="max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold uppercase tracking-wider text-brand-100 mb-6 border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Begin Your Adventure</span>
            </span>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-6">
              Ready to Plan Your Next Journey?
            </h2>

            <p className="text-base sm:text-lg text-brand-100 leading-relaxed max-w-xl mx-auto mb-10">
              Discover new places, build your itinerary, and start your next adventure with Vista Holidays.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/destinations" className="w-full sm:w-auto">
                <Button
                  variant="secondary"
                  size="lg"
                  iconRight={ArrowRight}
                  className="w-full sm:w-auto bg-white text-slate-900 hover:bg-slate-100 font-bold shadow-lg"
                >
                  Explore Destinations
                </Button>
              </Link>
              <Button
                variant="accent"
                size="lg"
                iconLeft={Sparkles}
                onClick={handleStartPlanning}
                className="w-full sm:w-auto font-bold shadow-lg"
              >
                Plan My Trip
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default AboutPage;
