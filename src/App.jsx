import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { LocationProvider } from './context/LocationContext';
import { AssistantProvider } from './context/AssistantContext';
import { TravelAssistant } from './components/ai';
import { AppErrorBoundary, NetworkStatus } from './components/common';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import DestinationsPage from './pages/DestinationsPage';
import DestinationDetailPage from './pages/DestinationDetailPage';
import WeatherInsightsPage from './pages/WeatherInsightsPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <AppErrorBoundary>
      <AppProvider>
        <LocationProvider>
          <AssistantProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<MainLayout />}>
                  <Route index element={<HomePage />} />
                  <Route path="destinations" element={<DestinationsPage />} />
                  <Route path="destinations/:id" element={<DestinationDetailPage />} />
                  <Route path="weather" element={<WeatherInsightsPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Route>
              </Routes>
              {/* Global Floating AI Travel Assistant */}
              <TravelAssistant />
              {/* Non-intrusive Offline / Online Network Monitor */}
              <NetworkStatus />
            </BrowserRouter>
          </AssistantProvider>
        </LocationProvider>
      </AppProvider>
    </AppErrorBoundary>
  );
}

export default App;
