import { apiClient } from './api';

/**
 * Authentication service communicating with Vista Holidays backend API
 */
export const authService = {
  /**
   * Register a new user
   */
  register: async ({ name, email, password, mobile, termsAccepted }) => {
    return apiClient('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, mobile, termsAccepted })
    });
  },

  /**
   * Log in an existing user
   */
  login: async ({ email, password }) => {
    return apiClient('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },

  /**
   * Log out the current user and clear server session cookie
   */
  logout: async () => {
    return apiClient('/auth/logout', {
      method: 'POST'
    });
  },

  /**
   * Fetch current authenticated user profile
   */
  getMe: async () => {
    return apiClient('/auth/me', {
      method: 'GET'
    });
  },

  /**
   * Verify user email via token
   */
  verifyEmail: async (token) => {
    return apiClient(`/auth/verify-email?token=${encodeURIComponent(token)}`, {
      method: 'GET'
    });
  },

  /**
   * Resend email verification link
   */
  resendVerification: async (email) => {
    return apiClient('/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  },

  /**
   * Accept mandatory Terms & Conditions
   */
  acceptTerms: async (version = '1.0') => {
    return apiClient('/auth/accept-terms', {
      method: 'POST',
      body: JSON.stringify({ version })
    });
  }
};

export default authService;
