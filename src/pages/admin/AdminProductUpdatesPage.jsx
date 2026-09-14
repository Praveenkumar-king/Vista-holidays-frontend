import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Plus, 
  Search, 
  Eye, 
  Edit2, 
  Trash2, 
  Layers, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  CloudSun, 
  Compass, 
  X, 
  Loader2,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { Container } from '../../components/layout/Container';
import { AdminNavHeader } from '../../components/layout/AdminNavHeader';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';
import { productUpdateService } from '../../services/productUpdateService';
import { ProductUpdateModal } from '../../components/whats-new/ProductUpdateModal';
import { UserProductUpdateModal } from '../../components/whats-new/UserProductUpdateModal';

const STATUS_FILTERS = ['All', 'Published', 'Draft', 'Unpublished'];

export const AdminProductUpdatesPage = () => {
  const toast = useToast();

  const [updates, setUpdates] = useState([]);
  const [summary, setSummary] = useState({
    total: 0,
    published: 0,
    draft: 0,
    unpublished: 0
  });
  const [cloudinaryConfigured, setCloudinaryConfigured] = useState(true);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [updateToEdit, setUpdateToEdit] = useState(null);

  // Preview modal state
  const [previewUpdate, setPreviewUpdate] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Delete modal state
  const [updateToDelete, setUpdateToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchUpdates = async () => {
    setLoading(true);
    try {
      const response = await productUpdateService.getAdminUpdates({
        search,
        status: selectedStatus
      });

      if (response.success && response.data) {
        setUpdates(response.data.updates || []);
        if (response.data.summary) {
          setSummary(response.data.summary);
        }
        if (typeof response.data.cloudinaryConfigured === 'boolean') {
          setCloudinaryConfigured(response.data.cloudinaryConfigured);
        }
      }
    } catch (err) {
      toast.error(err.message || 'Failed to load product updates.', 'Error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpdates();
  }, [selectedStatus]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUpdates();
  };

  const handleCreateNew = () => {
    setUpdateToEdit(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (update) => {
    setUpdateToEdit(update);
    setIsFormModalOpen(true);
  };

  const handlePreview = (update) => {
    setPreviewUpdate(update);
    setIsPreviewOpen(true);
  };

  const handleStatusChange = async (update, newStatus) => {
    if (update.status === newStatus) return;

    try {
      await productUpdateService.updateStatus(update._id, newStatus);
      toast.success(`Release v${update.version} changed to ${newStatus}.`, 'Status Updated');
      fetchUpdates();
    } catch (err) {
      toast.error(err.message || 'Failed to change status.', 'Error');
    }
  };

  const confirmDelete = async () => {
    if (!updateToDelete) return;

    setDeleting(true);
    try {
      await productUpdateService.deleteUpdate(updateToDelete._id);
      toast.success(`Release v${updateToDelete.version} and its Cloudinary assets deleted.`, 'Deleted');
      setUpdateToDelete(null);
      fetchUpdates();
    } catch (err) {
      toast.error(err.message || 'Failed to delete update.', 'Error');
    } finally {
      setDeleting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'published':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Published
          </span>
        );
      case 'draft':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 border border-amber-500/30 text-amber-400">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Draft
          </span>
        );
      case 'unpublished':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 border border-slate-700 text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
            Unpublished
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs bg-slate-800 text-slate-300">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <AdminNavHeader />
      <div className="py-10 flex-grow">
        <Container size="xl">
        {/* Header Ribbon */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-400 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Admin Management</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
              Product Updates
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Manage product updates and announcement carousels shown to users.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button
              variant="outline"
              size="sm"
              iconLeft={RefreshCw}
              onClick={fetchUpdates}
              disabled={loading}
              className="text-xs border-slate-800 text-slate-300 hover:bg-slate-900"
            >
              Refresh
            </Button>

            <Button
              variant="primary"
              size="sm"
              iconLeft={Plus}
              onClick={handleCreateNew}
              className="text-xs font-bold shadow-md shadow-brand-500/20"
            >
              Create Product Update
            </Button>
          </div>
        </div>

        {/* Cloudinary Warning Banner if not configured */}
        {!cloudinaryConfigured && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-start gap-3 text-xs leading-relaxed">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-400 mt-0.5" />
            <div>
              <span className="font-bold">Cloudinary Configuration Notice:</span> Cloudinary API credentials 
              (<code className="font-mono text-amber-200">CLOUDINARY_CLOUD_NAME</code>, <code className="font-mono text-amber-200">CLOUDINARY_API_KEY</code>, <code className="font-mono text-amber-200">CLOUDINARY_API_SECRET</code>) 
              are not yet set in <code className="font-mono text-amber-200">server/.env</code>. 
              Adding them enables direct slide image uploads to Cloudinary.
            </div>
          </div>
        )}

        {/* Metric Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-8">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Updates</div>
            <div className="text-2xl font-display font-extrabold text-white mt-1">{summary.total}</div>
          </div>
          <div className="bg-slate-900/90 border border-emerald-500/20 rounded-2xl p-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">Published</div>
            <div className="text-2xl font-display font-extrabold text-emerald-400 mt-1">{summary.published}</div>
          </div>
          <div className="bg-slate-900/90 border border-amber-500/20 rounded-2xl p-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400">Drafts</div>
            <div className="text-2xl font-display font-extrabold text-amber-400 mt-1">{summary.draft}</div>
          </div>
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Unpublished</div>
            <div className="text-2xl font-display font-extrabold text-slate-400 mt-1">{summary.unpublished}</div>
          </div>
        </div>

        {/* Search & Status Filters */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search updates by version, title, description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
            />
          </form>

          {/* Status Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {STATUS_FILTERS.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setSelectedStatus(status)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedStatus === status
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Table / List View */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-brand-500 mb-3" />
              <span className="text-xs">Loading product updates...</span>
            </div>
          ) : updates.length === 0 ? (
            <div className="text-center py-16 px-4">
              <Layers className="w-10 h-10 mx-auto text-slate-600 mb-3" />
              <h3 className="text-base font-bold text-white mb-1">No product updates found</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto mb-6">
                {search || selectedStatus !== 'All'
                  ? 'Try clearing your search filters or status selection.'
                  : 'Create your first product update to keep users informed about new features and improvements.'}
              </p>
              <Button
                variant="primary"
                size="sm"
                iconLeft={Plus}
                onClick={handleCreateNew}
                className="text-xs"
              >
                Create Product Update
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/70 border-b border-slate-800 uppercase tracking-wider text-[11px] text-slate-400 font-semibold">
                  <tr>
                    <th scope="col" className="px-5 py-3.5">VERSION</th>
                    <th scope="col" className="px-5 py-3.5">TITLE & DESCRIPTION</th>
                    <th scope="col" className="px-5 py-3.5">STATUS</th>
                    <th scope="col" className="px-5 py-3.5">SLIDES</th>
                    <th scope="col" className="px-5 py-3.5">CREATED DATE</th>
                    <th scope="col" className="px-5 py-3.5 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {updates.map((update) => (
                    <tr key={update._id} className="hover:bg-slate-800/30 transition-colors">
                      {/* Version */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-indigo-500/15 border border-indigo-500/30 text-indigo-300">
                          v{update.version}
                        </span>
                      </td>

                      {/* Title & Description */}
                      <td className="px-5 py-4 max-w-sm">
                        <div className="font-semibold text-white text-sm line-clamp-1 mb-0.5">
                          {update.title}
                        </div>
                        <div className="text-slate-400 line-clamp-1 text-xs">
                          {update.description}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {getStatusBadge(update.status)}
                          
                          {/* Quick status dropdown */}
                          <select
                            value={update.status}
                            onChange={(e) => handleStatusChange(update, e.target.value)}
                            className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-0.5 text-[11px] text-slate-300 hover:border-slate-700 focus:outline-none cursor-pointer"
                          >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                            <option value="unpublished">Unpublished</option>
                          </select>
                        </div>
                      </td>

                      {/* Slides */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300 text-xs font-semibold">
                          <Layers className="w-3.5 h-3.5 text-brand-400" />
                          <span>
                            {update.slides ? update.slides.length : 0} {update.slides?.length === 1 ? 'Slide' : 'Slides'}
                          </span>
                        </div>
                      </td>

                      {/* Created Date */}
                      <td className="px-5 py-4 whitespace-nowrap text-slate-400 text-xs">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          <span>
                            {new Date(update.createdAt).toLocaleDateString('en-US', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Preview button */}
                          <button
                            type="button"
                            onClick={() => handlePreview(update)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-sky-400 hover:bg-sky-500/10 transition-colors"
                            title="Preview Carousel"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Edit button */}
                          <button
                            type="button"
                            onClick={() => handleEdit(update)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 transition-colors"
                            title="Edit Release"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* Delete button */}
                          <button
                            type="button"
                            onClick={() => setUpdateToDelete(update)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                            title="Delete Release"
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
          )}
        </div>
      </Container>
      </div>

      {/* Admin Create / Edit Modal */}
      <ProductUpdateModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setUpdateToEdit(null);
        }}
        updateToEdit={updateToEdit}
        onSuccess={fetchUpdates}
      />

      {/* Admin Preview Modal */}
      <UserProductUpdateModal
        isOpen={isPreviewOpen}
        onClose={() => {
          setIsPreviewOpen(false);
          setPreviewUpdate(null);
        }}
        update={previewUpdate}
        isPreview={true}
      />

      {/* Delete Confirmation Modal */}
      {updateToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div 
            className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-500/15 text-rose-400 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-white mb-1">
              Delete Product Update v{updateToDelete.version}?
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              Are you sure you want to permanently delete this update? All associated 
              Cloudinary images and user viewing records will also be permanently deleted. This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setUpdateToDelete(null)}
                disabled={deleting}
                className="text-slate-400 hover:text-white hover:bg-slate-800"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={confirmDelete}
                loading={deleting}
                className="font-bold px-4"
              >
                Delete Permanently
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductUpdatesPage;
