import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Users,
  Star,
  MessageSquare,
  HelpCircle,
  RefreshCw,
  Sparkles,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { AdminBadge } from '../../components/admin/AdminBadge';
import { adminService } from '../../services/adminService';
import { useToast } from '../../context/ToastContext';

const RANGES = [
  { label: 'Today', value: 'today' },
  { label: 'Last 7 Days', value: '7d' },
  { label: 'Last 30 Days', value: '30d' },
  { label: 'This Month', value: 'month' },
  { label: 'All Time', value: 'all' }
];

export const AdminAnalyticsPage = () => {
  const toast = useToast();
  const [range, setRange] = useState('30d');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    kpis: {
      newUsersInRange: 0,
      totalUsers: 0,
      verifiedUsers: 0,
      pendingVerification: 0,
      totalSupportTickets: 0,
      supportTicketsInRange: 0,
      avgFeedbackRating: '5.0',
      totalFeedback: 0,
      productUpdatesCount: 0,
      announcementsCount: 0
    },
    distributions: {
      queryTypes: [],
      ticketStatuses: [],
      ratings: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    }
  });

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await adminService.getAnalytics(range);
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to fetch analytics metrics.', 'Error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [range]);

  const ratingTotal = Object.values(data.distributions.ratings || {}).reduce((a, b) => a + b, 0);

  return (
    <AdminLayout
      title="Platform Analytics &amp; Intelligence"
      subtitle="Aggregation metrics for user signups, travel planning, support tickets, and traveler feedback ratings."
      badgeText="Live Data"
      onRefresh={fetchAnalytics}
      refreshing={loading}
      primaryAction={
        <div className="flex items-center gap-1 bg-[#0c1222] p-1 rounded-xl border border-slate-800">
          {RANGES.map((r) => (
            <button
              key={r.value}
              onClick={() => setRange(r.value)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                range === r.value
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      }
    >
      {/* Top 5 KPI Cards (Screenshot 15 style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {/* New Users */}
        <div className="p-5 rounded-2xl bg-[#0c1222] border border-slate-800/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">New Users In Range</span>
              <Users className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-3xl font-extrabold text-white">
              {data.kpis.newUsersInRange}
            </div>
          </div>
          <div className="text-[11px] text-slate-400 mt-3 pt-3 border-t border-slate-800/60">
            Total Platform Users: {data.kpis.totalUsers}
          </div>
        </div>

        {/* Support Tickets */}
        <div className="p-5 rounded-2xl bg-[#0c1222] border border-slate-800/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Support Inquiries</span>
              <HelpCircle className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-3xl font-extrabold text-white">
              {data.kpis.supportTicketsInRange}
            </div>
          </div>
          <div className="text-[11px] text-slate-400 mt-3 pt-3 border-t border-slate-800/60">
            Lifetime Tickets: {data.kpis.totalSupportTickets}
          </div>
        </div>

        {/* Avg Feedback Rating */}
        <div className="p-5 rounded-2xl bg-[#0c1222] border border-slate-800/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Avg Feedback Rating</span>
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            </div>
            <div className="text-3xl font-extrabold text-amber-400 flex items-baseline gap-1">
              <span>{data.kpis.avgFeedbackRating}</span>
              <span className="text-xs font-normal text-slate-400">/ 5.0</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-400 mt-3 pt-3 border-t border-slate-800/60">
            From survey respondents
          </div>
        </div>

        {/* Total Feedback */}
        <div className="p-5 rounded-2xl bg-[#0c1222] border border-slate-800/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Feedback</span>
              <MessageSquare className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-extrabold text-white">
              {data.kpis.totalFeedback}
            </div>
          </div>
          <div className="text-[11px] text-slate-400 mt-3 pt-3 border-t border-slate-800/60">
            Survey questionnaires logged
          </div>
        </div>

        {/* Product Releases */}
        <div className="p-5 rounded-2xl bg-[#0c1222] border border-slate-800/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Active Releases</span>
              <Sparkles className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-3xl font-extrabold text-white">
              {data.kpis.productUpdatesCount}
            </div>
          </div>
          <div className="text-[11px] text-slate-400 mt-3 pt-3 border-t border-slate-800/60">
            {data.kpis.announcementsCount} platform announcements active
          </div>
        </div>
      </div>

      {/* 2x2 Analytics Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Query Type Distribution */}
        <div className="p-6 rounded-2xl bg-[#0c1222] border border-slate-800/80">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Query Type Distribution</h3>
              <p className="text-xs text-slate-400">Incoming contact inquiries by inquiry category</p>
            </div>
            <span className="text-xs font-bold text-slate-400">
              {data.distributions.queryTypes.reduce((a, b) => a + b.count, 0)} Inquiries
            </span>
          </div>

          {data.distributions.queryTypes.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No inquiries recorded in this period.
            </div>
          ) : (
            <div className="space-y-4">
              {data.distributions.queryTypes.map((q) => (
                <div key={q.type}>
                  <div className="flex items-center justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-200">{q.type}</span>
                    <span className="text-slate-400">{q.count} ({q.percentage}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#080d19] overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${q.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Card 2: Support Ticket Status Breakdown */}
        <div className="p-6 rounded-2xl bg-[#0c1222] border border-slate-800/80">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Support Ticket Status</h3>
              <p className="text-xs text-slate-400">Progression stages of support inquiries</p>
            </div>
            <span className="text-xs font-bold text-slate-400">
              {data.kpis.totalSupportTickets} Tickets
            </span>
          </div>

          {data.distributions.ticketStatuses.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No tickets found.
            </div>
          ) : (
            <div className="space-y-4">
              {data.distributions.ticketStatuses.map((s) => {
                const barColor =
                  s.status === 'Closed' || s.status === 'Resolved'
                    ? 'bg-rose-500'
                    : s.status === 'In Progress'
                    ? 'bg-amber-500'
                    : 'bg-emerald-500';

                return (
                  <div key={s.status}>
                    <div className="flex items-center justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-200">{s.status}</span>
                      <span className="text-slate-400">{s.count} ({s.percentage}%)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#080d19] overflow-hidden">
                      <div
                        className={`h-full ${barColor} rounded-full transition-all duration-500`}
                        style={{ width: `${s.percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Card 3: Product Satisfaction Ratings */}
        <div className="p-6 rounded-2xl bg-[#0c1222] border border-slate-800/80">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Product Satisfaction Ratings</h3>
              <p className="text-xs text-slate-400">Star rating breakdown from surveys</p>
            </div>
            <span className="text-xs font-bold text-slate-400">
              Rating Breakdown
            </span>
          </div>

          <div className="space-y-3.5">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = data.distributions.ratings?.[stars] || 0;
              const pct = ratingTotal > 0 ? Math.round((count / ratingTotal) * 100) : 0;

              return (
                <div key={stars}>
                  <div className="flex items-center justify-between text-xs font-semibold mb-1">
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <span>{stars} Stars</span>
                    </div>
                    <span className="text-slate-400">{count} respondents ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#080d19] overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Card 4: User Verification & Growth */}
        <div className="p-6 rounded-2xl bg-[#0c1222] border border-slate-800/80">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Traveler Verification Ratio</h3>
              <p className="text-xs text-slate-400">Status of traveler email verifications</p>
            </div>
            <span className="text-xs font-bold text-slate-400">
              {data.kpis.totalUsers} Travelers
            </span>
          </div>

          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-1">
                <span className="text-emerald-400">Verified Travelers</span>
                <span className="text-slate-300">
                  {data.kpis.verifiedUsers} ({data.kpis.totalUsers > 0 ? Math.round((data.kpis.verifiedUsers / data.kpis.totalUsers) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#080d19] overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{
                    width: `${data.kpis.totalUsers > 0 ? (data.kpis.verifiedUsers / data.kpis.totalUsers) * 100 : 0}%`
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-1">
                <span className="text-amber-400">Pending Verification</span>
                <span className="text-slate-300">
                  {data.kpis.pendingVerification} ({data.kpis.totalUsers > 0 ? Math.round((data.kpis.pendingVerification / data.kpis.totalUsers) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#080d19] overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-500"
                  style={{
                    width: `${data.kpis.totalUsers > 0 ? (data.kpis.pendingVerification / data.kpis.totalUsers) * 100 : 0}%`
                  }}
                />
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#080d19] border border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
              <span>Automated Brevo verification rate:</span>
              <span className="font-bold text-white">
                {data.kpis.totalUsers > 0
                  ? `${Math.round((data.kpis.verifiedUsers / data.kpis.totalUsers) * 100)}%`
                  : '100%'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalyticsPage;
