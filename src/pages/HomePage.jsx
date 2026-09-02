import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Sparkles, 
  ArrowRight, 
  Send,
  Compass, 
  MessageSquare, 
  Bot, 
  CalendarDays 
} from 'lucide-react';
import { getFeaturedDestinations, DESTINATIONS } from '../data/destinations';
import { getFeaturedFamousPlaces } from '../data/famousPlaces';
import { useTravelAssistant } from '../hooks/useTravelAssistant';
import { useLocation } from '../hooks/useLocation';
import { Container } from '../components/layout/Container';
import { Hero, DestinationExplorer } from '../components/sections';
import { DestinationCard, FamousPlaceCard, PlaceDetailModal } from '../components/destinations';
import { LocationSelector } from '../components/location';
import { WeatherSection } from '../components/weather';
import { ItineraryPlanner } from '../components/itinerary';
import { 
  Button, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  Input, 
  Badge, 
  SectionHeader 
} from '../components/ui';

const HomePage = () => {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [customPrompt, setCustomPrompt] = useState('');

  const { openAssistant } = useTravelAssistant();
  const { selectedLocation } = useLocation();

  const featuredDestinations = getFeaturedDestinations().slice(0, 4);
  const featuredPlaces = getFeaturedFamousPlaces(6);

  const handleLaunchPrompt = (prompt) => {
    openAssistant(prompt, {
      location: selectedLocation,
      destination: selectedLocation?.city ? { name: selectedLocation.city, country: selectedLocation.country } : null
    });
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customPrompt.trim()) return;
    const p = customPrompt.trim();
    setCustomPrompt('');
    handleLaunchPrompt(p);
  };

  return (
    <div className="flex flex-col gap-16 sm:gap-24 lg:gap-32 pb-24">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION WITH LOOPING BACKGROUND VIDEO                             */}
      {/* ========================================================================= */}
      <Hero />

      {/* ========================================================================= */}
      {/* 2. FUNCTIONAL DESTINATION EXPLORER (Search + Filters + Grid)               */}
      {/* ========================================================================= */}
      <DestinationExplorer initialLimit={6} />

      {/* ========================================================================= */}
      {/* 3. FEATURED DESTINATIONS SHOWCASE (Dynamic from dataset)                  */}
      {/* ========================================================================= */}
      <section id="featured">
        <Container size="xl">
          <SectionHeader
            eyebrow="Curated Showcase"
            title="Featured Global Highlights"
            description="Handpicked travel hotspots selected for their extraordinary culture, landscape, and traveler reviews."
            action={
              <Link to="/destinations">
                <Button variant="secondary" size="sm" iconRight={ArrowRight}>
                  Explore Full Catalog ({DESTINATIONS.length})
                </Button>
              </Link>
            }
          />

          {/* Destination Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredDestinations.map((dest) => (
              <DestinationCard
                key={dest.id}
                destination={dest}
              />
            ))}
          </div>
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* 4. FAMOUS PLACES PREVIEW SECTION (Dynamic from famousPlaces.js)           */}
      {/* ========================================================================= */}
      <section id="places" className="bg-slate-100/60 py-16 sm:py-20 border-y border-slate-200/60">
        <Container size="xl">
          <SectionHeader
            eyebrow="World Wonders & Landmarks"
            title="Famous Places to Explore"
            description="Explore world-famous monuments, natural wonders, and cultural sanctuaries across top travel destinations."
            action={
              <Link to="/destinations">
                <Button variant="secondary" size="sm" iconRight={ArrowRight}>
                  Browse by Destination
                </Button>
              </Link>
            }
          />

          {/* Famous Places Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {featuredPlaces.map((place) => (
              <FamousPlaceCard
                key={place.id}
                place={place}
                showDestinationLink={true}
                onSelectPlace={(p) => setSelectedPlace(p)}
              />
            ))}
          </div>
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* 5. LOCATION AWARENESS & GEOGRAPHIC SELECTION SECTION                      */}
      {/* ========================================================================= */}
      <LocationSelector />

      {/* ========================================================================= */}
      {/* 6. REAL-TIME WEATHER INTELLIGENCE SECTION (OpenWeather Powered)           */}
      {/* ========================================================================= */}
      <WeatherSection />

      {/* ========================================================================= */}
      {/* 7. GEMINI AI TRAVEL ASSISTANT INTERACTIVE SECTION                         */}
      {/* ========================================================================= */}
      <section id="assistant">
        <Container size="xl">
          <SectionHeader
            eyebrow="AI Travel Concierge"
            title="Your Intelligent Travel Companion"
            description="Ask natural-language travel questions, discover dining hotspots, packing checklists, or budget breakdowns."
          />

          <Card variant="default" className="bg-white border-slate-200/90 shadow-card p-6 sm:p-8 lg:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Value Proposition & Prompt Starters */}
              <div className="lg:col-span-7 space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-sm">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-display font-extrabold text-xl sm:text-2xl text-slate-900 tracking-tight">
                      Vista Travel Concierge
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500">
                      Real-time generative intelligence tailored to your active location and destinations
                    </p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Have a question about where to eat in Tokyo, how to spend 3 days in Paris, or what to pack for Manali? Our AI concierge provides structured, practical travel intelligence instantly.
                </p>

                {/* Suggested Starter Chips */}
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    Click a prompt to begin conversation:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'What are the best places to visit in Paris?',
                      'How many days should I spend in Tokyo?',
                      'What food should I try in Singapore?',
                      'Suggest top beaches and cafes in Goa',
                      'Is 4 days enough for Dubai?'
                    ].map((prompt, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleLaunchPrompt(prompt)}
                        className="text-left text-xs px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-brand-50 text-slate-700 hover:text-brand-900 border border-slate-200/80 hover:border-brand-200 transition-colors shadow-subtle"
                      >
                        "{prompt}"
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Question Form */}
                <form onSubmit={handleCustomSubmit} className="flex items-center gap-2 pt-2">
                  <Input
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="Ask any custom travel question..."
                    className="bg-slate-50"
                  />
                  <Button variant="primary" size="md" iconLeft={Send} type="submit">
                    Ask AI
                  </Button>
                </form>
              </div>

              {/* Right Column: Interactive Card Preview */}
              <div className="lg:col-span-5">
                <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-brand-950 rounded-3xl p-6 sm:p-7 text-white shadow-float border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <Bot className="w-4 h-4 text-amber-300" />
                      <span className="text-xs font-bold uppercase tracking-wider">
                        Live AI Preview
                      </span>
                    </div>
                    <Badge variant="glass" size="sm" className="bg-white/10 text-white border-white/20">
                      AI Powered
                    </Badge>
                  </div>

                  {/* Sample Query and AI Response Bubble */}
                  <div className="space-y-3 text-xs">
                    <div className="p-3 rounded-xl bg-brand-600/30 border border-brand-500/30 text-sky-100 self-end">
                      <span className="text-[10px] uppercase font-bold text-sky-300 block mb-0.5">Traveler Query</span>
                      "What are the top 3 experiences in Paris for first-timers?"
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 text-slate-200 leading-relaxed">
                      <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-amber-300 mb-1">
                        <Sparkles className="w-3 h-3" />
                        <span>Vista Concierge</span>
                      </div>
                      <ul className="space-y-1 pl-4 list-disc text-slate-200">
                        <li><strong>Louvre at Opening:</strong> Book 9 AM timed tickets to beat crowds.</li>
                        <li><strong>Seine Sunset Cruise:</strong> Watch evening sparkles over the Eiffel Tower.</li>
                        <li><strong>Montmartre Stroll:</strong> Coffee & croissants by Sacré-Cœur basilica.</li>
                      </ul>
                    </div>
                  </div>

                  <Button
                    variant="accent"
                    size="md"
                    onClick={() => openAssistant('Hello! What travel destinations do you recommend?')}
                    className="w-full justify-center text-slate-950 font-bold"
                    iconLeft={MessageSquare}
                  >
                    Open Vista Holidays Assistant
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* 8. AI ITINERARY PLANNER (Live Gemini Day-by-Day Generation)               */}
      {/* ========================================================================= */}
      <section id="itinerary">
        <Container size="xl">
          <SectionHeader
            eyebrow="Custom Schedule Builder"
            title="Smart Day-by-Day Itinerary Planner"
            description="Generate customized multi-day travel schedules optimized for travel pace, iconic landmarks, and sightseeing flow."
          />

          <ItineraryPlanner />
        </Container>
      </section>

      {/* Landmark Details Modal */}
      <PlaceDetailModal
        place={selectedPlace}
        isOpen={Boolean(selectedPlace)}
        onClose={() => setSelectedPlace(null)}
      />
    </div>
  );
};

export default HomePage;
