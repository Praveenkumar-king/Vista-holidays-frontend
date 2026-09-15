import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Settings,
  Globe,
  Bell,
  Sliders,
  DollarSign,
  Thermometer,
  Shield,
  Save,
  Check,
  Trash2,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/ui/Button';

const PREFS_STORAGE_KEY = 'travel_app_user_preferences';

export const UserSettingsPage = () => {
  const { currentUser } = useAuth();
  const toast = useToast();

  const [settings, setSettings] = useState({
    currency: 'INR',
    temperatureUnit: 'C',
    travelStyle: 'Balanced',
    emailBookingAlerts: true,
    emailTripReminders: true,
    promoOffers: false,
    aiPersonalization: true
  });

  // Load saved preferences
  useEffect(() => {
    try {
      const saved = localStorage.getItem(PREFS_STORAGE_KEY);
      if (saved) {
        setSettings((prev) => ({ ...prev, ...JSON.parse(saved) }));
      }
    } catch (e) {
      console.warn('Failed to load user preferences:', e);
    }
  }, []);

  const handleSave = (e) => {
    e?.preventDefault();
    try {
      localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(settings));
      toast.success('Preferences saved successfully!');
    } catch (e) {
      toast.error('Failed to save preferences.');
    }
  };

  const handleClearCache = () => {
    if (
      window.confirm(
        'Are you sure you want to clear your local cache (AI chat history and offline data)? Your account data on the server will not be affected.'
      )
    ) {
      try {
        localStorage.removeItem('travel_app_ai_chat_history');
        localStorage.removeItem('travel_app_saved_itinerary');
        localStorage.removeItem('travel_app_selected_location');
        toast.success('Local cache cleared successfully.');
      } catch (e) {
        toast.error('Could not clear cache.');
      }
    }
  };

  return (
    <div className="py-6 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-brand-600 uppercase mb-1">
            <Settings className="w-4 h-4" />
            <span>Platform Configuration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 tracking-tight">
            Preferences & Settings
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Personalize your Vista Holidays experience, units of measure, and communication alerts.
          </p>
        </div>

        <Button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-xs transition-all"
        >
          <Save className="w-4 h-4" />
          <span>Save Preferences</span>
        </Button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* 2. Regional & Units Settings */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-bold text-base text-slate-900">
                Regional & Measurement Units
              </h2>
              <p className="text-xs text-slate-500">
                Configure currency displays and meteorological temperature units.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Preferred Currency */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Preferred Currency
              </label>
              <select
                value={settings.currency}
                onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
              >
                <option value="INR">Indian Rupee (INR ₹)</option>
                <option value="USD">US Dollar (USD $)</option>
                <option value="EUR">Euro (EUR €)</option>
                <option value="GBP">British Pound (GBP £)</option>
                <option value="AED">UAE Dirham (AED)</option>
              </select>
            </div>

            {/* Temperature Unit */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Temperature Metric
              </label>
              <select
                value={settings.temperatureUnit}
                onChange={(e) => setSettings({ ...settings, temperatureUnit: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
              >
                <option value="C">Celsius (°C)</option>
                <option value="F">Fahrenheit (°F)</option>
              </select>
            </div>
          </div>
        </div>

        {/* 3. Travel Persona & AI Personalization */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-bold text-base text-slate-900">
                Travel Style & AI Tailoring
              </h2>
              <p className="text-xs text-slate-500">
                Help Gemini AI formulate itineraries suited to your travel preferences.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Primary Travel Personality
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { id: 'Balanced', label: 'Balanced & Relaxed' },
                { id: 'Adventure', label: 'Adventure & Trekking' },
                { id: 'Heritage', label: 'Culture & Heritage' },
                { id: 'Luxury', label: 'Luxury & Wellness' },
                { id: 'Budget', label: 'Budget Explorer' }
              ].map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setSettings({ ...settings, travelStyle: style.id })}
                  className={`p-3 rounded-2xl border text-xs font-bold transition-all text-center ${
                    settings.travelStyle === style.id
                      ? 'bg-brand-50 border-brand-500 text-brand-700 shadow-xs'
                      : 'bg-slate-50 border-slate-200/70 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Notification Preferences */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-bold text-base text-slate-900">
                Notification Alerts
              </h2>
              <p className="text-xs text-slate-500">
                Select which messages and platform alerts you would like to receive.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/70 cursor-pointer">
              <div>
                <span className="text-xs font-bold text-slate-800 block">
                  Booking Confirmations & Invoices
                </span>
                <span className="text-[11px] text-slate-500">
                  Receive instant payment receipts and travel vouchers via email
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.emailBookingAlerts}
                onChange={(e) =>
                  setSettings({ ...settings, emailBookingAlerts: e.target.checked })
                }
                className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/70 cursor-pointer">
              <div>
                <span className="text-xs font-bold text-slate-800 block">
                  Upcoming Trip Reminders
                </span>
                <span className="text-[11px] text-slate-500">
                  Receive alerts 48 hours prior to departure with weather & packing tips
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.emailTripReminders}
                onChange={(e) =>
                  setSettings({ ...settings, emailTripReminders: e.target.checked })
                }
                className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/70 cursor-pointer">
              <div>
                <span className="text-xs font-bold text-slate-800 block">
                  Promotional Holiday Offers
                </span>
                <span className="text-[11px] text-slate-500">
                  Exclusive seasonal discounts and early bird holiday packages
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.promoOffers}
                onChange={(e) => setSettings({ ...settings, promoOffers: e.target.checked })}
                className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500"
              />
            </label>
          </div>
        </div>

        {/* 5. Data & Privacy Management */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="font-display font-bold text-base text-slate-900">
                Storage & Cache Management
              </h2>
              <p className="text-xs text-slate-500">
                Clear locally cached search history, GPS drafts, and assistant chats.
              </p>
            </div>

            <button
              type="button"
              onClick={handleClearCache}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Local Cache</span>
            </button>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-500 pt-2">
            <Link to="/privacy" className="hover:text-brand-600 font-medium flex items-center gap-1">
              <span>Privacy Policy</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-brand-600 font-medium flex items-center gap-1">
              <span>Terms of Service</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UserSettingsPage;
