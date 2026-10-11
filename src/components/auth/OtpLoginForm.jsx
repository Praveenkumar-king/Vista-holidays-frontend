import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Mail, 
  ArrowRight, 
  AlertCircle, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  Loader2, 
  Edit2 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';

export const OtpLoginForm = ({ targetDestination = '/user/dashboard', initialEmail = '' }) => {
  const { sendLoginOtp, loginWithOtp, resendVerification } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState(initialEmail);
  const [step, setStep] = useState('request'); // 'request' | 'verify'
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [countdown, setCountdown] = useState(45);
  const [errorMessage, setErrorMessage] = useState('');
  const [unverifiedEmail, setUnverifiedEmail] = useState(null);
  const [resendingVerification, setResendingVerification] = useState(false);
  const [resendVerificationSuccess, setResendVerificationSuccess] = useState('');

  const inputRefs = useRef([]);
  const timerRef = useRef(null);
  const isVerifyingRef = useRef(false);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  // Countdown timer manager
  const startCountdown = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setCountdown(45);
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const formatCountdown = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Email format validation
  const validateEmail = (candidateEmail) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(candidateEmail.trim().toLowerCase());
  };

  // Handle Send OTP
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    setErrorMessage('');
    setUnverifiedEmail(null);
    setResendVerificationSuccess('');

    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setSendingOtp(true);
    const result = await sendLoginOtp(trimmedEmail);
    setSendingOtp(false);

    if (result.success) {
      setStep('verify');
      setOtp(['', '', '', '', '', '']);
      isVerifyingRef.current = false;
      startCountdown();
      // Focus first OTP input
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    } else if (result.unverified) {
      setUnverifiedEmail(result.email || trimmedEmail);
      setErrorMessage('Please verify your email before signing in.');
    } else {
      setErrorMessage(result.message || 'Failed to send OTP. Please try again.');
    }
  };

  // Handle Resend OTP
  const handleResendOtp = async () => {
    if (countdown > 0 || sendingOtp || verifying) return;
    setErrorMessage('');
    setSendingOtp(true);

    const result = await sendLoginOtp(email.trim().toLowerCase());
    setSendingOtp(false);

    if (result.success) {
      setOtp(['', '', '', '', '', '']);
      isVerifyingRef.current = false;
      startCountdown();
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    } else {
      setErrorMessage(result.message || 'Failed to resend OTP. Please try again.');
    }
  };

  // Handle unverified email resend activation link
  const handleResendActivation = async () => {
    if (!unverifiedEmail || resendingVerification) return;
    setResendingVerification(true);
    setResendVerificationSuccess('');
    const res = await resendVerification(unverifiedEmail);
    setResendingVerification(false);
    if (res.success) {
      setResendVerificationSuccess('Verification email sent! Please check your inbox.');
    }
  };

  // Automatic Verification when all 6 digits are provided
  const triggerAutomaticVerification = async (codeArray) => {
    const fullCode = codeArray.join('');
    if (fullCode.length !== 6 || isVerifyingRef.current) {
      return;
    }

    isVerifyingRef.current = true;
    setVerifying(true);
    setErrorMessage('');

    const result = await loginWithOtp({
      email: email.trim().toLowerCase(),
      otp: fullCode
    });

    if (result.success) {
      // Successfully authenticated! Redirect to target dashboard
      navigate(targetDestination, { replace: true });
    } else {
      isVerifyingRef.current = false;
      setVerifying(false);
      setErrorMessage(result.message || 'Incorrect or expired OTP.');
      
      if (result.unverified) {
        setUnverifiedEmail(result.email || email.trim().toLowerCase());
      }

      // Reset digits & refocus first input for convenient retry
      setOtp(['', '', '', '', '', '']);
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 50);
    }
  };

  // OTP Box Change handler
  const handleDigitChange = (index, e) => {
    const val = e.target.value;
    // Extract numeric characters
    const numericChar = val.replace(/\D/g, '').slice(-1);

    const newOtp = [...otp];
    newOtp[index] = numericChar;
    setOtp(newOtp);

    // If entered a digit, move focus to next box
    if (numericChar && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // If all 6 digits are filled, automatically verify immediately!
    if (newOtp.every((digit) => digit !== '')) {
      triggerAutomaticVerification(newOtp);
    }
  };

  // OTP Box Key Down handler (backspace and arrow navigation)
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        // Move back and clear previous
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
        e.preventDefault();
      } else if (otp[index]) {
        // Clear current
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
        e.preventDefault();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
      e.preventDefault();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
      e.preventDefault();
    }
  };

  // OTP Box Paste handler (paste entire 6-digit code)
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const digitsOnly = pastedData.replace(/\D/g, '').slice(0, 6);

    if (!digitsOnly) return;

    const newOtp = ['', '', '', '', '', ''];
    for (let i = 0; i < digitsOnly.length; i++) {
      newOtp[i] = digitsOnly[i];
    }
    setOtp(newOtp);

    if (digitsOnly.length === 6) {
      inputRefs.current[5]?.focus();
      triggerAutomaticVerification(newOtp);
    } else if (digitsOnly.length < 6) {
      inputRefs.current[digitsOnly.length]?.focus();
    }
  };

  // Allow user to change email during verification step
  const handleChangeEmail = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setStep('request');
    setOtp(['', '', '', '', '', '']);
    isVerifyingRef.current = false;
    setErrorMessage('');
    setUnverifiedEmail(null);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Unverified Email Warning Banner */}
      {unverifiedEmail && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs sm:text-sm text-amber-900 flex flex-col gap-3 animate-slide-up" role="alert">
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

          {resendVerificationSuccess ? (
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold pl-7 bg-emerald-50 py-2 px-3 rounded-xl border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{resendVerificationSuccess}</span>
            </div>
          ) : (
            <div className="pl-7">
              <Button
                type="button"
                variant="accent"
                size="xs"
                loading={resendingVerification}
                onClick={handleResendActivation}
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
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs sm:text-sm text-rose-700 flex items-start gap-2.5 animate-slide-up" role="alert">
          <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {step === 'request' ? (
        /* STEP 1: BEFORE SENDING OTP */
        <form onSubmit={handleSendOtp} noValidate className="space-y-4">
          <div>
            <label htmlFor="otp-email-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Email Address
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="otp-email-input"
                type="email"
                autoComplete="email"
                placeholder="alex@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={sendingOtp}
                required
                className="w-full bg-white text-slate-800 text-sm placeholder:text-slate-400 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 shadow-subtle hover:border-slate-300 disabled:opacity-60"
              />
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={sendingOtp}
              iconRight={ArrowRight}
              className="w-full justify-center shadow-md font-bold text-sm bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600"
            >
              Send OTP
            </Button>
          </div>
        </form>
      ) : (
        /* STEP 2: AFTER SENDING OTP (VERIFICATION INTERFACE) */
        <div className="space-y-4 animate-fade-in">
          {/* Email Display Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                Email Address
              </label>
              <button
                type="button"
                onClick={handleChangeEmail}
                disabled={verifying}
                className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 hover:underline transition-colors disabled:opacity-50"
              >
                <Edit2 className="w-3 h-3" />
                Change Email
              </button>
            </div>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                value={email}
                readOnly
                className="w-full bg-slate-50 text-slate-700 text-sm border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 cursor-not-allowed select-none shadow-subtle"
              />
            </div>
          </div>

          {/* Resend OTP Button / Countdown Controller */}
          <div>
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={countdown > 0 || sendingOtp || verifying}
              className={`w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 border shadow-subtle ${
                countdown > 0
                  ? 'bg-slate-100/90 text-slate-500 border-slate-200 cursor-not-allowed'
                  : 'bg-white text-brand-600 hover:bg-brand-50 border-brand-200 hover:border-brand-300 active:scale-[0.99] cursor-pointer'
              }`}
            >
              {sendingOtp ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-brand-600" />
                  <span>Sending fresh OTP...</span>
                </>
              ) : countdown > 0 ? (
                <>
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>Resend OTP ({formatCountdown(countdown)})</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 text-brand-600" />
                  <span>Resend OTP</span>
                </>
              )}
            </button>
          </div>

          {/* Dynamic Confirmation Message */}
          <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-brand-800 bg-brand-50/70 border border-brand-200/70 rounded-xl py-2 px-3 text-center">
            <Mail className="w-4 h-4 text-brand-600 flex-shrink-0" />
            <span>
              OTP sent to <strong className="font-semibold text-brand-950">{email}</strong>
            </span>
          </div>

          {/* Six Individual OTP Input Boxes */}
          <div>
            <div className="flex justify-between items-center gap-1.5 sm:gap-2.5 py-2">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => (inputRefs.current[idx] = el)}
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  disabled={verifying}
                  onChange={(e) => handleDigitChange(idx, e)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  onPaste={handlePaste}
                  aria-label={`OTP Digit ${idx + 1} of 6`}
                  className={`w-11 h-14 sm:w-12 sm:h-16 text-center text-xl sm:text-2xl font-bold font-mono rounded-xl sm:rounded-2xl border transition-all duration-150 focus:outline-none ${
                    digit
                      ? 'border-brand-500 bg-brand-50/40 text-brand-950 shadow-subtle ring-1 ring-brand-500/20'
                      : 'border-slate-200 bg-white text-slate-800'
                  } focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20 shadow-subtle hover:border-slate-300 disabled:opacity-60 disabled:cursor-not-allowed`}
                />
              ))}
            </div>

            {/* Verifying Spinner Indicator */}
            {verifying ? (
              <div className="flex items-center justify-center gap-2 text-xs font-semibold text-brand-600 pt-2 animate-pulse">
                <Loader2 className="w-4 h-4 animate-spin text-brand-600" />
                <span>Verifying code & logging you in...</span>
              </div>
            ) : (
              <p className="text-[11px] sm:text-xs text-slate-500 text-center pt-1 font-sans">
                Automatic verification: you will be signed in instantly once all 6 digits are entered.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OtpLoginForm;
