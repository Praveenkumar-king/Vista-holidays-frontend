import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  Compass, 
  Eye, 
  EyeOff, 
  AlertCircle,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Container } from '../components/layout/Container';

export const LoginPage = () => {
  const { login, resendVerification } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setServerError] = useState('');
  const [unverifiedEmail, setUnverifiedEmail] = useState(null);
  const [resending, setResending] = useState(false);
  const [resendSuccessMessage, setResendSuccessMessage] = useState('');

  const fromPath = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setUnverifiedEmail(null);
    setResendSuccessMessage('');

    if (!formData.email.trim() || !formData.password) {
      setServerError('Please provide both email and password.');
      return;
    }

    setLoading(true);
    const result = await login({
      email: formData.email.trim().toLowerCase(),
      password: formData.password
    });
    setLoading(false);

    if (result.success) {
      navigate(fromPath, { replace: true });
    } else if (result.unverified) {
      setUnverifiedEmail(result.email || formData.email.trim().toLowerCase());
      setServerError('Please verify your email before signing in.');
    } else {
      setServerError(result.message || 'Invalid email or password.');
    }
  };

  const handleResend = async () => {
    if (!unverifiedEmail || resending) return;

    setResending(true);
    setResendSuccessMessage('');
    const res = await resendVerification(unverifiedEmail);
    setResending(false);

    if (res.success) {
      setResendSuccessMessage('Verification email sent! Please check your inbox.');
    }
  };

  return (
    <div className="min-h-[85vh] py-12 sm:py-16 flex items-center justify-center bg-gradient-to-b from-brand-50/40 via-white to-slate-50">
      <Container size="sm">
        <div className="bg-white rounded-3xl shadow-float border border-slate-200/80 p-6 sm:p-10 transition-all duration-300">
          {/* Header Brand */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white mx-auto mb-3 shadow-md">
              <Compass className="w-6 h-6 stroke-[2.2]" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 tracking-tight">
              Welcome Back
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1.5 font-sans">
              Sign in to manage your journeys, curated destinations, and travel plans.
            </p>
          </div>

          {/* Unverified Email Warning Banner */}
          {unverifiedEmail && (
            <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs sm:text-sm text-amber-900 flex flex-col gap-3 animate-slide-up" role="alert">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-amber-950">
                    Please verify your email before signing in.
                  </p>
                  <p className="text-amber-800 text-xs mt-0.5">
                    We sent an activation link to <strong>{unverifiedEmail}</strong>. You must activate your account before accessing Vista Holidays.
                  </p>
                </div>
              </div>

              {resendSuccessMessage ? (
                <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold pl-7 bg-emerald-50 py-2 px-3 rounded-xl border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{resendSuccessMessage}</span>
                </div>
              ) : (
                <div className="pl-7">
                  <Button
                    type="button"
                    variant="accent"
                    size="xs"
                    loading={resending}
                    onClick={handleResend}
                    iconLeft={RefreshCw}
                    className="font-bold text-slate-950"
                  >
                    Resend Verification Email
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* General Error Banner */}
          {!unverifiedEmail && errorMessage && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs sm:text-sm text-rose-700 flex items-start gap-2.5 animate-slide-up" role="alert">
              <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="login-email" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  placeholder="alex@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full bg-white text-slate-800 text-sm placeholder:text-slate-400 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 shadow-subtle hover:border-slate-300"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="login-password" className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Password
                </label>
              </div>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="w-full bg-white text-slate-800 text-sm placeholder:text-slate-400 border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 shadow-subtle hover:border-slate-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-slate-400 hover:text-slate-600 focus:outline-none"
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
                size="lg"
                loading={loading}
                iconRight={ArrowRight}
                className="w-full justify-center shadow-md font-bold text-sm"
              >
                Sign In
              </Button>
            </div>
          </form>

          {/* Footer Link to Register */}
          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Don't have an account yet?{' '}
              <Link
                to="/users/register"
                className="font-semibold text-brand-600 hover:text-brand-700 hover:underline underline-offset-2 transition-colors"
              >
                Create an Account
              </Link>
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default LoginPage;
