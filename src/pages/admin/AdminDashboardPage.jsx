import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  HelpCircle,
  Mail,
  MessageSquare,
  Sparkles,
  Megaphone,
  Wrench,
  BarChart3,
  ArrowRight,
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { AdminBadge } from '../../components/admin/AdminBadge';
import { adminService } from '../../services/adminService';
import { useToast } from '../../context/ToastContext';

export const AdminDashboardPage = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState({
    kpis: {
      users: { total: 0, verified: 0, pending: 0 },
      supportTickets: { active: 0, total: 0 },
      contactMessages: { open: 0, total: 0 },
      feedbackMessages: { pending: 0, total: 0 },
      productUpdates: { total: 0, published: 0 },
      announcements: { active: 0 }
    },
    liveActivities: []
  });

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await adminService.getDashboardOverview();
      if (response.success && response.data) {
        setOverview(response.data);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to fetch dashboard metrics.', 'Error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const formatISTDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Kolkata',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(d);
  };

  const getStatusBadgeVariant = (status) => {
    const s = String(status).toLowerCase();
    if (['open', 'new', 'active', 'published'].includes(s)) return 'info';
    if (['in progress', 'reviewed', 'pending'].includes(s)) return 'warning';
    if (['resolved', 'closed', 'verified'].includes(s)) return 'success';
    if (['suspended', 'expired'].includes(s)) return 'error';
    return 'neutral';
  };

  return (
    <AdminLayout onRefresh={fetchDashboardData} refreshing={loading}>
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Card 1: Registered Users */}
        <div className="p-5 rounded-2xl bg-[#0c1222]/90 border border-slate-800/90 flex flex-col justify-between hover:border-slate-700/80 transition-all">
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider">Registered Users</span>
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">
              {overview.kpis.users.total}
              <span className="text-xs font-medium text-slate-400 ml-2">
                ({overview.kpis.users.verified} verified)
              </span>
            </div>
          </div>
          <div className="text-[11px] text-slate-400 mt-3 pt-3 border-t border-slate-800/60">
            {overview.kpis.users.pending} pending email verification
          </div>
        </div>

        {/* Card 2: Active Support Tickets */}
        <div className="p-5 rounded-2xl bg-[#0c1222]/90 border border-slate-800/90 flex flex-col justify-between hover:border-slate-700/80 transition-all">
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider">Active Support Tickets</span>
              <div className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <HelpCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">
              {overview.kpis.supportTickets.active}
            </div>
          </div>
          <div className="text-[11px] text-slate-400 mt-3 pt-3 border-t border-slate-800/60">
            Inquiries awaiting operational response
          </div>
        </div>

        {/* Card 3: Pending Contact Inquiries */}
        <div className="p-5 rounded-2xl bg-[#0c1222]/90 border border-slate-800/90 flex flex-col justify-between hover:border-slate-700/80 transition-all">
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider">Pending Contact Inquiries</span>
              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Mail className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400">
              {overview.kpis.contactMessages.open}
            </div>
          </div>
          <div className="text-[11px] text-slate-400 mt-3 pt-3 border-t border-slate-800/60">
            {overview.kpis.contactMessages.total} total public inquiries logged
          </div>
        </div>

        {/* Card 4: Pending User Feedback */}
        <div className="p-5 rounded-2xl bg-[#0c1222]/90 border border-slate-800/90 flex flex-col justify-between hover:border-slate-700/80 transition-all">
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider">Pending Traveler Feedback</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <MessageSquare className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
              {overview.kpis.feedbackMessages.pending}
            </div>
          </div>
          <div className="text-[11px] text-slate-400 mt-3 pt-3 border-t border-slate-800/60">
            {overview.kpis.feedbackMessages.total} total survey ratings recorded
          </div>
        </div>
      </div>

      {/* Analytics Callout Ribbon */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0d1629] to-slate-900 border border-slate-800/90 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Analytics Control Center</h3>
            <p className="text-xs text-slate-400">
              Explore traveler sentiment trends, inquiries distribution, and platform system metrics.
            </p>
          </div>
        </div>

        <Link
          to="/admin/analytics"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-indigo-400 hover:text-white bg-indigo-500/10 hover:bg-indigo-600 border border-indigo-500/30 transition-all shrink-0"
        >
          <span>View Trends</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Quick Operations */}
      <div className="mb-10">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 px-1">
          Quick Operations
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3">
          <Link
            to="/admin/users"
            className="p-3.5 rounded-2xl bg-[#0c1222] border border-slate-800/90 hover:border-slate-700 text-center flex flex-col items-center justify-center group transition-all"
          >
            <Users className="w-5 h-5 text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-slate-200 group-hover:text-white">Manage Users</span>
          </Link>

          <Link
            to="/admin/support-tickets"
            className="p-3.5 rounded-2xl bg-[#0c1222] border border-slate-800/90 hover:border-slate-700 text-center flex flex-col items-center justify-center group transition-all"
          >
            <HelpCircle className="w-5 h-5 text-rose-400 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-slate-200 group-hover:text-white">Support Desk</span>
          </Link>

          <Link
            to="/admin/contact"
            className="p-3.5 rounded-2xl bg-[#0c1222] border border-slate-800/90 hover:border-slate-700 text-center flex flex-col items-center justify-center group transition-all"
          >
            <Mail className="w-5 h-5 text-cyan-400 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-slate-200 group-hover:text-white">Contact Inbox</span>
          </Link>

          <Link
            to="/admin/feedback"
            className="p-3.5 rounded-2xl bg-[#0c1222] border border-slate-800/90 hover:border-slate-700 text-center flex flex-col items-center justify-center group transition-all"
          >
            <MessageSquare className="w-5 h-5 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-slate-200 group-hover:text-white">User Feedback</span>
          </Link>

          <Link
            to="/admin/whats-new"
            className="p-3.5 rounded-2xl bg-[#0c1222] border border-slate-800/90 hover:border-slate-700 text-center flex flex-col items-center justify-center group transition-all"
          >
            <Sparkles className="w-5 h-5 text-sky-400 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-slate-200 group-hover:text-white">What's New</span>
          </Link>

          <Link
            to="/admin/announcements"
            className="p-3.5 rounded-2xl bg-[#0c1222] border border-slate-800/90 hover:border-slate-700 text-center flex flex-col items-center justify-center group transition-all"
          >
            <Megaphone className="w-5 h-5 text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-slate-200 group-hover:text-white">Announcements</span>
          </Link>

          <Link
            to="/admin/maintenance"
            className="p-3.5 rounded-2xl bg-[#0c1222] border border-slate-800/90 hover:border-slate-700 text-center flex flex-col items-center justify-center group transition-all"
          >
            <Wrench className="w-5 h-5 text-rose-400 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-slate-200 group-hover:text-white">Maintenance</span>
          </Link>

          <Link
            to="/admin/analytics"
            className="p-3.5 rounded-2xl bg-[#0c1222] border border-slate-800/90 hover:border-slate-700 text-center flex flex-col items-center justify-center group transition-all"
          >
            <BarChart3 className="w-5 h-5 text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-slate-200 group-hover:text-white">Analytics</span>
          </Link>
        </div>
      </div>

      {/* Live Activity Stream */}
      <div className="rounded-2xl bg-[#0c1222]/80 border border-slate-800/80 p-6">
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-800/60">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Live Activity Stream
          </div>
          <div className="text-[11px] text-slate-400">
            Real-time database events
          </div>
        </div>

        {overview.liveActivities.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            No recent activity recorded yet.
          </div>
        ) : (
          <div className="divide-y divide-slate-800/60">
            {overview.liveActivities.map((act) => (
              <div
                key={act.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:bg-slate-800/20 px-2 rounded-xl transition-colors"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <Link
                      to={act.link}
                      className="text-xs sm:text-sm font-bold text-white hover:text-rose-400 transition-colors"
                    >
                      {act.title}
                    </Link>
                    <AdminBadge variant={getStatusBadgeVariant(act.status)}>
                      {act.status}
                    </AdminBadge>
                    <span className="text-[10px] text-slate-400 font-medium">
                      • {act.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 truncate max-w-2xl">
                    {act.description}
                  </p>
                </div>

                <div className="text-[11px] text-slate-400 whitespace-nowrap shrink-0">
                  {formatISTDate(act.timestamp)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;
