import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import authService from '../services/authService';
import { useToast } from './ToastContext';
import TermsModal from '../components/auth/TermsModal';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [termsLoading, setTermsLoading] = useState(false);
  
  const toast = useToast();
  const termsTimerRef = useRef(null);

  // Clear any existing terms timer
  const clearTermsTimer = () => {
    if (termsTimerRef.current) {
      clearTimeout(termsTimerRef.current);
      termsTimerRef.current = null;
    }
  };

  // Schedule mandatory terms modal after ~3 seconds if user hasn't accepted yet
  const evaluateTermsRequirement = useCallback((user) => {
    clearTermsTimer();

    if (user && user.emailVerified && !user.termsAccepted) {
      termsTimerRef.current = setTimeout(() => {
        setShowTermsModal(true);
      }, 3000);
    } else {
      setShowTermsModal(false);
    }
  }, []);

  // Fetch current user on application mount to restore session
  const refreshUser = useCallback(async () => {
    try {
      const response = await authService.getMe();
      if (response.success && response.data?.user) {
        const user = response.data.user;
        setCurrentUser(user);
        evaluateTermsRequirement(user);
        return user;
      }
      setCurrentUser(null);
      return null;
    } catch {
      setCurrentUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, [evaluateTermsRequirement]);

  useEffect(() => {
    refreshUser();
    return () => clearTermsTimer();
  }, [refreshUser]);

  /**
   * Log in user
   */
  const login = async ({ email, password }) => {
    try {
      const response = await authService.login({ email, password });
      if (response.success && response.data?.user) {
        const user = response.data.user;
        setCurrentUser(user);
        toast.success(`Welcome back, ${user.name}!`, 'Signed In');
        evaluateTermsRequirement(user);
        return { success: true, user };
      }
      return { success: false, message: response.message || 'Login failed' };
    } catch (error) {
      const isUnverified = error.unverified || error.data?.unverified;
      if (isUnverified) {
        return {
          success: false,
          unverified: true,
          email: error.email || error.data?.email || email,
          message: error.message || 'Please verify your email before signing in.'
        };
      }
      if (error.code === 'MAINTENANCE_MODE' || error.status === 503) {
        toast.warning(error.message || 'System under maintenance.', 'Maintenance Active');
        return {
          success: false,
          maintenance: true,
          message: error.message || 'System under maintenance. Normal user login is temporarily disabled.'
        };
      }
      toast.error(error.message || 'Invalid email or password.', 'Login Failed');
      return {
        success: false,
        message: error.message || 'Invalid credentials.'
      };
    }
  };

  /**
   * Register new user
   */
  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      toast.success(
        'Account created! Please check your inbox to verify your email.',
        'Registration Successful'
      );
      return { success: true, data: response.data, message: response.message };
    } catch (error) {
      if (error.code === 'MAINTENANCE_MODE' || error.status === 503) {
        toast.warning(error.message || 'System under maintenance.', 'Maintenance Active');
        return {
          success: false,
          maintenance: true,
          message: error.message || 'System under maintenance. User registration is temporarily paused.'
        };
      }
      const isUnverified = error.unverified || error.data?.unverified;
      if (isUnverified) {
        return {
          success: false,
          unverified: true,
          email: error.email || error.data?.email || userData.email,
          message: error.message || 'An unverified account with this email already exists.'
        };
      }
      toast.error(error.message || 'Registration failed. Please check your details.', 'Registration Failed');
      return {
        success: false,
        message: error.message || 'Registration failed.'
      };
    }
  };

  /**
   * Resend email verification
   */
  const resendVerification = async (email) => {
    try {
      const response = await authService.resendVerification(email);
      toast.success('Verification email sent. Please check your inbox.', 'Email Sent');
      return { success: true, message: response.message };
    } catch (error) {
      toast.error(error.message || 'Failed to resend verification email.', 'Resend Failed');
      return { success: false, message: error.message };
    }
  };

  /**
   * Accept mandatory Terms & Conditions
   */
  const acceptTerms = async (version = '1.0') => {
    try {
      setTermsLoading(true);
      const response = await authService.acceptTerms(version);
      if (response.success && response.data?.user) {
        setCurrentUser(response.data.user);
        setShowTermsModal(false);
        toast.success('Terms Accepted', 'Confirmed');
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      toast.error(error.message || 'Failed to record terms acceptance.', 'Error');
      return { success: false, message: error.message };
    } finally {
      setTermsLoading(false);
    }
  };

  /**
   * Log out user
   */
  const logout = async () => {
    try {
      clearTermsTimer();
      setShowTermsModal(false);
      await authService.logout();
      setCurrentUser(null);
      toast.info('You have been logged out successfully.', 'Logged Out');
      return { success: true };
    } catch (error) {
      setCurrentUser(null);
      toast.error(error.message || 'Logout failed.', 'Error');
      return { success: false };
    }
  };

  const value = {
    currentUser,
    isAuthenticated: Boolean(currentUser),
    isAdmin: currentUser?.role === 'admin',
    loading,
    login,
    logout,
    register,
    refreshUser,
    resendVerification,
    acceptTerms,
    showTermsModal
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      {/* Mandatory Terms Modal - Global layer appearing ~3s after first verified login */}
      <TermsModal
        isOpen={showTermsModal}
        onAccept={() => acceptTerms('1.0')}
        loading={termsLoading}
      />
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
