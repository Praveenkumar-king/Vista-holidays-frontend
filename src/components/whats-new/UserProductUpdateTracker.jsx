import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { productUpdateService } from '../../services/productUpdateService';
import { UserProductUpdateModal } from './UserProductUpdateModal';

/**
 * UserProductUpdateTracker:
 * Automatically checks for any published product updates that the current user has not yet seen.
 * - Delays presentation by ~1 second after page load for smooth UX.
 * - Admin routes and auth routes are exempt from automatic popup presentation.
 * - Once seen, the database record prevents the modal from re-appearing.
 */
export const UserProductUpdateTracker = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const location = useLocation();
  const [unseenUpdate, setUnseenUpdate] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const checkPerformedRef = useRef(false);

  useEffect(() => {
    // Only check once per session/user mount
    if (checkPerformedRef.current) return;

    // Do not pop up on admin screens, for admin users, or during auth verification flows
    const isAdmin = location.pathname.startsWith('/admin') || currentUser?.role === 'admin';
    const isAuthFlowRoute = 
      location.pathname.startsWith('/users/login') ||
      location.pathname.startsWith('/user/login') ||
      location.pathname.startsWith('/users/register') ||
      location.pathname.startsWith('/user/register') ||
      location.pathname.startsWith('/users/verify-email') ||
      location.pathname.startsWith('/user/verify-email');

    if (!isAuthenticated || !currentUser || isAdmin || isAuthFlowRoute) {
      return;
    }

    // Schedule check ~1 second after load
    const timer = setTimeout(async () => {
      try {
        checkPerformedRef.current = true;
        const response = await productUpdateService.getUnseenUpdate();
        if (response.success && response.data?.hasUnseen && response.data?.update) {
          setUnseenUpdate(response.data.update);
          setIsOpen(true);
        }
      } catch (err) {
        // Silently handle error so travel app experience is uninterrupted
        console.debug('Product update check skipped:', err?.message);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [isAuthenticated, currentUser, location.pathname]);

  if (!isOpen || !unseenUpdate) return null;

  return (
    <UserProductUpdateModal
      update={unseenUpdate}
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      isPreview={false}
    />
  );
};

export default UserProductUpdateTracker;
