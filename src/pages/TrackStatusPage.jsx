import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  Search, 
  Compass, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  MessageSquare, 
  Mail, 
  ShieldCheck, 
  ArrowRight,
  Circle,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { Container } from '../components/layout/Container';
import { Button } from '../components/ui/Button';
import { useToast } from '../context/ToastContext';
import { ticketService } from '../services/ticketService';

export const TrackStatusPage = () => {
  const location = useLocation();
  const toast = useToast();

  const [ticketIdInput, setTicketIdInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [ticketData, setTicketData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Extract ticket param from URL if present
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const queryTicket = params.get('ticket');
    if (queryTicket) {
      setTicketIdInput(queryTicket.trim());
    }
  }, [location.search]);

  const handleTrack = async (e) => {
    e?.preventDefault();
    setErrorMessage('');

    if (!ticketIdInput.trim() || !emailInput.trim()) {
      setErrorMessage('Please enter both your Ticket ID and Email Address.');
      return;
    }

    setLoading(true);
    try {
      const response = await ticketService.trackTicket({
        ticketId: ticketIdInput.trim(),
        email: emailInput.trim().toLowerCase()
      });

      if (response.success && response.data?.ticket) {
        setTicketData(response.data.ticket);
        toast.success('Ticket found and verified.', 'Status Retrieved');
      } else {
        setErrorMessage('Ticket ID or email address is incorrect.');
        setTicketData(null);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Ticket ID or email address is incorrect.');
      setTicketData(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Open':
      case 'New':
        return 'bg-amber-500/15 border-amber-500/30 text-amber-400';
      case 'In Progress':
      case 'Reviewed':
        return 'bg-sky-500/15 border-sky-500/30 text-sky-400';
      case 'Resolved':
        return 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400';
      case 'Closed':
        return 'bg-slate-700/30 border-slate-600 text-slate-400';
      default:
        return 'bg-brand-500/15 border-brand-500/30 text-brand-400';
    }
  };

  const formatTimelineDate = (dateString) => {
    if (!dateString) return 'Pending';
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }) + ' • ' + d.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return String(dateString);
    }
  };

  return (
    <div className="min-h-screen py-12 sm:py-16 bg-slate-950 text-slate-100">
      <Container size="md">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Compass className="w-3.5 h-3.5" />
            <span>Support Tracking Portal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight mb-2">
            Track Your Request
          </h1>
          <p className="text-sm text-slate-400 font-sans">
            Enter your Ticket ID and corresponding email address to view real-time resolution progress and support updates.
          </p>
        </div>

        {/* Verification Form Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-card backdrop-blur-xl mb-10">
          <form onSubmit={handleTrack} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Ticket ID
                </label>
                <input
                  type="text"
                  placeholder="e.g. Vista-CON-20260914-001"
                  value={ticketIdInput}
                  onChange={(e) => setTicketIdInput(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm font-mono text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="The email you submitted with"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                />
              </div>
            </div>

            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 animate-fade-in">
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <Button
                type="submit"
                variant="primary"
                size="md"
                loading={loading}
                iconLeft={Search}
                className="w-full sm:w-auto font-bold shadow-md"
              >
                Track Status
              </Button>
            </div>
          </form>
        </div>

        {/* TRACK STATUS RESULT (Sections 9 & 15 of requirements) */}
        {ticketData && (
          <div className="space-y-6 animate-fade-in">
            {/* Top Overview Card */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-card backdrop-blur-xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {ticketData.requestType}
                  </div>
                  <h2 className="text-2xl font-mono font-extrabold text-white tracking-wide mt-1">
                    {ticketData.ticketId}
                  </h2>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider shadow-sm ${getStatusBadge(ticketData.status)}`}>
                    ● {ticketData.status}
                  </div>
                </div>
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 text-xs">
                <div>
                  <span className="text-slate-400 uppercase tracking-wider">Submitted By:</span>
                  <div className="text-sm font-semibold text-white mt-1">{ticketData.name}</div>
                </div>
                <div>
                  <span className="text-slate-400 uppercase tracking-wider">Registered Email:</span>
                  <div className="text-sm font-semibold text-white mt-1">{ticketData.email}</div>
                </div>
                <div>
                  <span className="text-slate-400 uppercase tracking-wider">
                    {ticketData.queryType ? 'Query Category:' : 'Given Rating:'}
                  </span>
                  <div className="text-sm font-semibold text-white mt-1">
                    {ticketData.queryType || `${'⭐'.repeat(ticketData.rating || 5)} (${ticketData.rating}/5)`}
                  </div>
                </div>
              </div>
            </div>

            {/* Support Team Messages (Section 15) */}
            {ticketData.messages && ticketData.messages.length > 0 && (
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-card backdrop-blur-xl">
                <h3 className="text-base font-display font-bold text-white mb-4 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-sky-400" />
                  <span>Support Team Messages</span>
                </h3>

                <div className="space-y-4">
                  {ticketData.messages.map((msg, index) => (
                    <div
                      key={index}
                      className="p-5 rounded-2xl bg-sky-950/40 border border-sky-500/20 text-sky-100 relative"
                    >
                      <div className="text-xs font-bold uppercase tracking-wider text-sky-400 mb-2 flex items-center justify-between">
                        <span>{msg.senderName || 'Vista Holidays Support Team'}</span>
                        <span className="text-slate-400 font-normal">{formatTimelineDate(msg.createdAt)}</span>
                      </div>
                      <p className="text-sm text-slate-200 italic leading-relaxed whitespace-pre-wrap">
                        "{msg.message}"
                      </p>
                      <div className="text-[11px] text-slate-400 mt-3 font-medium">
                        — Vista Holidays Support Team
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Visual Resolution Timeline (Section 9) */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-card backdrop-blur-xl">
              <h3 className="text-base font-display font-bold text-white mb-6 flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-400" />
                <span>Ticket Resolution Timeline</span>
              </h3>

              <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2 sm:before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                {ticketData.timeline && ticketData.timeline.length > 0 ? (
                  ticketData.timeline.map((item, index) => {
                    const isLast = index === ticketData.timeline.length - 1;
                    return (
                      <div key={index} className="relative group">
                        {/* Bullet Icon */}
                        <div className={`absolute -left-[30px] sm:-left-[35px] top-0.5 w-5 h-5 rounded-full flex items-center justify-center border text-[10px] ${
                          isLast
                            ? 'bg-brand-500 border-brand-400 text-white shadow-glow'
                            : 'bg-emerald-950 border-emerald-500 text-emerald-400'
                        }`}>
                          {isLast ? <Circle className="w-2.5 h-2.5 fill-current" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>

                        <div>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                            <span className="text-sm font-bold text-white">
                              {item.message}
                            </span>
                            <span className="text-[11px] text-slate-400 font-mono">
                              {formatTimelineDate(item.createdAt)}
                            </span>
                          </div>
                          {item.status && (
                            <span className="inline-block mt-1 text-[10px] uppercase font-bold text-slate-400 px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
                              Status: {item.status}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-slate-500">No activity logged yet.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};

export default TrackStatusPage;
