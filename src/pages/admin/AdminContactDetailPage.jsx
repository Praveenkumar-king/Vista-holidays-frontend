import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  RefreshCw,
  Calendar,
  CheckCircle2,
  Circle,
  User,
  Mail,
  Phone,
  MapPin,
  Send,
  Clock,
  ShieldCheck,
  Check
} from 'lucide-react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { AdminBadge } from '../../components/admin/AdminBadge';
import { ticketService } from '../../services/ticketService';
import { useToast } from '../../context/ToastContext';

const WORKFLOW_STEPS = [
  { step: 'STEP 01', label: 'Received', desc: 'Inquiry logged in operations desk', statusKey: 'Open' },
  { step: 'STEP 02', label: 'In-Progress', desc: 'Assigned and being actively reviewed', statusKey: 'In Progress' },
  { step: 'STEP 03', label: 'Resolved', desc: 'Response prepared and sent', statusKey: 'Resolved' },
  { step: 'STEP 04', label: 'Closed', desc: 'Inquiry finalized and archived', statusKey: 'Closed' }
];

export const AdminContactDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('Open');
  const [adminNote, setAdminNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchTicket = async () => {
    setLoading(true);
    try {
      const response = await ticketService.getContactMessageById(id);
      if (response.success && response.data?.ticket) {
        setTicket(response.data.ticket);
        setSelectedStatus(response.data.ticket.status || 'Open');
      } else {
        toast.error('Contact inquiry not found.', 'Error');
        navigate('/admin/contact');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to fetch ticket details.', 'Error');
      navigate('/admin/contact');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicket();
  }, [id]);

  const handleUpdateStatusAndNotify = async (e) => {
    e.preventDefault();
    if (!ticket || submitting) return;

    setSubmitting(true);
    try {
      let updatedTicket = ticket;

      // 1. Update status if changed
      if (selectedStatus !== ticket.status) {
        const statusRes = await ticketService.updateContactStatus(ticket._id, selectedStatus);
        if (statusRes.success && statusRes.data?.ticket) {
          updatedTicket = statusRes.data.ticket;
        }
      }

      // 2. Send Admin Message if typed
      if (adminNote.trim()) {
        const msgRes = await ticketService.sendContactAdminMessage(ticket._id, adminNote.trim());
        if (msgRes.success && msgRes.data?.ticket) {
          updatedTicket = msgRes.data.ticket;
        }
        setAdminNote('');
      }

      setTicket(updatedTicket);
      toast.success('Inquiry updated and notification dispatched.', 'Updated');
    } catch (err) {
      toast.error(err.message || 'Failed to update ticket.', 'Error');
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

  if (loading) {
    return (
      <AdminLayout>
        <div className="py-24 text-center text-xs text-slate-400">
          Loading contact inquiry details...
        </div>
      </AdminLayout>
    );
  }

  if (!ticket) return null;

  // Determine current step index in progression
  const currentStepIdx = WORKFLOW_STEPS.findIndex(s => s.statusKey.toLowerCase() === (ticket.status || 'Open').toLowerCase());
  const activeStep = currentStepIdx === -1 ? 0 : currentStepIdx;

  const locationString = [ticket.city, ticket.state, ticket.country].filter(Boolean).join(', ') || 'Not specified';

  return (
    <AdminLayout>
      {/* Back and Action Buttons */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <Link
          to="/admin/contact"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Contact Messages Directory</span>
        </Link>

        <button
          onClick={fetchTicket}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Header Banner Card (Screenshot 8 style) */}
      <div className="p-6 sm:p-7 rounded-3xl bg-[#0c1222] border border-slate-800/90 mb-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">
              Contact Inquiry Control
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-mono font-extrabold text-cyan-400 tracking-tight">
                {ticket.ticketId}
              </h1>
              <AdminBadge variant={ticket.status === 'Closed' ? 'neutral' : 'info'} dot>
                {ticket.status}
              </AdminBadge>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>Submitted: {formatDate(ticket.createdAt)}</span>
          </div>
        </div>

        {/* INQUIRY PROGRESSION WORKFLOW */}
        <div className="mt-6">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-4">
            Inquiry Progression Workflow
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {WORKFLOW_STEPS.map((s, idx) => {
              const isPassed = idx <= activeStep;
              const isCurrent = idx === activeStep;

              return (
                <div
                  key={s.step}
                  className={`p-4 rounded-2xl border transition-all ${
                    isCurrent
                      ? 'bg-blue-600/10 border-blue-500/80 shadow-md shadow-blue-950/40'
                      : isPassed
                      ? 'bg-[#080d19] border-emerald-500/40'
                      : 'bg-[#080d19]/60 border-slate-800/60 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {s.step}
                    </span>
                    {isPassed ? (
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <Check className="w-3 h-3" />
                      </div>
                    ) : (
                      <Circle className="w-4 h-4 text-slate-600" />
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-white mb-0.5">
                    {s.label}
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    {s.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2-Column Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Message Details + Status History Log */}
        <div className="lg:col-span-2 space-y-6">
          {/* Query Type & Full Message */}
          <div className="p-6 rounded-2xl bg-[#0c1222] border border-slate-800/80 space-y-4">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Query Type
              </div>
              <h3 className="text-lg font-bold text-white">
                {ticket.queryType}
              </h3>
            </div>

            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Full Message
              </div>
              <div className="p-4 rounded-xl bg-[#080d19] border border-slate-800/80 text-xs text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
                {ticket.message}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 text-xs font-semibold text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>Terms &amp; Conditions Accepted: Yes</span>
            </div>
          </div>

          {/* Status History Log (Timeline) */}
          <div className="p-6 rounded-2xl bg-[#0c1222] border border-slate-800/80">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 pb-2 border-b border-slate-800/60">
              Status History Log
            </h3>

            {(!ticket.timeline || ticket.timeline.length === 0) ? (
              <div className="text-xs text-slate-400 py-4 text-center">
                No history log available.
              </div>
            ) : (
              <div className="space-y-4">
                {ticket.timeline.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-[#080d19] border border-slate-800/80 flex flex-col sm:flex-row sm:items-start justify-between gap-2 text-xs"
                  >
                    <div>
                      <div className="font-bold text-white flex items-center gap-2">
                        <span>{item.type === 'INITIAL_SUBMISSION' ? 'Received' : item.type === 'STATUS_CHANGE' ? item.status || 'Status Change' : 'Admin Message'}</span>
                        {item.status && (
                          <AdminBadge variant="neutral">
                            {item.status}
                          </AdminBadge>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {item.type === 'INITIAL_SUBMISSION' ? `By ${ticket.name}` : 'By Vista Holidays Administration'}
                      </div>
                      <p className="text-xs text-slate-300 italic mt-1.5">
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

        {/* Right 1 Column: Sender Information + Update Status Form */}
        <div className="lg:col-span-1 space-y-6">
          {/* Sender Contact Information */}
          <div className="p-6 rounded-2xl bg-[#0c1222] border border-slate-800/80 space-y-3.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-800/60">
              Sender Contact Information
            </h3>

            <div className="flex items-center gap-3 text-xs">
              <div className="w-8 h-8 rounded-xl bg-slate-800/80 flex items-center justify-center text-slate-400 shrink-0">
                <User className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Name</span>
                <span className="font-bold text-white truncate block">{ticket.name}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <div className="w-8 h-8 rounded-xl bg-slate-800/80 flex items-center justify-center text-slate-400 shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Email</span>
                <span className="font-mono text-slate-200 truncate block">{ticket.email}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <div className="w-8 h-8 rounded-xl bg-slate-800/80 flex items-center justify-center text-slate-400 shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Mobile</span>
                <span className="text-slate-200 block">{ticket.mobile || 'Not provided'}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <div className="w-8 h-8 rounded-xl bg-slate-800/80 flex items-center justify-center text-slate-400 shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Location</span>
                <span className="text-slate-200 block truncate">{locationString}</span>
              </div>
            </div>
          </div>

          {/* Update Inquiry Status & Admin Message */}
          <form onSubmit={handleUpdateStatusAndNotify} className="p-6 rounded-2xl bg-[#0c1222] border border-slate-800/80 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-800/60">
              Update Inquiry Status
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Progression State
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#080d19] border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500"
              >
                <option value="Open">Open (Received)</option>
                <option value="In Progress">In-Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Admin Message (Optional)
              </label>
              <textarea
                rows={4}
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="Type resolution message to dispatch to the traveler via Brevo email..."
                className="w-full p-3 rounded-xl bg-[#080d19] border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 resize-none leading-relaxed"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-950/50 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? 'Updating...' : 'Update Status & Notify'}</span>
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminContactDetailPage;
