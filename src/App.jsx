import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
import UserDashboardPage from './pages/UserDashboardPage';
import UserProfilePage from './pages/UserProfilePage';
import UserLayout from './layouts/UserLayout';
import UserTripsPage from './pages/user/UserTripsPage';
import UserAiAssistantPage from './pages/user/UserAiAssistantPage';
import UserAiPlansPage from './pages/user/UserAiPlansPage';
import UserSavedDestinationsPage from './pages/user/UserSavedDestinationsPage';
import UserRecentWeatherPage from './pages/user/UserRecentWeatherPage';
import UserRecentLocationsPage from './pages/user/UserRecentLocationsPage';
import UserNotificationsPage from './pages/user/UserNotificationsPage';
import UserSecurityPage from './pages/user/UserSecurityPage';
import UserSettingsPage from './pages/user/UserSettingsPage';
import GuestRoute from './components/auth/GuestRoute';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';

// Public Support Ticket & Documentation Routes
import ContactPage from './pages/ContactPage';
import FeedbackPage from './pages/FeedbackPage';
import TrackStatusPage from './pages/TrackStatusPage';
import FAQPage from './pages/FAQPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import CookiePolicyPage from './pages/CookiePolicyPage';

// Admin Control Center Pages
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminUserDetailPage from './pages/admin/AdminUserDetailPage';
import AdminSupportTicketsPage from './pages/admin/AdminSupportTicketsPage';
import AdminContactMessagesPage from './pages/admin/AdminContactMessagesPage';
import AdminContactDetailPage from './pages/admin/AdminContactDetailPage';
import AdminFeedbackMessagesPage from './pages/admin/AdminFeedbackMessagesPage';
import AdminFeedbackDetailPage from './pages/admin/AdminFeedbackDetailPage';
import AdminProductUpdatesPage from './pages/admin/AdminProductUpdatesPage';
import AdminAnnouncementsPage from './pages/admin/AdminAnnouncementsPage';
import AdminMaintenancePage from './pages/admin/AdminMaintenancePage';
import AdminPlatformSettingsPage from './pages/admin/AdminPlatformSettingsPage';
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage';
import AdminTransactionsPage from './pages/admin/AdminTransactionsPage';
import MyBookingsPage from './pages/MyBookingsPage';

