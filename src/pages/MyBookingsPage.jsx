import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
  Luggage,
  Calendar,
  Users,
  CreditCard,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
  ExternalLink,
  MapPin,
  RefreshCw,
  Search,
  Receipt,
  X,
  Compass
} from 'lucide-react';
import { Container } from '../components/layout/Container';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { bookingService } from '../services/bookingService';

export const MyBookingsPage = () => {
  const { isAuthenticated, currentUser, loading: authLoading } = useAuth();
  const toast = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Extract optional ?id=... from query parameters for deep linking from confirmation email
  const queryParamBookingId = new URLSearchParams(location.search).get('id');

  const fetchBookings = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const res = await bookingService.getMyBookings(filterStatus);
      if (res.success && res.data?.bookings) {
        setBookings(res.data.bookings);

        // Auto-open requested booking from email link
        if (queryParamBookingId) {
          const matched = res.data.bookings.find(
            (b) => b.bookingId.toLowerCase() === queryParamBookingId.toLowerCase()
          );
          if (matched) {
            setSelectedBooking(matched);
          }
        }
      }
    } catch (err) {
      toast.error(err.message || 'Unable to load bookings.', 'Error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/users/login', { state: { from: location.pathname } });
    } else if (isAuthenticated) {
      fetchBookings();
    }
  }, [isAuthenticated, authLoading, filterStatus]);

  // Client-side search filtering
  const filteredBookings = bookings.filter((b) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      b.bookingId.toLowerCase().includes(q) ||
      b.destinationName.toLowerCase().includes(q) ||
      b.packageName.toLowerCase().includes(q)
    );
  });

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">✓ Confirmed</span>;
      case 'completed':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">Completed</span>;
      case 'cancelled':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">Cancelled</span>;
      case 'pending':
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">Pending</span>;
    }
  };

  const tabs = [
    { id: 'all', label: 'All Bookings' },
    { id: 'confirmed', label: 'Confirmed' },
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'completed', label: 'Completed' },
    { id: 'cancelled', label: 'Cancelled' }
  ];

  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-brand-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-12 bg-[#f8fafc] min-h-[85vh]">
      <Container size="xl" className="space-y-8">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
                User Portal
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500 font-medium">
                {currentUser?.email}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
              <Luggage className="w-8 h-8 text-brand-600 stroke-[2.2]" />
              My Bookings
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              View and manage your travel reservations, payment receipts, and itineraries.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={fetchBookings}
              disabled={loading}
              className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
              title="Refresh bookings"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-brand-600' : ''}`} />
            </button>
            <Link to="/destinations">
              <Button variant="primary" size="md" iconRight={ArrowRight} className="font-bold shadow-sm">
                Explore More Destinations
              </Button>
            </Link>
          </div>
        </div>

        {/* Filter Tabs & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterStatus(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  filterStatus === tab.id
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search bookings or destinations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white text-slate-800 text-xs border border-slate-200 rounded-xl pl-9 pr-3 py-2 outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 shadow-sm"
            />
          </div>
        </div>

        {/* Bookings Content */}
        {loading ? (
          <div className="py-16 text-center">
            <RefreshCw className="w-8 h-8 text-brand-600 animate-spin mx-auto mb-3" />
            <p className="text-sm text-slate-500">Loading your reservations...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-12 text-center shadow-subtle max-w-md mx-auto my-8">
            <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-4">
              <Compass className="w-8 h-8 stroke-[2]" />
            </div>
            <h3 className="font-display font-extrabold text-xl text-slate-900 mb-2">
              No Bookings Found
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              You don't have any reservations matching this filter. Explore our curated world destinations to plan your next journey!
            </p>
            <Link to="/destinations">
              <Button variant="primary" size="md" iconRight={ArrowRight} className="font-bold shadow-md">
                Browse Destinations
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBookings.map((b) => (
              <div
                key={b._id}
                className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar: Booking ID & Status */}
                  <div className="flex items-center justify-between gap-2 pb-4 border-b border-slate-100 mb-4">
                    <span className="font-mono text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                      {b.bookingId}
                    </span>
                    {getStatusBadge(b.bookingStatus)}
                  </div>

                  {/* Destination & Package */}
                  <div className="mb-4">
                    <h3 className="font-display font-extrabold text-xl text-slate-900 leading-tight">
                      {b.destinationName}
                    </h3>
                    <span className="text-xs font-semibold text-brand-600 block mt-0.5">
                      {b.packageName}
                    </span>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mb-4 bg-slate-50 p-3.5 rounded-2xl">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-brand-600" />
                      <span>{b.days} Day{b.days > 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-brand-600" />
                      <span>{b.members} Traveler{b.members > 1 ? 's' : ''}</span>
                    </div>
                    <div className="col-span-2 pt-2 border-t border-slate-200/70 flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Total Paid:</span>
                      <span className="font-extrabold text-emerald-600 text-sm font-display">
                        ₹{Number(b.totalAmount).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    {new Date(b.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedBooking(b)}
                    className="font-bold text-xs"
                  >
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* BOOKING DETAILS MODAL */}
        {selectedBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                <div className="flex items-center gap-2.5">
                  <Receipt className="w-5 h-5 text-brand-600" />
                  <h3 className="font-display font-bold text-lg text-slate-900">
                    Booking Details
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedBooking(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-sm">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-slate-500">Booking Reference</span>
                  <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                    {selectedBooking.bookingId}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Destination</span>
                  <span className="font-bold text-slate-900">{selectedBooking.destinationName}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Package Selected</span>
                  <span className="font-semibold text-brand-600">{selectedBooking.packageName}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Price Per Day</span>
                  <span className="font-semibold text-slate-800">
                    ₹{Number(selectedBooking.pricePerDay).toLocaleString('en-IN')} / Day
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Stay Duration</span>
                  <span className="font-semibold text-slate-800">{selectedBooking.days} Days</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Members</span>
                  <span className="font-semibold text-slate-800">{selectedBooking.members} Travelers</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="font-semibold text-slate-800">
                    ₹{Number(selectedBooking.subtotal).toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Taxes &amp; Fees</span>
                  <span className="font-semibold text-slate-800">
                    {selectedBooking.tax > 0 ? `₹${Number(selectedBooking.tax).toLocaleString('en-IN')}` : 'Included (₹0)'}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                  <span className="font-bold text-slate-900 text-base">Total Amount</span>
                  <span className="font-extrabold text-emerald-600 text-lg font-display">
                    ₹{Number(selectedBooking.totalAmount).toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-slate-500">Payment Status</span>
                  <span className="font-bold text-emerald-600 capitalize">{selectedBooking.paymentStatus}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Booking Status</span>
                  {getStatusBadge(selectedBooking.bookingStatus)}
                </div>

                {selectedBooking.razorpayPaymentId && (
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <span className="text-slate-400">Razorpay Payment ID</span>
                    <span className="font-mono text-slate-600">{selectedBooking.razorpayPaymentId}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <span>Booking Date</span>
                  <span>{new Date(selectedBooking.createdAt).toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
                <Button variant="primary" size="sm" onClick={() => setSelectedBooking(null)}>
                  Done
                </Button>
              </div>
            </div>
          </div>
        )}

      </Container>
    </div>
  );
};

export default MyBookingsPage;
