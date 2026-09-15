import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  HelpCircle,
  Search,
  ExternalLink,
  Filter
} from 'lucide-react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { AdminBadge } from '../../components/admin/AdminBadge';
import { AdminEmptyState } from '../../components/admin/AdminEmptyState';
import { adminService } from '../../services/adminService';
import { useToast } from '../../context/ToastContext';

export const AdminSupportTicketsPage = () => {
  const toast = useToast();
  const [tickets, setTickets] = useState([]);
  const [summary, setSummary] = useState({ total: 0, open: 0, closed: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const response = await adminService.getAllTickets({
        search,
        status: selectedStatus,
        category: selectedCategory
      });
      if (response.success && response.data) {
        setTickets(response.data.tickets || []);
        if (response.data.summary) {
          setSummary(response.data.summary);
        }
      }
    } catch (err) {
      toast.error(err.message || 'Failed to fetch support tickets.', 'Error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [selectedStatus, selectedCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchTickets();
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

  const getStatusBadgeVariant = (status) => {
    const s = String(status).toLowerCase();
    if (['open', 'new'].includes(s)) return 'info';
    if (['in progress', 'reviewed'].includes(s)) return 'warning';
    if (['resolved', 'closed'].includes(s)) return 'neutral';
    return 'neutral';
  };

  return (
    <AdminLayout
      title="Support Tickets Directory"
      subtitle="Review, track, and update the status of user support inquiries across the platform."
      badgeText={`${summary.total} Tickets`}
      onRefresh={fetchTickets}
      refreshing={loading}
    >
      {/* Search & Filters */}
      <div className="p-4 rounded-2xl bg-[#0c1222] border border-slate-800/80 mb-6 flex flex-col md:flex-row items-center gap-3">
        <form onSubmit={handleSearchSubmit} className="flex-1 w-full relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search ticket ID, user name, email, or subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#080d19] border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
          />
        </form>

        <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#080d19] border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-rose-500"
          >
            <option value="All">All Statuses</option>
            <option value="Open">Open / New</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#080d19] border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-rose-500"
          >
            <option value="All">All Categories</option>
            <option value="General Inquiry">General Inquiry</option>
            <option value="Booking & Itinerary">Booking &amp; Itinerary</option>
            <option value="Traveler Feedback">Traveler Feedback</option>
            <option value="Technical Support">Technical Support</option>
          </select>
        </div>
      </div>

      {/* Tickets Table */}
      {loading ? (
        <div className="py-20 text-center text-xs text-slate-400">
          Loading support tickets...
        </div>
      ) : tickets.length === 0 ? (
        <AdminEmptyState
          icon={HelpCircle}
          title="No Support Tickets Found"
          description="There are currently no tickets matching your search or filters."
        />
      ) : (
        <div className="rounded-2xl bg-[#0c1222]/90 border border-slate-800/80 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#080d19] text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800/80">
                <tr>
                  <th className="px-5 py-3.5">S.NO</th>
                  <th className="px-5 py-3.5">TICKET ID</th>
                  <th className="px-5 py-3.5">DATE &amp; TIME</th>
                  <th className="px-5 py-3.5">USER NAME</th>
                  <th className="px-5 py-3.5">EMAIL</th>
                  <th className="px-5 py-3.5">SUBJECT</th>
                  <th className="px-5 py-3.5">CATEGORY</th>
                  <th className="px-5 py-3.5">STATUS</th>
                  <th className="px-5 py-3.5 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {tickets.map((ticket, idx) => (
                  <tr
                    key={ticket._id}
                    className="hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-5 py-4 text-slate-400">{idx + 1}</td>

                    <td className="px-5 py-4 font-mono font-bold text-blue-400">
                      {ticket.ticketId}
                    </td>

                    <td className="px-5 py-4 text-slate-400 whitespace-nowrap">
                      {formatDate(ticket.createdAt)}
                    </td>

                    <td className="px-5 py-4 font-bold text-white whitespace-nowrap">
                      {ticket.userName}
                    </td>

                    <td className="px-5 py-4 text-slate-400 font-mono text-[11px]">
                      {ticket.email}
                    </td>

                    <td className="px-5 py-4 text-slate-300 max-w-xs truncate">
                      {ticket.subject}
                    </td>

                    <td className="px-5 py-4 text-slate-400">
                      {ticket.category}
                    </td>

                    <td className="px-5 py-4">
                      <AdminBadge variant={getStatusBadgeVariant(ticket.status)}>
                        {ticket.status}
                      </AdminBadge>
                    </td>

                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <Link
                        to={ticket.detailUrl}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-blue-400 bg-blue-500/10 hover:bg-blue-600 hover:text-white border border-blue-500/20 transition-all"
                      >
                        <span>View Details</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminSupportTicketsPage;
