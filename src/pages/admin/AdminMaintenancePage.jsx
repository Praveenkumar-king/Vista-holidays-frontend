import React, { useState, useEffect } from 'react';
import {
  Wrench,
  ShieldCheck,
  Clock,
  Save,
  AlertTriangle,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { AdminBadge } from '../../components/admin/AdminBadge';
import { AdminConfirmModal } from '../../components/admin/AdminConfirmModal';
import { adminService } from '../../services/adminService';
import { useToast } from '../../context/ToastContext';

export const AdminMaintenancePage = () => {
  const toast = useToast();
  const [maintenance, setMaintenance] = useState({
    maintenanceMode: false,
    maintenanceHeadline: 'Scheduled Maintenance in Progress',
    maintenanceMessage: 'Vista Holidays is currently undergoing scheduled platform maintenance. We will be back online shortly. Thank you for your patience.',
    maintenanceStartedAt: null,
    adminBypassActive: true
  });
  const [headline, setHeadline] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [savingCopy, setSavingCopy] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const fetchMaintenance = async () => {
    setLoading(true);
    try {
      const res = await adminService.getMaintenance();
      if (res.success && res.data) {
        setMaintenance(res.data);
        setHeadline(res.data.maintenanceHeadline || '');
        setMessage(res.data.maintenanceMessage || '');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to fetch maintenance status.', 'Error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaintenance();
  }, []);

  const handleToggleMaintenance = async () => {
    setToggling(true);
    try {
      const res = await adminService.toggleMaintenance(!maintenance.maintenanceMode);
      if (res.success && res.data) {
        setMaintenance(prev => ({
          ...prev,
          maintenanceMode: res.data.maintenanceMode,
          maintenanceStartedAt: res.data.maintenanceStartedAt
        }));
        toast.success(
          res.data.maintenanceMode
            ? 'Maintenance mode is now active. Normal user access is blocked.'
            : 'Maintenance mode disabled. System returned to operational state.',
          'Status Changed'
        );
      }
      setShowConfirmModal(false);
    } catch (err) {
      toast.error(err.message || 'Failed to toggle maintenance mode.', 'Error');
    } finally {
      setToggling(false);
    }
  };

  const handleSaveCopy = async (e) => {
    e.preventDefault();
    if (!headline.trim() || !message.trim() || savingCopy) return;

    setSavingCopy(true);
    try {
      const res = await adminService.updateMaintenanceCopy({
        headline,
        message
      });
      if (res.success) {
        toast.success('Maintenance notice copy saved successfully.', 'Saved');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to save notice copy.', 'Error');
    } finally {
      setSavingCopy(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Not currently active';
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

  return (
    <AdminLayout
      title="Platform Maintenance Control"
      subtitle="Toggle global application maintenance mode and customize user-facing maintenance messaging."
      badgeText={maintenance.maintenanceMode ? 'UNDER MAINTENANCE' : 'SYSTEM ONLINE'}
      onRefresh={fetchMaintenance}
      refreshing={loading}
    >
      {/* Top Status Card (Screenshot 13 inspired) */}
      <div className="p-6 sm:p-7 rounded-3xl bg-[#0c1222] border border-slate-800/90 mb-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div
              className={`w-3.5 h-3.5 rounded-full mt-1.5 shrink-0 ${
                maintenance.maintenanceMode
                  ? 'bg-amber-400 shadow-lg shadow-amber-500/50 animate-pulse'
                  : 'bg-emerald-400 shadow-lg shadow-emerald-500/50'
              }`}
            />
            <div>
              <div className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
                <span>Current Status:</span>
                <span className={maintenance.maintenanceMode ? 'text-amber-400' : 'text-emerald-400'}>
                  {maintenance.maintenanceMode ? 'UNDER MAINTENANCE' : 'OPERATIONAL & ONLINE'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
                {maintenance.maintenanceMode
                  ? 'Platform is under maintenance. User registrations and standard logins are blocked at the backend.'
                  : 'All platform services, destination exploration, AI travel itinerary planning, and traveler accounts are active.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowConfirmModal(true)}
            className={`inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-extrabold shadow-lg transition-all shrink-0 ${
              maintenance.maintenanceMode
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-950/50'
                : 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-950/50'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>{maintenance.maintenanceMode ? 'Disable Maintenance Mode' : 'Enable Maintenance Mode'}</span>
          </button>
        </div>
      </div>

      {/* Info Sub-Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {/* Admin Access Bypass */}
        <div className="p-5 rounded-2xl bg-[#0c1222] border border-slate-800/80 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
              Admin Access Bypass
            </span>
            <span className="text-xs sm:text-sm font-bold text-white block mt-0.5">
              Full Admin Bypass Active (Protected)
            </span>
          </div>
        </div>

        {/* Maintenance Started */}
        <div className="p-5 rounded-2xl bg-[#0c1222] border border-slate-800/80 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
              Maintenance Started
            </span>
            <span className="text-xs sm:text-sm font-mono font-bold text-slate-200 block mt-0.5">
              {formatDate(maintenance.maintenanceStartedAt)}
            </span>
          </div>
        </div>
      </div>

      {/* User Maintenance Notice Copy Form */}
      <div className="p-6 sm:p-7 rounded-3xl bg-[#0c1222] border border-slate-800/80">
        <div className="mb-6 pb-4 border-b border-slate-800/60">
          <h3 className="text-base font-bold text-white">
            User Maintenance Notice Copy
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Customize the title and explanation shown to travelers who visit during maintenance windows.
          </p>
        </div>

        <form onSubmit={handleSaveCopy} className="space-y-4 max-w-3xl">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Maintenance Page Headline <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Scheduled Maintenance in Progress"
              className="w-full px-4 py-2.5 rounded-xl bg-[#080d19] border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Maintenance Message Body <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Provide a helpful explanation to travelers..."
              className="w-full p-4 rounded-xl bg-[#080d19] border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 resize-none leading-relaxed font-sans"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={savingCopy}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-950/50 transition-all disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{savingCopy ? 'Saving Notice Copy...' : 'Save Notice Text'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Confirmation Modal */}
      <AdminConfirmModal
        isOpen={showConfirmModal}
        title={maintenance.maintenanceMode ? 'Disable Maintenance Mode?' : 'Activate Maintenance Mode?'}
        message={
          maintenance.maintenanceMode
            ? 'Are you sure you want to disable maintenance mode and resume full public access to traveler registration and logins?'
            : 'When maintenance mode is active, new traveler registrations and standard logins will be blocked at the backend. Administrators can continue accessing this console.'
        }
        confirmText={maintenance.maintenanceMode ? 'Disable Maintenance' : 'Activate Maintenance'}
        confirmVariant={maintenance.maintenanceMode ? 'success' : 'danger'}
        loading={toggling}
        onConfirm={handleToggleMaintenance}
        onCancel={() => setShowConfirmModal(false)}
      />
    </AdminLayout>
  );
};

export default AdminMaintenancePage;
