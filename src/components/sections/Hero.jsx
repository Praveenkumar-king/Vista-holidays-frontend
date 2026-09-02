import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Compass, 
  ArrowRight, 
  Sparkles, 
  ChevronDown, 
  Globe2, 
  CloudSun, 
  CalendarDays,
  ShieldCheck
} from 'lucide-react';
import { Container } from '../layout/Container';
import { Button } from '../ui/Button';

export const Hero = () => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const videoRef = useRef(null);

  // Check for prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (event) => setPrefersReducedMotion(event.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Handle video playback respecting accessibility preferences
  useEffect(() => {
    if (videoRef.current) {
      if (prefersReducedMotion) {
        videoRef.current.pause();
      } else {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Autoplay may be restricted or video file not found
          });
        }
      }
    }
  }, [prefersReducedMotion]);

  const handleVideoLoaded = () => {
    setVideoLoaded(true);
  };

  const handleVideoError = () => {
    setVideoError(true);
  };

  const scrollToExplorer = (e) => {
    e.preventDefault();
    const target = document.getElementById('explorer');
    if (target) {
      target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      aria-label="Travel Application Introduction"
      className="relative w-full min-h-[90vh] lg:min-h-[92vh] flex items-center justify-center overflow-hidden bg-slate-950 text-white"
    >
      {/* ========================================================================= */}
      {/* 1. BACKGROUND VIDEO & CINEMATIC FALLBACK LAYER                            */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        {/* Cinematic Gradient Fallback (Active when video is loading, errored, or missing) */}
        <div
          className={`absolute inset-0 w-full h-full bg-gradient-to-br from-slate-950 via-slate-900 to-brand-950 transition-opacity duration-1000 ${
            videoLoaded && !videoError ? 'opacity-0' : 'opacity-100'
          }`}
        >
          {/* Ambient Lighting Accents */}
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-brand-600/20 rounded-full blur-[120px] animate-pulse-subtle" />
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-amber-500/15 rounded-full blur-[140px] animate-pulse-subtle" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(14,135,234,0.15),rgba(255,255,255,0))]" />
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
            onLoadedData={handleVideoLoaded}
            onError={handleVideoError}
            className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 scale-105 ${
              videoLoaded ? 'opacity-70' : 'opacity-0'
            }`}
            aria-hidden="true"
          >
            <source src="/videos/hero-travel.mp4" type="video/mp4" />
          </video>
        )}

        {/* Sophisticated Dark Directional Overlay for Maximum Text Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-slate-950/60" />
        
        {/* Subtle Vignette Mask */}
        <div className="absolute inset-0 shadow-[inset_0_0_120px_rgba(0,0,0,0.8)]" />
      </div>

      {/* ========================================================================= */}
      {/* 2. HERO CONTENT CONTAINER                                                 */}
      {/* ========================================================================= */}
      <Container size="xl" className="relative z-10 pt-16 pb-20 sm:pt-20 sm:pb-24 lg:py-28 flex flex-col items-center text-center">
        <div className="max-w-4xl flex flex-col items-center">
          
          {/* Eyebrow / Small Pill Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-md text-sky-200 border border-white/20 shadow-subtle mb-6 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="tracking-wide uppercase">Intelligent Travel Curation</span>
          </div>

          {/* Main Display Headline */}
          <h1 className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] sm:leading-[1.08] text-white mb-6 animate-fade-in-up">
            Discover Places <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-sky-200 to-amber-200">
              Worth Remembering
            </span>
          </h1>

          {/* Supporting Description */}
          <p className="text-base sm:text-lg lg:text-xl text-slate-200/90 max-w-2xl leading-relaxed mb-10 font-normal animate-fade-in-up">
            Explore handpicked global destinations, gain real-time climate insights, and craft tailored multi-day itineraries designed for thoughtful travelers.
          </p>

          {/* Action Buttons (CTAs) */}
          <div className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3.5 sm:gap-4 mb-14 animate-fade-in-up">
            <Link to="/destinations" className="w-full sm:w-auto">
              <Button
                variant="accent"
                size="lg"
                iconRight={ArrowRight}
                className="w-full sm:w-auto shadow-float text-slate-950 font-bold hover:scale-[1.02] transition-transform"
              >
                Explore Destinations
              </Button>
            </Link>

            <a href="#itinerary" className="w-full sm:w-auto">
              <Button
                variant="secondary"
                size="lg"
                iconLeft={CalendarDays}
                className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border-white/25 backdrop-blur-md shadow-sm"
              >
                Plan a Trip
              </Button>
            </a>
          </div>

          {/* Quick Value Metrics & Features Pill Row */}
          <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-3xl pt-8 border-t border-white/10 text-left">
            <div className="p-3 sm:p-3.5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-brand-500/20 text-brand-300 flex items-center justify-center flex-shrink-0">
                <Globe2 className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-bold text-white">50+ Escapes</div>
                <div className="text-[11px] text-slate-400">Curated Worldwide</div>
              </div>
            </div>

            <div className="p-3 sm:p-3.5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center flex-shrink-0">
                <CloudSun className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-bold text-white">Live Forecasts</div>
                <div className="text-[11px] text-slate-400">Real-time Weather</div>
              </div>
            </div>

            <div className="p-3 sm:p-3.5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-300 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-bold text-white">AI Assistant</div>
                <div className="text-[11px] text-slate-400">Smart Trip Guides</div>
              </div>
            </div>

            <div className="p-3 sm:p-3.5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-bold text-white">100% Free</div>
                <div className="text-[11px] text-slate-400">No Subscription</div>
              </div>
            </div>
          </div>

        </div>
      </Container>

      {/* ========================================================================= */}
      {/* 3. ACCESSIBLE SCROLL INDICATOR                                            */}
      {/* ========================================================================= */}
      <a
        href="#explorer"
        onClick={scrollToExplorer}
        className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 text-slate-400 hover:text-white transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-xl p-2 cursor-pointer"
        aria-label="Scroll to explore destinations section"
      >
        <span className="text-[11px] font-medium tracking-wider uppercase opacity-80 group-hover:opacity-100">
          Scroll to explore
        </span>
        <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center border border-white/15 animate-bounce-slow motion-reduce:animate-none">
          <ChevronDown className="w-4 h-4 text-white" />
        </div>
      </a>
    </section>
  );
};

export default Hero;
