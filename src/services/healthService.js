import { apiClient } from './api';

/**
 * Service to check backend API health status
 */
export async function checkServerHealth() {
  return apiClient('/health');
}
