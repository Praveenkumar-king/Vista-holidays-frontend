import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, FileText, ChevronDown, ChevronUp, Lock } from 'lucide-react';
import { Button } from '../ui/Button';

export const TermsModal = ({ isOpen, onAccept, loading = false }) => {
  const [showFullTerms, setShowFullTerms] = useState(false);
  const modalRef = useRef(null);

  // Prevent Escape key dismissal and trap focus inside modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    // Prevent body scroll while modal is active
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown, true);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in select-none"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="terms-dialog-title"
      aria-describedby="terms-dialog-desc"
    >
      <div
        ref={modalRef}
        className="w-full max-w-lg bg-white rounded-3xl shadow-float border border-slate-200 overflow-hidden animate-scale-in"
      >
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-brand-600 to-brand-800 p-6 text-white text-center relative">
          <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl mx-auto flex items-center justify-center mb-3 shadow-inner">
            <ShieldCheck className="w-7 h-7 text-white" />
          </div>
          <h2 id="terms-dialog-title" className="text-xl font-display font-extrabold tracking-tight">
            Please Accept Our Terms & Conditions
          </h2>
          <p className="text-xs text-brand-100 mt-1 font-sans">
            Mandatory account policy acknowledgment for Vista Holidays travelers
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4 text-slate-600 text-sm font-sans">
          <div id="terms-dialog-desc" className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-xs text-slate-700 leading-relaxed">
            <p className="font-semibold text-slate-900 mb-1 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-brand-600" />
              Welcome to Vista Holidays!
            </p>
            Before you start discovering destinations, saving custom itineraries, and using our AI travel recommendations, please review and accept our platform usage standards and privacy policies.
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 text-sm mb-1.5 font-display">Key Highlights:</h4>
            <ul className="list-disc list-inside space-y-1 text-xs text-slate-600">
              <li>Your account credentials and travel bookings are encrypted and protected.</li>
              <li>AI-generated itineraries are curated advisory recommendations for travel planning.</li>
              <li>You agree to use Vista Holidays services in compliance with international travel laws.</li>
              <li>We respect your privacy and never sell your personal data to third parties.</li>
            </ul>
          </div>

          {/* Expandable "Read our Full Terms" section */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden transition-all">
            <button
              type="button"
              onClick={() => setShowFullTerms(!showFullTerms)}
              className="w-full flex items-center justify-between p-3.5 bg-slate-50/80 hover:bg-slate-100 text-xs font-semibold text-brand-700 transition-colors"
              aria-expanded={showFullTerms}
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand-600" />
                <span>Read our Full Terms</span>
              </div>
              {showFullTerms ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showFullTerms && (
              <div className="p-4 bg-white border-t border-slate-200 text-xs text-slate-500 space-y-2 max-h-48 overflow-y-auto leading-relaxed">
                <p>
                  <strong>1. Acceptance of Terms:</strong> By clicking "Accepted", you agree to abide by these Vista Holidays Terms of Service and our Privacy Policy.
                </p>
                <p>
                  <strong>2. Account Security:</strong> You are responsible for maintaining the confidentiality of your account credentials and any travel itineraries created under your account.
                </p>
                <p>
                  <strong>3. Travel Services & AI Advisory:</strong> Destination weather data, interactive maps, and AI itineraries are provided for informational travel guidance. Actual travel conditions and schedules should be confirmed with official carriers.
                </p>
                <p>
                  <strong>4. Policy Updates:</strong> Vista Holidays reserves the right to periodically update service features and travel community guidelines.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Action Footer (No Dismissal, Only Accepted Button) */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col gap-3">
          <Button
            type="button"
            variant="primary"
            size="lg"
            onClick={onAccept}
            loading={loading}
            className="w-full justify-center shadow-md font-bold text-sm"
          >
            Accepted
          </Button>
          <p className="text-[11px] text-center text-slate-400">
            By clicking Accepted, you confirm that you have reviewed and agree to the Vista Holidays terms.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;
