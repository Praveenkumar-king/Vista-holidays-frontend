import { apiClient } from './api';

/**
 * User service communicating with Vista Holidays profile & dashboard APIs
 */
export const userService = {
  /**
   * Get current authenticated user profile
   */
  getProfile: async () => {
    return apiClient('/user/me', {
      method: 'GET'
    });
  },

  /**
   * Update user name and mobile number
   */
  updateProfile: async ({ name, mobile }) => {
    return apiClient('/user/profile', {
      method: 'PUT',
      body: JSON.stringify({ name, mobile })
    });
  },

  /**
   * Upload or replace profile image via Cloudinary
   * @param {File} file - Profile image file
   */
  uploadProfileImage: async (file) => {
    const formData = new FormData();
    formData.append('profileImage', file);

    return apiClient('/user/profile-image', {
      method: 'POST',
      body: formData
    });
  },

  /**
   * Remove profile image (reverts to default avatar initials)
   */
  removeProfileImage: async () => {
    return apiClient('/user/profile-image', {
      method: 'DELETE'
    });
  },

  /**
   * Get user dashboard telemetry and summary
   */
  getDashboardSummary: async () => {
    return apiClient('/user/dashboard-summary', {
      method: 'GET'
    });
  },

  /**
   * Toggle saved destination in wishlist
   */
  toggleSavedDestination: async (destinationId) => {
    return apiClient('/user/saved-destinations/toggle', {
      method: 'POST',
      body: JSON.stringify({ destinationId })
    });
  },

  /**
   * Change account password
   */
  changePassword: async ({ currentPassword, newPassword }) => {
    return apiClient('/user/change-password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword })
    });
  }
};

export default userService;
