import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { LocationProvider } from './context/LocationContext';
import { AssistantProvider } from './context/AssistantContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { TravelAssistant } from './components/ai';
import { AppErrorBoundary, NetworkStatus } from './components/common';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import DestinationsPage from './pages/DestinationsPage';
import DestinationDetailPage from './pages/DestinationDetailPage';
import WeatherInsightsPage from './pages/WeatherInsightsPage';
import NotFoundPage from './pages/NotFoundPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import GuestRoute from './components/auth/GuestRoute';
import AdminRoute from './components/auth/AdminRoute';

// Support Ticket System Pages
import ContactPage from './pages/ContactPage';
import FeedbackPage from './pages/FeedbackPage';
import TrackStatusPage from './pages/TrackStatusPage';
import FAQPage from './pages/FAQPage';
import AdminContactMessagesPage from './pages/admin/AdminContactMessagesPage';
import AdminContactDetailPage from './pages/admin/AdminContactDetailPage';
import AdminFeedbackMessagesPage from './pages/admin/AdminFeedbackMessagesPage';
import AdminFeedbackDetailPage from './pages/admin/AdminFeedbackDetailPage';

// What's New / Product Updates
import AdminProductUpdatesPage from './pages/admin/AdminProductUpdatesPage';
import { UserProductUpdateTracker } from './components/whats-new';

function App() {
  return (
    <AppErrorBoundary>
      <ToastProvider>
        <AuthProvider>
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
                      
                      {/* User Authentication Routes */}
                      <Route 
                        path="users/register" 
                        element={
                          <GuestRoute>
                            <RegisterPage />
                          </GuestRoute>
                        } 
                      />
                      <Route 
                        path="users/login" 
                        element={
                          <GuestRoute>
                            <LoginPage />
                          </GuestRoute>
                        } 
                      />
                      <Route path="users/verify-email" element={<VerifyEmailPage />} />

                      {/* Complete Support Ticket & Documentation Public Routes */}
                      <Route path="contact" element={<ContactPage />} />
                      <Route path="feedback" element={<FeedbackPage />} />
                      <Route path="track-status" element={<TrackStatusPage />} />
                      <Route path="faq" element={<FAQPage />} />

                      {/* Complete Support Ticket System Admin Routes (Protected) */}
                      <Route 
                        path="admin/contact" 
                        element={
                          <AdminRoute>
                            <AdminContactMessagesPage />
                          </AdminRoute>
                        } 
                      />
                      <Route 
                        path="admin/contact/:id" 
                        element={
                          <AdminRoute>
                            <AdminContactDetailPage />
                          </AdminRoute>
                        } 
                      />
                      <Route 
                        path="admin/feedback" 
                        element={
                          <AdminRoute>
                            <AdminFeedbackMessagesPage />
                          </AdminRoute>
                        } 
                      />
                      <Route 
                        path="admin/feedback/:id" 
                        element={
                          <AdminRoute>
                            <AdminFeedbackDetailPage />
                          </AdminRoute>
                        } 
                      />

                      {/* What's New / Product Updates Admin Routes (Protected) */}
                      <Route 
                        path="admin/whats-new" 
                        element={
                          <AdminRoute>
                            <AdminProductUpdatesPage />
                          </AdminRoute>
                        } 
                      />
                      <Route 
                        path="admin/product-updates" 
                        element={
                          <AdminRoute>
                            <AdminProductUpdatesPage />
                          </AdminRoute>
                        } 
                      />

                      {/* 404 Fallback */}
                      <Route path="*" element={<NotFoundPage />} />
                    </Route>
                  </Routes>
                  {/* Global Floating AI Travel Assistant */}
                  <TravelAssistant />
                  {/* Non-intrusive Offline / Online Network Monitor */}
                  <NetworkStatus />
                  {/* Automated Unseen Product Update Notification */}
                  <UserProductUpdateTracker />
                </BrowserRouter>
              </AssistantProvider>
            </LocationProvider>
          </AppProvider>
        </AuthProvider>
      </ToastProvider>
    </AppErrorBoundary>
  );
}

export default App;
