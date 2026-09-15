import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Calendar,
  Clock,
  Compass,
  Luggage,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ExternalLink,
  ChevronRight,
  Filter,
  Receipt,
  Download,
  Bot
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useTravelAssistant } from '../../hooks/useTravelAssistant';
import { bookingService } from '../../services/bookingService';
import { Container } from '../../components/layout/Container';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { DESTINATIONS } from '../../data/destinations';

export const UserTripsPage = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const { openAssistant } = useTravelAssistant();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' | 'completed' | 'cancelled' | 'all'

  const fetchTrips = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const res = await bookingService.getMyBookings('all');
      if (res.success && res.data?.bookings) {
        setBookings(res.data.bookings);
      }
    } catch (err) {
      console.error('Error fetching trips:', err);
      toast.error('Failed to load trips. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, [isAuthenticated]);

  // Helper to resolve trip status
  const now = new Date();
  const processedTrips = bookings.map((b) => {
    const travelDate = b.travelDate ? new Date(b.travelDate) : new Date(b.createdAt);
    const isPast = travelDate < now;
    let computedStatus = b.bookingStatus || 'confirmed';

    if (b.bookingStatus === 'cancelled') {
      computedStatus = 'cancelled';
    } else if (isPast || b.bookingStatus === 'completed') {
      computedStatus = 'completed';
    } else {
      computedStatus = 'upcoming';
    }

    // Match destination image
    const matchedDest = DESTINATIONS.find(
      (d) =>
        d.id.toLowerCase() === (b.destinationId || '').toLowerCase() ||
        d.title.toLowerCase().includes((b.destinationTitle || '').toLowerCase())
    );

    return {
      ...b,
      travelDate,
      computedStatus,
      destinationImage:
        b.destinationImage ||
        matchedDest?.image ||
        'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80',
      daysUntil: Math.ceil((travelDate - now) / (1000 * 60 * 60 * 24))
    };
  });

  const upcomingTrips = processedTrips.filter((t) => t.computedStatus === 'upcoming');
  const completedTrips = processedTrips.filter((t) => t.computedStatus === 'completed');
  const cancelledTrips = processedTrips.filter((t) => t.computedStatus === 'cancelled');

  const filteredTrips =
    activeTab === 'all'
      ? processedTrips
      : activeTab === 'upcoming'
      ? upcomingTrips
      : activeTab === 'completed'
      ? completedTrips
      : cancelledTrips;

  const nextTrip = upcomingTrips.length > 0 ? upcomingTrips[0] : null;

  return (
    <div className="py-6 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-brand-600 uppercase mb-1">
            <Luggage className="w-4 h-4" />
            <span>Traveler Journey Manager</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 tracking-tight">
            My Trips & Adventures
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track upcoming departures, review past travels, and organize your itinerary.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/destinations"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-sm shadow-brand-500/20 transition-all hover:scale-102"
          >
            <Compass className="w-4 h-4" />
            <span>Book New Trip</span>
          </Link>
          <button
            type="button"
            onClick={() => openAssistant('Help me organize my upcoming trip and packing checklist')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
          >
            <Bot className="w-4 h-4 text-brand-600" />
            <span>Trip AI Advice</span>
          </button>
        </div>
      </div>

      {/* 2. Top Highlights & Next Trip Spotlight */}
      {nextTrip && (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl p-6 sm:p-8">
          <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-brand-500/10 blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 border border-brand-400/30 text-brand-300 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Next Upcoming Adventure • {nextTrip.daysUntil > 0 ? `In ${nextTrip.daysUntil} Days` : 'Happening Soon!'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
                {nextTrip.destinationTitle || 'Scenic Getaway'}
              </h2>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-brand-400" />
                  {nextTrip.travelDate.toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-brand-400" />
                  Booking ID: <strong className="text-white font-mono">{nextTrip.bookingId}</strong>
                </span>
                <span>•</span>
                <span className="text-emerald-400 font-bold uppercase tracking-wider">
                  Confirmed & Ready
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                to={`/user/bookings?id=${nextTrip.bookingId}`}
                className="px-5 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold shadow-md transition-all flex items-center gap-2"
              >
                <span>View Booking Details</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
              <button
                type="button"
                onClick={() =>
                  openAssistant(
                    `Give me a detailed weather forecast, local customs, and top things to do for my upcoming trip to ${nextTrip.destinationTitle}`
                  )
                }
                className="px-4 py-3 rounded-xl bg-brand-600/80 hover:bg-brand-600 text-white text-xs font-bold border border-brand-400/30 transition-all flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Ask AI Guide</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Filter Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200">
        <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto pb-px">
          {[
            { id: 'upcoming', label: 'Upcoming Trips', count: upcomingTrips.length },
            { id: 'completed', label: 'Completed Trips', count: completedTrips.length },
            { id: 'cancelled', label: 'Cancelled Trips', count: cancelledTrips.length },
            { id: 'all', label: 'All Departures', count: processedTrips.length }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 font-bold text-xs transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-brand-600 text-brand-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  activeTab === tab.id
                    ? 'bg-brand-100 text-brand-700'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 4. Trips Grid or Loading/Empty State */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <LoadingSpinner size="lg" />
          <p className="text-xs text-slate-500 font-medium animate-pulse">
            Fetching your travel departures...
          </p>
        </div>
      ) : filteredTrips.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xs max-w-xl mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto shadow-xs">
            <Luggage className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-display font-bold text-slate-900">
              No {activeTab} trips found
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              {activeTab === 'upcoming'
                ? "You don't have any upcoming trips scheduled. Discover handpicked getaways across India!"
                : "No trips found in this filter category."}
            </p>
          </div>
          <div className="pt-2 flex items-center justify-center gap-3">
            <Link
              to="/destinations"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-xs transition-colors"
            >
              <Compass className="w-4 h-4" />
              <span>Explore Destinations</span>
            </Link>
            <Link
              to="/user/ai-plans"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
            >
              <Sparkles className="w-4 h-4 text-brand-600" />
              <span>Generate AI Plan</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map((trip) => {
            const isUpcoming = trip.computedStatus === 'upcoming';
            const isCompleted = trip.computedStatus === 'completed';
            const isCancelled = trip.computedStatus === 'cancelled';

            return (
              <div
                key={trip._id || trip.bookingId}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col group"
              >
                {/* Destination Image Cover */}
                <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={trip.destinationImage}
                    alt={trip.destinationTitle}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                  {/* Status Badge */}
                  <div className="absolute top-3 left-3">
                    {isUpcoming && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500 text-white shadow-xs">
                        <CheckCircle2 className="w-3 h-3" />
                        Upcoming ({trip.daysUntil}d)
                      </span>
                    )}
                    {isCompleted && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-800/80 text-white backdrop-blur-xs">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        Completed
                      </span>
                    )}
                    {isCancelled && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500 text-white shadow-xs">
                        <XCircle className="w-3 h-3" />
                        Cancelled
                      </span>
                    )}
                  </div>

                  {/* Booking ID badge */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                    <span className="text-xs font-mono font-bold bg-black/40 px-2 py-0.5 rounded backdrop-blur-xs">
                      #{trip.bookingId}
                    </span>
                    <span className="text-xs font-bold text-brand-300">
                      ₹{trip.amountPaid?.toLocaleString('en-IN') || trip.totalAmount?.toLocaleString('en-IN') || 'Paid'}
                    </span>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-display font-bold text-base text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-1">
                      {trip.destinationTitle || 'Vista Journey'}
                    </h3>

                    <div className="mt-3 space-y-2 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>
                          Travel Date:{' '}
                          <strong className="text-slate-800">
                            {trip.travelDate.toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </strong>
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Luggage className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>
                          Travelers:{' '}
                          <strong className="text-slate-800">
                            {trip.travelers?.length || trip.travelersCount || 1} Guest(s)
                          </strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <Link
                      to={`/user/bookings?id=${trip.bookingId}`}
                      className="flex-1 text-center py-2 px-3 rounded-xl bg-slate-50 hover:bg-brand-50 text-slate-700 hover:text-brand-700 text-xs font-bold border border-slate-200/60 transition-colors"
                    >
                      View Voucher
                    </Link>

                    <button
                      type="button"
                      onClick={() =>
                        openAssistant(
                          `Can you provide an itinerary and packing guide for my trip to ${trip.destinationTitle}?`
                        )
                      }
                      className="p-2 rounded-xl text-slate-500 hover:text-brand-600 hover:bg-brand-50 border border-slate-200/60 transition-colors"
                      title="Ask AI Assistant about this trip"
                    >
                      <Sparkles className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UserTripsPage;