// What's New User Experience Tracker
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
                    {/* Public Portal Landmark Shell */}
                    <Route path="/" element={<MainLayout />}>
                      <Route index element={<HomePage />} />
                      <Route path="destinations" element={<DestinationsPage />} />
                      <Route path="destinations/:id" element={<DestinationDetailPage />} />
                      <Route path="weather" element={<WeatherInsightsPage />} />

                      {/* Legacy User Portal Alias Redirects */}
                      <Route path="users" element={<Navigate to="/user/dashboard" replace />} />
                      <Route path="users/dashboard" element={<Navigate to="/user/dashboard" replace />} />
                      <Route path="users/profile" element={<Navigate to="/user/profile" replace />} />
                      <Route path="users/bookings" element={<Navigate to="/user/bookings" replace />} />
                      <Route path="bookings" element={<Navigate to="/user/bookings" replace />} />

                      {/* User Authentication Routes (both /user/* and /users/* fully supported) */}
                      <Route
                        path="user/register"
                        element={
                          <GuestRoute>
                            <RegisterPage />
                          </GuestRoute>
                        }
                      />
                      <Route
                        path="users/register"
                        element={
                          <GuestRoute>
                            <RegisterPage />
                          </GuestRoute>
                        }
                      />
                      <Route
                        path="user/login"
                        element={
                          <GuestRoute>
                            <LoginPage />
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
                      <Route path="user/verify-email" element={<VerifyEmailPage />} />
                      <Route path="users/verify-email" element={<VerifyEmailPage />} />

                      {/* Support Ticket & Inquiries Public Routes */}
                      <Route path="contact" element={<ContactPage />} />
                      <Route path="feedback" element={<FeedbackPage />} />
                      <Route path="track-status" element={<TrackStatusPage />} />
                      <Route path="faq" element={<FAQPage />} />

                      {/* Legal, Terms & Compliance Routes */}
                      <Route path="terms" element={<TermsPage />} />
                      <Route path="terms-and-conditions" element={<TermsPage />} />
                      <Route path="privacy" element={<PrivacyPage />} />
                      <Route path="privacy-policy" element={<PrivacyPage />} />
                      <Route path="cookie-policy" element={<CookiePolicyPage />} />
                      <Route path="cookies" element={<CookiePolicyPage />} />
                    </Route>

                    {/* Dedicated Authenticated User Navigation Portal */}
                    <Route
                      path="user"
                      element={
                        <ProtectedRoute>
                          <UserLayout />
                        </ProtectedRoute>
                      }
                    >
                      <Route index element={<Navigate to="/user/dashboard" replace />} />
                      <Route path="dashboard" element={<UserDashboardPage />} />
                      <Route path="profile" element={<UserProfilePage />} />
                      <Route path="trips" element={<UserTripsPage />} />
                      <Route path="bookings" element={<MyBookingsPage />} />
                      <Route path="ai-assistant" element={<UserAiAssistantPage />} />
                      <Route path="ai-plans" element={<UserAiPlansPage />} />
                      <Route path="saved-destinations" element={<UserSavedDestinationsPage />} />
                      <Route path="recent-weather" element={<UserRecentWeatherPage />} />
                      <Route path="recent-locations" element={<UserRecentLocationsPage />} />
                      <Route path="notifications" element={<UserNotificationsPage />} />
                      <Route path="security" element={<UserSecurityPage />} />
                      <Route path="settings" element={<UserSettingsPage />} />
                    </Route>

                    {/* Admin Authentication (Standalone Dark Interface) */}
                    <Route path="admin/login" element={<AdminLoginPage />} />

                    {/* Protected Administration Hub Routes */}
                    <Route
                      path="admin"
                      element={
                        <AdminRoute>
                          <AdminDashboardPage />
                        </AdminRoute>
                      }
                    />

                    {/* Admin Transactions & Financial Telemetry */}
                    <Route
                      path="admin/transactions"
                      element={
                        <AdminRoute>
                          <AdminTransactionsPage />
                        </AdminRoute>
                      }
                    />

                    {/* Users Directory & Detailed Inspection */}
                    <Route
                      path="admin/users"
                      element={
                        <AdminRoute>
                          <AdminUsersPage />
                        </AdminRoute>
                      }
                    />
                    <Route
                      path="admin/users/:id"
                      element={
                        <AdminRoute>
                          <AdminUserDetailPage />
                        </AdminRoute>
                      }
                    />

                    {/* Support Tickets Unified Directory */}
                    <Route
                      path="admin/support-tickets"
                      element={
                        <AdminRoute>
                          <AdminSupportTicketsPage />
                        </AdminRoute>
                      }
                    />
                    <Route
                      path="admin/support"
                      element={
                        <AdminRoute>
                          <AdminSupportTicketsPage />
                        </AdminRoute>
                      }
                    />

                    {/* Contact Desk Inquiries */}
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

                    {/* Traveler Feedback & Reviews */}
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

                    {/* What's New & Product Updates */}
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

                    {/* Platform Announcements */}
                    <Route
                      path="admin/announcements"
                      element={
                        <AdminRoute>
                          <AdminAnnouncementsPage />
                        </AdminRoute>
                      }
                    />
                    <Route
                      path="admin/platform-announcements"
                      element={
                        <AdminRoute>
                          <AdminAnnouncementsPage />
                        </AdminRoute>
                      }
                    />

                    {/* Platform Maintenance Mode Control */}
                    <Route
                      path="admin/maintenance"
                      element={
                        <AdminRoute>
                          <AdminMaintenancePage />
                        </AdminRoute>
                      }
                    />

                    {/* Platform & Infrastructure Settings */}
                    <Route
                      path="admin/platform-settings"
                      element={
                        <AdminRoute>
                          <AdminPlatformSettingsPage />
                        </AdminRoute>
                      }
                    />
                    <Route
                      path="admin/settings"
                      element={
                        <AdminRoute>
                          <AdminPlatformSettingsPage />
                        </AdminRoute>
                      }
                    />

                    {/* Platform Analytics & Intelligence */}
                    <Route
                      path="admin/analytics"
                      element={
                        <AdminRoute>
                          <AdminAnalyticsPage />
                        </AdminRoute>
                      }
                    />

                    {/* 404 Fallback */}
                    <Route path="*" element={<NotFoundPage />} />
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
