import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  X,
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  Calendar,
  Users,
  MapPin,
  Sparkles,
  ArrowRight,
  AlertCircle,
  Clock,
  Phone,
  Mail,
  User as UserIcon,
  Receipt
} from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { bookingService } from '../../services/bookingService';

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

export const CheckoutModal = ({
  isOpen,
  onClose,
  destination,
  selectedPackage,
  days,
  members,
  pricing
}) => {
  const { currentUser, isAuthenticated } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [mobile, setMobile] = useState(currentUser?.mobile || '');
  const [loading, setLoading] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handlePay = async () => {
    if (!isAuthenticated) {
      toast.info('Please sign in to proceed with your booking.', 'Sign In Required');
      navigate('/users/login', { state: { from: window.location.pathname } });
      return;
    }

    const cleanMobile = mobile.trim() || currentUser?.mobile;
    if (!cleanMobile) {
      setErrorMessage('Please provide a contact mobile number for booking updates.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      // 1. Request Checkout & Order Creation from authoritative backend
      toast.info('Initiating secure checkout session...', 'Processing');
      const checkoutRes = await bookingService.createCheckout({
        destinationId: destination.id,
        destinationName: destination.name,
        packageId: selectedPackage.id,
        days,
        members,
        mobile: cleanMobile
      });

      if (!checkoutRes.success || !checkoutRes.data) {
        throw new Error(checkoutRes.message || 'Unable to create checkout order.');
      }

      const orderData = checkoutRes.data;
      toast.success('Checkout created. Opening payment gateway...', 'Checkout Created');

      // 2. Check if simulated or live Razorpay
      if (orderData.isSimulated || !orderData.keyId || orderData.keyId === 'rzp_test_simulation') {
        // Dev Simulation Mode: simulate instant successful payment without third-party popups
        await new Promise((r) => setTimeout(r, 900));

        const simPaymentId = `pay_sim_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        const verifyRes = await bookingService.verifyPayment({
          bookingId: orderData.bookingId,
          razorpayOrderId: orderData.orderId,
          razorpayPaymentId: simPaymentId,
          razorpaySignature: 'simulated_signature'
        });

        if (verifyRes.success && verifyRes.data) {
          toast.success('Payment verified! Booking confirmed 🎉', 'Payment Successful');
          setConfirmedBooking(verifyRes.data.booking);
        } else {
          throw new Error(verifyRes.message || 'Payment verification failed.');
        }
        return;
      }

      // 3. Live Razorpay Flow
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        throw new Error('Could not load Razorpay payment gateway. Please check your internet connection.');
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
          contact: cleanMobile
        },
        theme: {
          color: '#0e87ea'
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            toast.warning('Payment was cancelled.', 'Payment Cancelled');
          }
        },
        handler: async (response) => {
          try {
            toast.info('Verifying payment signature with server...', 'Verifying');
            const verifyRes = await bookingService.verifyPayment({
              bookingId: orderData.bookingId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature
            });

            if (verifyRes.success && verifyRes.data) {
              toast.success('Payment verified! Booking confirmed 🎉', 'Booking Confirmed');
              setConfirmedBooking(verifyRes.data.booking);
            } else {
              throw new Error(verifyRes.message || 'Payment verification failed.');
            }
          } catch (verErr) {
            setErrorMessage(verErr.message || 'Payment verification failed on the server.');
            toast.error(verErr.message || 'Payment verification failed.', 'Verification Failed');
          } finally {
            setLoading(false);
          }
        }
      };

      const rzpInstance = new window.Razorpay(options);
      rzpInstance.on('payment.failed', (response) => {
        setLoading(false);
        const reason = response.error?.description || 'Payment was declined.';
        setErrorMessage(reason);
        toast.error(reason, 'Payment Failed');
      });

      rzpInstance.open();
    } catch (err) {
      setErrorMessage(err.message || 'Unable to complete payment.');
      toast.error(err.message || 'Payment could not be completed.', 'Payment Error');
    } finally {
      if (!confirmedBooking) {
        setLoading(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="px-6 sm:px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-600 flex items-center justify-center">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-slate-900 leading-tight">
                {confirmedBooking ? 'Booking Confirmed 🎉' : 'Vista Holidays Checkout'}
              </h3>
              <p className="text-xs text-slate-500">
                {confirmedBooking ? 'Your travel itinerary is confirmed' : 'Review your trip details and complete payment'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto space-y-6">
          
          {/* SUCCESS STATE */}
          {confirmedBooking ? (
            <div className="text-center py-4 space-y-6 animate-fade-in">
              <div className="w-16 h-16 rounded-3xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto text-3xl shadow-inner animate-bounce-slow">
                🎉
              </div>

              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Confirmed &amp; Paid
                </div>
                <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900">
                  You're Going to {confirmedBooking.destinationName}!
                </h2>
                <p className="text-sm text-slate-600 max-w-md mx-auto mt-1">
                  We've sent an official confirmation and itinerary to <strong className="text-slate-800">{confirmedBooking.email}</strong>.
                </p>
              </div>

              {/* Confirmation Details Card */}
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 text-left text-sm space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
                  <span className="text-slate-500 font-medium">Booking ID</span>
                  <span className="font-mono font-bold text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                    {confirmedBooking.bookingId}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Destination</span>
                  <span className="font-bold text-slate-900">{confirmedBooking.destinationName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Package</span>
                  <span className="font-semibold text-brand-600">{confirmedBooking.packageName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Stay Duration</span>
                  <span className="font-semibold text-slate-900">{confirmedBooking.days} Day{confirmedBooking.days > 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Members</span>
                  <span className="font-semibold text-slate-900">{confirmedBooking.members} Traveler{confirmedBooking.members > 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-slate-200/80">
                  <span className="text-slate-900 font-bold">Amount Paid</span>
                  <span className="text-emerald-600 font-extrabold text-lg">
                    ₹{Number(confirmedBooking.totalAmount).toLocaleString('en-IN')}
                  </span>
                </div>
                {confirmedBooking.razorpayPaymentId && (
                  <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                    <span>Payment Reference</span>
                    <span className="font-mono">{confirmedBooking.razorpayPaymentId}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <Link to="/users/bookings" className="w-full sm:w-auto">
                  <Button variant="primary" size="md" iconRight={ArrowRight} className="w-full justify-center shadow-md font-bold">
                    View My Bookings
                  </Button>
                </Link>
                <Button variant="outline" size="md" onClick={onClose} className="w-full sm:w-auto justify-center">
                  Close &amp; Keep Browsing
                </Button>
              </div>
            </div>
          ) : (
            /* CHECKOUT FORM STATE */
            <>
              {errorMessage && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-3 animate-fade-in">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* 1. BOOKING SUMMARY */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                  <Receipt className="w-3.5 h-3.5 text-brand-600" />
                  Booking Summary
                </h4>
                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-2.5 text-sm">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                    <div>
                      <span className="font-bold text-slate-900 text-base">{destination.name}</span>
                      <span className="text-slate-400 text-xs block">{destination.country}</span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-brand-50 border border-brand-100 text-brand-700 text-xs font-bold">
                      {selectedPackage.name}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600 pt-1">
                    <span>Price Per Day:</span>
                    <span className="font-semibold text-slate-900">₹{pricing.pricePerDay.toLocaleString('en-IN')} / day</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Stay Duration:</span>
                    <span className="font-semibold text-slate-900">{days} Day{days > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Number of Members:</span>
                    <span className="font-semibold text-slate-900">{members} Traveler{members > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal ({days}d × {members}p):</span>
                    <span className="font-semibold text-slate-900">₹{pricing.subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Taxes &amp; Fees:</span>
                    <span className="text-slate-500 font-medium">{pricing.tax > 0 ? `₹${pricing.tax.toLocaleString('en-IN')}` : 'Included (₹0)'}</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-slate-200 text-base">
                    <span className="font-extrabold text-slate-900">Total Amount:</span>
                    <span className="text-xl font-extrabold text-emerald-600 font-display">
                      ₹{pricing.totalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* 2. CUSTOMER INFORMATION */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                  <UserIcon className="w-3.5 h-3.5 text-brand-600" />
                  Customer Information
                </h4>
                {isAuthenticated ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                      <span className="text-slate-400 block mb-1">Full Name</span>
                      <strong className="text-slate-800 text-sm truncate block">{currentUser?.name}</strong>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                      <span className="text-slate-400 block mb-1">Account Email</span>
                      <strong className="text-slate-800 text-sm truncate block">{currentUser?.email}</strong>
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 block mb-1 font-medium">Contact Phone</label>
                      <div className="relative flex items-center">
                        <Phone className="w-3.5 h-3.5 absolute left-3 text-slate-400 pointer-events-none" />
                        <input
                          type="tel"
                          value={mobile}
                          onChange={(e) => setMobile(e.target.value)}
                          placeholder="Phone number"
                          required
                          className="w-full bg-white text-slate-800 text-sm border border-slate-200 rounded-xl pl-9 pr-3 py-2 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-800 flex items-center justify-between">
                    <span>You must be logged in to confirm this reservation.</span>
                    <Link to="/users/login">
                      <Button variant="secondary" size="sm" className="font-bold">
                        Sign In First
                      </Button>
                    </Link>
                  </div>
                )}
              </div>

              {/* 3. PAYMENT SECTION */}
              <div className="pt-2 border-t border-slate-100 space-y-4">
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Secure 256-bit SSL Encrypted Payment</span>
                  </div>
                  <span className="font-bold text-slate-700">Powered by Razorpay</span>
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  onClick={handlePay}
                  loading={loading}
                  disabled={loading || !isAuthenticated}
                  iconLeft={CreditCard}
                  className="w-full justify-center font-bold text-base py-3.5 shadow-lg bg-emerald-600 hover:bg-emerald-700 border-emerald-600"
                >
                  Pay with Razorpay — ₹{pricing.totalAmount.toLocaleString('en-IN')}
                </Button>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
