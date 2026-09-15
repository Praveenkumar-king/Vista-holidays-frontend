import React, { useState, useEffect } from 'react';
import {
  Receipt,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  RotateCcw,
  Eye,
  X,
  Filter,
  ArrowUpDown,
  Download,
  DollarSign,
  TrendingUp,
  CreditCard
} from 'lucide-react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { AdminBadge } from '../../components/admin/AdminBadge';
import { AdminEmptyState } from '../../components/admin/AdminEmptyState';
import { adminTransactionService } from '../../services/adminTransactionService';
import { useToast } from '../../context/ToastContext';

export const AdminTransactionsPage = () => {
  const toast = useToast();

  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    totalTransactions: 0,
    successfulPayments: 0,
    failedPayments: 0,
    pendingPayments: 0,
    refundedPayments: 0
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const [txRes, sumRes] = await Promise.all([
        adminTransactionService.getTransactions({
          search,
          status: selectedStatus,
          page,
          limit: 20
        }),
        adminTransactionService.getSummary()
      ]);

      if (txRes.success && txRes.data) {
        setTransactions(txRes.data.transactions || []);
        if (txRes.data.pagination) {
          setPagination(txRes.data.pagination);
        }
      }

      if (sumRes.success && sumRes.data) {
        setSummary(sumRes.data);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to fetch transaction records.', 'Error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [selectedStatus, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchTransactions();
  };

  const openTransactionDetail = async (tx) => {
    setSelectedTransaction(tx);
    setDetailLoading(true);
    try {
      const res = await adminTransactionService.getTransactionById(tx.transactionId || tx._id);
      if (res.success && res.data) {
        setSelectedTransaction({
          ...res.data.transaction,
          booking: res.data.booking
        });
      }
    } catch {
      // Retain basic tx info
    } finally {
      setDetailLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return <AdminBadge variant="success" dot>Paid</AdminBadge>;
      case 'pending':
      case 'created':
        return <AdminBadge variant="warning" dot>Pending</AdminBadge>;
      case 'failed':
        return <AdminBadge variant="error" dot>Failed</AdminBadge>;
      case 'refunded':
        return <AdminBadge variant="info" dot>Refunded</AdminBadge>;
      default:
        return <AdminBadge variant="neutral">{status}</AdminBadge>;
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <AdminLayout
      title="Transactions &amp; Revenue"
      subtitle="Authoritative payment verification logs, transaction history, and revenue telemetry."
      badgeText={`₹${Number(summary.totalRevenue).toLocaleString('en-IN')} Revenue`}
      onRefresh={fetchTransactions}
      refreshing={loading}
    >
      {/* 1. FINANCIAL SUMMARY METRIC CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 mb-6">
        
        {/* Card 1: Total Revenue (STRICTLY FROM PAID PAYMENTS) */}
        <div className="col-span-2 p-5 rounded-2xl bg-[#0c1222] border border-slate-800/90 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-display">
            ₹{Number(summary.totalRevenue).toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Aggregated from verified paid bookings
          </span>
        </div>

        {/* Card 2: Total Transactions */}
        <div className="p-4 rounded-2xl bg-[#0c1222] border border-slate-800/90">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold uppercase text-slate-400">Total Txns</span>
            <Receipt className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="text-xl font-bold text-white font-display">
            {summary.totalTransactions}
          </div>
          <span className="text-[10px] text-slate-500">All attempts</span>
        </div>

        {/* Card 3: Successful Payments */}
        <div className="p-4 rounded-2xl bg-[#0c1222] border border-slate-800/90">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold uppercase text-emerald-400">Paid</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-emerald-400 font-display">
            {summary.successfulPayments}
          </div>
          <span className="text-[10px] text-slate-500">Successful</span>
        </div>

        {/* Card 4: Pending Payments */}
        <div className="p-4 rounded-2xl bg-[#0c1222] border border-slate-800/90">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold uppercase text-amber-400">Pending</span>
            <Clock className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-bold text-amber-400 font-display">
            {summary.pendingPayments}
          </div>
          <span className="text-[10px] text-slate-500">Awaiting pay</span>
        </div>

        {/* Card 5: Failed Payments */}
        <div className="p-4 rounded-2xl bg-[#0c1222] border border-slate-800/90">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold uppercase text-rose-400">Failed</span>
            <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="text-xl font-bold text-rose-400 font-display">
            {summary.failedPayments}
          </div>
          <span className="text-[10px] text-slate-500">Declined/error</span>
        </div>
      </div>

      {/* 2. SEARCH & FILTER CONTROLS */}
      <div className="p-4 rounded-2xl bg-[#0c1222] border border-slate-800/80 mb-6 flex flex-col md:flex-row items-center gap-3">
        <form onSubmit={handleSearchSubmit} className="flex-1 w-full relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by User Name, Email, Booking ID, Destination, Payment ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#080d19] border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
          />
        </form>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2.5 rounded-xl bg-[#080d19] border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500"
          >
            <option value="all">All Statuses</option>
            <option value="paid">Paid Only</option>
            <option value="pending">Pending Only</option>
            <option value="failed">Failed Only</option>
            <option value="refunded">Refunded Only</option>
          </select>

          <button
            type="button"
            onClick={fetchTransactions}
            className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-xs font-bold text-white transition-colors flex items-center gap-1.5"
          >
            Filter
          </button>
        </div>
      </div>

      {/* 3. TRANSACTION DATA TABLE */}
      <div className="rounded-2xl bg-[#0c1222] border border-slate-800/80 overflow-hidden shadow-card">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            Loading real transaction records...
          </div>
        ) : transactions.length === 0 ? (
          <AdminEmptyState
            title="No Transactions Found"
            description="No transactions match your current search criteria."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-[#080d19]/80 text-slate-400 uppercase tracking-wider font-semibold text-[11px]">
                  <th className="py-3.5 px-4">DATE</th>
                  <th className="py-3.5 px-4">USER</th>
                  <th className="py-3.5 px-4">EMAIL</th>
                  <th className="py-3.5 px-4">BOOKING ID</th>
                  <th className="py-3.5 px-4">DESTINATION</th>
                  <th className="py-3.5 px-4">PACKAGE</th>
                  <th className="py-3.5 px-4">DAYS</th>
                  <th className="py-3.5 px-4">MEMBERS</th>
                  <th className="py-3.5 px-4">AMOUNT</th>
                  <th className="py-3.5 px-4">PAYMENT ID</th>
                  <th className="py-3.5 px-4">STATUS</th>
                  <th className="py-3.5 px-4 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {transactions.map((tx) => (
                  <tr
                    key={tx._id}
                    className="hover:bg-[#131b2e] transition-colors"
                  >
                    <td className="py-3 px-4 whitespace-nowrap text-slate-400">
                      {formatDate(tx.transactionDate || tx.createdAt)}
                    </td>
                    <td className="py-3 px-4 font-semibold text-white whitespace-nowrap">
                      {tx.userName}
                    </td>
                    <td className="py-3 px-4 text-sky-400 whitespace-nowrap">
                      {tx.email}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-300 whitespace-nowrap">
                      {tx.bookingId}
                    </td>
                    <td className="py-3 px-4 font-medium text-white whitespace-nowrap">
                      {tx.destination}
                    </td>
                    <td className="py-3 px-4 text-slate-300 whitespace-nowrap">
                      {tx.package}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {tx.days}d
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {tx.members}p
                    </td>
                    <td className="py-3 px-4 font-extrabold text-emerald-400 whitespace-nowrap">
                      ₹{Number(tx.amount).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                      {tx.razorpayPaymentId || '—'}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {getStatusBadge(tx.paymentStatus)}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => openTransactionDetail(tx)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        title="View Full Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        {pagination.pages > 1 && (
          <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>
              Showing Page {page} of {pagination.pages} ({pagination.total} transactions)
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-lg bg-[#080d19] border border-slate-800 disabled:opacity-40 hover:bg-slate-800 transition-colors"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={page >= pagination.pages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 rounded-lg bg-[#080d19] border border-slate-800 disabled:opacity-40 hover:bg-slate-800 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 4. TRANSACTION INSPECTION MODAL */}
      {selectedTransaction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-[#0c1222] rounded-3xl shadow-2xl border border-slate-800 overflow-hidden text-xs">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-[#080d19]">
              <div className="flex items-center gap-2.5">
                <Receipt className="w-4 h-4 text-brand-400" />
                <h3 className="font-display font-bold text-sm text-white">
                  Transaction Audit Inspector
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTransaction(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-3.5 max-h-[70vh] overflow-y-auto">
              <div className="flex justify-between items-center pb-2.5 border-b border-slate-800">
                <span className="text-slate-400">Transaction ID</span>
                <span className="font-mono font-bold text-white bg-[#080d19] px-2 py-0.5 rounded border border-slate-800">
                  {selectedTransaction.transactionId}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400">Booking ID</span>
                <span className="font-mono text-slate-200">{selectedTransaction.bookingId}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400">Customer Name</span>
                <span className="font-bold text-white">{selectedTransaction.userName}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400">Customer Email</span>
                <span className="text-sky-400">{selectedTransaction.email}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400">Destination</span>
                <span className="font-bold text-white">{selectedTransaction.destination}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400">Package</span>
                <span className="text-brand-400 font-semibold">{selectedTransaction.package}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400">Duration &amp; Members</span>
                <span className="text-slate-200">
                  {selectedTransaction.days} Days • {selectedTransaction.members} Travelers
                </span>
              </div>

              <div className="flex justify-between items-center pt-2.5 border-t border-slate-800">
                <span className="font-bold text-white text-sm">Amount Paid</span>
                <span className="text-emerald-400 font-extrabold text-base">
                  ₹{Number(selectedTransaction.amount).toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400">Payment Status</span>
                {getStatusBadge(selectedTransaction.paymentStatus)}
              </div>

              {selectedTransaction.razorpayOrderId && (
                <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                  <span className="text-slate-400">Razorpay Order ID</span>
                  <span className="font-mono text-slate-300">{selectedTransaction.razorpayOrderId}</span>
                </div>
              )}

              {selectedTransaction.razorpayPaymentId && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Razorpay Payment ID</span>
                  <span className="font-mono text-slate-300">{selectedTransaction.razorpayPaymentId}</span>
                </div>
              )}

              <div className="flex justify-between items-center text-slate-400 text-[11px] pt-2 border-t border-slate-800">
                <span>Timestamp</span>
                <span>{new Date(selectedTransaction.transactionDate || selectedTransaction.createdAt).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 bg-[#080d19] flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedTransaction(null)}
                className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </AdminLayout>
  );
};

export default AdminTransactionsPage;
