import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Trash2, 
  FileDown, 
  Eye, 
  RefreshCw, 
  AlertTriangle, 
  X,
  Compass,
  ArrowRight,
  Filter
} from 'lucide-react';
import { Container } from '../../components/layout/Container';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';
import { ticketService } from '../../services/ticketService';

const STATUS_FILTERS = ['All', 'Open', 'In Progress', 'Resolved', 'Closed'];

export const AdminContactMessagesPage = () => {
  const toast = useToast();

  const [tickets, setTickets] = useState([]);
  const [summary, setSummary] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const response = await ticketService.getContactMessages({
        search,
        status: selectedStatus
      });

      if (response.success && response.data) {
        setTickets(response.data.tickets || []);
        if (response.data.summary) {
          setSummary(response.data.summary);
        }
      }
    } catch (err) {
      toast.error(err.message || 'Failed to fetch contact tickets.', 'Error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [selectedStatus]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchTickets();
  };

  const handleDeleteSingle = async (ticket) => {
    if (!window.confirm(`Are you sure you want to delete ticket ${ticket.ticketId}?`)) return;

    setDeletingId(ticket._id);
    try {
      await ticketService.deleteContactMessage(ticket._id);
      toast.success(`Ticket ${ticket.ticketId} deleted.`, 'Deleted');
      fetchTickets();
    } catch (err) {
      toast.error(err.message || 'Failed to delete ticket.', 'Error');
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteAll = async () => {
    try {
      await ticketService.deleteAllContactMessages();
      toast.success('All contact messages have been permanently deleted.', 'Cleared');
      setShowDeleteAllModal(false);
      fetchTickets();
    } catch (err) {
      toast.error(err.message || 'Failed to delete all tickets.', 'Error');
    }
  };

  const handleExportPDF = () => {
    window.print();
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Open':
        return 'bg-amber-500/15 border-amber-500/30 text-amber-400';
      case 'In Progress':
        return 'bg-sky-500/15 border-sky-500/30 text-sky-400';
      case 'Resolved':
        return 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400';
      case 'Closed':
        return 'bg-slate-700/30 border-slate-600 text-slate-400';
      default:
        return 'bg-slate-800 text-slate-300';
    }
  };

  return (
    <div className="min-h-screen py-10 bg-slate-950 text-slate-100">
      <Container size="xl">
        {/* Header Ribbon */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-400 mb-1">
              <Compass className="w-3.5 h-3.5" />
              <span>Admin Management</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
              Contact Support Directory
            </h1>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportPDF}
              iconLeft={FileDown}
              className="text-xs border-slate-800 text-slate-200 hover:bg-slate-900"
            >
              Export PDF
            </Button>

            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowDeleteAllModal(true)}
              iconLeft={Trash2}
              className="text-xs font-bold"
            >
              Delete All
            </Button>
          </div>
        </div>

        {/* Summary Metric Cards (Section 22) */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5 mb-8">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total</div>
            <div className="text-2xl font-display font-extrabold text-white mt-1">{summary.total}</div>
          </div>
          <div className="bg-slate-900/90 border border-amber-500/20 rounded-2xl p-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400">Open</div>
            <div className="text-2xl font-display font-extrabold text-amber-400 mt-1">{summary.open}</div>
          </div>
          <div className="bg-slate-900/90 border border-sky-500/20 rounded-2xl p-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-sky-400">In Progress</div>
            <div className="text-2xl font-display font-extrabold text-sky-400 mt-1">{summary.inProgress}</div>
          </div>
          <div className="bg-slate-900/90 border border-emerald-500/20 rounded-2xl p-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">Resolved</div>
            <div className="text-2xl font-display font-extrabold text-emerald-400 mt-1">{summary.resolved}</div>
          </div>
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 col-span-2 sm:col-span-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Closed</div>
            <div className="text-2xl font-display font-extrabold text-slate-400 mt-1">{summary.closed}</div>
          </div>
        </div>

        {/* Search & Status Filters */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search ID, name, email, query, message..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500"
            />
          </form>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {STATUS_FILTERS.map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedStatus === st
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                  <th className="py-3.5 px-4">S.NO</th>
                  <th className="py-3.5 px-4">TICKET ID</th>
                  <th className="py-3.5 px-4">DATE &amp; TIME</th>
                  <th className="py-3.5 px-4">USER NAME</th>
                  <th className="py-3.5 px-4">EMAIL ADDRESS</th>
                  <th className="py-3.5 px-4">QUERY TYPE</th>
                  <th className="py-3.5 px-4">STATUS</th>
                  <th className="py-3.5 px-4 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {loading ? (
                  <tr>
                    <td colSpan="8" className="py-12 text-center text-slate-500">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-brand-500" />
                      Loading contact inquiries...
                    </td>
                  </tr>
                ) : tickets.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="py-12 text-center text-slate-500">
                      No contact tickets match the current filters.
                    </td>
                  </tr>
                ) : (
                  tickets.map((t, idx) => (
                    <tr key={t._id} className="hover:bg-slate-800/30 transition-colors group">
                      <td className="py-3.5 px-4 font-mono text-slate-500">{idx + 1}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-rose-400 whitespace-nowrap">
                        {t.ticketId}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                        {new Date(t.createdAt).toLocaleDateString()} • {new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-white whitespace-nowrap">{t.name}</td>
                      <td className="py-3.5 px-4 text-slate-300">{t.email}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-[11px] text-slate-300">
                          {t.queryType}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-full border text-[11px] font-bold uppercase tracking-wider ${getStatusBadgeClass(t.status)}`}>
                          ● {t.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <Link to={`/admin/contact/${t._id}`}>
                            <Button variant="secondary" size="xs" iconLeft={Eye} className="text-[11px] font-bold bg-white text-slate-900 hover:bg-slate-200">
                              View Details
                            </Button>
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDeleteSingle(t)}
                            disabled={deletingId === t._id}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                            title="Delete Ticket"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Delete All Modal (Section 34) */}
        {showDeleteAllModal && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
            <div className="w-full max-w-md bg-slate-900 border border-rose-500/30 rounded-3xl p-6 shadow-float animate-scale-in text-center">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto mb-4">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <h3 className="text-lg font-display font-bold text-white mb-2">
                Delete All Contact Tickets?
              </h3>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                This action is destructive and irreversible. All contact inquiries, message threads, and resolution timelines will be permanently erased.
              </p>

              <div className="flex items-center justify-center gap-3">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowDeleteAllModal(false)}
                  className="w-full text-slate-300 bg-slate-800 hover:bg-slate-700"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDeleteAll}
                  className="w-full font-bold"
                >
                  Yes, Delete All
                </Button>
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};

export default AdminContactMessagesPage;
