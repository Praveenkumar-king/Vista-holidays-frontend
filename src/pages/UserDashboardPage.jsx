import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  Luggage,
  CloudSun,
  Bot,
  User as UserIcon,
  Heart,
  Calendar,
  Clock,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Sparkles,
  MapPin,
  Bell,
  AlertCircle,
  ShieldCheck,
  ChevronRight,
  RefreshCw,
  Eye
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { userService } from '../services/userService';
import { Container } from '../components/layout/Container';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import UserProfileCard from '../components/user/UserProfileCard';

export const UserDashboardPage = () => {
  const { currentUser, logout } = useAuth();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [summaryData, setSummaryData] = useState(null);

  // Live IST Clock & Date State
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [dynamicGreeting, setDynamicGreeting] = useState('Good Morning 🌅');

  // Time & Greeting Tick (Asia/Kolkata timezone)
  useEffect(() => {
    const updateTimeAndGreeting = () => {
      const now = new Date();
      const options = { timeZone: 'Asia/Kolkata' };

      // Determine IST Hour
      const istHour = parseInt(
        new Intl.DateTimeFormat('en-US', { ...options, hour: 'numeric', hour12: false }).format(now),
        10
      );

      let greeting = 'Good Morning 🌅';
      if (istHour >= 12 && istHour < 17) {
        greeting = 'Good Afternoon ☀️';
      } else if (istHour >= 17) {
        greeting = 'Good Evening 🌙';
      }
      setDynamicGreeting(greeting);

      const dateString = new Intl.DateTimeFormat('en-US', {
        ...options,
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(now).toUpperCase();
      setCurrentDate(dateString);

      const timeString = new Intl.DateTimeFormat('en-US', {
        ...options,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }).format(now);
      setCurrentTime(timeString);
    };

    updateTimeAndGreeting();
    const interval = setInterval(updateTimeAndGreeting, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch Dashboard Summary Data
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const res = await userService.getDashboardSummary();
      if (res.success && res.data) {
        setSummaryData(res.data);
      }
    } catch (err) {
      console.error('Error loading dashboard summary:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const stats = summaryData?.stats || {
    totalBookings: 0,
    confirmedBookings: 0,
    upcomingBookings: 0,
    savedDestinationsCount: 0
  };

  const completion = summaryData?.completion || {
    percentage: 75,
    missingFields: []
  };

  const recentBookings = summaryData?.recentBookings || [];
  const latestBooking = recentBookings[0] || null;
  const recentActivities = summaryData?.recentActivities || [];
  const notifications = summaryData?.notifications || [];

  const userName = currentUser?.name ? currentUser.name.split(' ')[0] : 'Traveler';

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 py-8 sm:py-12">
      <Container size="xl">
        {/* Phase 4 Header: Current Day/Date, Time, Dynamic Greeting, User Name */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-slate-400 uppercase mb-1">
                <Calendar className="w-3.5 h-3.5 text-brand-500" />
                <span>{currentDate || 'LOADING DATE...'}</span>
                <span className="text-slate-300">•</span>
                <Clock className="w-3.5 h-3.5 text-brand-500" />
                <span className="font-mono text-slate-600">{currentTime || '00:00:00'} (IST)</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-slate-900 tracking-tight">
                {dynamicGreeting}, <span className="text-brand-600">{currentUser?.name || userName}</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                Welcome back to Vista Holidays. Here is your active travel summary and upcoming adventures.
              </p>
            </div>

            <div className="flex items-center gap-2.5 self-start md:self-center">
              <Button
                variant="outline"
                size="sm"
                iconLeft={RefreshCw}
                onClick={loadDashboardData}
                loading={loading}
                className="text-xs font-semibold"
              >
                Refresh
              </Button>
              <Link to="/destinations">
                <Button
                  variant="primary"
                  size="sm"
                  iconRight={ArrowRight}
                  className="text-xs font-semibold shadow-sm"
                >
                  Plan Next Trip
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="min-h-[40vh] flex items-center justify-center">
            <LoadingSpinner size="lg" message="Loading your traveler dashboard..." />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Top Grid: Profile Card & Profile Completion Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
              <div className="lg:col-span-2">
                <UserProfileCard user={currentUser} />
              </div>

              {/* Profile Completion Card (Phase 20) */}
              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Profile Completion
                    </span>
                    <span className="text-sm font-extrabold text-brand-600">
                      {completion.percentage}%
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mb-4">
                    <div
                      className="h-full bg-gradient-to-r from-brand-500 to-emerald-500 transition-all duration-500 rounded-full"
                      style={{ width: `${completion.percentage}%` }}
                    />
                  </div>

                  {completion.missingFields.length > 0 ? (
                    <div className="space-y-1.5 text-xs text-slate-600">
                      <p className="font-semibold text-slate-700">Missing steps:</p>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-500">
                        {completion.missingFields.map((field, idx) => (
                          <li key={idx}>Add {field}</li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 p-2.5 rounded-2xl border border-emerald-100">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                      <span>All profile credentials completed!</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <Link to="/user/profile">
                    <Button
                      variant={completion.percentage === 100 ? 'ghost' : 'outline'}
                      size="sm"
                      className="w-full text-xs font-semibold"
                    >
                      {completion.percentage === 100 ? 'Review Profile' : 'Complete Profile'}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Travel Stats Telemetry (Phase 15H) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-soft">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
                    <Luggage className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xl sm:text-2xl font-extrabold text-slate-900">
                      {stats.totalBookings}
                    </span>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Total Bookings
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-soft">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xl sm:text-2xl font-extrabold text-slate-900">
                      {stats.confirmedBookings}
                    </span>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Confirmed Trips
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-soft">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                    <Heart className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xl sm:text-2xl font-extrabold text-slate-900">
                      {stats.savedDestinationsCount}
                    </span>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Saved Wishlist
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-soft">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-extrabold text-slate-900 truncate block max-w-[120px]">
                      {currentUser?.createdAt
                        ? new Date(currentUser.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            year: 'numeric'
                          })
                        : 'Member'}
                    </span>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Member Since
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions (Phase 16) */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft p-6 sm:p-7">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
                Quick Actions
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                <Link
                  to="/destinations"
                  className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50/80 hover:bg-brand-50 hover:text-brand-700 border border-slate-200/60 transition-all text-center group"
                >
                  <Compass className="w-6 h-6 text-brand-600 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-semibold text-slate-800 group-hover:text-brand-700">
                    Explore Trips
                  </span>
                </Link>

                <Link
                  to="/user/bookings"
                  className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50/80 hover:bg-brand-50 hover:text-brand-700 border border-slate-200/60 transition-all text-center group"
                >
                  <Luggage className="w-6 h-6 text-brand-600 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-semibold text-slate-800 group-hover:text-brand-700">
                    My Bookings
                  </span>
                </Link>

                <Link
                  to="/weather"
                  className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50/80 hover:bg-brand-50 hover:text-brand-700 border border-slate-200/60 transition-all text-center group"
                >
                  <CloudSun className="w-6 h-6 text-amber-500 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-semibold text-slate-800 group-hover:text-brand-700">
                    Live Weather
                  </span>
                </Link>

                <Link
                  to="/user/profile"
                  className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50/80 hover:bg-brand-50 hover:text-brand-700 border border-slate-200/60 transition-all text-center group"
                >
                  <UserIcon className="w-6 h-6 text-slate-600 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-semibold text-slate-800 group-hover:text-brand-700">
                    Profile & Photo
                  </span>
                </Link>

                <Link
                  to="/contact"
                  className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50/80 hover:bg-brand-50 hover:text-brand-700 border border-slate-200/60 transition-all text-center group"
                >
                  <ShieldCheck className="w-6 h-6 text-emerald-600 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-semibold text-slate-800 group-hover:text-brand-700">
                    Support Desk
                  </span>
                </Link>

                <Link
                  to="/faq"
                  className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50/80 hover:bg-brand-50 hover:text-brand-700 border border-slate-200/60 transition-all text-center group"
                >
                  <AlertCircle className="w-6 h-6 text-sky-600 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-semibold text-slate-800 group-hover:text-brand-700">
                    Help & FAQs
                  </span>
                </Link>
              </div>
            </div>

            {/* Middle Grid: My Bookings Preview & Continue Planning */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* My Bookings Preview Card (Phase 23) */}
              <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 shadow-soft p-6 sm:p-7">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                      <Luggage className="w-4 h-4" />
                    </div>
                    <h2 className="text-lg font-display font-extrabold text-slate-900">
                      Recent & Upcoming Bookings
                    </h2>
                  </div>
                  <Link to="/user/bookings">
                    <Button variant="ghost" size="sm" iconRight={ChevronRight} className="text-xs font-semibold">
                      View All Bookings
                    </Button>
                  </Link>
                </div>

                {latestBooking ? (
                  <div className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/60 hover:bg-slate-50 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                      <div>
                        <span className="text-[11px] font-mono font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-lg border border-brand-200">
                          {latestBooking.bookingId}
                        </span>
                        <h3 className="text-base font-display font-bold text-slate-900 mt-1">
                          {latestBooking.destinationName}
                        </h3>
                        <p className="text-xs text-slate-500">
                          {latestBooking.packageName} • {latestBooking.days} Days • {latestBooking.members} Travelers
                        </p>
                      </div>

                      <div className="text-left sm:text-right">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                            latestBooking.bookingStatus === 'confirmed'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {latestBooking.bookingStatus}
                        </span>
                        <p className="text-sm font-extrabold text-slate-900 mt-1">
                          ₹{latestBooking.totalAmount?.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
                      <span>Booked on {new Date(latestBooking.createdAt).toLocaleDateString('en-US')}</span>
                      <Link
                        to="/user/bookings"
                        className="font-semibold text-brand-600 hover:text-brand-700 inline-flex items-center gap-1"
                      >
                        Details <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50">
                    <Luggage className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <h3 className="text-sm font-bold text-slate-700">No active bookings yet</h3>
                    <p className="text-xs text-slate-500 mt-1 mb-4">
                      Explore our handpicked travel packages and book your next dream holiday.
                    </p>
                    <Link to="/destinations">
                      <Button variant="primary" size="sm" className="text-xs font-semibold">
                        Explore Destinations
                      </Button>
                    </Link>
                  </div>
                )}
              </div>

              {/* Continue Planning / Wishlist Card (Phase 17 & 18) */}
              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft p-6 sm:p-7 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                      <Heart className="w-4 h-4" />
                    </div>
                    <h2 className="text-lg font-display font-extrabold text-slate-900">
                      Continue Planning
                    </h2>
                  </div>

                  <p className="text-xs text-slate-500 mb-4">
                    Ready to discover your next destination? Check out handpicked luxury packages curated for you.
                  </p>

                  <div className="p-4 rounded-2xl bg-gradient-to-br from-brand-50 to-teal-50/50 border border-brand-100">
                    <div className="flex items-center gap-2 text-xs font-bold text-brand-700 mb-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Start Your First Trip</span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Discover the iconic landmarks of Paris, Bali, or Tokyo with dynamic AI itineraries.
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100">
                  <Link to="/destinations">
                    <Button variant="outline" size="sm" iconRight={ArrowRight} className="w-full text-xs font-semibold">
                      Explore Destinations
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Bottom Grid: Notifications & Recent Activity (Phase 15F & 15G) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Notifications */}
              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft p-6 sm:p-7">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                    <Bell className="w-4 h-4" />
                  </div>
                  <h2 className="text-base font-display font-extrabold text-slate-900">
                    Account Notifications
                  </h2>
                </div>

                <div className="space-y-3">
                  {notifications.length > 0 ? (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100 flex items-start gap-3"
                      >
                        <div className="w-6 h-6 rounded-lg bg-white shadow-xs border border-slate-200 flex items-center justify-center text-brand-600 flex-shrink-0 mt-0.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 truncate">
                            {notif.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {notif.message}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 py-4 text-center">
                      No new notifications at this time.
                    </p>
                  )}
                </div>
              </div>

              {/* Recent Activity Feed */}
              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft p-6 sm:p-7">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                  <h2 className="text-base font-display font-extrabold text-slate-900">
                    Recent Activity Log
                  </h2>
                </div>

                <div className="space-y-3">
                  {recentActivities.length > 0 ? (
                    recentActivities.map((act, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/70 border border-slate-100 text-xs"
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <div className="w-2 h-2 rounded-full bg-brand-500 flex-shrink-0" />
                          <div className="truncate">
                            <span className="font-semibold text-slate-800">{act.action}</span>
                            {act.details && (
                              <span className="text-slate-500 ml-1.5 truncate">
                                — {act.details}
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-400 flex-shrink-0 ml-2">
                          {act.timestamp
                            ? new Date(act.timestamp).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric'
                              })
                            : 'Recent'}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 py-4 text-center">
                      No recent account activities recorded.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};

export default UserDashboardPage;
