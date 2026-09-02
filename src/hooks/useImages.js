import { useState, useEffect, useRef } from 'react';
import { fetchImageByQuery } from '../services/imageService';

/**
 * Hook to retrieve remote photography from Pexels API
 * @param {string} query - Query string
 * @param {Object} options - { perPage = 1, enabled = true }
 * @returns {Object} { photo, photos, loading, error, refetch }
 */
export function useRemoteImage(query, { perPage = 1, enabled = true } = {}) {
  const [photo, setPhoto] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(Boolean(enabled && query && typeof query === 'string' && query.trim()));
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  useEffect(() => {
    if (!enabled || !query || typeof query !== 'string' || !query.trim()) {
      setPhoto(null);
      setPhotos([]);
      setError(null);
      setLoading(false);
      return;
    }

    if (abortRef.current) {
      abortRef.current.abort();
    }
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    fetchImageByQuery(query, { perPage, signal: controller.signal })
      .then((res) => {
        if (controller.signal.aborted) return;
        const photoList = res?.success && Array.isArray(res?.data?.photos) ? res.data.photos : [];
        if (photoList.length > 0 && photoList[0]?.url) {
          setPhoto(photoList[0]);
          setPhotos(photoList);
          setError(null);
        } else {
          setPhoto(null);
          setPhotos([]);
          setError(null);
        }
        setLoading(false);
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        console.warn(`[useRemoteImage] Image fetch skipped or unavailable for "${query}":`, err.message);
        setError(err);
        setPhoto(null);
        setPhotos([]);
        setLoading(false);
      });

    return () => {
      if (abortRef.current) {
        abortRef.current.abort();
      }
    };
  }, [query, perPage, enabled]);

  return {
    photo,
    photos,
    loading,
    error,
    hasImage: Boolean(photo)
  };
}

export default useRemoteImage;
