import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Trash2,
  RefreshCw,
  Mail,
  Calendar,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Shield,
  HelpCircle,
  MessageSquare,
  Phone,
  UserCheck
} from 'lucide-react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { AdminBadge } from '../../components/admin/AdminBadge';
import { AdminConfirmModal } from '../../components/admin/AdminConfirmModal';
import { adminService } from '../../services/adminService';
import { useToast } from '../../context/ToastContext';

export const AdminUserDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const res = await adminService.getUserById(id);
      if (res.success && res.data) {
        setUserData(res.data);
      } else {
        toast.error('User not found.', 'Error');
        navigate('/admin/users');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to fetch user details.', 'Error');
      navigate('/admin/users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  const handleDeleteUser = async () => {
    setDeleting(true);
    try {
      await adminService.deleteUser(id);
      toast.success('User account deleted successfully.', 'Deleted');
      setShowDeleteModal(false);
      navigate('/admin/users');
    } catch (err) {
      toast.error(err.message || 'Failed to delete user.', 'Error');
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!userData?.user || statusUpdating) return;
    const currentStatus = userData.user.accountStatus;
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';

    setStatusUpdating(true);
    try {
      const res = await adminService.updateUserStatus(id, newStatus);
      if (res.success) {
        toast.success(`Account status changed to ${newStatus}.`, 'Updated');
        fetchUser();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to change status.', 'Error');
    } finally {
      setStatusUpdating(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
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
          Loading user profile details...
        </div>
      </AdminLayout>
    );
  }

  const user = userData?.user;
  const activity = userData?.activity || {};

  return (
    <AdminLayout>
      {/* Back and Action Buttons */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <Link
          to="/admin/users"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Users Directory</span>
        </Link>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowDeleteModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-600 border border-rose-500/30 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Account</span>
          </button>

          <button
            onClick={fetchUser}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* User Identity Banner Card (Screenshot 5 inspired) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0c1222] border border-slate-800/90 mb-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center font-extrabold text-blue-400 text-xl shadow-lg shrink-0">
              {getInitials(user.name)}
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                  {user.name}
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
                  {user.role}
                </span>
              </div>
              <div className="text-xs sm:text-sm text-slate-400 font-mono mt-1">
                {user.email}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start sm:items-end gap-1.5 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Joined: {formatDate(user.createdAt)}</span>
            </div>
            <div>
              {user.emailVerified ? (
                <span className="inline-flex items-center gap-1 font-bold text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified Account</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 font-bold text-amber-400">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Pending Email Verification</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* User Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          <div className="p-4 rounded-2xl bg-[#080d19] border border-slate-800/80">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Support Inquiries
            </div>
            <div className="text-2xl font-extrabold text-white">
              {activity.supportTicketsCount || 0}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#080d19] border border-slate-800/80">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Survey Reviews
            </div>
            <div className="text-2xl font-extrabold text-white">
              {activity.feedbackCount || 0}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#080d19] border border-slate-800/80">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Account Status
            </div>
            <div className="text-base font-extrabold capitalize text-emerald-400 mt-1">
              {user.accountStatus}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#080d19] border border-slate-800/80">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Last Login
            </div>
            <div className="text-xs font-semibold text-slate-300 mt-2 truncate">
              {formatDate(user.lastLoginAt)}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Profile Details & Right Inquiries History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Account Information */}
        <div className="lg:col-span-1 space-y-6">
          <div className="p-6 rounded-2xl bg-[#0c1222] border border-slate-800/80">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 pb-2 border-b border-slate-800/60">
              Account &amp; Profile Details
            </h3>

            <div className="space-y-3.5 text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">Full Name</span>
                <span className="font-semibold text-white">{user.name}</span>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">Email Address</span>
                <span className="font-mono text-slate-200">{user.email}</span>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">Contact Mobile</span>
                <span className="font-semibold text-slate-200">{user.mobile || '—'}</span>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">Email Verification</span>
                <AdminBadge variant={user.emailVerified ? 'success' : 'warning'}>
                  {user.emailVerified ? 'Verified' : 'Pending'}
                </AdminBadge>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">Terms Accepted</span>
                <span className="font-semibold text-slate-200">
                  {user.termsAccepted ? `Yes (v${user.termsVersion || '1.0'})` : 'No'}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">Account Status</span>
                <div className="flex items-center gap-2 mt-1">
                  <AdminBadge variant={user.accountStatus === 'active' ? 'success' : 'danger'}>
                    {user.accountStatus}
                  </AdminBadge>
                  <button
                    onClick={handleToggleStatus}
                    disabled={statusUpdating}
                    className="text-[11px] font-bold text-rose-400 hover:text-rose-300 underline disabled:opacity-50"
                  >
                    {user.accountStatus === 'active' ? 'Suspend Account' : 'Reactivate'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Recent Inquiries & Feedback */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Contact Inquiries */}
          <div className="p-6 rounded-2xl bg-[#0c1222] border border-slate-800/80">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 pb-2 border-b border-slate-800/60">
              Recent Support Inquiries
            </h3>

            {(!activity.contactTickets || activity.contactTickets.length === 0) ? (
              <div className="py-6 text-center text-xs text-slate-400">
                No support inquiries found from this user.
              </div>
            ) : (
              <div className="space-y-3">
                {activity.contactTickets.map((t) => (
                  <div
                    key={t._id}
                    className="p-3.5 rounded-xl bg-[#080d19] border border-slate-800/80 flex items-center justify-between gap-4"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-blue-400 font-mono">
                          {t.ticketId}
                        </span>
                        <AdminBadge variant={t.status === 'Closed' ? 'neutral' : 'info'}>
                          {t.status}
                        </AdminBadge>
                      </div>
                      <p className="text-xs text-slate-300 truncate">
                        {t.queryType}: "{t.message}"
                      </p>
                    </div>

                    <Link
                      to={`/admin/contact/${t._id}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-blue-400 hover:text-blue-300 shrink-0"
                    >
                      <span>Ticket</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Feedback Submissions */}
          <div className="p-6 rounded-2xl bg-[#0c1222] border border-slate-800/80">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 pb-2 border-b border-slate-800/60">
              Recent Traveler Feedback
            </h3>

            {(!activity.feedbackTickets || activity.feedbackTickets.length === 0) ? (
              <div className="py-6 text-center text-xs text-slate-400">
                No feedback submissions from this user yet.
              </div>
            ) : (
              <div className="space-y-3">
                {activity.feedbackTickets.map((f) => (
                  <div
                    key={f._id}
                    className="p-3.5 rounded-xl bg-[#080d19] border border-slate-800/80 flex items-center justify-between gap-4"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-purple-400 font-mono">
                          {f.ticketId}
                        </span>
                        <AdminBadge variant="success">
                          ★ {f.rating || 5} Stars
                        </AdminBadge>
                        <AdminBadge variant="neutral">
                          {f.status}
                        </AdminBadge>
                      </div>
                      <p className="text-xs text-slate-400">
                        Submitted: {formatDate(f.createdAt)}
                      </p>
                    </div>

                    <Link
                      to={`/admin/feedback/${f._id}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-purple-400 hover:text-purple-300 shrink-0"
                    >
                      <span>Review</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete User Modal */}
      <AdminConfirmModal
        isOpen={showDeleteModal}
        title={`Delete Traveler Account: ${user.name}?`}
        message="This action will permanently delete this account and all associated travel records. This operation cannot be undone."
        confirmText="Delete Account"
        confirmVariant="danger"
        loading={deleting}
        onConfirm={handleDeleteUser}
        onCancel={() => setShowDeleteModal(false)}
      />
    </AdminLayout>
  );
};

export default AdminUserDetailPage;
