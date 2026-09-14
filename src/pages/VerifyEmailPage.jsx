import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ArrowRight, 
  Mail, 
  RefreshCw, 
  Sparkles,
  Compass
} from 'lucide-react';
import { authService } from '../services/authService';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/ui/Button';
import { Container } from '../components/layout/Container';

export const VerifyEmailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

  const [status, setStatus] = useState('verifying'); // 'verifying' | 'success' | 'expired' | 'invalid'
  const [errorMessage, setErrorMessage] = useState('');
  const [resendEmail, setResendEmail] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [countdown, setCountdown] = useState(4);

  const canvasRef = useRef(null);
  const redirectTimerRef = useRef(null);
  const countdownIntervalRef = useRef(null);

  // Extract token from URL query string
  const token = new URLSearchParams(location.search).get('token');

  useEffect(() => {
    let isMounted = true;

    if (!token) {
      setStatus('invalid');
      setErrorMessage('No verification token was provided.');
      return;
    }

    const performVerification = async () => {
      try {
        const response = await authService.verifyEmail(token);
        if (!isMounted) return;

        if (response.success) {
          setStatus('success');
          toast.success('Your Vista Holidays account has been successfully verified!', 'Account Activated');
        } else {
          setStatus('invalid');
          setErrorMessage(response.message || 'Invalid verification link.');
        }
      } catch (error) {
        if (!isMounted) return;
        const code = error.code || error.data?.code;

        if (code === 'EXPIRED_TOKEN') {
          setStatus('expired');
          setErrorMessage('This verification link has expired.');
          if (error.email || error.data?.email) {
            setResendEmail(error.email || error.data?.email);
          }
          toast.warning('Verification link expired. Please request a new one.', 'Link Expired');
        } else {
          setStatus('invalid');
          setErrorMessage(error.message || 'Invalid or already used verification link.');
          toast.error(error.message || 'Invalid verification link.', 'Verification Failed');
        }
      }
    };

    performVerification();

    return () => {
      isMounted = false;
      if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, [token, toast]);

  // Tasteful, finite Confetti Celebration for Success state
  useEffect(() => {
    if (status !== 'success') return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let animationFrameId;

    if (!prefersReducedMotion && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const width = (canvas.width = canvas.offsetWidth || 500);
      const height = (canvas.height = canvas.offsetHeight || 350);

      const colors = ['#0e87ea', '#38a3f6', '#f59e0b', '#10b981', '#6366f1', '#ec4899', '#fbbf24'];
      const particles = Array.from({ length: 65 }, () => ({
        x: width / 2 + (Math.random() - 0.5) * 80,
        y: height / 2 + (Math.random() - 0.5) * 40,
        vx: (Math.random() - 0.5) * 8,
        vy: -Math.random() * 8 - 4,
        size: Math.random() * 6 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        opacity: 1,
        shape: Math.random() > 0.5 ? 'rect' : 'circle'
      }));

      const startTime = performance.now();
      const duration = 3500; // 3.5 seconds strictly finite animation

      const render = (now) => {
        const elapsed = now - startTime;
        if (elapsed > duration) {
          ctx.clearRect(0, 0, width, height);
          return;
        }

        ctx.clearRect(0, 0, width, height);
        const progress = elapsed / duration;

        particles.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.22; // gravity
          p.vx *= 0.98; // air drag
          p.rotation += p.rotationSpeed;
          p.opacity = Math.max(0, 1 - progress * 1.2);

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = p.opacity;
          ctx.fillStyle = p.color;

          if (p.shape === 'rect') {
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
          } else {
            ctx.beginPath();
            ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        });

        animationFrameId = requestAnimationFrame(render);
      };

      animationFrameId = requestAnimationFrame(render);
    }

    // Auto-redirect countdown
    countdownIntervalRef.current = setInterval(() => {
      setCountdown((prev) => (prev > 1 ? prev - 1 : 1));
    }, 1000);

    redirectTimerRef.current = setTimeout(() => {
      navigate('/users/login', { replace: true });
    }, 4000);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [status, navigate]);

  const handleResend = async (e) => {
    e.preventDefault();
    if (!resendEmail.trim() || resendLoading) return;

    setResendLoading(true);
    setResendSuccess(false);

    try {
      await authService.resendVerification(resendEmail.trim().toLowerCase());
      setResendSuccess(true);
      toast.success('A new verification email has been sent. Please check your inbox.', 'Email Sent');
    } catch (err) {
      toast.error(err.message || 'Failed to resend verification email.', 'Resend Error');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] py-14 sm:py-20 flex items-center justify-center bg-gradient-to-b from-brand-50/40 via-white to-slate-50">
      <Container size="sm">
        <div className="bg-white rounded-3xl shadow-float border border-slate-200/80 p-8 sm:p-10 text-center relative overflow-hidden transition-all duration-300">
          
          {/* Canvas for Confetti Celebration */}
          {status === 'success' && (
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full pointer-events-none z-10"
            />
          )}

          {/* STATE 1: Verifying in progress */}
          {status === 'verifying' && (
            <div className="py-8 animate-fade-in">
              <div className="w-16 h-16 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600 mx-auto mb-5 shadow-inner">
                <Compass className="w-8 h-8 animate-spin text-brand-600" />
              </div>
              <h1 className="text-2xl font-display font-extrabold text-slate-900 mb-2">
                Verifying Your Account
              </h1>
              <p className="text-sm text-slate-500 max-w-sm mx-auto">
                Please wait while we validate your verification token with Vista Holidays...
              </p>
            </div>
          )}

          {/* STATE 2: Success Activation Experience */}
          {status === 'success' && (
            <div className="py-4 animate-fade-in relative z-20">
              <div className="text-5xl mb-4 animate-bounce-slow" role="img" aria-label="Celebration Party Popper">
                🎉
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-4">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Verified
              </div>

              <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 tracking-tight mb-3">
                Account Activated
              </h1>

              <p className="text-base text-slate-600 max-w-md mx-auto mb-8 leading-relaxed font-sans">
                Your Vista Holidays account has been successfully verified. You are ready to explore destinations and curate memorable journeys.
              </p>

              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 max-w-xs mx-auto mb-6 flex items-center justify-center gap-2 text-xs text-slate-500 font-medium">
                <Clock className="w-4 h-4 text-brand-600" />
                <span>Redirecting to Sign In in <strong>{countdown}</strong> second{countdown === 1 ? '' : 's'}...</span>
              </div>

              <div className="flex justify-center">
                <Link to="/users/login">
                  <Button variant="primary" size="md" iconRight={ArrowRight} className="font-bold shadow-md">
                    Proceed to Sign In Now
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* STATE 3: Expired Token State */}
          {status === 'expired' && (
            <div className="py-4 animate-fade-in">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mx-auto mb-4 shadow-inner">
                <Clock className="w-8 h-8 stroke-[2.2]" />
              </div>

              <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 mb-2">
                Verification Link Expired
              </h1>

              <p className="text-sm text-slate-600 max-w-md mx-auto mb-6">
                Security links expire after 24 hours. Enter your email below to receive a fresh verification link.
              </p>

              {resendSuccess ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-800 flex items-center gap-2 justify-center mb-6">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>A new verification link has been sent! Please check your inbox.</span>
                </div>
              ) : (
                <form onSubmit={handleResend} className="max-w-sm mx-auto mb-6 space-y-3">
                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      placeholder="Enter your account email"
                      value={resendEmail}
                      onChange={(e) => setResendEmail(e.target.value)}
                      required
                      className="w-full bg-white text-slate-800 text-sm placeholder:text-slate-400 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 shadow-subtle"
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    loading={resendLoading}
                    iconLeft={RefreshCw}
                    className="w-full justify-center shadow-md font-bold"
                  >
                    Resend Verification Email
                  </Button>
                </form>
              )}

              <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-4 text-xs text-slate-500">
                <Link to="/users/login" className="text-brand-600 hover:underline font-semibold">
                  Return to Sign In
                </Link>
                <span>•</span>
                <Link to="/users/register" className="text-slate-600 hover:underline">
                  Create New Account
                </Link>
              </div>
            </div>
          )}

          {/* STATE 4: Invalid Token State */}
          {status === 'invalid' && (
            <div className="py-4 animate-fade-in">
              <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mx-auto mb-4 shadow-inner">
                <AlertCircle className="w-8 h-8 stroke-[2.2]" />
              </div>

              <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 mb-2">
                Invalid Verification Link
              </h1>

              <p className="text-sm text-slate-600 max-w-md mx-auto mb-6">
                {errorMessage || 'This verification link is invalid, malformed, or has already been used.'}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link to="/users/login" className="w-full sm:w-auto">
                  <Button variant="primary" size="md" className="w-full justify-center">
                    Go to Sign In
                  </Button>
                </Link>
                <Link to="/users/register" className="w-full sm:w-auto">
                  <Button variant="outline" size="md" className="w-full justify-center">
                    Register New Account
                  </Button>
                </Link>
              </div>
            </div>
          )}

        </div>
      </Container>
    </div>
  );
};

export default VerifyEmailPage;
