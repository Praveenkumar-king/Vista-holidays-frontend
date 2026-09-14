import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  CheckCircle2, 
  Compass, 
  ArrowRight, 
  RefreshCw, 
  Clock, 
  HelpCircle,
  ShieldCheck
} from 'lucide-react';
import { Container } from '../components/layout/Container';
import { Button } from '../components/ui/Button';
import { useToast } from '../context/ToastContext';
import { ticketService } from '../services/ticketService';

const QUERY_TYPES = [
  'General Inquiry',
  'Booking Assistance',
  'Custom Holiday Package',
  'Cancellation / Refund',
  'Feedback / Suggestions',
  'Technical Support',
  'Partnership / Business'
];

export const ContactPage = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    country: '',
    state: '',
    city: '',
    queryType: 'General Inquiry',
    message: '',
    termsAccepted: false
  });

  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState(null);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const isEmailValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email.trim());
  const isFormValid =
    formData.firstName.trim().length >= 2 &&
    formData.lastName.trim().length >= 1 &&
    isEmailValid &&
    formData.queryType &&
    formData.message.trim().length >= 5 &&
    formData.termsAccepted;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      message: true,
      termsAccepted: true
    });

    if (!isFormValid || loading) return;

    setLoading(true);
    try {
      const response = await ticketService.submitContact(formData);
      if (response.success && response.data) {
        setSubmittedTicket(response.data);
        toast.success(`Contact ticket ${response.data.ticketId} created!`, 'Request Received');
      } else {
        toast.error(response.message || 'Failed to submit contact request.', 'Submission Error');
      }
    } catch (err) {
      toast.error(err.message || 'Server error. Please try again.', 'Error');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmittedTicket(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      mobile: '',
      country: '',
      state: '',
      city: '',
      queryType: 'General Inquiry',
      message: '',
      termsAccepted: false
    });
    setTouched({});
  };

  // SUCCESS UI (Section 6 of requirements)
  if (submittedTicket) {
    return (
      <div className="min-h-[85vh] py-16 flex items-center justify-center bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white px-4">
        <Container size="sm">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-float text-center backdrop-blur-xl animate-fade-in">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center text-emerald-400 mx-auto mb-5 shadow-glow">
              <CheckCircle2 className="w-8 h-8 stroke-[2.2]" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight mb-2">
              Contact Submitted Successfully ✅
            </h1>

            <p className="text-sm text-slate-400 mb-6">
              Your request has been received. Our support team is reviewing your inquiry.
            </p>

            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 mb-6 text-left space-y-3">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Ticket ID:
                </div>
                <div className="text-xl sm:text-2xl font-mono font-extrabold text-brand-400 tracking-wide mt-0.5">
                  {submittedTicket.ticketId}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2 text-xs text-slate-300">
                <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>
                  Confirmation email sent to: <strong className="text-white">{submittedTicket.email}</strong>
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                variant="primary"
                size="md"
                onClick={() => navigate(`/track-status?ticket=${submittedTicket.ticketId}`)}
                iconRight={ArrowRight}
                className="w-full sm:w-auto font-bold shadow-lg"
              >
                Track Your Status
              </Button>

              <Button
                variant="secondary"
                size="md"
                onClick={handleReset}
                iconLeft={RefreshCw}
                className="w-full sm:w-auto text-slate-900 font-semibold"
              >
                Submit Another Request
              </Button>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 sm:py-16 bg-slate-950 text-slate-100">
      <Container size="lg">
        {/* Header Ribbon */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Compass className="w-3.5 h-3.5" />
            <span>Vista Holidays Support</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight mb-3">
            Get In Touch With Our Team
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed font-sans">
            Whether you are planning an exotic getaway, need itinerary customization, or have a customer query, our support specialists are here around the clock.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Contact Informational Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-card backdrop-blur-md">
              <h3 className="text-base font-display font-bold text-white mb-4 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-brand-400" />
                <span>Support Channels</span>
              </h3>

              <div className="space-y-4 text-xs text-slate-300">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <Mail className="w-4 h-4 text-brand-400 mt-0.5" />
                  <div>
                    <div className="font-semibold text-white">Email Us</div>
                    <div className="text-slate-400">support@vistaholidays.com</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Responses within 24 hours</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <Phone className="w-4 h-4 text-emerald-400 mt-0.5" />
                  <div>
                    <div className="font-semibold text-white">Direct Line</div>
                    <div className="text-slate-400">+1 (800) 450-VISTA</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Mon - Sat: 9 AM - 8 PM EST</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <Clock className="w-4 h-4 text-amber-400 mt-0.5" />
                  <div>
                    <div className="font-semibold text-white">Ticket Tracking</div>
                    <div className="text-slate-400">Live Status Updates</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Real-time resolution timeline</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">Already have a ticket?</span>
                <Link to="/track-status" className="text-xs font-bold text-brand-400 hover:text-brand-300 underline underline-offset-2">
                  Track Status →
                </Link>
              </div>
            </div>

            {/* Privacy Promise */}
            <div className="bg-slate-900/50 border border-slate-800/60 rounded-3xl p-5 text-xs text-slate-400 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-brand-400 flex-shrink-0 mt-0.5" />
              <span>We respect your privacy. Inquiries are stored in encrypted records and used only for itinerary assistance.</span>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-card backdrop-blur-xl">
            <h2 className="text-xl font-display font-bold text-white mb-6">
              Send Us a Message
            </h2>

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {/* First & Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-first-name" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    First Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="contact-first-name"
                    type="text"
                    placeholder="Alex"
                    value={formData.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    onBlur={() => handleBlur('firstName')}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                  />
                  {touched.firstName && formData.firstName.trim().length < 2 && (
                    <p className="mt-1 text-xs text-rose-400 font-medium">First name must be at least 2 characters</p>
                  )}
                </div>

                <div>
                  <label htmlFor="contact-last-name" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Last Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="contact-last-name"
                    type="text"
                    placeholder="Morgan"
                    value={formData.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    onBlur={() => handleBlur('lastName')}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                  />
                  {touched.lastName && formData.lastName.trim().length < 1 && (
                    <p className="mt-1 text-xs text-rose-400 font-medium">Last name is required</p>
                  )}
                </div>
              </div>

              {/* Email & Mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-email" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    placeholder="alex@example.com"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    onBlur={() => handleBlur('email')}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                  />
                  {touched.email && !isEmailValid && (
                    <p className="mt-1 text-xs text-rose-400 font-medium">Please provide a valid email</p>
                  )}
                </div>

                <div>
                  <label htmlFor="contact-mobile" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Mobile Number
                  </label>
                  <input
                    id="contact-mobile"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={formData.mobile}
                    onChange={(e) => handleChange('mobile', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                  />
                </div>
              </div>

              {/* Location: Country, State, City */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="contact-country" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Country
                  </label>
                  <input
                    id="contact-country"
                    type="text"
                    placeholder="United States"
                    value={formData.country}
                    onChange={(e) => handleChange('country', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label htmlFor="contact-state" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    State / Province
                  </label>
                  <input
                    id="contact-state"
                    type="text"
                    placeholder="California"
                    value={formData.state}
                    onChange={(e) => handleChange('state', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label htmlFor="contact-city" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    City
                  </label>
                  <input
                    id="contact-city"
                    type="text"
                    placeholder="San Francisco"
                    value={formData.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                  />
                </div>
              </div>

              {/* Query Type */}
              <div>
                <label htmlFor="contact-query-type" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Query Type <span className="text-rose-500">*</span>
                </label>
                <select
                  id="contact-query-type"
                  value={formData.queryType}
                  onChange={(e) => handleChange('queryType', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                >
                  {QUERY_TYPES.map((type) => (
                    <option key={type} value={type} className="bg-slate-900 text-white">
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="contact-message" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Message <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="contact-message"
                  rows={4}
                  placeholder="Please describe your trip requirements, dates, group size, or inquiries..."
                  value={formData.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  onBlur={() => handleBlur('message')}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 resize-y"
                />
                {touched.message && formData.message.trim().length < 5 && (
                  <p className="mt-1 text-xs text-rose-400 font-medium">Message must be at least 5 characters</p>
                )}
              </div>

              {/* Terms Checkbox */}
              <div>
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.termsAccepted}
                    onChange={(e) => handleChange('termsAccepted', e.target.checked)}
                    onBlur={() => handleBlur('termsAccepted')}
                    className="mt-1 w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-slate-700 bg-slate-950 cursor-pointer"
                  />
                  <span className="text-xs text-slate-400 leading-normal">
                    I agree to the Vista Holidays{' '}
                    <span className="text-brand-400 underline underline-offset-2">Terms &amp; Conditions</span>{' '}
                    and Privacy Policy. <span className="text-rose-500">*</span>
                  </span>
                </label>
                {touched.termsAccepted && !formData.termsAccepted && (
                  <p className="mt-1 text-xs text-rose-400 font-medium">You must accept the Terms &amp; Conditions</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={loading}
                  disabled={!isFormValid || loading}
                  iconRight={Send}
                  className="w-full justify-center shadow-lg font-bold text-sm"
                >
                  Submit Request
                </Button>
              </div>
            </form>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ContactPage;
