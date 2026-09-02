import { apiClient } from './api';

// Lightweight in-memory client-side cache for weather requests (5-minute TTL)
const weatherCache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

function getCacheKey(lat, lon) {
  return `${Number(lat).toFixed(3)},${Number(lon).toFixed(3)}`;
}

/**
 * Fetch real-time weather for given coordinates via backend proxy
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {Object} options - { signal, forceRefresh }
 * @returns {Promise<Object>} Weather payload
 */
export async function fetchCurrentWeather(lat, lon, { signal, forceRefresh = false } = {}) {
  if (lat === undefined || lon === undefined || lat === null || lon === null) {
    throw new Error('Coordinates (latitude and longitude) are required to fetch weather.');
  }

  const cacheKey = getCacheKey(lat, lon);

  // Check valid cache entry
  if (!forceRefresh && weatherCache.has(cacheKey)) {
    const cached = weatherCache.get(cacheKey);
    const now = Date.now();
    if (now - cached.timestamp < CACHE_TTL_MS) {
      return { success: true, data: cached.data, fromCache: true };
    }
  }

  const endpoint = `/weather/current?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`;

  const res = await apiClient(endpoint, {
    method: 'GET',
    signal
  });

  if (res.success && res.data) {
    // Store in memory cache
    weatherCache.set(cacheKey, {
      timestamp: Date.now(),
      data: res.data
    });
  }

  return res;
}

/**
 * Fetch real-time weather by city name or postal/pincode via backend proxy
 * @param {string} query - City name or pincode
 * @param {Object} options - { signal, forceRefresh }
 * @returns {Promise<Object>} Weather payload
 */
export async function fetchWeatherByQuery(query, { signal, forceRefresh = false } = {}) {
  if (!query || typeof query !== 'string' || !query.trim()) {
    throw new Error('City name or pincode is required to fetch weather.');
  }

  const normalizedQuery = query.trim().toLowerCase();
  const cacheKey = `query:${normalizedQuery}`;

  if (!forceRefresh && weatherCache.has(cacheKey)) {
    const cached = weatherCache.get(cacheKey);
    const now = Date.now();
    if (now - cached.timestamp < CACHE_TTL_MS) {
      return { success: true, data: cached.data, fromCache: true };
    }
  }

  const endpoint = `/weather/current?query=${encodeURIComponent(query.trim())}`;

  const res = await apiClient(endpoint, {
    method: 'GET',
    signal
  });

  if (res.success && res.data) {
    weatherCache.set(cacheKey, {
      timestamp: Date.now(),
      data: res.data
    });
  }

  return res;
}

export default {
  fetchCurrentWeather,
  fetchWeatherByQuery
};
