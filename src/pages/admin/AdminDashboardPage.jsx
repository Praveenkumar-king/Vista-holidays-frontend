import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Mail, 
  MessageSquare, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  Layers, 
  CheckCircle2, 
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { Container } from '../../components/layout/Container';
import { AdminNavHeader } from '../../components/layout/AdminNavHeader';
import { useAuth } from '../../context/AuthContext';
import { ticketService } from '../../services/ticketService';
import { productUpdateService } from '../../services/productUpdateService';

export const AdminDashboardPage = () => {
  const { currentUser } = useAuth();

  const [contactSummary, setContactSummary] = useState({ total: 0, open: 0 });
  const [feedbackSummary, setFeedbackSummary] = useState({ total: 0, pending: 0 });
  const [updatesSummary, setUpdatesSummary] = useState({ total: 0, published: 0 });
  const [loading, setLoading] = useState(true);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const [contactRes, feedbackRes, updatesRes] = await Promise.allSettled([
        ticketService.getContactMessages({}),
        ticketService.getFeedbackMessages({}),
        productUpdateService.getAdminUpdates({})
      ]);

      if (contactRes.status === 'fulfilled' && contactRes.value?.data?.summary) {
        setContactSummary(contactRes.value.data.summary);
      }
      if (feedbackRes.status === 'fulfilled' && feedbackRes.value?.data?.summary) {
        setFeedbackSummary(feedbackRes.value.data.summary);
      }
      if (updatesRes.status === 'fulfilled' && updatesRes.value?.data?.summary) {
        setUpdatesSummary(updatesRes.value.data.summary);
      }
    } catch {
      // Graceful fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Admin Navigation Bar */}
      <AdminNavHeader />

      <Container size="xl" className="py-10 flex-grow">
        {/* Welcome Ribbon */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-400 mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Administrator Portal Hub</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
              Welcome back, {currentUser?.name || 'Administrator'}
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Manage incoming support tickets, customer feedback, and product release updates in one central dashboard.
            </p>
          </div>

          <button
            onClick={fetchMetrics}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Overview</span>
          </button>
        </div>

        {/* 3 Core Management Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Card 1: Contact Support Messages */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-7 flex flex-col justify-between hover:border-slate-700 transition-all group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-5 group-hover:scale-105 transition-transform">
                <Mail className="w-6 h-6" />
              </div>

              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">
                Inquiries &amp; Assistance
              </span>
              <h2 className="text-xl font-bold text-white mt-1 mb-2">
                Contact Messages
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
                Review traveler inquiries, change ticket statuses, reply with admin messages, and generate reports.
              </p>

              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-950/60 rounded-2xl border border-slate-800/80 mb-6">
                <div>
                  <div className="text-[10px] uppercase text-slate-500 font-bold">Total Tickets</div>
                  <div className="text-xl font-extrabold text-white mt-0.5">{contactSummary.total ?? 0}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase text-amber-400 font-bold">Open Tickets</div>
                  <div className="text-xl font-extrabold text-amber-400 mt-0.5">{contactSummary.open ?? 0}</div>
                </div>
              </div>
            </div>

            <Link
              to="/admin/contact"
              className="inline-flex items-center justify-between px-4 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-md shadow-rose-950/50"
            >
              <span>Manage Contact Tickets</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 2: Traveler Feedback */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-7 flex flex-col justify-between hover:border-slate-700 transition-all group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-5 group-hover:scale-105 transition-transform">
                <MessageSquare className="w-6 h-6" />
              </div>

              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
                User Reviews &amp; Ratings
              </span>
              <h2 className="text-xl font-bold text-white mt-1 mb-2">
                Traveler Feedback
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
                Inspect user ratings, survey responses, traveler recommendations, and sentiment feedback.
              </p>

              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-950/60 rounded-2xl border border-slate-800/80 mb-6">
                <div>
                  <div className="text-[10px] uppercase text-slate-500 font-bold">Submissions</div>
                  <div className="text-xl font-extrabold text-white mt-0.5">{feedbackSummary.total ?? 0}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase text-purple-400 font-bold">Pending Review</div>
                  <div className="text-xl font-extrabold text-purple-400 mt-0.5">{feedbackSummary.open ?? feedbackSummary.pending ?? 0}</div>
                </div>
              </div>
            </div>

            <Link
              to="/admin/feedback"
              className="inline-flex items-center justify-between px-4 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-md shadow-purple-950/50"
            >
              <span>Manage Feedback</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 3: What's New & Product Updates */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-7 flex flex-col justify-between hover:border-slate-700 transition-all group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 mb-5 group-hover:scale-105 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>

              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400">
                Release Announcements
              </span>
              <h2 className="text-xl font-bold text-white mt-1 mb-2">
                What's New &amp; Releases
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
                Publish feature slides, upload Cloudinary assets, configure changelogs, and announce platform updates.
              </p>

              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-950/60 rounded-2xl border border-slate-800/80 mb-6">
                <div>
                  <div className="text-[10px] uppercase text-slate-500 font-bold">Total Releases</div>
                  <div className="text-xl font-extrabold text-white mt-0.5">{updatesSummary.total ?? 0}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase text-emerald-400 font-bold">Published</div>
                  <div className="text-xl font-extrabold text-emerald-400 mt-0.5">{updatesSummary.published ?? 0}</div>
                </div>
              </div>
            </div>

            <Link
              to="/admin/whats-new"
              className="inline-flex items-center justify-between px-4 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-all shadow-md shadow-sky-950/50"
            >
              <span>Manage What's New</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Quick System Info */}
        <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Admin Gateway Operational • Session: <strong className="text-white">{currentUser?.email}</strong></span>
          </div>
          <Link to="/" className="text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors">
            <span>View Public Application</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </Container>
    </div>
  );
};

export default AdminDashboardPage;
