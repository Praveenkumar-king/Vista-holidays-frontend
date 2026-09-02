import { apiClient } from './api';

// In-memory cache for external image responses
const imageCache = new Map();

// In-flight request deduplication map to prevent parallel duplicate calls
const pendingRequests = new Map();

/**
 * Fetch landscape photography matching destination or landmark query
 * @param {string} query - Destination or place query
 * @param {Object} options - { perPage = 1, signal }
 * @returns {Promise<Object>} Photos payload
 */
export async function fetchImageByQuery(query, { perPage = 1, signal } = {}) {
  if (!query || typeof query !== 'string' || !query.trim()) {
    return { success: true, data: { photos: [] } };
  }

  // Handle pre-aborted caller signal immediately
  if (signal?.aborted) {
    const abortErr = new Error('Image request aborted');
    abortErr.name = 'AbortError';
    throw abortErr;
  }

  const normalizedQuery = query.trim().toLowerCase();
  const cacheKey = `${normalizedQuery}_${perPage}`;

  // 1. Return from memory cache if already fetched
  if (imageCache.has(cacheKey)) {
    return { success: true, data: imageCache.get(cacheKey), fromCache: true };
  }

  // 2. Reuse existing in-flight promise or initiate a deduplicated request
  let requestPromise = pendingRequests.get(cacheKey);

  if (!requestPromise) {
    const endpoint = `/images/search?query=${encodeURIComponent(query.trim())}&perPage=${perPage}`;

    requestPromise = (async () => {
      try {
        const res = await apiClient(endpoint, {
          method: 'GET'
          // Do not bind the shared network request to an individual caller's signal
        });

        // Validate response structure before caching
        if (res && res.success && res.data && Array.isArray(res.data.photos)) {
          imageCache.set(cacheKey, res.data);
          return res;
        }

        // Return safe normalized fallback payload if format differs
        return {
          success: true,
          data: {
            photos: res?.data?.photos || [],
            totalResults: res?.data?.totalResults || 0,
            query: query.trim()
          }
        };
      } finally {
        pendingRequests.delete(cacheKey);
      }
    })();

    pendingRequests.set(cacheKey, requestPromise);
  }

  // 3. If caller supplied an active signal, wrap with caller-specific abort listener
  if (signal) {
    return new Promise((resolve, reject) => {
      const onAbort = () => {
        signal.removeEventListener('abort', onAbort);
        const abortErr = new Error('Image request aborted');
        abortErr.name = 'AbortError';
        reject(abortErr);
      };

      if (signal.aborted) {
        return onAbort();
      }

      signal.addEventListener('abort', onAbort, { once: true });

      requestPromise
        .then((res) => {
          signal.removeEventListener('abort', onAbort);
          resolve(res);
        })
        .catch((err) => {
          signal.removeEventListener('abort', onAbort);
          reject(err);
        });
    });
  }

  return requestPromise;
}

export default {
  fetchImageByQuery
};

