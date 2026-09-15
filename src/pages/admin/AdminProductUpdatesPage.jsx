import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Plus,
  Search,
  Eye,
  Edit2,
  Trash2,
  Calendar,
  Layers,
  CheckCircle2,
  AlertTriangle,
  ExternalLink
} from 'lucide-react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { AdminBadge } from '../../components/admin/AdminBadge';
import { AdminEmptyState } from '../../components/admin/AdminEmptyState';
import { AdminConfirmModal } from '../../components/admin/AdminConfirmModal';
import { productUpdateService } from '../../services/productUpdateService';
import { ProductUpdateModal } from '../../components/whats-new/ProductUpdateModal';
import { UserProductUpdateModal } from '../../components/whats-new/UserProductUpdateModal';
import { useToast } from '../../context/ToastContext';

export const AdminProductUpdatesPage = () => {
  const toast = useToast();
  const [updates, setUpdates] = useState([]);
  const [summary, setSummary] = useState({ total: 0, published: 0, draft: 0, unpublished: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [updateToEdit, setUpdateToEdit] = useState(null);
  const [previewUpdate, setPreviewUpdate] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
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

  const handleTogglePublish = async (update) => {
    const newStatus = update.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    try {
      await productUpdateService.updateStatus(update._id, newStatus);
      toast.success(
        `Version v${update.version} is now ${newStatus === 'PUBLISHED' ? 'published' : 'unpublished'}.`,
        'Updated'
      );
      fetchUpdates();
    } catch (err) {
      toast.error(err.message || 'Failed to change publication status.', 'Error');
    }
  };

  const handleDeleteUpdate = async () => {
    if (!updateToDelete) return;
    setDeleting(true);
    try {
      await productUpdateService.deleteUpdate(updateToDelete._id);
      toast.success(`Release v${updateToDelete.version} deleted.`, 'Deleted');
      setUpdateToDelete(null);
      fetchUpdates();
    } catch (err) {
      toast.error(err.message || 'Failed to delete product update.', 'Error');
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
      year: 'numeric'
    }).format(d);
  };

  return (
    <AdminLayout
      title="What's New / Product Updates"
      subtitle="Create and publish versioned feature releases delivered directly into the User Dashboard popup."
      badgeText={`${summary.total} Releases`}
      onRefresh={fetchUpdates}
      refreshing={loading}
      primaryAction={
        <button
          onClick={() => {
            setUpdateToEdit(null);
            setIsFormModalOpen(true);
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-950/50 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create Product Update</span>
        </button>
      }
    >
      {/* Search & Status Filter */}
      <div className="p-4 rounded-2xl bg-[#0c1222] border border-slate-800/80 mb-6 flex flex-col md:flex-row items-center gap-3">
        <form onSubmit={handleSearchSubmit} className="flex-1 w-full relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by version (e.g. 1.0.0) or title..."
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
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
            <option value="UNPUBLISHED">Unpublished</option>
          </select>
        </div>
      </div>

      {/* Directory Table (Screenshot 9 inspired) */}
      {loading ? (
        <div className="py-20 text-center text-xs text-slate-400">
          Loading product updates...
        </div>
      ) : updates.length === 0 ? (
        <AdminEmptyState
          icon={Sparkles}
          title="No Product Updates Yet"
          description="Create your first release update to showcase new travel features to travelers."
        />
      ) : (
        <div className="rounded-2xl bg-[#0c1222]/90 border border-slate-800/80 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#080d19] text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800/80">
                <tr>
                  <th className="px-5 py-3.5">S.NO</th>
                  <th className="px-5 py-3.5">VERSION</th>
                  <th className="px-5 py-3.5">UPDATE TITLE</th>
                  <th className="px-5 py-3.5">SLIDES</th>
                  <th className="px-5 py-3.5">STATUS</th>
                  <th className="px-5 py-3.5">PUBLISHED DATE</th>
                  <th className="px-5 py-3.5">CREATED DATE</th>
                  <th className="px-5 py-3.5 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {updates.map((update, idx) => {
                  const isPublished = update.status === 'PUBLISHED';
                  const slideCount = update.slides?.length || 0;

                  return (
                    <tr
                      key={update._id}
                      className="hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="px-5 py-4 text-slate-400">{idx + 1}</td>

                      <td className="px-5 py-4 font-mono font-bold text-blue-400">
                        v{update.version}
                      </td>

                      <td className="px-5 py-4 font-bold text-white max-w-xs truncate">
                        {update.title}
                      </td>

                      <td className="px-5 py-4 text-slate-300">
                        {slideCount} {slideCount === 1 ? 'Slide' : 'Slides'}
                      </td>

                      <td className="px-5 py-4">
                        <AdminBadge variant={isPublished ? 'success' : 'warning'}>
                          {update.status}
                        </AdminBadge>
                      </td>

                      <td className="px-5 py-4 text-slate-400">
                        {formatDate(update.publishedAt)}
                      </td>

                      <td className="px-5 py-4 text-slate-400">
                        {formatDate(update.createdAt)}
                      </td>

                      {/* Actions: Preview, Edit, Publish/Unpublish, Delete */}
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setPreviewUpdate(update);
                              setIsPreviewOpen(true);
                            }}
                            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                            title="Preview user popup"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => {
                              setUpdateToEdit(update);
                              setIsFormModalOpen(true);
                            }}
                            className="p-1.5 rounded-xl text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition-colors"
                            title="Edit update"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleTogglePublish(update)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors ${
                              isPublished
                                ? 'text-slate-300 hover:text-white bg-slate-800/80 border-slate-700'
                                : 'text-emerald-400 bg-emerald-500/10 hover:bg-emerald-600 hover:text-white border-emerald-500/30'
                            }`}
                          >
                            {isPublished ? 'Unpublish' : 'Publish'}
                          </button>

                          <button
                            onClick={() => setUpdateToDelete(update)}
                            className="p-1.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                            title="Delete update"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit Modal (Cloudinary Image Upload inside) */}
      <ProductUpdateModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setUpdateToEdit(null);
        }}
        onSuccess={() => {
          setIsFormModalOpen(false);
          setUpdateToEdit(null);
          fetchUpdates();
        }}
        initialData={updateToEdit}
      />

      {/* Preview Modal */}
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
      <AdminConfirmModal
        isOpen={Boolean(updateToDelete)}
        title={`Delete Release: v${updateToDelete?.version}?`}
        message="Are you sure you want to delete this feature update? This will remove all slides and cannot be undone."
        confirmText="Delete Update"
        confirmVariant="danger"
        loading={deleting}
        onConfirm={handleDeleteUpdate}
        onCancel={() => setUpdateToDelete(null)}
      />
    </AdminLayout>
  );
};

export default AdminProductUpdatesPage;
