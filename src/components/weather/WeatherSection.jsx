import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from '../../hooks/useLocation';
import { fetchCurrentWeather } from '../../services/weatherService';
import { Container } from '../layout/Container';
import { SectionHeader } from '../ui/SectionHeader';
import { WeatherCard } from './WeatherCard';
import { WeatherSkeleton } from './WeatherSkeleton';
import { WeatherError } from './WeatherError';
import { WeatherNoLocation } from './WeatherNoLocation';

export const WeatherSection = ({ className = '' }) => {
  const { selectedLocation } = useLocation();
  const [weather, setWeather] = useState(null);
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Keep track of active abort controller to prevent race conditions
  const abortControllerRef = useRef(null);

  const loadWeather = useCallback(async (forceRefresh = false) => {
    if (!selectedLocation || selectedLocation.latitude === undefined || selectedLocation.longitude === undefined) {
      setWeather(null);
      setStatus('idle');
      return;
    }

    // Cancel any ongoing fetch request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    if (forceRefresh) {
      setIsRefreshing(true);
    } else {
      setStatus('loading');
    }
    setErrorMessage('');

    try {
      const res = await fetchCurrentWeather(
        selectedLocation.latitude,
        selectedLocation.longitude,
        { signal: controller.signal, forceRefresh }
      );

      if (res.success && res.data) {
        setWeather(res.data);
        setStatus('success');
      } else {
        throw new Error(res.message || 'Unable to retrieve weather data.');
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        // Ignored aborted requests
        return;
      }
      console.warn('Weather fetch failed:', err.message);
      setErrorMessage(
        err.data?.message || err.message || 'Weather data is temporarily unavailable. Please try again.'
      );
      setStatus('error');
    } finally {
      setIsRefreshing(false);
    }
  }, [selectedLocation]);

  // Trigger weather fetch whenever selected coordinates change
  useEffect(() => {
    loadWeather(false);

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [selectedLocation?.latitude, selectedLocation?.longitude, loadWeather]);

  return (
    <section id="weather" aria-label="Real-Time Weather Information" className={`w-full ${className}`}>
      <Container size="xl">
        <SectionHeader
          eyebrow="Atmospheric Telemetry"
          title="Live Weather Intelligence"
          description="Real-time temperatures, wind speeds, humidity, and climate conditions powered by OpenWeather."
        />

        {/* Dynamic State Rendering */}
        {!selectedLocation ? (
          <WeatherNoLocation />
        ) : status === 'loading' ? (
          <WeatherSkeleton />
        ) : status === 'error' ? (
          <WeatherError
            message={errorMessage}
            onRetry={() => loadWeather(true)}
          />
        ) : (
          <WeatherCard
            weather={weather}
            locationInfo={selectedLocation}
            onRefresh={() => loadWeather(true)}
            isRefreshing={isRefreshing}
          />
        )}
      </Container>
    </section>
  );
};

export default WeatherSection;
