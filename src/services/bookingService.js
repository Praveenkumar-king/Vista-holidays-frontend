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
  }
};

export default bookingService;
