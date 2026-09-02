/**
 * Centralized utility to map technical/network errors into polite, actionable, user-friendly messages
 */

export function getFriendlyErrorMessage(
  error,
  fallback = 'Something went wrong. Please try again.'
) {
  if (!error) return fallback;

  // 1. Check if user is offline
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return "You're offline or your connection was interrupted. Please check your connection and try again.";
  }

  // 2. Ignore intentional AbortController cancellation
  if (error.name === 'AbortError') {
    return '';
  }

  // 3. Extract message from error object or string
  const rawMsg = typeof error === 'string'
    ? error
    : error.message || error.data?.message || '';

  // 4. Map known error patterns
  if (rawMsg.includes('Failed to fetch') || rawMsg.includes('NetworkError') || rawMsg.includes('network connectivity')) {
    return "Unable to connect to the travel service. Please check your internet connection and verify the server is running.";
  }

  if (rawMsg.includes('timeout') || rawMsg.includes('timed out') || error.name === 'TimeoutError') {
    return 'The request took too long to complete. Please try again.';
  }

  if (rawMsg.includes('rate limit') || rawMsg.includes('RESOURCE_EXHAUSTED') || rawMsg.includes('busy')) {
    return 'The travel assistant is temporarily busy. Please wait a moment before trying again.';
  }

  if (rawMsg.includes('not configured') || rawMsg.includes('API key')) {
    return rawMsg; // Clean message from server (e.g. "OpenWeather API key is not configured on the server")
  }

  if (rawMsg.includes('404') || rawMsg.includes('not found')) {
    return 'The requested destination or resource was not found.';
  }

  if (rawMsg.length > 0 && rawMsg.length < 160 && !rawMsg.includes('at ') && !rawMsg.includes('{')) {
    return rawMsg;
  }

  return fallback;
}

export default {
  getFriendlyErrorMessage
};
