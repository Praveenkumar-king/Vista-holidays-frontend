import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { ShieldAlert } from 'lucide-react';

/**
 * Route wrapper that restricts access exclusively to authenticated users with admin privileges
 */
export const AdminRoute = ({ children }) => {
  const { currentUser, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" message="Verifying administrator credentials..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate 
        to="/admin/login" 
        state={{ 
          from: location, 
          message: 'Administrator credentials required to access this portal.' 
        }} 
        replace 
      />
    );
  }

  if (currentUser?.role !== 'admin') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full text-center bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Access Denied</h2>
          <p className="text-sm text-slate-600 mb-6">
            You do not have administrator permissions to access this portal. Please log in with authorized administrator credentials.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link 
              to="/" 
              className="inline-flex justify-center items-center px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
            >
              Return Home
            </Link>
            <Link 
              to="/admin/login" 
              state={{ from: location, message: 'Please sign in with administrator credentials.' }}
              className="inline-flex justify-center items-center px-4 py-2 text-sm font-medium text-white bg-rose-600 rounded-lg hover:bg-rose-700 transition-colors"
            >
              Sign In as Admin
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default AdminRoute;
