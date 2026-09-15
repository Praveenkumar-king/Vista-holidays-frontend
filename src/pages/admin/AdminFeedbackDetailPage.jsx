import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  RefreshCw,
  Calendar,
  Star,
  User,
  Mail,
  Phone,
  Send,
  CheckCircle2,
  HelpCircle,
  MessageSquare
} from 'lucide-react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { AdminBadge } from '../../components/admin/AdminBadge';
import { ticketService } from '../../services/ticketService';
import { useToast } from '../../context/ToastContext';

export const AdminFeedbackDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('New');
  const [adminNote, setAdminNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchFeedback = async () => {
    setLoading(true);
    try {
      const response = await ticketService.getFeedbackMessageById(id);
      if (response.success && response.data?.feedback) {
        setFeedback(response.data.feedback);
        setSelectedStatus(response.data.feedback.status || 'New');
      } else {
        toast.error('Feedback record not found.', 'Error');
        navigate('/admin/feedback');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to fetch feedback details.', 'Error');
      navigate('/admin/feedback');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, [id]);

  const handleUpdateStatusAndReply = async (e) => {
    e.preventDefault();
    if (!feedback || submitting) return;

    setSubmitting(true);
    try {
      let updatedFeedback = feedback;

      // Update status if changed
      if (selectedStatus !== feedback.status) {
        const statusRes = await ticketService.updateFeedbackStatus(feedback._id, selectedStatus);
        if (statusRes.success && statusRes.data?.feedback) {
          updatedFeedback = statusRes.data.feedback;
        }
      }

      // Send admin message if provided
      if (adminNote.trim()) {
        const msgRes = await ticketService.sendFeedbackAdminMessage(feedback._id, adminNote.trim());
        if (msgRes.success && msgRes.data?.feedback) {
          updatedFeedback = msgRes.data.feedback;
        }
        setAdminNote('');
      }

      setFeedback(updatedFeedback);
      toast.success('Feedback status updated and reply logged.', 'Saved');
    } catch (err) {
      toast.error(err.message || 'Failed to update feedback.', 'Error');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Kolkata',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(d);
  };

  const formatQuestionKey = (key) => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .replace(/^\w/, (c) => c.toUpperCase());
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="py-24 text-center text-xs text-slate-400">
          Loading feedback details...
        </div>
      </AdminLayout>
    );
  }

  if (!feedback) return null;

  // Answers may be a Map or standard Object
  const answersEntries = feedback.answers
    ? feedback.answers instanceof Map
      ? Array.from(feedback.answers.entries())
      : Object.entries(feedback.answers)
    : [];

  return (
    <AdminLayout>
      {/* Back and Action Buttons */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <Link
          to="/admin/feedback"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Feedback Messages Directory</span>
        </Link>

        <button
          onClick={fetchFeedback}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Header Banner Card */}
      <div className="p-6 sm:p-7 rounded-3xl bg-[#0c1222] border border-slate-800/90 mb-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">
              Feedback Inquiry Control
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-mono font-extrabold text-purple-400 tracking-tight">
                {feedback.ticketId}
              </h1>
              <AdminBadge variant="primary" dot>
                {feedback.status}
              </AdminBadge>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>Submitted: {formatDate(feedback.createdAt)}</span>
          </div>
        </div>

        {/* Rating Score Banner */}
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#080d19] border border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < (feedback.rating || 5)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-slate-700'
                  }`}
                />
              ))}
            </div>
            <span className="text-lg font-extrabold text-white">
              {feedback.rating || 5}.0 / 5.0
            </span>
          </div>
          <div className="text-xs text-slate-400">
            Platform Traveler Experience Review
          </div>
        </div>
      </div>

      {/* Main Grid: Left Survey Answers & Right Response Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Dynamically Rendered Questionnaire Answers */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl bg-[#0c1222] border border-slate-800/80">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-5 pb-2 border-b border-slate-800/60">
              Submitted Feedback &amp; Survey Responses
            </h3>

            {answersEntries.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400">
                No detailed questionnaire answers recorded with this submission.
              </div>
            ) : (
              <div className="space-y-4">
                {answersEntries.map(([qKey, aVal], idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[#080d19] border border-slate-800/80"
                  >
                    <div className="text-[11px] font-bold text-slate-400 mb-1 uppercase tracking-wide">
                      {formatQuestionKey(qKey)}
                    </div>
                    <div className="text-xs sm:text-sm font-medium text-slate-100 leading-relaxed">
                      {String(aVal)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Status History Log / Messages */}
          <div className="p-6 rounded-2xl bg-[#0c1222] border border-slate-800/80">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 pb-2 border-b border-slate-800/60">
              Feedback Timeline &amp; Correspondence
            </h3>

            {(!feedback.timeline || feedback.timeline.length === 0) ? (
              <div className="text-xs text-slate-400 py-4 text-center">
                No timeline history logged yet.
              </div>
            ) : (
              <div className="space-y-3">
                {feedback.timeline.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-[#080d19] border border-slate-800/80 flex flex-col sm:flex-row sm:items-start justify-between gap-2 text-xs"
                  >
                    <div>
                      <div className="font-bold text-white flex items-center gap-2">
                        <span>{item.type === 'INITIAL_SUBMISSION' ? 'Survey Submitted' : item.type === 'STATUS_CHANGE' ? item.status || 'Status Change' : 'Admin Response'}</span>
                      </div>
                      <p className="text-xs text-slate-300 italic mt-1">
                        "{item.message}"
                      </p>
                    </div>

                    <div className="text-[10px] text-slate-400 whitespace-nowrap">
                      {formatDate(item.createdAt)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Column: Traveler Contact Info + Reply Form */}
        <div className="lg:col-span-1 space-y-6">
          {/* User Info */}
          <div className="p-6 rounded-2xl bg-[#0c1222] border border-slate-800/80 space-y-3.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-800/60">
              Traveler Information
            </h3>

            <div className="flex items-center gap-3 text-xs">
              <div className="w-8 h-8 rounded-xl bg-slate-800/80 flex items-center justify-center text-slate-400 shrink-0">
                <User className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Name</span>
                <span className="font-bold text-white truncate block">{feedback.name}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <div className="w-8 h-8 rounded-xl bg-slate-800/80 flex items-center justify-center text-slate-400 shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Email</span>
                <span className="font-mono text-slate-200 truncate block">{feedback.email}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <div className="w-8 h-8 rounded-xl bg-slate-800/80 flex items-center justify-center text-slate-400 shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Mobile</span>
                <span className="text-slate-200 block">{feedback.mobile || 'Not provided'}</span>
              </div>
            </div>
          </div>

          {/* Admin Response Form */}
          <form onSubmit={handleUpdateStatusAndReply} className="p-6 rounded-2xl bg-[#0c1222] border border-slate-800/80 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-800/60">
              Admin Response &amp; Status
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Feedback Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#080d19] border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500"
              >
                <option value="New">New</option>
                <option value="Reviewed">Reviewed</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Admin Response (Optional)
              </label>
              <textarea
                rows={4}
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="Type response to send directly to this traveler..."
                className="w-full p-3 rounded-xl bg-[#080d19] border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 resize-none leading-relaxed"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-950/50 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? 'Saving...' : 'Send Message & Save'}</span>
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminFeedbackDetailPage;
