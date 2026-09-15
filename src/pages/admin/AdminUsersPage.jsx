import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Search,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Filter
} from 'lucide-react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { AdminBadge } from '../../components/admin/AdminBadge';
import { AdminEmptyState } from '../../components/admin/AdminEmptyState';
import { adminService } from '../../services/adminService';
import { useToast } from '../../context/ToastContext';

export const AdminUsersPage = () => {
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [summary, setSummary] = useState({ total: 0, verified: 0, pending: 0, admins: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [selectedVerification, setSelectedVerification] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await adminService.getUsers({
        search,
        role: selectedRole,
        verification: selectedVerification,
        status: selectedStatus
      });
      if (response.success && response.data) {
        setUsers(response.data.users || []);
        if (response.data.summary) {
          setSummary(response.data.summary);
        }
      }
    } catch (err) {
      toast.error(err.message || 'Failed to fetch users directory.', 'Error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [selectedRole, selectedVerification, selectedStatus]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUsers();
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
      year: 'numeric'
    }).format(d);
  };

  return (
    <AdminLayout
      title="Users Directory"
      subtitle="Search, inspect, and manage registered travelers and administrator accounts."
      badgeText={`${summary.total} Users`}
      onRefresh={fetchUsers}
      refreshing={loading}
    >
      {/* Search & Filter Bar */}
      <div className="p-4 rounded-2xl bg-[#0c1222] border border-slate-800/80 mb-6 flex flex-col md:flex-row items-center gap-3">
        <form onSubmit={handleSearchSubmit} className="flex-1 w-full relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by user name, email, or mobile..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#080d19] border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
          />
        </form>

        <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#080d19] border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-rose-500"
          >
            <option value="All">All Roles</option>
            <option value="user">Travelers (Users)</option>
            <option value="admin">Administrators</option>
          </select>

          <select
            value={selectedVerification}
            onChange={(e) => setSelectedVerification(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#080d19] border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-rose-500"
          >
            <option value="All">All Verification</option>
            <option value="Verified">Verified</option>
            <option value="Pending">Pending Verification</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#080d19] border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-rose-500"
          >
            <option value="All">All Statuses</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="py-20 text-center text-xs text-slate-400">
          Loading users directory...
        </div>
      ) : users.length === 0 ? (
        <AdminEmptyState
          icon={Users}
          title="No Users Found"
          description="No users matched your current search and filter settings."
        />
      ) : (
        <div className="rounded-2xl bg-[#0c1222]/90 border border-slate-800/80 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#080d19] text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800/80">
                <tr>
                  <th className="px-5 py-3.5">S.NO</th>
                  <th className="px-5 py-3.5">USER</th>
                  <th className="px-5 py-3.5">EMAIL</th>
                  <th className="px-5 py-3.5">VERIFICATION</th>
                  <th className="px-5 py-3.5">ACCOUNT STATUS</th>
                  <th className="px-5 py-3.5">JOINED DATE</th>
                  <th className="px-5 py-3.5">LAST LOGIN</th>
                  <th className="px-5 py-3.5 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {users.map((user, idx) => (
                  <tr
                    key={user._id}
                    className="hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-5 py-4 text-slate-400">{idx + 1}</td>

                    {/* User avatar & Name */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center font-bold text-blue-400 text-xs shrink-0">
                          {getInitials(user.name)}
                        </div>
                        <div>
                          <div className="font-bold text-white flex items-center gap-1.5">
                            <span>{user.name}</span>
                            {user.role === 'admin' && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-rose-500/20 text-rose-400 border border-rose-500/30">
                                Admin
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400">{user.mobile || '—'}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-slate-300 font-mono text-[11px]">
                      {user.email}
                    </td>

                    <td className="px-5 py-4">
                      {user.emailVerified ? (
                        <AdminBadge variant="success" dot>
                          Verified
                        </AdminBadge>
                      ) : (
                        <AdminBadge variant="warning" dot>
                          Pending
                        </AdminBadge>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <AdminBadge
                        variant={user.accountStatus === 'active' ? 'success' : 'danger'}
                      >
                        {user.accountStatus || 'active'}
                      </AdminBadge>
                    </td>

                    <td className="px-5 py-4 text-slate-400">
                      {formatDate(user.createdAt)}
                    </td>

                    <td className="px-5 py-4 text-slate-400">
                      {formatDate(user.lastLoginAt)}
                    </td>

                    {/* Action: Inspect User ↗ */}
                    <td className="px-5 py-4 text-right">
                      <Link
                        to={`/admin/users/${user._id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-blue-400 bg-blue-500/10 hover:bg-blue-600 hover:text-white border border-blue-500/20 transition-all"
                      >
                        <span>Inspect User</span>
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

export default AdminUsersPage;
