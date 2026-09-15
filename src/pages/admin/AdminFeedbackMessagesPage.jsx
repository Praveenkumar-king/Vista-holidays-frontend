import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageSquare,
  Search,
  Trash2,
  ExternalLink,
  Star
} from 'lucide-react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { AdminBadge } from '../../components/admin/AdminBadge';
import { AdminEmptyState } from '../../components/admin/AdminEmptyState';
import { AdminConfirmModal } from '../../components/admin/AdminConfirmModal';
import { ticketService } from '../../services/ticketService';
import { useToast } from '../../context/ToastContext';

export const AdminFeedbackMessagesPage = () => {
  const toast = useToast();
  const [feedbacks, setFeedbacks] = useState([]);
  const [summary, setSummary] = useState({ total: 0, pending: 0, resolved: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const [feedbackToDelete, setFeedbackToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const response = await ticketService.getFeedbackMessages({
        search,
        status: selectedStatus
      });

      if (response.success && response.data) {
        setFeedbacks(response.data.feedbacks || []);
        if (response.data.summary) {
          setSummary(response.data.summary);
        }
      }
    } catch (err) {
      toast.error(err.message || 'Failed to fetch traveler feedback.', 'Error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, [selectedStatus]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchFeedbacks();
  };

  const handleDeleteSingle = async () => {
    if (!feedbackToDelete) return;
    setDeleting(true);
    try {
      await ticketService.deleteFeedbackMessage(feedbackToDelete._id);
      toast.success(`Feedback ${feedbackToDelete.ticketId} deleted.`, 'Deleted');
      setFeedbackToDelete(null);
      fetchFeedbacks();
    } catch (err) {
      toast.error(err.message || 'Failed to delete feedback.', 'Error');
    } finally {
      setDeleting(false);
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

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'New': return 'info';
      case 'Reviewed': return 'warning';
      case 'Resolved': return 'success';
      case 'Closed': return 'neutral';
      default: return 'neutral';
    }
  };

  return (
    <AdminLayout
      title="Feedback Messages Directory"
      subtitle="Review traveler ratings, questionnaire answers, and sentiment suggestions."
      badgeText={`${feedbacks.length} Submissions`}
      onRefresh={fetchFeedbacks}
      refreshing={loading}
    >
      {/* Search & Status Filter */}
      <div className="p-4 rounded-2xl bg-[#0c1222] border border-slate-800/80 mb-6 flex flex-col md:flex-row items-center gap-3">
        <form onSubmit={handleSearchSubmit} className="flex-1 w-full relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search ticket ID, traveler name, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#080d19] border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
          />
        </form>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#080d19] border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-rose-500"
          >
            <option value="All">All Statuses</option>
            <option value="New">New</option>
            <option value="Reviewed">Reviewed</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Feedbacks Table */}
      {loading ? (
        <div className="py-20 text-center text-xs text-slate-400">
          Loading feedback messages...
        </div>
      ) : feedbacks.length === 0 ? (
        <AdminEmptyState
          icon={MessageSquare}
          title="No Feedback Submissions Found"
          description="There are currently no feedback submissions matching your query."
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
                  <th className="px-5 py-3.5">RATING</th>
                  <th className="px-5 py-3.5">STATUS</th>
                  <th className="px-5 py-3.5 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {feedbacks.map((fb, idx) => (
                  <tr
                    key={fb._id}
                    className="hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-5 py-4 text-slate-400">{idx + 1}</td>

                    <td className="px-5 py-4 font-mono font-bold text-purple-400 whitespace-nowrap">
                      {fb.ticketId}
                    </td>

                    <td className="px-5 py-4 text-slate-400 whitespace-nowrap">
                      {formatDate(fb.createdAt)}
                    </td>

                    <td className="px-5 py-4 font-bold text-white whitespace-nowrap">
                      {fb.name}
                    </td>

                    <td className="px-5 py-4 text-slate-400 font-mono text-[11px]">
                      {fb.email}
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-amber-400 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{fb.rating || 5}.0</span>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <AdminBadge variant={getStatusBadgeVariant(fb.status)}>
                        {fb.status}
                      </AdminBadge>
                    </td>

                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/feedback/${fb._id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-purple-400 bg-purple-500/10 hover:bg-purple-600 hover:text-white border border-purple-500/20 transition-all"
                        >
                          <span>View Details</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>

                        <button
                          onClick={() => setFeedbackToDelete(fb)}
                          className="p-1.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Delete feedback"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AdminConfirmModal
        isOpen={Boolean(feedbackToDelete)}
        title={`Delete Feedback: ${feedbackToDelete?.ticketId}?`}
        message="Are you sure you want to permanently delete this feedback submission?"
        confirmText="Delete Feedback"
        confirmVariant="danger"
        loading={deleting}
        onConfirm={handleDeleteSingle}
        onCancel={() => setFeedbackToDelete(null)}
      />
    </AdminLayout>
  );
};

export default AdminFeedbackMessagesPage;
