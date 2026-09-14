import apiClient from './api';

export const productUpdateService = {
  // --- Admin APIs ---

  getAdminUpdates: async ({ search = '', status = 'All' } = {}) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (status && status !== 'All') params.append('status', status);

    const queryString = params.toString();
    const endpoint = `/admin/product-updates${queryString ? `?${queryString}` : ''}`;
    return apiClient(endpoint);
  },

  getAdminUpdateById: async (id) => {
    return apiClient(`/admin/product-updates/${id}`);
  },

  createUpdate: async (payload) => {
    return apiClient('/admin/product-updates', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  updateUpdate: async (id, payload) => {
    return apiClient(`/admin/product-updates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
  },

  updateStatus: async (id, status) => {
    return apiClient(`/admin/product-updates/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  },

  deleteUpdate: async (id) => {
    return apiClient(`/admin/product-updates/${id}`, {
      method: 'DELETE'
    });
  },

  uploadSlideImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    return apiClient('/admin/product-updates/upload-image', {
      method: 'POST',
      body: formData
    });
  },

  deleteSlideImage: async (publicId) => {
    return apiClient('/admin/product-updates/image', {
      method: 'DELETE',
      body: JSON.stringify({ publicId })
    });
  },

  // --- User APIs ---

  getUnseenUpdate: async () => {
    return apiClient('/product-updates/unseen');
  },

  markUpdateSeen: async (id) => {
    return apiClient(`/product-updates/${id}/seen`, {
      method: 'POST'
    });
  }
};

export default productUpdateService;
