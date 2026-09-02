import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getDestinationById } from '../data/destinations';

const LocationContext = createContext();

const LOCAL_STORAGE_KEY = 'travel_app_selected_location';

export const LocationProvider = ({ children }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [error, setError] = useState(null); // { code, message, userFriendly }
  const [permissionStatus, setPermissionStatus] = useState('prompt'); // 'prompt' | 'granted' | 'denied' | 'unavailable'

  // Safe initial hydration from localStorage for manual locations
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          parsed &&
          typeof parsed === 'object' &&
          typeof parsed.latitude === 'number' &&
          typeof parsed.longitude === 'number'
        ) {
          setSelectedLocation(parsed);
          setStatus('success');
        }
      }
    } catch (err) {
      console.warn('Failed to parse saved location from localStorage:', err);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  }, []);

  // Request browser geolocation explicitly upon user trigger
  const requestCurrentLocation = useCallback(() => {
    setStatus('loading');
    setError(null);

    // 1. Check browser Geolocation API support
    if (!navigator || !navigator.geolocation) {
      const errPayload = {
        code: 'UNSUPPORTED',
        message: 'Geolocation is not supported by this browser.',
        userFriendly: 'Location detection is not supported in this browser. You can search for a destination instead.'
      };
      setError(errPayload);
      setStatus('error');
      setPermissionStatus('unavailable');
      return;
    }

    const options = {
      enableHighAccuracy: false,
      timeout: 12000,
      maximumAge: 120000
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;

        const locationData = {
          source: 'current',
          latitude: Number(latitude.toFixed(4)),
          longitude: Number(longitude.toFixed(4)),
          accuracy: accuracy ? Math.round(accuracy) : null,
          city: '',
          country: '',
          displayName: 'Current Device Location',
          destinationId: null,
          updatedAt: new Date().toISOString()
        };

        setSelectedLocation(locationData);
        setStatus('success');
        setError(null);
        setPermissionStatus('granted');

        try {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(locationData));
        } catch (e) {
          // Ignore localStorage quota errors
        }
      },
      (geoError) => {
        let userFriendly = 'Your location could not be determined right now. You can search for a destination instead.';
        let perm = 'prompt';

        switch (geoError.code) {
          case geoError.PERMISSION_DENIED:
            userFriendly = 'Location access was denied. You can search for a destination instead.';
            perm = 'denied';
            break;
          case geoError.POSITION_UNAVAILABLE:
            userFriendly = 'Your position is currently unavailable. Please search for a destination.';
            break;
          case geoError.TIMEOUT:
            userFriendly = 'Location request timed out. Please try again or search for a destination.';
            break;
          default:
            userFriendly = 'Unable to detect location. Please search for a destination.';
        }

        const errPayload = {
          code: geoError.code || 'UNKNOWN',
          message: geoError.message,
          userFriendly
        };

        setError(errPayload);
        setStatus('error');
        setPermissionStatus(perm);
      },
      options
    );
  }, []);

  // Set a manually selected destination
  const setManualLocation = useCallback((destination) => {
    if (!destination) return;

    // Support either destination object or destination ID string
    const dest = typeof destination === 'string' ? getDestinationById(destination) : destination;
    if (!dest) return;

    const locationData = {
      source: 'manual',
      latitude: Number(dest.latitude),
      longitude: Number(dest.longitude),
      accuracy: null,
      city: dest.name,
      country: dest.country,
      region: dest.region || '',
      displayName: `${dest.name}, ${dest.country}`,
      destinationId: dest.id,
      updatedAt: new Date().toISOString()
    };

    setSelectedLocation(locationData);
    setStatus('success');
    setError(null);

    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(locationData));
    } catch (e) {
      // Ignore localStorage quota errors
    }
  }, []);

  // Clear selected location
  const clearLocation = useCallback(() => {
    setSelectedLocation(null);
    setStatus('idle');
    setError(null);

    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (e) {
      // Ignore
    }
  }, []);

  const value = {
    selectedLocation,
    status,
    error,
    permissionStatus,
    isLoading: status === 'loading',
    isError: status === 'error',
    isCurrentLocation: selectedLocation?.source === 'current',
    isManualLocation: selectedLocation?.source === 'manual',
    requestCurrentLocation,
    setManualLocation,
    clearLocation
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

export default LocationContext;
