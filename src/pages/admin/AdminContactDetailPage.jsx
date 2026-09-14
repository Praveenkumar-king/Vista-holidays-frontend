import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Send, 
  Clock, 
  CheckCircle2, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  FileText, 
  ShieldCheck, 
  Globe, 
  Circle,
  MessageSquare,
  RefreshCw,
  Headphones
} from 'lucide-react';
import { Container } from '../../components/layout/Container';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';
import { ticketService } from '../../services/ticketService';

const STATUS_OPTIONS = ['Open', 'In Progress', 'Resolved', 'Closed'];

export const AdminContactDetailPage = () => {
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
      const response = await ticketService.getContactMessageById(id);
      if (response.success && response.data?.ticket) {
        setTicket(response.data.ticket);
      } else {
        toast.error('Ticket not found.', 'Error');
        navigate('/admin/contact');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to load ticket details.', 'Error');
      navigate('/admin/contact');
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
      const response = await ticketService.updateContactStatus(ticket._id, newStatus);
      if (response.success && response.data?.ticket) {
        setTicket(response.data.ticket);
        toast.success(`Status updated to ${newStatus}.`, 'Status Saved');
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
      const response = await ticketService.sendContactAdminMessage(ticket._id, adminMessageInput.trim());
      if (response.success && response.data?.ticket) {
        setTicket(response.data.ticket);
        setAdminMessageInput('');
        toast.success(response.message || 'Admin message sent to user.', 'Message Delivered');
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
        <RefreshCw className="w-8 h-8 animate-spin text-rose-500" />
      </div>
    );
  }

  if (!ticket) return null;

  return (
    <div className="min-h-screen py-10 bg-slate-950 text-slate-100">
      <Container size="xl">
        {/* Back navigation */}
        <div className="mb-6">
          <Link
            to="/admin/contact"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Contact Messages Directory</span>
          </Link>
        </div>

        {/* SECTION 18 DYNAMIC HEADER WITH RED/ORANGE GRADIENT */}
        <div className="rounded-3xl overflow-hidden shadow-card border border-rose-500/30 mb-8 bg-slate-900">
          <div className="bg-gradient-to-r from-red-700 via-rose-600 to-amber-600 p-6 sm:p-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="text-[11px] font-extrabold uppercase tracking-widest text-amber-200 mb-1">
                VISTA HOLIDAYS SUPPORT TICKET
              </div>
              <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight flex items-center gap-2.5">
                <Headphones className="w-7 h-7 text-amber-200" />
                <span>🎧 {ticket.name}'s Contact Message</span>
              </h1>
              <div className="text-sm font-mono text-amber-100 mt-1 font-bold">
                Ref ID: <span className="underline decoration-amber-300 underline-offset-4">{ticket.ticketId}</span>
              </div>
            </div>

            {/* Status Selector Dropdown */}
            <div className="bg-black/30 backdrop-blur-md rounded-2xl p-3 border border-white/20 flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-200">
                TICKET STATUS:
              </span>
              <select
                value={ticket.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={statusUpdating}
                className="bg-slate-950 text-white font-bold text-xs uppercase tracking-wider border border-white/30 rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-white/50 cursor-pointer"
              >
                {STATUS_OPTIONS.map((st) => (
                  <option key={st} value={st} className="bg-slate-900 text-white">
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT 7 COLS: TICKET DETAILS + ADMIN MESSAGE COMPOSER */}
          <div className="lg:col-span-7 space-y-8">
            {/* Ticket Details (Section 19) */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-card backdrop-blur-xl">
              <h3 className="text-base font-display font-bold text-white mb-5 flex items-center gap-2">
                <FileText className="w-4 h-4 text-rose-400" />
                <span>Inquiry Details</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                  <span className="text-slate-400 uppercase tracking-wider font-semibold">First Name &amp; Last Name</span>
                  <div className="text-sm font-bold text-white mt-1">{ticket.name}</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                  <span className="text-slate-400 uppercase tracking-wider font-semibold">Email Address</span>
                  <div className="text-sm font-mono text-slate-200 mt-1">{ticket.email}</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                  <span className="text-slate-400 uppercase tracking-wider font-semibold">Mobile Number</span>
                  <div className="text-sm text-slate-200 mt-1">{ticket.mobile || 'N/A'}</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                  <span className="text-slate-400 uppercase tracking-wider font-semibold">Location (City, State, Country)</span>
                  <div className="text-sm text-slate-200 mt-1">
                    {[ticket.city, ticket.state, ticket.country].filter(Boolean).join(', ') || 'N/A'}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 sm:col-span-2">
                  <span className="text-slate-400 uppercase tracking-wider font-semibold">Query Type</span>
                  <div className="text-sm font-bold text-rose-400 mt-1">{ticket.queryType}</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800/80 sm:col-span-2">
                  <span className="text-slate-400 uppercase tracking-wider font-semibold block mb-2">Submitted Message</span>
                  <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                    {ticket.message}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                  <span className="text-slate-400 uppercase tracking-wider font-semibold">Submission Timestamp</span>
                  <div className="text-xs font-mono text-slate-300 mt-1">{formatDateTime(ticket.createdAt)}</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                  <span className="text-slate-400 uppercase tracking-wider font-semibold">Terms Acceptance</span>
                  <div className="text-xs text-emerald-400 font-semibold mt-1 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Accepted on Submit</span>
                  </div>
                </div>

                {ticket.ipAddress && (
                  <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 sm:col-span-2">
                    <span className="text-slate-400 uppercase tracking-wider font-semibold">Client IP Address</span>
                    <div className="text-xs font-mono text-slate-400 mt-1">{ticket.ipAddress}</div>
                  </div>
                )}
              </div>
            </div>

            {/* ADMIN SPECIFIC MESSAGE SYSTEM (Section 12 & 14) */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-card backdrop-blur-xl">
              <h3 className="text-base font-display font-bold text-white mb-2 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-sky-400" />
                <span>Admin Message to Traveler</span>
              </h3>
              <p className="text-xs text-slate-400 mb-5">
                Send an official message to this specific ticket. The traveler will immediately receive an email notification with your message and live tracking link.
              </p>

              <form onSubmit={handleSendMessage} className="space-y-4">
                <textarea
                  rows={4}
                  placeholder="Type a message to the user..."
                  value={adminMessageInput}
                  onChange={(e) => setAdminMessageInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                />

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    loading={sendingMessage}
                    disabled={!adminMessageInput.trim() || sendingMessage}
                    iconRight={Send}
                    className="font-bold shadow-md bg-sky-600 hover:bg-sky-500 text-white"
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
                        <span className="font-bold text-sky-400">{m.senderName || 'Vista Holidays Support Team'}</span>
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
              <Clock className="w-4 h-4 text-amber-400" />
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
                          ? 'bg-rose-500 border-rose-400 text-white'
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

export default AdminContactDetailPage;
