import { apiClient } from './api';

export const bookingService = {
  /**
   * Request checkout creation and get Razorpay order
   */
  createCheckout: async (bookingData) => {
    return apiClient('/bookings/checkout', {
      method: 'POST',
      body: JSON.stringify(bookingData)
    });
  },

  /**
   * Verify Razorpay payment signature
   */
  verifyPayment: async (paymentData) => {
    return apiClient('/bookings/verify-payment', {
      method: 'POST',
      body: JSON.stringify(paymentData)
    });
  },

  /**
   * Get current authenticated user's own bookings
   */
  getMyBookings: async (status = 'all') => {
    const query = status && status !== 'all' ? `?status=${encodeURIComponent(status)}` : '';
    return apiClient(`/bookings/my${query}`, {
      method: 'GET'
    });
  },

  /**
   * Get single booking details
   */
  getBookingById: async (bookingId) => {
    return apiClient(`/bookings/${encodeURIComponent(bookingId)}`, {
      method: 'GET'
    });
  },

  /**
   * Securely download authoritative stored invoice PDF
   * @param {string} bookingId
   * @param {string} [invoiceNumber]
   */
  downloadInvoice: async (bookingId, invoiceNumber = '') => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
    const response = await fetch(`${API_BASE_URL}/bookings/${encodeURIComponent(bookingId)}/invoice`, {
      method: 'GET',
      credentials: 'include'
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw new Error(errorBody.message || `Failed to download invoice (status: ${response.status})`);
    }

    const blob = await response.blob();
    const filename = invoiceNumber
      ? `Vista-Holidays-Invoice-${invoiceNumber}.pdf`
      : `Vista-Holidays-Invoice-${bookingId}.pdf`;

    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);

    return { success: true, filename };
  }
};

export default bookingService;
