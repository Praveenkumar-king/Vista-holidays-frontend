import React, { useState, useEffect } from 'react';
import {
  Megaphone,
  Plus,
  Search,
  Eye,
  Edit2,
  Trash2,
  Calendar,
  X,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Send,
  Users
} from 'lucide-react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { AdminBadge } from '../../components/admin/AdminBadge';
import { AdminEmptyState } from '../../components/admin/AdminEmptyState';
import { AdminConfirmModal } from '../../components/admin/AdminConfirmModal';
import { adminService } from '../../services/adminService';
import { useToast } from '../../context/ToastContext';

export const AdminAnnouncementsPage = () => {
  const toast = useToast();
  const [announcements, setAnnouncements] = useState([]);
  const [summary, setSummary] = useState({ total: 0, active: 0, draft: 0, expired: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedAudience, setSelectedAudience] = useState('All');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [announcementToEdit, setAnnouncementToEdit] = useState(null);
  const [announcementToDelete, setAnnouncementToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetAudience, setTargetAudience] = useState('everyone');
  const [expirationDuration, setExpirationDuration] = useState('never');
  const [status, setStatus] = useState('active');

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const response = await adminService.getAdminAnnouncements({
        search,
        status: selectedStatus,
        audience: selectedAudience
      });

      if (response.success && response.data) {
        setAnnouncements(response.data.announcements || []);
        if (response.data.summary) {
          setSummary(response.data.summary);
        }
      }
    } catch (err) {
      toast.error(err.message || 'Failed to fetch platform announcements.', 'Error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, [selectedStatus, selectedAudience]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchAnnouncements();
  };

  const handleOpenCreate = () => {
    setAnnouncementToEdit(null);
    setTitle('');
    setMessage('');
    setTargetAudience('everyone');
    setExpirationDuration('never');
    setStatus('active');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ann) => {
    setAnnouncementToEdit(ann);
    setTitle(ann.title);
    setMessage(ann.message);
    setTargetAudience(ann.targetAudience || 'everyone');
    setExpirationDuration(ann.expirationDuration || 'never');
    setStatus(ann.status || 'active');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim() || submitting) return;

    setSubmitting(true);
    try {
      if (announcementToEdit) {
        await adminService.updateAnnouncement(announcementToEdit._id, {
          title,
          message,
          targetAudience,
          expirationDuration,
          status
        });
        toast.success('Announcement updated.', 'Saved');
      } else {
        await adminService.createAnnouncement({
          title,
          message,
          targetAudience,
          expirationDuration,
          status
        });
        toast.success('Platform announcement published.', 'Created');
      }

      setIsModalOpen(false);
      setAnnouncementToEdit(null);
      fetchAnnouncements();
    } catch (err) {
      toast.error(err.message || 'Failed to save announcement.', 'Error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (ann) => {
    try {
      const res = await adminService.toggleAnnouncementStatus(ann._id);
      if (res.success) {
        toast.success(`Announcement is now ${res.data.announcement.status}.`, 'Status Changed');
        fetchAnnouncements();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to toggle status.', 'Error');
    }
  };

  const handleDelete = async () => {
    if (!announcementToDelete) return;
    setDeleting(true);
    try {
      await adminService.deleteAnnouncement(announcementToDelete._id);
      toast.success('Announcement deleted.', 'Deleted');
      setAnnouncementToDelete(null);
      fetchAnnouncements();
    } catch (err) {
      toast.error(err.message || 'Failed to delete announcement.', 'Error');
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Indefinite';
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Kolkata',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(d);
  };

  const getStatusBadgeVariant = (s) => {
    switch (s?.toLowerCase()) {
      case 'active': return 'success';
      case 'draft': return 'warning';
      case 'expired': return 'neutral';
      case 'closed': return 'neutral';
      default: return 'neutral';
    }
  };

  const getAudienceLabel = (aud) => {
    switch (aud) {
      case 'everyone': return '👥 Everyone';
      case 'users': return '✈️ Travelers Only';
      case 'admins': return '🛡️ Admins Only';
      default: return aud;
    }
  };

  return (
    <AdminLayout
      title="Platform Announcement Center"
      subtitle="Broadcast temporary platform banners for maintenance, feature releases, and service notices."
      badgeText={`${summary.total} Notices`}
      onRefresh={fetchAnnouncements}
      refreshing={loading}
      primaryAction={
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-950/50 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create Announcement</span>
        </button>
      }
    >
      {/* Search & Filters */}
      <div className="p-4 rounded-2xl bg-[#0c1222] border border-slate-800/80 mb-6 flex flex-col md:flex-row items-center gap-3">
        <form onSubmit={handleSearchSubmit} className="flex-1 w-full relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search announcement title or message..."
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
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="expired">Expired</option>
            <option value="closed">Closed</option>
          </select>

          <select
            value={selectedAudience}
            onChange={(e) => setSelectedAudience(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#080d19] border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-rose-500"
          >
            <option value="All">All Audiences</option>
            <option value="everyone">Everyone</option>
            <option value="users">Standard Users Only</option>
            <option value="admins">Administrators Only</option>
          </select>
        </div>
      </div>

      {/* Announcements Table */}
      {loading ? (
        <div className="py-20 text-center text-xs text-slate-400">
          Loading platform announcements...
        </div>
      ) : announcements.length === 0 ? (
        <AdminEmptyState
          icon={Megaphone}
          title="No Platform Announcements"
          description="There are currently no announcements matching your filters."
        />
      ) : (
        <div className="rounded-2xl bg-[#0c1222]/90 border border-slate-800/80 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#080d19] text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800/80">
                <tr>
                  <th className="px-5 py-3.5">S.NO</th>
                  <th className="px-5 py-3.5">TITLE</th>
                  <th className="px-5 py-3.5">TARGET AUDIENCE</th>
                  <th className="px-5 py-3.5">STATUS</th>
                  <th className="px-5 py-3.5">START DATE</th>
                  <th className="px-5 py-3.5">EXPIRY DATE</th>
                  <th className="px-5 py-3.5">CREATED</th>
                  <th className="px-5 py-3.5 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {announcements.map((ann, idx) => (
                  <tr
                    key={ann._id}
                    className="hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-5 py-4 text-slate-400">{idx + 1}</td>

                    <td className="px-5 py-4 font-bold text-white max-w-xs">
                      <div>{ann.title}</div>
                      <div className="text-[11px] text-slate-400 font-normal truncate mt-0.5">
                        {ann.message}
                      </div>
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap">
                      <AdminBadge variant="neutral">
                        {getAudienceLabel(ann.targetAudience)}
                      </AdminBadge>
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap">
                      <AdminBadge variant={getStatusBadgeVariant(ann.status)} dot>
                        {ann.status.toUpperCase()}
                      </AdminBadge>
                    </td>

                    <td className="px-5 py-4 text-slate-400 whitespace-nowrap">
                      {formatDate(ann.startDate)}
                    </td>

                    <td className="px-5 py-4 text-slate-400 whitespace-nowrap">
                      {formatDate(ann.expiresAt)}
                    </td>

                    <td className="px-5 py-4 text-slate-400 whitespace-nowrap">
                      {formatDate(ann.createdAt)}
                    </td>

                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(ann)}
                          className="p-1.5 rounded-xl text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition-colors"
                          title="Edit announcement"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleToggleStatus(ann)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors ${
                            ann.status === 'active'
                              ? 'text-amber-400 bg-amber-500/10 hover:bg-amber-600 hover:text-white border-amber-500/30'
                              : 'text-emerald-400 bg-emerald-500/10 hover:bg-emerald-600 hover:text-white border-emerald-500/30'
                          }`}
                        >
                          {ann.status === 'active' ? 'Stop' : 'Activate'}
                        </button>

                        <button
                          onClick={() => setAnnouncementToDelete(ann)}
                          className="p-1.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Delete announcement"
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

      {/* Create / Edit Modal (Screenshot 12 inspired) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div
            className="w-full max-w-lg rounded-2xl bg-[#0c1222] border border-slate-800 shadow-2xl p-6 text-slate-100 relative"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800/80">
              <div>
                <h3 className="text-lg font-bold text-white">
                  {announcementToEdit ? 'Edit Platform Announcement' : 'Create Platform Announcement'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Publish a persistent banner notice displayed across user/admin interfaces.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Announcement Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Scheduled Infrastructure Maintenance"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#080d19] border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Announcement Message <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Provide full notice details for travelers or admins..."
                  className="w-full p-3 rounded-xl bg-[#080d19] border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 resize-none leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Target Audience
                  </label>
                  <select
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#080d19] border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500"
                  >
                    <option value="everyone">Everyone (Users + Admins)</option>
                    <option value="users">Standard Users Only</option>
                    <option value="admins">Administrators Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Expiration Duration
                  </label>
                  <select
                    value={expirationDuration}
                    onChange={(e) => setExpirationDuration(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#080d19] border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500"
                  >
                    <option value="never">No Expiration</option>
                    <option value="1_day">1 Day</option>
                    <option value="2_days">2 Days</option>
                    <option value="5_days">5 Days</option>
                    <option value="1_month">1 Month</option>
                    <option value="2_months">2 Months</option>
                    <option value="3_months">3 Months</option>
                    <option value="6_months">6 Months</option>
                    <option value="1_year">1 Year</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Initial Lifecycle State
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#080d19] border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500"
                >
                  <option value="active">ACTIVE (Display banner immediately)</option>
                  <option value="draft">DRAFT (Save for review)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-950/50 transition-all disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : announcementToEdit ? 'Save Changes' : 'Create Announcement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AdminConfirmModal
        isOpen={Boolean(announcementToDelete)}
        title={`Delete Announcement: "${announcementToDelete?.title}"?`}
        message="Are you sure you want to delete this broadcast notice? This action cannot be reversed."
        confirmText="Delete Notice"
        confirmVariant="danger"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setAnnouncementToDelete(null)}
      />
    </AdminLayout>
  );
};

export default AdminAnnouncementsPage;
