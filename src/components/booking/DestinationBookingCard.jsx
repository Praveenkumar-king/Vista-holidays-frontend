import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Users, 
  Minus, 
  Plus, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Check, 
  CreditCard,
  Luggage,
  Clock
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { 
  getPackagesForDestination, 
  calculateBookingPrice 
} from '../../data/destinationPackages';

export const DestinationBookingCard = ({ destination }) => {
  const navigate = useNavigate();

  const packages = useMemo(() => {
    return getPackagesForDestination(destination?.id);
  }, [destination?.id]);

  const todayStr = useMemo(() => {
    return new Date().toISOString().split('T')[0];
  }, []);

  const defaultCheckInDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  }, []);

  // Restore draft if user navigated back from checkout
  const [selectedPackageId, setSelectedPackageId] = useState(() => {
    try {
      const saved = sessionStorage.getItem('vista_checkout_draft');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.destinationId === destination?.id && parsed.packageId) {
          return parsed.packageId;
        }
      }
    } catch {}
    return packages[0]?.id || 'standard';
  });

  const [days, setDays] = useState(() => {
    try {
      const saved = sessionStorage.getItem('vista_checkout_draft');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.destinationId === destination?.id && parsed.days) {
          return Math.max(1, Number(parsed.days));
        }
      }
    } catch {}
    return 3;
  });

  const [members, setMembers] = useState(() => {
    try {
      const saved = sessionStorage.getItem('vista_checkout_draft');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.destinationId === destination?.id && parsed.members) {
          return Math.max(1, Number(parsed.members));
        }
      }
    } catch {}
    return 2;
  });

  const [checkInDate, setCheckInDate] = useState(() => {
    try {
      const saved = sessionStorage.getItem('vista_checkout_draft');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.destinationId === destination?.id && parsed.checkInDate) {
          return parsed.checkInDate;
        }
      }
    } catch {}
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });

  const selectedPackage = useMemo(() => {
    return packages.find((p) => p.id === selectedPackageId) || packages[0];
  }, [packages, selectedPackageId]);

  // Dynamic Price Calculation (updates instantly on any change)
  const pricing = useMemo(() => {
    return calculateBookingPrice({
      destinationId: destination?.id,
      packageId: selectedPackage.id,
      days,
      members
    });
  }, [destination?.id, selectedPackage.id, days, members]);

  // Safe Days Adjusters
  const handleDaysDecrement = () => {
    setDays((prev) => Math.max(1, prev - 1));
  };
  const handleDaysIncrement = () => {
    setDays((prev) => prev + 1);
  };

  // Safe Members Adjusters
  const handleMembersDecrement = () => {
    setMembers((prev) => Math.max(1, prev - 1));
  };
  const handleMembersIncrement = () => {
    setMembers((prev) => Math.min(25, prev + 1));
  };

  return (
    <div id="booking-section" className="bg-white rounded-3xl border border-slate-200/90 shadow-card p-6 sm:p-7 space-y-6">
      
      {/* Header Badge & Title */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600">
            Book Destination Package
          </span>
          <h3 className="font-display font-extrabold text-xl text-slate-900 mt-0.5">
            Reserve Your Trip to {destination.name}
          </h3>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0">
          <Luggage className="w-5 h-5" />
        </div>
      </div>

      {/* Package Tier Selector */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
          Choose Package Experience
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {packages.map((pkg) => {
            const isSelected = pkg.id === selectedPackageId;
            return (
              <button
                key={pkg.id}
                type="button"
                onClick={() => setSelectedPackageId(pkg.id)}
                className={`p-3.5 rounded-2xl text-left border transition-all relative ${
                  isSelected
                    ? 'border-brand-500 bg-brand-50/50 shadow-subtle ring-2 ring-brand-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                {pkg.badge && (
                  <span className={`absolute top-2.5 right-2.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider ${
                    isSelected ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {pkg.badge}
                  </span>
                )}
                <div className="font-display font-bold text-sm text-slate-900 pr-12">
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

      {/* Booking Configuration: Check-in Date, Stay Duration & Members */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        
        {/* 1. Check-in Date */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
          <label htmlFor="booking-check-in-date" className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-brand-600" />
            Check-in Date
          </label>
          <input
            id="booking-check-in-date"
            type="date"
            min={todayStr}
            value={checkInDate}
            onChange={(e) => setCheckInDate(e.target.value)}
            className="w-full bg-white border border-slate-200 text-slate-800 text-xs sm:text-sm font-semibold rounded-xl px-2.5 py-2 outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 shadow-sm"
          />
        </div>

        {/* 2. Stay Duration Control */}
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

            <span className="font-display font-extrabold text-base sm:text-lg text-slate-900">
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

        {/* 3. Members Control */}
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
              aria-label="Decrease members by 1"
            >
              <Minus className="w-4 h-4" />
            </button>

            <span className="font-display font-extrabold text-base sm:text-lg text-slate-900">
              {members} Member{members > 1 ? 's' : ''}
            </span>

            <button
              type="button"
              onClick={handleMembersIncrement}
              className="w-8 h-8 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-700 hover:bg-slate-100 active:scale-95 transition-all"
              aria-label="Increase members by 1"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic Price Breakdown Box */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-2 text-xs sm:text-sm">
        <div className="flex justify-between text-slate-600">
          <span>Price per Day:</span>
          <span className="font-semibold text-slate-900">
            ₹{pricing.pricePerDay.toLocaleString('en-IN')} / Day
          </span>
        </div>
        <div className="flex justify-between text-slate-600">
          <span>Duration:</span>
          <span className="font-semibold text-slate-900">{days} Day{days > 1 ? 's' : ''}</span>
        </div>
        <div className="flex justify-between text-slate-600">
          <span>Members:</span>
          <span className="font-semibold text-slate-900">{members} Member{members > 1 ? 's' : ''}</span>
        </div>
        <div className="flex justify-between text-slate-600">
          <span>Subtotal:</span>
          <span className="font-semibold text-slate-900">
            ₹{pricing.subtotal.toLocaleString('en-IN')}
          </span>
        </div>
        <div className="flex justify-between items-center pt-2.5 border-t border-slate-200/90 text-sm sm:text-base">
          <div>
            <span className="font-bold text-slate-900 block">Total Amount</span>
            <span className="text-[11px] text-slate-400 font-normal">All taxes &amp; fees included</span>
          </div>
          <span className="text-xl sm:text-2xl font-extrabold text-emerald-600 font-display">
            ₹{pricing.totalAmount.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Action CTA: Navigate to Dedicated Checkout Page */}
      <Button
        variant="primary"
        size="lg"
        onClick={() => {
          const bookingDraft = {
            destinationId: destination.id,
            destinationName: destination.name,
            country: destination.country || '',
            destination: {
              id: destination.id,
              name: destination.name,
              country: destination.country || '',
              image: destination.image || '',
              images: destination.images || [],
              coverImage: destination.coverImage || '',
              description: destination.description || '',
              location: destination.location || ''
            },
            packageId: selectedPackage.id,
            packageName: selectedPackage.name,
            selectedPackage,
            pricePerDay: pricing.pricePerDay,
            checkInDate: checkInDate || defaultCheckInDate,
            days,
            members,
            subtotal: pricing.subtotal,
            tax: pricing.tax,
            totalAmount: pricing.totalAmount,
            currency: pricing.currency || 'INR'
          };

          try {
            sessionStorage.setItem('vista_checkout_draft', JSON.stringify(bookingDraft));
          } catch (e) {
            console.warn('Unable to save draft to sessionStorage', e);
          }

          navigate('/checkout', { state: bookingDraft });
        }}
        iconRight={ArrowRight}
        className="w-full justify-center shadow-md font-bold py-3.5 bg-brand-600 hover:bg-brand-700"
      >
        Checkout
      </Button>

      <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>Authoritative pricing verified by Vista Holidays</span>
      </div>
    </div>
  );
};

export default DestinationBookingCard;
