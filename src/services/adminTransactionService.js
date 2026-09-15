import { apiClient } from './api';

export const adminTransactionService = {
  /**
   * Get transaction summary & financial telemetry
   */
  getSummary: async () => {
    return apiClient('/admin/transactions/summary', {
      method: 'GET'
    });
  },

  /**
   * Get all transactions with search, filter, and pagination
   */
  getTransactions: async ({ search = '', status = 'all', page = 1, limit = 20 } = {}) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (status && status !== 'all') params.append('status', status);
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);

    return apiClient(`/admin/transactions?${params.toString()}`, {
      method: 'GET'
    });
  },

  /**
   * Get transaction details by ID
   */
  getTransactionById: async (id) => {
    return apiClient(`/admin/transactions/${encodeURIComponent(id)}`, {
      method: 'GET'
    });
  }
};

export default adminTransactionService;
