import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertCircle, 
  Compass,
  LogOut 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Container } from '../../components/layout/Container';

export const AdminLoginPage = () => {
  const { login, currentUser, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fromPath = location.state?.from?.pathname || '/admin';
  const redirectNotice = location.state?.message;

  // If already logged in as admin, redirect directly to intended admin page
  useEffect(() => {
    if (isAuthenticated && currentUser?.role === 'admin') {
      navigate(fromPath, { replace: true });
    }
  }, [isAuthenticated, currentUser, fromPath, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.email.trim() || !formData.password) {
      setErrorMessage('Please provide both administrator email and password.');
      return;
    }

    setLoading(true);
    const result = await login({
      email: formData.email.trim().toLowerCase(),
      password: formData.password
    });
    setLoading(false);

    if (result.success) {
      if (result.user?.role !== 'admin') {
        setErrorMessage('Access Denied: This account does not have administrator privileges.');
        return;
      }
      navigate(fromPath, { replace: true });
    } else {
      setErrorMessage(result.message || 'Invalid administrator email or password.');
    }
  };

  return (
    <div className="min-h-[85vh] py-12 sm:py-16 flex items-center justify-center bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-slate-100">
      <Container size="sm">
        <div className="bg-slate-900/90 backdrop-blur-md rounded-3xl shadow-2xl border border-slate-800 p-6 sm:p-10 transition-all">
          {/* Admin Header Branding */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-700 flex items-center justify-center text-white mx-auto mb-3 shadow-lg shadow-rose-900/30">
              <ShieldCheck className="w-7 h-7 stroke-[2.2]" />
            </div>
            <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-500/15 text-rose-400 border border-rose-500/30 mb-2">
              Staff &amp; Admin Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
              Admin Authentication
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1.5 font-sans">
              Enter authorized administrator credentials to manage tickets and updates.
            </p>
          </div>

          {/* Already logged in as regular user warning */}
          {isAuthenticated && currentUser?.role !== 'admin' && (
            <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs sm:text-sm text-amber-300 flex flex-col gap-3">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-amber-200">
                    Logged in as Traveler: {currentUser?.email}
                  </p>
                  <p className="text-amber-400 text-xs mt-0.5">
                    This account lacks administrative privileges. Please sign out and log in with your admin credentials.
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="xs"
                onClick={logout}
                iconLeft={LogOut}
                className="self-start text-amber-200 border-amber-500/40 hover:bg-amber-500/10"
              >
                Sign Out &amp; Switch Account
              </Button>
            </div>
          )}

          {/* Notice banner if redirected */}
          {!errorMessage && redirectNotice && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <span>{redirectNotice}</span>
            </div>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-950/60 border border-rose-800 text-xs sm:text-sm text-rose-300 flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Admin Login Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Email Field */}
            <div>
              <label 
                htmlFor="admin-email" 
                className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
              >
                Admin Email
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-slate-500 pointer-events-none">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="admin-email"
                  type="email"
                  autoComplete="email"
                  placeholder="admin@vistaholidays.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full bg-slate-950 text-slate-100 text-sm placeholder:text-slate-600 border border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 transition-all focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label 
                htmlFor="admin-password" 
                className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
              >
                Password
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-slate-500 pointer-events-none">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="w-full bg-slate-950 text-slate-100 text-sm placeholder:text-slate-600 border border-slate-700 rounded-xl pl-10 pr-10 py-2.5 transition-all focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-slate-500 hover:text-slate-300 transition-colors p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                loading={loading}
                iconRight={ArrowRight}
                className="w-full justify-center bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-md shadow-rose-900/30 border-0"
              >
                Authorize &amp; Access Admin
              </Button>
            </div>
          </form>

          {/* Footer Navigation */}
          <div className="mt-8 pt-6 border-t border-slate-800 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Return to Public Website</span>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default AdminLoginPage;
