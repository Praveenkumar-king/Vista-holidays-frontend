/**
 * Base API client configuration for the frontend
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Generic request helper wrapping the Fetch API
 */
export async function apiClient(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultHeaders = {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    }
  };

  let response;
  try {
    response = await fetch(url, config);
  } catch (networkErr) {
    if (networkErr.name === 'AbortError') {
      throw networkErr; // Retain AbortError for clean cancellation detection
    }
    const err = new Error(
      typeof navigator !== 'undefined' && !navigator.onLine
        ? "You're offline. Please check your network connection."
        : 'Failed to connect to backend server. Please verify the server is running.'
    );
    err.status = 0;
    err.originalError = networkErr;
    throw err;
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const error = new Error(errorBody.message || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.data = errorBody;
    throw error;
  }

  return response.json();
}

export default apiClient;
