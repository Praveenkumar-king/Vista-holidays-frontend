import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  User as UserIcon, 
  Mail, 
  Lock, 
  Phone, 
  Check, 
  X, 
  ArrowRight, 
  Compass, 
  Eye, 
  EyeOff,
  CheckCircle2,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Container } from '../components/layout/Container';

export const RegisterPage = () => {
  const { register, resendVerification } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    mobile: '',
    termsAccepted: false
  });

  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [duplicateUnverifiedEmail, setDuplicateUnverifiedEmail] = useState(null);
  const [resendingEmail, setResendingEmail] = useState(false);
  const [serverError, setServerError] = useState('');
  const [registeredSuccess, setRegisteredSuccess] = useState(false);

  // Field validation rules
  const validation = useMemo(() => {
    const trimmedName = formData.name.trim();
    const nameValid = trimmedName.length >= 2;
    const nameError = !nameValid && touched.name ? 'Name must be at least 2 characters' : '';

    const normalizedEmail = formData.email.trim().toLowerCase();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const emailValid = emailRegex.test(normalizedEmail);
    const emailError = !emailValid && touched.email ? 'Please enter a valid email address' : '';

    // Password criteria
    const pw = formData.password;
    const pwRules = {
      length: pw.length >= 8,
      upper: /[A-Z]/.test(pw),
      lower: /[a-z]/.test(pw),
      number: /[0-9]/.test(pw),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pw)
    };
    const passwordValid = Object.values(pwRules).every(Boolean);
    const passwordError = !passwordValid && touched.password ? 'Please satisfy all password security requirements' : '';

    // Mobile criteria (international or standard 7-15 digits)
    const mobileDigits = formData.mobile.replace(/\D/g, '');
    const mobileValid = mobileDigits.length >= 7 && mobileDigits.length <= 15;
    const mobileError = !mobileValid && touched.mobile ? 'Please enter a valid mobile number (7-15 digits)' : '';

    const termsValid = formData.termsAccepted === true;
    const termsError = !termsValid && touched.termsAccepted ? 'You must accept the Terms & Conditions' : '';

    const isFormValid = nameValid && emailValid && passwordValid && mobileValid && termsValid;

    return {
      nameValid,
      nameError,
      emailValid,
      emailError,
      passwordValid,
      passwordError,
      pwRules,
      mobileValid,
      mobileError,
      termsValid,
      termsError,
      isFormValid
    };
  }, [formData, touched]);

  const handleChange = (field, value) => {
    setServerError('');
    setDuplicateUnverifiedEmail(null);
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({
      name: true,
      email: true,
      password: true,
      mobile: true,
      termsAccepted: true
    });

    if (!validation.isFormValid || loading) return;

    setLoading(true);
    setServerError('');
    setDuplicateUnverifiedEmail(null);

    const result = await register({
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      mobile: formData.mobile.trim(),
      termsAccepted: formData.termsAccepted
    });

    setLoading(false);

    if (result.success) {
      setRegisteredSuccess(true);
    } else if (result.unverified) {
      setDuplicateUnverifiedEmail(result.email || formData.email.trim());
    } else {
      setServerError(result.message || 'Registration failed.');
    }
  };

  const handleResendFromDuplicate = async () => {
    if (!duplicateUnverifiedEmail || resendingEmail) return;
    setResendingEmail(true);
    await resendVerification(duplicateUnverifiedEmail);
    setResendingEmail(false);
  };

  // View: Success state awaiting email verification
  if (registeredSuccess) {
    return (
      <div className="min-h-[85vh] py-16 flex items-center justify-center bg-gradient-to-b from-brand-50/40 via-white to-slate-50">
        <Container size="sm">
          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-float border border-slate-200/80 text-center animate-fade-in">
            <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600 mx-auto mb-5 shadow-inner">
              <Mail className="w-8 h-8 stroke-[2.2]" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 tracking-tight mb-2">
              Verification Email Sent!
            </h1>

            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              We have sent an activation link to{' '}
              <strong className="text-slate-900 font-semibold">{formData.email.trim().toLowerCase()}</strong>.
              Please check your inbox and click <strong className="text-brand-600 font-semibold">"Verify My Email"</strong> to activate your Vista Holidays account.
            </p>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-800 text-left mb-6 space-y-1">
              <p className="font-semibold flex items-center gap-1.5 text-amber-900">
                <AlertCircle className="w-4 h-4 text-amber-600" /> Note for verification:
              </p>
              <p>The verification link will expire in 24 hours. Check your spam/junk folder if you do not see it in a few minutes.</p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                variant="outline"
                size="md"
                onClick={() => resendVerification(formData.email.trim().toLowerCase())}
                iconLeft={RefreshCw}
                className="w-full sm:w-auto"
              >
                Resend Verification Email
              </Button>

              <Link to="/users/login" className="w-full sm:w-auto">
                <Button variant="primary" size="md" className="w-full justify-center">
                  Go to Sign In
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-[90vh] py-12 sm:py-16 flex items-center justify-center bg-gradient-to-b from-brand-50/40 via-white to-slate-50">
      <Container size="sm">
        <div className="bg-white rounded-3xl shadow-float border border-slate-200/80 p-6 sm:p-10 transition-all duration-300">
          {/* Header Brand */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white mx-auto mb-3 shadow-md">
              <Compass className="w-6 h-6 stroke-[2.2]" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 tracking-tight">
              Create an Account
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1.5 font-sans">
              Join Vista Holidays to unlock personalized itineraries, destination insights, and live weather.
            </p>
          </div>

          {/* General Server Error Banner */}
          {serverError && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs sm:text-sm text-rose-700 flex items-start gap-2.5 animate-slide-up" role="alert">
              <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
              <span>{serverError}</span>
            </div>
          )}

          {/* Unverified Account Already Exists Banner */}
          {duplicateUnverifiedEmail && (
            <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs sm:text-sm text-amber-900 flex flex-col gap-2.5 animate-slide-up" role="alert">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p>
                  An unverified account with <strong>{duplicateUnverifiedEmail}</strong> already exists.
                </p>
              </div>
              <div className="pl-7">
                <Button
                  type="button"
                  variant="accent"
                  size="xs"
                  loading={resendingEmail}
                  onClick={handleResendFromDuplicate}
                  iconLeft={RefreshCw}
                >
                  Resend Verification Link
                </Button>
              </div>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* 1. Name */}
            <div>
              <label htmlFor="register-name" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                  <UserIcon className="w-4 h-4" />
                </div>
                <input
                  id="register-name"
                  type="text"
                  placeholder="e.g. Alex Morgan"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  onBlur={() => handleBlur('name')}
                  required
                  className={`w-full bg-white text-slate-800 text-sm placeholder:text-slate-400 border rounded-xl pl-10 pr-3.5 py-2.5 transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/20 shadow-subtle ${
                    validation.nameError
                      ? 'border-rose-300 focus:border-rose-500'
                      : touched.name && validation.nameValid
                      ? 'border-emerald-300 focus:border-emerald-500'
                      : 'border-slate-200 focus:border-brand-500 hover:border-slate-300'
                  }`}
                />
              </div>
              {validation.nameError && (
                <p className="mt-1 text-xs text-rose-600 font-medium" role="alert">
                  {validation.nameError}
                </p>
              )}
            </div>

            {/* 2. Email */}
            <div>
              <label htmlFor="register-email" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="register-email"
                  type="email"
                  autoComplete="email"
                  placeholder="alex@example.com"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  onBlur={() => handleBlur('email')}
                  required
                  className={`w-full bg-white text-slate-800 text-sm placeholder:text-slate-400 border rounded-xl pl-10 pr-3.5 py-2.5 transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/20 shadow-subtle ${
                    validation.emailError
                      ? 'border-rose-300 focus:border-rose-500'
                      : touched.email && validation.emailValid
                      ? 'border-emerald-300 focus:border-emerald-500'
                      : 'border-slate-200 focus:border-brand-500 hover:border-slate-300'
                  }`}
                />
              </div>
              {validation.emailError && (
                <p className="mt-1 text-xs text-rose-600 font-medium" role="alert">
                  {validation.emailError}
                </p>
              )}
            </div>

            {/* 3. Mobile */}
            <div>
              <label htmlFor="register-mobile" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Mobile Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  id="register-mobile"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={formData.mobile}
                  onChange={(e) => handleChange('mobile', e.target.value)}
                  onBlur={() => handleBlur('mobile')}
                  required
                  className={`w-full bg-white text-slate-800 text-sm placeholder:text-slate-400 border rounded-xl pl-10 pr-3.5 py-2.5 transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/20 shadow-subtle ${
                    validation.mobileError
                      ? 'border-rose-300 focus:border-rose-500'
                      : touched.mobile && validation.mobileValid
                      ? 'border-emerald-300 focus:border-emerald-500'
                      : 'border-slate-200 focus:border-brand-500 hover:border-slate-300'
                  }`}
                />
              </div>
              {validation.mobileError && (
                <p className="mt-1 text-xs text-rose-600 font-medium" role="alert">
                  {validation.mobileError}
                </p>
              )}
            </div>

            {/* 4. Password */}
            <div>
              <label htmlFor="register-password" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="register-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  onBlur={() => handleBlur('password')}
                  required
                  className={`w-full bg-white text-slate-800 text-sm placeholder:text-slate-400 border rounded-xl pl-10 pr-10 py-2.5 transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/20 shadow-subtle ${
                    validation.passwordError
                      ? 'border-rose-300 focus:border-rose-500'
                      : touched.password && validation.passwordValid
                      ? 'border-emerald-300 focus:border-emerald-500'
                      : 'border-slate-200 focus:border-brand-500 hover:border-slate-300'
                  }`}
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

              {/* Password criteria checklist feedback */}
              <div className="mt-2.5 p-3 bg-slate-50/80 rounded-xl border border-slate-100 text-[11px] space-y-1">
                <p className="font-semibold text-slate-600 mb-1">Password must contain:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-slate-500">
                  <span className={`flex items-center gap-1.5 ${validation.pwRules.length ? 'text-emerald-600 font-medium' : ''}`}>
                    {validation.pwRules.length ? <Check className="w-3 h-3" /> : <X className="w-3 h-3 text-slate-300" />}
                    At least 8 characters
                  </span>
                  <span className={`flex items-center gap-1.5 ${validation.pwRules.upper ? 'text-emerald-600 font-medium' : ''}`}>
                    {validation.pwRules.upper ? <Check className="w-3 h-3" /> : <X className="w-3 h-3 text-slate-300" />}
                    1 uppercase letter (A-Z)
                  </span>
                  <span className={`flex items-center gap-1.5 ${validation.pwRules.lower ? 'text-emerald-600 font-medium' : ''}`}>
                    {validation.pwRules.lower ? <Check className="w-3 h-3" /> : <X className="w-3 h-3 text-slate-300" />}
                    1 lowercase letter (a-z)
                  </span>
                  <span className={`flex items-center gap-1.5 ${validation.pwRules.number ? 'text-emerald-600 font-medium' : ''}`}>
                    {validation.pwRules.number ? <Check className="w-3 h-3" /> : <X className="w-3 h-3 text-slate-300" />}
                    1 number (0-9)
                  </span>
                  <span className={`flex items-center gap-1.5 ${validation.pwRules.special ? 'text-emerald-600 font-medium' : ''}`}>
                    {validation.pwRules.special ? <Check className="w-3 h-3" /> : <X className="w-3 h-3 text-slate-300" />}
                    1 special character (!@#$)
                  </span>
                </div>
              </div>
            </div>

            {/* 5. Terms and Conditions Checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.termsAccepted}
                  onChange={(e) => handleChange('termsAccepted', e.target.checked)}
                  onBlur={() => handleBlur('termsAccepted')}
                  className="mt-1 w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-slate-300 cursor-pointer"
                />
                <span className="text-xs text-slate-600 leading-normal">
                  I agree to the Vista Holidays{' '}
                  <a
                    href="/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-600 hover:text-brand-700 font-semibold underline underline-offset-2"
                  >
                    Terms &amp; Conditions
                  </a>{' '}
                  and{' '}
                  <a
                    href="/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-600 hover:text-brand-700 font-semibold underline underline-offset-2"
                  >
                    Privacy Policy
                  </a>
                  . <span className="text-rose-500">*</span>
                </span>
              </label>
              {validation.termsError && (
                <p className="mt-1 text-xs text-rose-600 font-medium pl-6" role="alert">
                  {validation.termsError}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-3">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                disabled={!validation.isFormValid || loading}
                iconRight={ArrowRight}
                className="w-full justify-center shadow-md font-bold text-sm"
              >
                Sign Up
              </Button>
            </div>
          </form>

          {/* Footer Link to Login */}
          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Already have an account?{' '}
              <Link
                to="/users/login"
                className="font-semibold text-brand-600 hover:text-brand-700 hover:underline underline-offset-2 transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default RegisterPage;
