import React, { createContext, useContext, useState, useCallback, useMemo, useRef } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const lastToastRef = useRef({ key: '', time: 0 });

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(({ type = 'info', title = '', message = '', duration = 4500 }) => {
    const toastKey = `${type}::${title}::${message}`;
    const now = Date.now();

    // Prevent identical toasts from flooding within 1500ms
    if (lastToastRef.current.key === toastKey && (now - lastToastRef.current.time) < 1500) {
      return null;
    }
    lastToastRef.current = { key: toastKey, time: now };

    const id = Date.now().toString() + Math.random().toString(36).substring(2, 7);

    setToasts((prev) => [...prev, { id, type, title, message }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, [removeToast]);

  const toast = useMemo(() => ({
    success: (message, title = 'Success') => addToast({ type: 'success', title, message }),
    error: (message, title = 'Error') => addToast({ type: 'error', title, message }),
    warning: (message, title = 'Notice') => addToast({ type: 'warning', title, message }),
    info: (message, title = 'Info') => addToast({ type: 'info', title, message }),
    dismiss: removeToast
  }), [addToast, removeToast]);

  const contextValue = useMemo(() => ({
    toast,
    addToast,
    removeToast
  }), [toast, addToast, removeToast]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  );
};

const ToastContainer = ({ toasts, onDismiss }) => {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div
      className="fixed top-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
      role="region"
      aria-label="Notifications"
    >
      {toasts.map((item) => (
        <ToastItem key={item.id} item={item} onDismiss={() => onDismiss(item.id)} />
      ))}
    </div>
  );
};

const toastConfig = {
  success: {
    icon: CheckCircle2,
    badgeBg: 'bg-emerald-500/10 text-emerald-600',
    borderColor: 'border-emerald-200',
    iconColor: 'text-emerald-500'
  },
  error: {
    icon: AlertCircle,
    badgeBg: 'bg-rose-500/10 text-rose-600',
    borderColor: 'border-rose-200',
    iconColor: 'text-rose-500'
  },
  warning: {
    icon: AlertTriangle,
    badgeBg: 'bg-amber-500/10 text-amber-600',
    borderColor: 'border-amber-200',
    iconColor: 'text-amber-500'
  },
  info: {
    icon: Info,
    badgeBg: 'bg-brand-500/10 text-brand-600',
    borderColor: 'border-brand-200',
    iconColor: 'text-brand-500'
  }
};

const ToastItem = ({ item, onDismiss }) => {
  const config = toastConfig[item.type] || toastConfig.info;
  const Icon = config.icon;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`pointer-events-auto bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-float border ${config.borderColor} flex items-start gap-3 transition-all duration-300 animate-slide-up hover:shadow-card-hover`}
    >
      <div className={`p-2 rounded-xl flex-shrink-0 ${config.badgeBg}`}>
        <Icon className={`w-5 h-5 ${config.iconColor}`} />
      </div>

      <div className="flex-1 min-w-0 pt-0.5">
        {item.title && (
          <h4 className="text-sm font-semibold text-slate-900 leading-none mb-1 font-display">
            {item.title}
          </h4>
        )}
        <p className="text-xs text-slate-600 leading-relaxed font-sans">
          {item.message}
        </p>
      </div>

      <button
        type="button"
        onClick={onDismiss}
        className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors flex-shrink-0"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context.toast;
};

export default ToastContext;
