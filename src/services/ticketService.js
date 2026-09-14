import { apiClient } from './api';

export const ticketService = {
  // --- Contact APIs ---
  submitContact: async (data) => {
    return apiClient('/contact', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  getContactMessages: async ({ search = '', status = 'All' } = {}) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (status && status !== 'All') params.append('status', status);
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return apiClient(`/contact${queryString}`, { method: 'GET' });
  },

  getContactMessageById: async (id) => {
    return apiClient(`/contact/${id}`, { method: 'GET' });
  },

  updateContactStatus: async (id, status) => {
    return apiClient(`/contact/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  },

  sendContactAdminMessage: async (id, message) => {
    return apiClient(`/contact/${id}/messages`, {
      method: 'POST',
      body: JSON.stringify({ message })
    });
  },

  deleteContactMessage: async (id) => {
    return apiClient(`/contact/${id}`, { method: 'DELETE' });
  },

  deleteAllContactMessages: async () => {
    return apiClient('/contact', { method: 'DELETE' });
  },

  // --- Feedback APIs ---
  submitFeedback: async (data) => {
    return apiClient('/feedback', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  getFeedbackMessages: async ({ search = '', status = 'All' } = {}) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (status && status !== 'All') params.append('status', status);
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return apiClient(`/feedback${queryString}`, { method: 'GET' });
  },

  getFeedbackMessageById: async (id) => {
    return apiClient(`/feedback/${id}`, { method: 'GET' });
  },

  updateFeedbackStatus: async (id, status) => {
    return apiClient(`/feedback/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  },

  sendFeedbackAdminMessage: async (id, message) => {
    return apiClient(`/feedback/${id}/messages`, {
      method: 'POST',
      body: JSON.stringify({ message })
    });
  },

  deleteFeedbackMessage: async (id) => {
    return apiClient(`/feedback/${id}`, { method: 'DELETE' });
  },

  deleteAllFeedbackMessages: async () => {
    return apiClient('/feedback', { method: 'DELETE' });
  },

  // --- Public Ticket Tracking API ---
  trackTicket: async ({ ticketId, email }) => {
    return apiClient('/tickets/track', {
      method: 'POST',
      body: JSON.stringify({ ticketId, email })
    });
  }
};

export default ticketService;
