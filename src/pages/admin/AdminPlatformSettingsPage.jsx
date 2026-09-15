import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Settings,
  Wrench,
  Save,
  Mail,
  Bot,
  Cloud,
  Database,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { AdminBadge } from '../../components/admin/AdminBadge';
import { adminService } from '../../services/adminService';
import { useToast } from '../../context/ToastContext';

export const AdminPlatformSettingsPage = () => {
  const toast = useToast();
  const [data, setData] = useState({
    settings: {
      brandName: 'Vista Holidays',
      supportEmail: 'support@vistaholidays.com',
      tagline: 'Discover Extraordinary Journeys with AI Travel Intelligence'
    },
    integrations: {
      brevo: { configured: true, relay: 'smtp-relay.brevo.com:587', fromEmail: 'Vista Holidays <noreply@vistaholidays.com>' },
      gemini: { configured: true, model: 'gemini-3.5-flash-lite', latency: 'Low-latency AI' },
      cloudinary: { configured: true, folder: 'vista-holidays/product-updates', delivery: 'Global Secure CDN' },
      mongodb: { connected: true, host: '127.0.0.1', databaseName: 'vista_holidays' }
    },
    security: {
      totalUsers: 0,
      verifiedUsers: 0,
      adminUsers: 0,
      totalContacts: 0
    }
  });

  const [brandName, setBrandName] = useState('');
  const [supportEmail, setSupportEmail] = useState('');
  const [tagline, setTagline] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await adminService.getSettings();
      if (res.success && res.data) {
        setData(res.data);
        setBrandName(res.data.settings.brandName || '');
        setSupportEmail(res.data.settings.supportEmail || '');
        setTagline(res.data.settings.tagline || '');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to fetch platform settings.', 'Error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    if (!brandName.trim() || !supportEmail.trim() || saving) return;

    setSaving(true);
    try {
      const res = await adminService.updateSettings({
        brandName,
        supportEmail,
        tagline
      });
      if (res.success) {
        toast.success('Platform settings updated successfully.', 'Saved');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to save settings.', 'Error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout
      title="Platform & Infrastructure Settings"
      subtitle="Configure core brand parameters, monitor infrastructure integrations, and view platform security KPIs."
      onRefresh={fetchSettings}
      refreshing={loading}
      primaryAction={
        <Link
          to="/admin/maintenance"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-all"
        >
          <Wrench className="w-3.5 h-3.5" />
          <span>Maintenance Control</span>
        </Link>
      }
    >
      <div className="space-y-6">
        {/* Card 1: General Platform Configuration */}
        <div className="p-6 sm:p-7 rounded-3xl bg-[#0c1222] border border-slate-800/80 shadow-xl">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Settings className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white">
              General Platform Configuration
            </h3>
          </div>
          <p className="text-xs text-slate-400 mb-6">
            Authoritative platform branding and administrative contact addresses.
          </p>

          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Platform Brand Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#080d19] border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Support Desk Email <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#080d19] border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Brand Tagline
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#080d19] border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-950/50 transition-all disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{saving ? 'Saving...' : 'Save Platform Settings'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Card 2: Infrastructure & Third-Party Integrations */}
        <div className="p-6 sm:p-7 rounded-3xl bg-[#0c1222] border border-slate-800/80 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-white">
                Infrastructure &amp; Third-Party Integrations
              </h3>
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              Zero Secret Exposure
            </span>
          </div>
          <p className="text-xs text-slate-400 mb-6">
            Live operational status of external microservices (API keys &amp; credentials kept strictly server-side).
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Brevo SMTP */}
            <div className="p-4 rounded-2xl bg-[#080d19] border border-slate-800/80 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white text-xs">Brevo Email (SMTP)</div>
                  <div className="text-[11px] text-slate-400 mt-1 font-mono">
                    Relay: {data.integrations?.brevo?.relay || 'smtp-relay.brevo.com:587'}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate max-w-xs mt-0.5">
                    From: {data.integrations?.brevo?.fromEmail || 'Vista Holidays'}
                  </div>
                </div>
              </div>

              <AdminBadge variant={data.integrations?.brevo?.configured ? 'success' : 'warning'} dot>
                {data.integrations?.brevo?.configured ? 'Configured' : 'Pending'}
              </AdminBadge>
            </div>

            {/* Gemini AI Engine */}
            <div className="p-4 rounded-2xl bg-[#080d19] border border-slate-800/80 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white text-xs">Gemini AI Travel Engine</div>
                  <div className="text-[11px] text-slate-400 mt-1 font-mono">
                    Model: {data.integrations?.gemini?.model || 'gemini-3.5-flash-lite'}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    Latency: Low-latency AI Travel Intelligence
                  </div>
                </div>
              </div>

              <AdminBadge variant={data.integrations?.gemini?.configured ? 'success' : 'warning'} dot>
                {data.integrations?.gemini?.configured ? 'Configured' : 'Missing Key'}
              </AdminBadge>
            </div>

            {/* Cloudinary Storage */}
            <div className="p-4 rounded-2xl bg-[#080d19] border border-slate-800/80 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0">
                  <Cloud className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white text-xs">Cloudinary Storage</div>
                  <div className="text-[11px] text-slate-400 mt-1 font-mono">
                    Folder: {data.integrations?.cloudinary?.folder || 'vista-holidays/product-updates'}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    Delivery: Global Secure CDN
                  </div>
                </div>
              </div>

              <AdminBadge variant={data.integrations?.cloudinary?.configured ? 'success' : 'warning'} dot>
                {data.integrations?.cloudinary?.configured ? 'Configured' : 'Credentials Missing'}
              </AdminBadge>
            </div>

            {/* MongoDB Database */}
            <div className="p-4 rounded-2xl bg-[#080d19] border border-slate-800/80 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white text-xs">MongoDB Database</div>
                  <div className="text-[11px] text-slate-400 mt-1 font-mono">
                    Host: {data.integrations?.mongodb?.host || 'Connected Host'}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    Transactions: Atomic ACID Active
                  </div>
                </div>
              </div>

              <AdminBadge variant={data.integrations?.mongodb?.connected ? 'success' : 'danger'} dot>
                {data.integrations?.mongodb?.connected ? 'Connected' : 'Offline'}
              </AdminBadge>
            </div>
          </div>
        </div>

        {/* Card 3: Security Activity Overview */}
        <div className="p-6 sm:p-7 rounded-3xl bg-[#0c1222] border border-slate-800/80 shadow-xl">
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-white">
                Security &amp; Account Overview
              </h3>
            </div>
            <Link
              to="/admin/analytics"
              className="inline-flex items-center gap-1 text-xs font-bold text-indigo-400 hover:text-indigo-300"
            >
              <span>Full Analytics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <p className="text-xs text-slate-400 mb-6">
            Real-time aggregated security audit metrics across all user and administrative accounts.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-[#080d19] border border-slate-800/80">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                Total Users
              </span>
              <span className="text-2xl font-extrabold text-white mt-1 block">
                {data.security?.totalUsers || 0}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#080d19] border border-slate-800/80">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                Email Verifications
              </span>
              <span className="text-2xl font-extrabold text-emerald-400 mt-1 block">
                {data.security?.verifiedUsers || 0}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#080d19] border border-slate-800/80">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                Admin Accounts
              </span>
              <span className="text-2xl font-extrabold text-rose-400 mt-1 block">
                {data.security?.adminUsers || 0}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#080d19] border border-slate-800/80">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                Contact Messages
              </span>
              <span className="text-2xl font-extrabold text-cyan-400 mt-1 block">
                {data.security?.totalContacts || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPlatformSettingsPage;
