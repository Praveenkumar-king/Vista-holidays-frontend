import { apiClient } from './api';

export const adminService = {
  // --- Dashboard Overview ---
  getDashboardOverview: async () => {
    return apiClient('/admin/dashboard/overview');
  },

  // --- Users Management ---
  getUsers: async ({ search = '', role = 'All', verification = 'All', status = 'All' } = {}) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (role && role !== 'All') params.append('role', role);
    if (verification && verification !== 'All') params.append('verification', verification);
    if (status && status !== 'All') params.append('status', status);

    const query = params.toString() ? `?${params.toString()}` : '';
    return apiClient(`/admin/users${query}`);
  },

  getUserById: async (id) => {
    return apiClient(`/admin/users/${id}`);
  },

  updateUserStatus: async (id, accountStatus) => {
    return apiClient(`/admin/users/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ accountStatus })
    });
  },

  deleteUser: async (id) => {
    return apiClient(`/admin/users/${id}`, {
      method: 'DELETE'
    });
  },

  // --- Unified Support Tickets ---
  getAllTickets: async ({ search = '', status = 'All', category = 'All' } = {}) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (status && status !== 'All') params.append('status', status);
    if (category && category !== 'All') params.append('category', category);

    const query = params.toString() ? `?${params.toString()}` : '';
    return apiClient(`/admin/tickets${query}`);
  },

  // --- Platform Announcements ---
  getAdminAnnouncements: async ({ search = '', status = 'All', audience = 'All' } = {}) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (status && status !== 'All') params.append('status', status);
    if (audience && audience !== 'All') params.append('audience', audience);

    const query = params.toString() ? `?${params.toString()}` : '';
    return apiClient(`/admin/announcements${query}`);
  },

  createAnnouncement: async (payload) => {
    return apiClient('/admin/announcements', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  getAnnouncementById: async (id) => {
    return apiClient(`/admin/announcements/${id}`);
  },

  updateAnnouncement: async (id, payload) => {
    return apiClient(`/admin/announcements/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
  },

  toggleAnnouncementStatus: async (id, status = null) => {
    return apiClient(`/admin/announcements/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  },

  deleteAnnouncement: async (id) => {
    return apiClient(`/admin/announcements/${id}`, {
      method: 'DELETE'
    });
  },

  getActiveAnnouncements: async () => {
    return apiClient('/announcements/active');
  },

  // --- Maintenance Mode & Settings ---
  getMaintenance: async () => {
    return apiClient('/admin/maintenance/maintenance');
  },

  toggleMaintenance: async (enabled) => {
    return apiClient('/admin/maintenance/maintenance/toggle', {
      method: 'POST',
      body: JSON.stringify({ enabled })
    });
  },

  updateMaintenanceCopy: async ({ headline, message }) => {
    return apiClient('/admin/maintenance/maintenance/copy', {
      method: 'PUT',
      body: JSON.stringify({ headline, message })
    });
  },

  getSettings: async () => {
    return apiClient('/admin/settings');
  },

  updateSettings: async (payload) => {
    return apiClient('/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
  },

  getPublicPlatformStatus: async () => {
    return apiClient('/platform/status');
  },

  // --- Analytics ---
  getAnalytics: async (range = '30d') => {
    return apiClient(`/admin/analytics?range=${range}`);
  }
};

export default adminService;
