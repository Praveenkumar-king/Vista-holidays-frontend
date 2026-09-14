import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Send, 
  Clock, 
  CheckCircle2, 
  Star, 
  Sparkles, 
  MessageSquare, 
  Circle,
  RefreshCw,
  HelpCircle,
  Layers
} from 'lucide-react';
import { Container } from '../../components/layout/Container';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';
import { ticketService } from '../../services/ticketService';

const FEEDBACK_STATUS_OPTIONS = ['New', 'Reviewed', 'Resolved', 'Closed'];

export const AdminFeedbackDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [adminMessageInput, setAdminMessageInput] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  const fetchTicket = async () => {
    setLoading(true);
    try {
      const response = await ticketService.getFeedbackMessageById(id);
      if (response.success && response.data?.ticket) {
        setTicket(response.data.ticket);
      } else {
        toast.error('Feedback ticket not found.', 'Error');
        navigate('/admin/feedback');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to load feedback details.', 'Error');
      navigate('/admin/feedback');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicket();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    if (!ticket || newStatus === ticket.status || statusUpdating) return;

    setStatusUpdating(true);
    try {
      const response = await ticketService.updateFeedbackStatus(ticket._id, newStatus);
      if (response.success && response.data?.ticket) {
        setTicket(response.data.ticket);
        toast.success(`Feedback status updated to ${newStatus}.`, 'Status Saved');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update status.', 'Error');
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!adminMessageInput.trim() || sendingMessage) return;

    setSendingMessage(true);
    try {
      const response = await ticketService.sendFeedbackAdminMessage(ticket._id, adminMessageInput.trim());
      if (response.success && response.data?.ticket) {
        setTicket(response.data.ticket);
        setAdminMessageInput('');
        toast.success(response.message || 'Admin message sent to user.', 'Delivered');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to send message.', 'Error');
    } finally {
      setSendingMessage(false);
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) +
        ' • ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    } catch {
      return String(dateString);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-slate-950 text-slate-400">
        <RefreshCw className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  if (!ticket) return null;

  // Convert answers map or object to key-value array
  const answerEntries = ticket.answers
    ? typeof ticket.answers === 'object'
      ? Object.entries(ticket.answers)
      : []
    : [];

  return (
    <div className="min-h-screen py-10 bg-slate-950 text-slate-100">
      <Container size="xl">
        {/* Back navigation */}
        <div className="mb-6">
          <Link
            to="/admin/feedback"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Feedback Directory</span>
          </Link>
        </div>

        {/* SECTION 20 DYNAMIC HEADER WITH PURPLE/BLUE GRADIENT */}
        <div className="rounded-3xl overflow-hidden shadow-card border border-purple-500/30 mb-8 bg-slate-900">
          <div className="bg-gradient-to-r from-purple-800 via-indigo-700 to-blue-600 p-6 sm:p-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="text-[11px] font-extrabold uppercase tracking-widest text-purple-200 mb-1">
                VISTA HOLIDAYS USER FEEDBACK
              </div>
              <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight flex items-center gap-2.5">
                <Sparkles className="w-7 h-7 text-purple-200" />
                <span>💬 {ticket.name}'s Feedback</span>
              </h1>
              <div className="text-sm font-mono text-purple-100 mt-1 font-bold">
                Ref ID: <span className="underline decoration-purple-300 underline-offset-4">{ticket.ticketId}</span>
              </div>
            </div>

            {/* Status Selector Dropdown */}
            <div className="bg-black/30 backdrop-blur-md rounded-2xl p-3 border border-white/20 flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-200">
                FEEDBACK STATUS:
              </span>
              <select
                value={ticket.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={statusUpdating}
                className="bg-slate-950 text-white font-bold text-xs uppercase tracking-wider border border-white/30 rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-white/50 cursor-pointer"
              >
                {FEEDBACK_STATUS_OPTIONS.map((st) => (
                  <option key={st} value={st} className="bg-slate-900 text-white">
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT 7 COLS: ALL DYNAMIC FEEDBACK ANSWERS + ADMIN MESSAGE */}
          <div className="lg:col-span-7 space-y-8">
            {/* Traveler & Rating Header Card */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-card backdrop-blur-xl">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                  <span className="text-slate-400 uppercase tracking-wider font-semibold">User Name</span>
                  <div className="text-sm font-bold text-white mt-1">{ticket.name}</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                  <span className="text-slate-400 uppercase tracking-wider font-semibold">Email Address</span>
                  <div className="text-sm font-mono text-slate-200 mt-1">{ticket.email}</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                  <span className="text-slate-400 uppercase tracking-wider font-semibold">Overall Rating</span>
                  <div className="flex items-center gap-1 text-amber-400 font-bold mt-1">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span className="text-sm">{ticket.rating || 5} of 5 Stars</span>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 21: ALL SUBMITTED ANSWERS DISPLAYED DYNAMICALLY */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-card backdrop-blur-xl">
              <h3 className="text-base font-display font-bold text-white mb-2 flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-400" />
                <span>Submitted Survey Responses</span>
              </h3>
              <p className="text-xs text-slate-400 mb-6">
                All feedback answers dynamically loaded from database records.
              </p>

              <div className="space-y-3">
                {answerEntries.length > 0 ? (
                  answerEntries.map(([question, answer], idx) => {
                    const isLongText = question === 'Suggestions' || question === 'Other Comments';
                    return (
                      <div
                        key={idx}
                        className={`p-4 rounded-2xl border border-slate-800/80 ${
                          isLongText ? 'bg-slate-950/90' : 'bg-slate-950/60 flex items-center justify-between'
                        }`}
                      >
                        <div className="text-xs font-semibold text-slate-300">
                          {question}
                        </div>
                        <div
                          className={`text-xs ${
                            isLongText
                              ? 'mt-2 text-slate-200 italic whitespace-pre-wrap pl-2 border-l-2 border-purple-500'
                              : 'font-bold text-purple-300 bg-purple-950/50 px-2.5 py-1 rounded-lg border border-purple-800/40'
                          }`}
                        >
                          {String(answer) || '(No comment provided)'}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-slate-500">No specific questionnaire answers found.</p>
                )}
              </div>
            </div>

            {/* ADMIN SPECIFIC MESSAGE SYSTEM (Section 12 & 14) */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-card backdrop-blur-xl">
              <h3 className="text-base font-display font-bold text-white mb-2 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-purple-400" />
                <span>Admin Message to User</span>
              </h3>
              <p className="text-xs text-slate-400 mb-5">
                Send an official follow-up to this feedback contributor. An email notification with your message and live tracking link will be delivered via Brevo SMTP.
              </p>

              <form onSubmit={handleSendMessage} className="space-y-4">
                <textarea
                  rows={4}
                  placeholder="Type a message to the user..."
                  value={adminMessageInput}
                  onChange={(e) => setAdminMessageInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                />

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    loading={sendingMessage}
                    disabled={!adminMessageInput.trim() || sendingMessage}
                    iconRight={Send}
                    className="font-bold shadow-md bg-purple-600 hover:bg-purple-500 text-white"
                  >
                    Send Message
                  </Button>
                </div>
              </form>

              {/* Message thread history */}
              {ticket.messages && ticket.messages.length > 0 && (
                <div className="mt-8 pt-6 border-t border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Message History ({ticket.messages.length})
                  </h4>

                  {ticket.messages.map((m, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/90">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-bold text-purple-400">{m.senderName || 'Vista Holidays Support Team'}</span>
                        <span className="text-[11px] text-slate-500 font-mono">{formatDateTime(m.createdAt)}</span>
                      </div>
                      <p className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
                        {m.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT 5 COLS: ACTIVITY TIMELINE */}
          <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-card backdrop-blur-xl">
            <h3 className="text-base font-display font-bold text-white mb-6 flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-400" />
              <span>Activity &amp; Resolution Timeline</span>
            </h3>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
              {ticket.timeline && ticket.timeline.length > 0 ? (
                ticket.timeline.map((item, idx) => {
                  const isLatest = idx === ticket.timeline.length - 1;
                  return (
                    <div key={idx} className="relative">
                      <div className={`absolute -left-[28px] top-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[8px] border ${
                        isLatest
                          ? 'bg-purple-500 border-purple-400 text-white'
                          : 'bg-slate-950 border-emerald-500 text-emerald-400'
                      }`}>
                        {isLatest ? <Circle className="w-2 h-2 fill-current" /> : <CheckCircle2 className="w-3 h-3" />}
                      </div>

                      <div>
                        <div className="text-xs font-bold text-white">{item.message}</div>
                        <div className="text-[10px] font-mono text-slate-400 mt-0.5">{formatDateTime(item.createdAt)}</div>
                        {item.status && (
                          <span className="inline-block mt-1 text-[9px] uppercase font-bold text-slate-400 px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800">
                            {item.status}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-slate-500">No timeline entries recorded.</p>
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default AdminFeedbackDetailPage;
