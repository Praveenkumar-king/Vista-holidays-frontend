import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  Calendar,
  Users,
  Clock,
  Phone,
  Mail,
  User as UserIcon,
  Receipt,
  AlertCircle,
  Sparkles,
  MapPin,
  Luggage,
  Lock,
  Minus,
  Plus,
  RefreshCw,
  ExternalLink,
  Info
} from 'lucide-react';
import { Container } from '../components/layout/Container';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { bookingService } from '../services/bookingService';
import { getDestinationById } from '../data/destinations';
import {
  getPackagesForDestination,
  calculateBookingPrice
} from '../data/destinationPackages';

/**
 * Dynamically loads the official Razorpay Checkout JavaScript SDK
 */
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const { currentUser, isAuthenticated, loading: authLoading } = useAuth();

  // Retrieve initial draft either from react-router navigation state or sessionStorage
  const initialDraft = useMemo(() => {
    if (location.state && location.state.destinationId) {
      return location.state;
    }
    try {
      const saved = sessionStorage.getItem('vista_checkout_draft');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.destinationId) {
          return parsed;
        }
      }
    } catch {
      // Ignored
    }
    return null;
  }, [location.state]);

  // Destination Catalog Details
  const destination = useMemo(() => {
    if (!initialDraft?.destinationId) return null;
    const fromCatalog = getDestinationById(initialDraft.destinationId);
    if (fromCatalog) return fromCatalog;
    // Fallback to embedded destination object if passed in draft
    return initialDraft.destination || {
      id: initialDraft.destinationId,
      name: initialDraft.destinationName || 'Destination',
      country: initialDraft.country || '',
      image: ''
    };
  }, [initialDraft]);

  // Destination Packages Catalog
  const packages = useMemo(() => {
    if (!destination?.id) return [];
    return getPackagesForDestination(destination.id);
  }, [destination?.id]);

  // Form State
  const [selectedPackageId, setSelectedPackageId] = useState(
    initialDraft?.packageId || packages[0]?.id || 'standard'
  );

  const [days, setDays] = useState(
    Math.max(1, parseInt(initialDraft?.days, 10) || 3)
  );

  const [members, setMembers] = useState(
    Math.max(1, parseInt(initialDraft?.members, 10) || 2)
  );

  const todayStr = useMemo(() => {
    return new Date().toISOString().split('T')[0];
  }, []);

  const [checkInDate, setCheckInDate] = useState(() => {
    if (initialDraft?.checkInDate) {
      return initialDraft.checkInDate;
    }
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });

  const [mobile, setMobile] = useState(
    currentUser?.mobile || initialDraft?.mobile || ''
  );

  // Sync mobile when currentUser loads
  useEffect(() => {
    if (currentUser?.mobile && !mobile) {
      setMobile(currentUser.mobile);
    }
  }, [currentUser?.mobile, mobile]);

  // Payment Execution & Confirmation States
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [phoneError, setPhoneError] = useState('');

  // Currently Selected Package Tier
  const selectedPackage = useMemo(() => {
    return packages.find((p) => p.id === selectedPackageId) || packages[0] || {
      id: 'standard',
      name: initialDraft?.packageName || 'Standard Explorer',
      pricePerDay: initialDraft?.pricePerDay || 5000
    };
  }, [packages, selectedPackageId, initialDraft]);

  // Authoritative Dynamic Pricing (Recalculates on any configuration change)
  const pricing = useMemo(() => {
    return calculateBookingPrice({
      destinationId: destination?.id || initialDraft?.destinationId,
      packageId: selectedPackage.id,
      days,
      members
    });
  }, [destination?.id, initialDraft?.destinationId, selectedPackage.id, days, members]);

  // Sync updated configuration back to sessionStorage draft so navigation back preserves changes
  useEffect(() => {
    if (destination?.id && !confirmedBooking) {
      const updatedDraft = {
        destinationId: destination.id,
        destinationName: destination.name,
        country: destination.country || '',
        destination,
        packageId: selectedPackage.id,
        packageName: selectedPackage.name,
        selectedPackage,
        pricePerDay: pricing.pricePerDay,
        checkInDate,
        days,
        members,
        subtotal: pricing.subtotal,
        tax: pricing.tax,
        totalAmount: pricing.totalAmount,
        currency: pricing.currency || 'INR',
        mobile
      };
      try {
        sessionStorage.setItem('vista_checkout_draft', JSON.stringify(updatedDraft));
      } catch {
        // Ignored
      }
    }
  }, [destination, selectedPackage, pricing, checkInDate, days, members, mobile, confirmedBooking]);

  // Stay Duration Adjusters
  const handleDaysDecrement = () => setDays((prev) => Math.max(1, prev - 1));
  const handleDaysIncrement = () => setDays((prev) => prev + 1);

  // Members Adjusters
  const handleMembersDecrement = () => setMembers((prev) => Math.max(1, prev - 1));
  const handleMembersIncrement = () => setMembers((prev) => Math.min(25, prev + 1));

  // Form Validation
  const validateForm = () => {
    setPhoneError('');
    setErrorMessage('');

    if (!isAuthenticated) {
      toast.info('Please sign in to complete your booking.', 'Sign In Required');
      navigate('/user/login', { state: { from: '/checkout' } });
      return false;
    }

    const cleanMobile = mobile.trim();
    if (!cleanMobile) {
      setPhoneError('Please enter a valid contact phone number.');
      return false;
    }

    // Phone digits sanity validation (accepts 10-15 digits, optional leading +)
    const phoneRegex = /^[+]?[\d\s-]{7,16}$/;
    if (!phoneRegex.test(cleanMobile.replace(/\s+/g, ''))) {
      setPhoneError('Please enter a valid phone number (e.g., +91 9876543210).');
      return false;
    }

    if (!checkInDate) {
      setErrorMessage('Please select a valid check-in date.');
      return false;
    }

    const checkInTime = new Date(checkInDate).getTime();
    const todayTime = new Date(todayStr).getTime();
    if (isNaN(checkInTime) || checkInTime < todayTime) {
      setErrorMessage('Check-in date cannot be in the past. Please select today or a future date.');
      return false;
    }

    if (days < 1) {
      setErrorMessage('Stay duration must be at least 1 day.');
      return false;
    }

    if (members < 1) {
      setErrorMessage('Number of travelers must be at least 1.');
      return false;
    }

    return true;
  };

  // Primary Payment Action: Pay ₹{totalAmount}
  const handlePayment = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);
    setErrorMessage('');

    try {
      toast.info('Initiating secure checkout session with server...', 'Processing');

      // 1. Request Checkout Order from authoritative backend
      const checkoutRes = await bookingService.createCheckout({
        destinationId: destination.id,
        destinationName: destination.name,
        country: destination.country || '',
        checkInDate,
        packageId: selectedPackage.id,
        days,
        members,
        mobile: mobile.trim()
      });

      if (!checkoutRes.success || !checkoutRes.data) {
        throw new Error(checkoutRes.message || 'Unable to create checkout order session.');
      }

      const orderData = checkoutRes.data;

      // 2. Simulated Payment Mode (Development when no live credentials configured)
      if (orderData.isSimulated || !orderData.keyId || orderData.keyId === 'rzp_test_simulation') {
        toast.info('Verifying payment in secure test mode...', 'Payment Verification');
        await new Promise((resolve) => setTimeout(resolve, 800));

        const simPaymentId = `pay_sim_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        const verifyRes = await bookingService.verifyPayment({
          bookingId: orderData.bookingId,
          razorpayOrderId: orderData.orderId,
          razorpayPaymentId: simPaymentId,
          razorpaySignature: 'simulated_signature'
        });

        if (verifyRes.success && verifyRes.data) {
          toast.success('Payment verified! Booking confirmed 🎉', 'Payment Successful');
          setConfirmedBooking({
            ...verifyRes.data.booking,
            country: destination.country || verifyRes.data.booking.country || '',
            checkInDate: checkInDate || verifyRes.data.booking.checkInDate
          });
          sessionStorage.removeItem('vista_checkout_draft');
        } else {
          throw new Error(verifyRes.message || 'Payment verification failed.');
        }
        return;
      }

      // 3. Live Razorpay Payment Gateway Flow
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        throw new Error(
          'Could not load secure payment gateway. Please check your internet connection and retry.'
        );
      }

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'Vista Holidays',
        description: `${destination.name} - ${orderData.packageName}`,
        image: 'https://res.cloudinary.com/dkzkasg7x/image/upload/v1789387703/Vista_Holidays_Logo.png',
        order_id: orderData.orderId,
        prefill: {
          name: currentUser?.name || '',
          email: currentUser?.email || '',
          contact: mobile.trim()
        },
        theme: {
          color: '#0e87ea'
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            toast.warning('Payment was cancelled. You can retry whenever you are ready.', 'Payment Cancelled');
          }
        },
        handler: async (response) => {
          try {
            toast.info('Cryptographically verifying payment with server...', 'Verifying');
            const verifyRes = await bookingService.verifyPayment({
              bookingId: orderData.bookingId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature
            });

            if (verifyRes.success && verifyRes.data) {
              toast.success('Payment verified! Booking confirmed 🎉', 'Booking Confirmed');
              setConfirmedBooking({
                ...verifyRes.data.booking,
                country: destination.country || verifyRes.data.booking.country || '',
                checkInDate: checkInDate || verifyRes.data.booking.checkInDate
              });
              sessionStorage.removeItem('vista_checkout_draft');
            } else {
              throw new Error(verifyRes.message || 'Payment verification failed.');
            }
          } catch (verErr) {
            const errText = verErr.message || 'Payment verification failed on the server.';
            setErrorMessage(errText);
            toast.error(errText, 'Verification Failed');
          } finally {
            setIsProcessing(false);
          }
        }
      };

      const rzpInstance = new window.Razorpay(options);
      rzpInstance.on('payment.failed', (response) => {
        setIsProcessing(false);
        const reason = response.error?.description || 'Payment was declined by your bank or payment provider.';
        setErrorMessage(reason);
        toast.error(reason, 'Payment Failed');
      });

      rzpInstance.open();
    } catch (err) {
      const msg = err.message || 'Unable to complete payment session. Please try again.';
      setErrorMessage(msg);
      toast.error(msg, 'Payment Error');
    } finally {
      if (!confirmedBooking) {
        setIsProcessing(false);
      }
    }
  };

  // Formatted date helper
  const formattedCheckInDisplay = useMemo(() => {
    if (!checkInDate) return 'Flexible / Not Selected';
    try {
      const d = new Date(checkInDate);
      if (isNaN(d.getTime())) return checkInDate;
      return d.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return checkInDate;
    }
  }, [checkInDate]);

  // =========================================================================
  // CASE 1: MISSING OR INVALID BOOKING STATE (Requirement 3)
  // =========================================================================
  if (!initialDraft || !destination) {
    return (
      <div className="py-12 sm:py-20 min-h-[75vh] flex items-center justify-center">
        <Container size="sm">
          <Card variant="default" className="text-center p-8 sm:p-12 shadow-card border-slate-200">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto mb-5 shadow-sm">
              <Luggage className="w-8 h-8 stroke-[2.2]" />
            </div>

            <Badge variant="accent" size="sm" className="mb-3 mx-auto">
              No Active Booking Session
            </Badge>

            <CardTitle as="h1" className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3">
              Checkout Unavailable
            </CardTitle>

            <CardDescription className="text-slate-500 max-w-sm mx-auto mb-8 text-sm sm:text-base leading-relaxed">
              You haven't selected a trip package yet, or your previous booking session has expired. Browse our world-class destinations to begin.
            </CardDescription>

            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Link to="/destinations">
                <Button variant="primary" size="md" iconLeft={ArrowLeft} className="w-full sm:w-auto font-bold shadow-sm">
                  Explore Destinations
                </Button>
              </Link>
              <Link to="/">
                <Button variant="secondary" size="md" className="w-full sm:w-auto font-semibold">
                  Return to Home
                </Button>
              </Link>
            </div>
          </Card>
        </Container>
      </div>
    );
  }

  // =========================================================================
  // CASE 2: CONFIRMED BOOKING STATE (Requirement 16)
  // =========================================================================
  if (confirmedBooking) {
    const formattedBookingDate = confirmedBooking.createdAt
      ? new Date(confirmedBooking.createdAt).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })
      : new Date().toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });

    const confirmedCheckIn = confirmedBooking.checkInDate
      ? new Date(confirmedBooking.checkInDate).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })
      : formattedCheckInDisplay;

    return (
      <div className="py-10 sm:py-16 min-h-[85vh] bg-[#f8fafc]">
        <Container size="md">
          <Card variant="default" className="p-6 sm:p-10 shadow-card border-slate-200 text-center space-y-6">
            
            {/* Success Icon */}
            <div className="w-20 h-20 rounded-3xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto text-4xl shadow-inner animate-bounce-slow">
              🎉
            </div>

            {/* Header */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Booking Confirmed 🎉
              </div>
              <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-slate-900 tracking-tight">
                You're Going to {confirmedBooking.destinationName}!
              </h1>
              <p className="text-sm sm:text-base text-slate-600 max-w-md mx-auto mt-2">
                We've sent a verified reservation receipt and travel itinerary to{' '}
                <strong className="text-slate-800 font-semibold">{confirmedBooking.email}</strong>.
              </p>
            </div>

            {/* Confirmation Details Card */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200/90 p-5 sm:p-6 text-left text-sm space-y-3.5 max-w-lg mx-auto shadow-subtle">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
                <span className="text-slate-500 font-medium">Booking ID</span>
                <span className="font-mono font-bold text-slate-900 bg-white px-3 py-1 rounded-lg border border-slate-200 shadow-sm text-sm">
                  {confirmedBooking.bookingId}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">Destination</span>
                <span className="font-bold text-slate-900">
                  {confirmedBooking.destinationName}
                  {confirmedBooking.country ? `, ${confirmedBooking.country}` : ''}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">Selected Package</span>
                <span className="font-semibold text-brand-600">{confirmedBooking.packageName}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">Check-in Date</span>
                <span className="font-semibold text-slate-900">{confirmedCheckIn}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">Stay Duration</span>
                <span className="font-semibold text-slate-900">
                  {confirmedBooking.days} Day{confirmedBooking.days > 1 ? 's' : ''}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">Travelers</span>
                <span className="font-semibold text-slate-900">
                  {confirmedBooking.members} Traveler{confirmedBooking.members > 1 ? 's' : ''}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">Payment Status</span>
                <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-xs border border-emerald-200">
                  ✓ Paid
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">Booking Date</span>
                <span className="font-semibold text-slate-800">{formattedBookingDate}</span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-200/80">
                <span className="text-slate-900 font-bold text-base">Amount Paid</span>
                <span className="text-emerald-600 font-extrabold text-xl font-display">
                  ₹{Number(confirmedBooking.totalAmount).toLocaleString('en-IN')}
                </span>
              </div>

              {confirmedBooking.razorpayPaymentId && (
                <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-100">
                  <span>Payment Reference</span>
                  <span className="font-mono text-slate-600">{confirmedBooking.razorpayPaymentId}</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2 max-w-md mx-auto">
              <Link to="/user/bookings" className="w-full sm:w-auto flex-1">
                <Button variant="primary" size="md" className="w-full justify-center shadow-md font-bold py-3">
                  View My Booking
                </Button>
              </Link>
              <Link to="/destinations" className="w-full sm:w-auto flex-1">
                <Button variant="outline" size="md" className="w-full justify-center font-semibold py-3">
                  Explore More Destinations
                </Button>
              </Link>
            </div>
          </Card>
        </Container>
      </div>
    );
  }

  // =========================================================================
  // CASE 3: ACTIVE DEDICATED CHECKOUT INTERFACE
  // =========================================================================
  return (
    <div className="py-8 sm:py-12 bg-[#f8fafc] min-h-[90vh]">
      <Container size="xl" className="space-y-8">
        
        {/* =================================================================== */}
        {/* PAGE HEADER & BACK ACTION (Requirement 5 & 24)                      */}
        {/* =================================================================== */}
        <div className="space-y-4 pb-4 border-b border-slate-200">
          <Link
            to={`/destinations/${destination.id}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-brand-600 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Trip</span>
          </Link>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
                Secure Reservation Portal
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs font-semibold text-slate-500">
                Authoritative Pricing
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-slate-900 tracking-tight">
              Vista Holidays Checkout
            </h1>
            <p className="text-sm sm:text-base text-slate-500 mt-1 max-w-2xl">
              Review your trip details and complete your booking securely.
            </p>
          </div>
        </div>

        {/* Global Error Banner */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-3 animate-fade-in shadow-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-600" />
            <div className="flex-1">
              <strong className="font-bold block mb-0.5">Payment Notice</strong>
              <span>{errorMessage}</span>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TWO-COLUMN CHECKOUT LAYOUT (Requirement 6)                          */}
        {/* =================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* ================================================================= */}
          {/* LEFT SIDE: Customer Info, Booking Details, Payment Section        */}
          {/* ================================================================= */}
          <div className="lg:col-span-7 space-y-6">

            {/* --------------------------------------------------------------- */}
            {/* 1. CUSTOMER INFORMATION (Requirement 7)                         */}
            {/* --------------------------------------------------------------- */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-6 sm:p-7 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-base sm:text-lg text-slate-900 leading-tight">
                      Customer Information
                    </h2>
                    <p className="text-xs text-slate-400">
                      Authenticated traveler credentials &amp; contact
                    </p>
                  </div>
                </div>
                {isAuthenticated && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified Account
                  </span>
                )}
              </div>

              {isAuthenticated ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Full Name */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                        Full Name
                      </span>
                      <strong className="text-slate-800 text-sm font-semibold truncate block">
                        {currentUser?.name || 'Traveler'}
                      </strong>
                    </div>

                    {/* Email */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                        Email Address
                      </span>
                      <strong className="text-slate-800 text-sm font-semibold truncate block">
                        {currentUser?.email}
                      </strong>
                    </div>
                  </div>

                  {/* Contact Phone (Editable with validation) */}
                  <div>
                    <label
                      htmlFor="contact-phone-input"
                      className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5"
                    >
                      Contact Phone <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <Phone className="w-4 h-4 absolute left-3.5 text-slate-400 pointer-events-none" />
                      <input
                        id="contact-phone-input"
                        type="tel"
                        value={mobile}
                        onChange={(e) => {
                          setMobile(e.target.value);
                          if (phoneError) setPhoneError('');
                        }}
                        placeholder="e.g. +91 9876543210"
                        required
                        className={`w-full bg-white text-slate-900 text-sm border rounded-xl pl-10 pr-3.5 py-2.5 focus:ring-2 focus:outline-none transition-all ${
                          phoneError
                            ? 'border-rose-400 focus:ring-rose-500/20 focus:border-rose-500'
                            : 'border-slate-200 focus:ring-brand-500/20 focus:border-brand-500 hover:border-slate-300'
                        }`}
                      />
                    </div>
                    {phoneError ? (
                      <p className="mt-1 text-xs text-rose-600 font-medium">{phoneError}</p>
                    ) : (
                      <p className="mt-1 text-[11px] text-slate-400">
                        Required for urgent itinerary updates and SMS flight/hotel telemetry.
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-amber-900 space-y-3">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-sm text-amber-900">Sign In Required</h4>
                      <p className="text-xs text-amber-800/90 mt-0.5 leading-relaxed">
                        Please log in to your Vista Holidays account to complete this booking. Your trip selections will be saved.
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate('/user/login', { state: { from: '/checkout' } })}
                    className="w-full sm:w-auto font-bold bg-amber-600 hover:bg-amber-700 border-amber-600"
                  >
                    Sign In to Continue
                  </Button>
                </div>
              )}
            </div>

            {/* --------------------------------------------------------------- */}
            {/* 2. BOOKING DETAILS (Requirement 8)                              */}
            {/* --------------------------------------------------------------- */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-6 sm:p-7 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                    <Luggage className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-base sm:text-lg text-slate-900 leading-tight">
                      Booking Details
                    </h2>
                    <p className="text-xs text-slate-400">
                      Destination, package configuration &amp; schedule
                    </p>
                  </div>
                </div>
                <Badge variant="brand" size="sm">
                  {destination.name}
                </Badge>
              </div>

              {/* Destination & Country Banner */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-slate-50 to-brand-50/40 border border-slate-200/80">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center font-display font-extrabold text-base shadow-sm">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-extrabold text-base sm:text-lg text-slate-900 leading-tight">
                      {destination.name}
                    </h3>
                    <span className="text-xs text-slate-500 font-medium">
                      {destination.country || 'Worldwide'}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Package Tier</span>
                  <span className="text-xs sm:text-sm font-bold text-brand-600">
                    {selectedPackage.name}
                  </span>
                </div>
              </div>

              {/* Package Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Package Experience
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {packages.map((pkg) => {
                    const isSelected = pkg.id === selectedPackageId;
                    return (
                      <button
                        key={pkg.id}
                        type="button"
                        onClick={() => setSelectedPackageId(pkg.id)}
                        className={`p-3 rounded-2xl text-left border transition-all relative ${
                          isSelected
                            ? 'border-brand-500 bg-brand-50/60 ring-2 ring-brand-500/20 shadow-subtle'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        {pkg.badge && (
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider block mb-1 w-max ${
                            isSelected ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {pkg.badge}
                          </span>
                        )}
                        <div className="font-display font-bold text-xs sm:text-sm text-slate-900 leading-snug">
                          {pkg.name}
                        </div>
                        <div className="text-xs font-extrabold text-brand-600 mt-1">
                          ₹{pkg.pricePerDay.toLocaleString('en-IN')}{' '}
                          <span className="text-[10px] text-slate-400 font-normal">/ day</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Check-in Date, Duration & Members Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
                
                {/* Check-in Date */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                  <label
                    htmlFor="checkout-check-in-date"
                    className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5"
                  >
                    <Calendar className="w-3.5 h-3.5 text-brand-600" />
                    Check-in Date
                  </label>
                  <input
                    id="checkout-check-in-date"
                    type="date"
                    min={todayStr}
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="w-full bg-white border border-slate-200 text-slate-800 text-xs sm:text-sm font-semibold rounded-xl px-2.5 py-2 outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 shadow-sm"
                  />
                </div>

                {/* Stay Duration */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-brand-600" />
                    Stay Duration
                  </span>
                  <div className="flex items-center justify-between pt-0.5">
                    <button
                      type="button"
                      onClick={handleDaysDecrement}
                      disabled={days <= 1}
                      className="w-8 h-8 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-700 hover:bg-slate-100 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                      aria-label="Decrease stay duration by 1 day"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-display font-extrabold text-base text-slate-900">
                      {days} Day{days > 1 ? 's' : ''}
                    </span>
                    <button
                      type="button"
                      onClick={handleDaysIncrement}
                      className="w-8 h-8 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-700 hover:bg-slate-100 active:scale-95 transition-all"
                      aria-label="Increase stay duration by 1 day"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Number of Travelers */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-brand-600" />
                    Travelers
                  </span>
                  <div className="flex items-center justify-between pt-0.5">
                    <button
                      type="button"
                      onClick={handleMembersDecrement}
                      disabled={members <= 1}
                      className="w-8 h-8 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-700 hover:bg-slate-100 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                      aria-label="Decrease travelers by 1"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-display font-extrabold text-base text-slate-900">
                      {members} Traveler{members > 1 ? 's' : ''}
                    </span>
                    <button
                      type="button"
                      onClick={handleMembersIncrement}
                      className="w-8 h-8 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-700 hover:bg-slate-100 active:scale-95 transition-all"
                      aria-label="Increase travelers by 1"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>

              {/* Clean Selected Specs Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 block">Price / Day:</span>
                  <strong className="text-slate-800">₹{pricing.pricePerDay.toLocaleString('en-IN')}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Check-in:</span>
                  <strong className="text-slate-800">{formattedCheckInDisplay}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Duration:</span>
                  <strong className="text-slate-800">{days} Day{days > 1 ? 's' : ''}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Travelers:</span>
                  <strong className="text-slate-800">{members} Traveler{members > 1 ? 's' : ''}</strong>
                </div>
              </div>
            </div>

            {/* --------------------------------------------------------------- */}
            {/* 3. PAYMENT INFORMATION SECTION (Requirement 11)                 */}
            {/* --------------------------------------------------------------- */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-6 sm:p-7 space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-base sm:text-lg text-slate-900 leading-tight">
                    Secure Payment
                  </h2>
                  <p className="text-xs text-slate-400">
                    Payment will be processed securely through the existing payment integration.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs text-slate-600">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-2.5">
                  <Lock className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>256-Bit SSL Encrypted Checkout</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Authoritative Pricing Verified</span>
                </div>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed pt-1">
                Your payment is authorized through 3D Secure verification. Once confirmed, you will receive an instant official confirmation email with your booking reference.
              </p>
            </div>

          </div>

          {/* ================================================================= */}
          {/* RIGHT SIDE: Booking Summary & Primary Payment CTA (Req 9, 10, 12) */}
          {/* ================================================================= */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
            
            {/* Premium Booking Summary Card */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-6 sm:p-7 space-y-6">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600">
                    Order Overview
                  </span>
                  <h2 className="font-display font-extrabold text-xl text-slate-900 mt-0.5">
                    Booking Summary
                  </h2>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
                  <Receipt className="w-5 h-5" />
                </div>
              </div>

              {/* Destination Header Card */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 text-sm">
                <div>
                  <span className="font-display font-extrabold text-slate-900 block text-base">
                    {destination.name}
                  </span>
                  <span className="text-xs text-slate-500">
                    {destination.country || 'Global Travel'}
                  </span>
                </div>
                <Badge variant="brand" size="sm">
                  {selectedPackage.name}
                </Badge>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Price Per Day:</span>
                  <span className="font-semibold text-slate-900">
                    ₹{pricing.pricePerDay.toLocaleString('en-IN')} / Day
                  </span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Check-in Date:</span>
                  <span className="font-semibold text-slate-900">
                    {formattedCheckInDisplay}
                  </span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Stay Duration:</span>
                  <span className="font-semibold text-slate-900">
                    {days} Day{days > 1 ? 's' : ''}
                  </span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Travelers:</span>
                  <span className="font-semibold text-slate-900">
                    {members} Traveler{members > 1 ? 's' : ''}
                  </span>
                </div>

                <div className="flex justify-between text-slate-600 pt-2 border-t border-slate-100">
                  <span>Subtotal ({days}d × {members}p):</span>
                  <span className="font-semibold text-slate-900">
                    ₹{pricing.subtotal.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Taxes &amp; Fees:</span>
                  <span className="text-slate-500 font-medium">
                    {pricing.tax > 0 ? `₹${pricing.tax.toLocaleString('en-IN')}` : 'Included (₹0)'}
                  </span>
                </div>

                {/* Total Authoritative Amount */}
                <div className="flex justify-between items-center pt-3 border-t border-slate-200 text-base">
                  <div>
                    <span className="font-display font-extrabold text-slate-900 block text-lg">
                      Total Amount
                    </span>
                    <span className="text-[11px] text-slate-400 font-normal">
                      Authoritative pricing verified
                    </span>
                  </div>
                  <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 font-display">
                    ₹{pricing.totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* ============================================================= */}
              {/* PRIMARY PAYMENT BUTTON (Requirement 12 STRICT REQUIREMENT)    */}
              {/* MUST ONLY BE: Pay ₹{totalAmount}                              */}
              {/* MUST NOT CONTAIN THE WORD "Razorpay"                          */}
              {/* ============================================================= */}
              <div className="space-y-3 pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handlePayment}
                  loading={isProcessing}
                  disabled={isProcessing || !isAuthenticated}
                  iconLeft={CreditCard}
                  className="w-full justify-center font-display font-extrabold text-base sm:text-lg py-4 shadow-lg bg-emerald-600 hover:bg-emerald-700 border-emerald-600 active:scale-[0.99] transition-all"
                >
                  Pay ₹{pricing.totalAmount.toLocaleString('en-IN')}
                </Button>

                {!isAuthenticated && (
                  <p className="text-[11px] text-center text-amber-700 font-medium">
                    * Please sign in above to enable payment.
                  </p>
                )}

                <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 pt-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Verified 256-bit secure gateway</span>
                </div>
              </div>

            </div>

            {/* Support Notice */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-500 flex items-center justify-between">
              <span>Need help with your booking?</span>
              <Link to="/contact" className="font-semibold text-brand-600 hover:underline">
                Contact Concierge
              </Link>
            </div>

          </div>

        </div>

      </Container>
    </div>
  );
};

export default CheckoutPage;
