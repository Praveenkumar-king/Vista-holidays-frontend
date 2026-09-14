import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Star, 
  MessageSquare, 
  CheckCircle2, 
  ArrowRight, 
  RefreshCw, 
  Mail, 
  Sparkles,
  HeartHandshake
} from 'lucide-react';
import { Container } from '../components/layout/Container';
import { Button } from '../components/ui/Button';
import { useToast } from '../context/ToastContext';
import { ticketService } from '../services/ticketService';

export const FeedbackPage = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    rating: 5,
    answers: {
      'Home Page visual appeal': 'Modern & Premium',
      'Platform load speed': 'Blazing fast',
      'Note creation experience': 'Intuitive & Smooth',
      'Note editor': 'Great formatting tools',
      'Suggestions': '',
      'Locked Notes': 'Very useful for security',
      'Share Notes': 'Seamless',
      'Dashboard': 'Clean & organized',
      'UI & Design': 'Luxury aesthetic',
      'Subscription & Pricing': 'Great value',
      'Payment': 'Smooth & trusted',
      'Overall Experience': 'Exceeded expectations',
      'Other Comments': ''
    },
    termsAccepted: true
  });

  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState(null);

  const handleAnswerChange = (question, answer) => {
    setFormData((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [question]: answer
      }
    }));
  };

  const isEmailValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email.trim());
  const isFormValid = formData.name.trim().length >= 2 && isEmailValid;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid || loading) return;

    setLoading(true);
    try {
      const response = await ticketService.submitFeedback(formData);
      if (response.success && response.data) {
        setSubmittedTicket(response.data);
        toast.success(`Feedback ticket ${response.data.ticketId} created!`, 'Feedback Received');
      } else {
        toast.error(response.message || 'Failed to submit feedback.', 'Error');
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
      name: '',
      email: '',
      mobile: '',
      rating: 5,
      answers: {
        'Home Page visual appeal': 'Modern & Premium',
        'Platform load speed': 'Blazing fast',
        'Note creation experience': 'Intuitive & Smooth',
        'Note editor': 'Great formatting tools',
        'Suggestions': '',
        'Locked Notes': 'Very useful for security',
        'Share Notes': 'Seamless',
        'Dashboard': 'Clean & organized',
        'UI & Design': 'Luxury aesthetic',
        'Subscription & Pricing': 'Great value',
        'Payment': 'Smooth & trusted',
        'Overall Experience': 'Exceeded expectations',
        'Other Comments': ''
      },
      termsAccepted: true
    });
  };

  // SUCCESS UI (Section 7 of requirements)
  if (submittedTicket) {
    return (
      <div className="min-h-[85vh] py-16 flex items-center justify-center bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white px-4">
        <Container size="sm">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-float text-center backdrop-blur-xl animate-fade-in">
            <div className="w-16 h-16 bg-purple-500/10 border border-purple-500/30 rounded-2xl flex items-center justify-center text-purple-400 mx-auto mb-5 shadow-glow">
              <Sparkles className="w-8 h-8 stroke-[2.2]" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight mb-2">
              Feedback Submitted Successfully 🎉
            </h1>

            <p className="text-sm text-slate-400 mb-6">
              Thank you for helping us improve Vista Holidays. Your insights directly shape our travel products.
            </p>

            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 mb-6 text-left space-y-3">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Ticket ID:
                </div>
                <div className="text-xl sm:text-2xl font-mono font-extrabold text-purple-400 tracking-wide mt-0.5">
                  {submittedTicket.ticketId}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2 text-xs text-slate-300">
                <Mail className="w-4 h-4 text-purple-400 flex-shrink-0" />
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
                Submit Another Feedback
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
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-wider mb-3">
            <HeartHandshake className="w-4 h-4" />
            <span>Community Voice</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight mb-3">
            Share Your Vista Holidays Feedback
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed font-sans">
            Your reviews and feature feedback directly steer our travel experience improvements, AI itinerary updates, and platform performance.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-8">
          {/* User Details Box */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-card backdrop-blur-xl">
            <h2 className="text-lg font-display font-bold text-white mb-5 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-purple-400" />
              <span>Traveler Information</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Overall Star Rating */}
            <div className="mt-6 pt-6 border-t border-slate-800/80">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Overall Experience Rating
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 text-slate-600 hover:scale-110 transition-transform focus:outline-none"
                    aria-label={`Rate ${star} star`}
                  >
                    <Star
                      className={`w-7 h-7 ${
                        (hoverRating || formData.rating) >= star
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-700'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-sm font-bold text-amber-400 ml-2">
                  {formData.rating} of 5 Stars
                </span>
              </div>
            </div>
          </div>

          {/* Section 21 Dynamic Questionnaire Items */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-card backdrop-blur-xl space-y-6">
            <h2 className="text-lg font-display font-bold text-white mb-2">
              Platform &amp; Feature Feedback
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              Please share how individual areas of the Vista Holidays portal perform for you.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                {
                  key: 'Home Page visual appeal',
                  options: ['Modern & Premium', 'Clean & Appealing', 'Average', 'Needs Enhancement']
                },
                {
                  key: 'Platform load speed',
                  options: ['Blazing fast', 'Fast & responsive', 'Moderate', 'Slow']
                },
                {
                  key: 'Note creation experience',
                  options: ['Intuitive & Smooth', 'Easy to use', 'Satisfactory', 'Needs Improvement']
                },
                {
                  key: 'Note editor',
                  options: ['Great formatting tools', 'Clean & functional', 'Could be better']
                },
                {
                  key: 'Locked Notes',
                  options: ['Very useful for security', 'Useful feature', 'Rarely used']
                },
                {
                  key: 'Share Notes',
                  options: ['Seamless collaboration', 'Easy', 'Difficult']
                },
                {
                  key: 'Dashboard',
                  options: ['Clean & organized', 'Adequate', 'Needs more insights']
                },
                {
                  key: 'UI & Design',
                  options: ['Luxury aesthetic', 'Modern & polished', 'Standard']
                },
                {
                  key: 'Subscription & Pricing',
                  options: ['Great value', 'Fair & balanced', 'High']
                },
                {
                  key: 'Payment',
                  options: ['Smooth & trusted', 'Secure', 'Encountered Issue']
                },
                {
                  key: 'Overall Experience',
                  options: ['Exceeded expectations', 'Outstanding', 'Satisfactory', 'Needs Work']
                }
              ].map(({ key, options }) => (
                <div key={key} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                  <label className="block text-xs font-semibold text-slate-200 mb-2">
                    {key}
                  </label>
                  <select
                    value={formData.answers[key] || options[0]}
                    onChange={(e) => handleAnswerChange(key, e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    {options.map((opt) => (
                      <option key={opt} value={opt} className="bg-slate-900 text-white">
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            {/* Suggestions Textarea */}
            <div className="pt-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Suggestions &amp; Ideas for Improvement
              </label>
              <textarea
                rows={3}
                placeholder="What new destinations, AI features, or tools would you like to see?"
                value={formData.answers['Suggestions'] || ''}
                onChange={(e) => handleAnswerChange('Suggestions', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Other Comments */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Other Comments
              </label>
              <textarea
                rows={2}
                placeholder="Any additional thoughts or notes for our team..."
                value={formData.answers['Other Comments'] || ''}
                onChange={(e) => handleAnswerChange('Other Comments', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="text-center pt-2">
            <Button
              type="submit"
              variant="accent"
              size="lg"
              loading={loading}
              disabled={!isFormValid || loading}
              className="w-full sm:w-80 justify-center shadow-xl font-bold text-slate-950 text-sm"
            >
              Submit Feedback
            </Button>
          </div>
        </form>
      </Container>
    </div>
  );
};

export default FeedbackPage;
