import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarDays,
  Sparkles,
  MapPin,
  Clock,
  Compass,
  Printer,
  Copy,
  Trash2,
  Check,
  Plus,
  ArrowRight,
  ExternalLink,
  Bot
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useTravelAssistant } from '../../hooks/useTravelAssistant';
import { ItineraryPlanner } from '../../components/itinerary/ItineraryPlanner';
import { Button } from '../../components/ui/Button';

const LOCAL_STORAGE_KEY = 'travel_app_saved_itinerary';

export const UserAiPlansPage = () => {
  const { currentUser } = useAuth();
  const toast = useToast();
  const { openAssistant } = useTravelAssistant();

  const [activeView, setActiveView] = useState('saved'); // 'saved' | 'create'
  const [savedItinerary, setSavedItinerary] = useState(null);
  const [copied, setCopied] = useState(false);

  // Load saved itinerary from localStorage
  const loadSavedPlan = () => {
    try {
      const data = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (data) {
        setSavedItinerary(JSON.parse(data));
      } else {
        setSavedItinerary(null);
      }
    } catch (e) {
      console.warn('Error reading saved itinerary:', e);
      setSavedItinerary(null);
    }
  };

  useEffect(() => {
    loadSavedPlan();
  }, [activeView]);

  const handleClearPlan = () => {
    if (window.confirm('Are you sure you want to remove this saved AI itinerary?')) {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      setSavedItinerary(null);
      toast.success('Itinerary cleared.');
    }
  };

  const handleCopyPlan = () => {
    if (!savedItinerary) return;
    try {
      const text = `Vista Holidays AI Itinerary: ${savedItinerary.destination || 'Custom Trip'} (${savedItinerary.days?.length || 0} Days)\n\n` +
        savedItinerary.days
          ?.map(
            (d, i) =>
              `Day ${d.day || i + 1}: ${d.title || ''}\n${d.activities?.map((a) => `• [${a.time || ''}] ${a.title || a.description}`).join('\n') || ''}`
          )
          .join('\n\n');
      navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Itinerary copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      toast.error('Failed to copy itinerary.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="py-6 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-brand-600 uppercase mb-1">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>AI Itinerary Studio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 tracking-tight">
            My AI Travel Plans
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review your custom Gemini AI generated travel itineraries or synthesize a new day-by-day plan.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveView('saved')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeView === 'saved'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Saved Plans {savedItinerary ? '(1)' : '(0)'}
          </button>
          <button
            type="button"
            onClick={() => setActiveView('create')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeView === 'create'
                ? 'bg-white text-brand-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create New Plan</span>
          </button>
        </div>
      </div>

      {/* 2. Content Views */}
      {activeView === 'create' ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
          <div className="mb-6">
            <h2 className="text-xl font-display font-bold text-slate-900">
              Generate a New AI Travel Plan
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Select your destination, duration, budget, and traveling style to receive an optimized schedule.
            </p>
          </div>
          {/* Reuse the battle-tested ItineraryPlanner component */}
          <ItineraryPlanner />
        </div>
      ) : savedItinerary && savedItinerary.days ? (
        /* Saved Plan Display */
        <div className="space-y-6">
          {/* Plan Header Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-200 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Generated by Gemini AI</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 tracking-tight">
                {savedItinerary.destination || savedItinerary.title || 'Custom Tour Itinerary'}
              </h2>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="w-4 h-4 text-brand-600" />
                  {savedItinerary.days?.length || 0} Days Itinerary
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-brand-600" />
                  Pace: {savedItinerary.pace || 'Balanced'}
                </span>
                {savedItinerary.budget && (
                  <>
                    <span>•</span>
                    <span>Budget: {savedItinerary.budget}</span>
                  </>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleCopyPlan}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                title="Copy itinerary as text"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Text'}</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                title="Print or save as PDF"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / PDF</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  openAssistant(
                    `I have an itinerary for ${savedItinerary.destination}. Can you give me restaurant recommendations and local transit tips for it?`
                  )
                }
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-bold border border-brand-200 transition-colors"
              >
                <Bot className="w-3.5 h-3.5" />
                <span>Ask AI Advice</span>
              </button>

              <button
                type="button"
                onClick={handleClearPlan}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Delete this saved plan"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Days Timeline */}
          <div className="space-y-4">
            {savedItinerary.days.map((dayItem, dayIndex) => (
              <div
                key={dayIndex}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-brand-600 text-white font-display font-bold text-xs flex items-center justify-center">
                      D{dayItem.day || dayIndex + 1}
                    </span>
                    <h3 className="text-base font-display font-bold text-slate-900">
                      {dayItem.title || `Day ${dayItem.day || dayIndex + 1}`}
                    </h3>
                  </div>
                  {dayItem.theme && (
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                      {dayItem.theme}
                    </span>
                  )}
                </div>

                {/* Day Activities */}
                <div className="space-y-3 pt-1">
                  {dayItem.activities?.map((activity, actIdx) => (
                    <div
                      key={actIdx}
                      className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/80 border border-slate-100 hover:border-slate-200 transition-all"
                    >
                      <div className="px-2 py-1 rounded-md bg-white border border-slate-200 text-[11px] font-bold text-brand-700 shrink-0 font-mono">
                        {activity.time || 'Activity'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-800">
                          {activity.title || activity.name || activity.activity}
                        </h4>
                        <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                          {activity.description || activity.details}
                        </p>
                        {activity.location && (
                          <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span>{activity.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="py-16 text-center bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xs max-w-xl mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto shadow-xs">
            <CalendarDays className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-display font-bold text-slate-900">
              No Saved AI Itineraries
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              You haven't generated or saved an AI itinerary yet. Use our Gemini-powered planner to build an unforgettable journey in seconds!
            </p>
          </div>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setActiveView('create')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Generate AI Plan Now</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAiPlansPage;
