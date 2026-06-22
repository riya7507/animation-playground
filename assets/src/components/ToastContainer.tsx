import React, { useEffect } from 'react';
import { Snowflake, Sparkles, RotateCcw, Info, X } from 'lucide-react';
import { ToastMessage } from '../types';

interface ToastContainerProps {
  toasts: ToastMessage[];
  onCloseToast: (id: string) => void;
}

export default function ToastContainer({ toasts, onCloseToast }: ToastContainerProps) {
  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 w-full max-w-sm px-4 sm:px-0 pointer-events-none"
      role="region"
      aria-live="polite"
      aria-label="Notification alerts"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => onCloseToast(toast.id)} />
      ))}
    </div>
  );
}

interface ToastItemProps {
  key?: string;
  toast: ToastMessage;
  onClose: () => void;
}

function ToastItem({ toast, onClose }: ToastItemProps) {
  // Automatically trigger close after 4 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const getToastStyles = () => {
    switch (toast.type) {
      case 'start':
        return {
          bg: 'bg-white/95 border-sky-100 text-slate-800 shadow-xl',
          icon: <Snowflake className="h-5 w-5 text-sky-500 animate-spin-slow" />,
          title: 'Snowfall Initiated',
          progressBarBg: 'bg-sky-400',
        };
      case 'info':
        return {
          bg: 'bg-white/95 border-fuchsia-100 text-slate-800 shadow-xl',
          icon: <Sparkles className="h-5 w-5 text-fuchsia-500 animate-pulse" />,
          title: 'Balloons Launched',
          progressBarBg: 'bg-fuchsia-400',
        };
      case 'confetti':
        return {
          bg: 'bg-white/95 border-rose-100 text-slate-800 shadow-xl',
          icon: <Sparkles className="h-5 w-5 text-rose-500 animate-pulse" />,
          title: 'Confetti Released',
          progressBarBg: 'bg-rose-400',
        };
      case 'end':
        return {
          bg: 'bg-white/95 border-emerald-100 text-slate-800 shadow-xl',
          icon: <Info className="h-5 w-5 text-emerald-500" />,
          title: 'Animation Completed',
          progressBarBg: 'bg-emerald-400',
        };
      case 'reset':
        return {
          bg: 'bg-white/95 border-slate-200 text-slate-800 shadow-xl',
          icon: <RotateCcw className="h-5 w-5 text-slate-500" />,
          title: 'Playground Cleared',
          progressBarBg: 'bg-slate-400',
        };
    }
  };

  const config = getToastStyles();

  return (
    <div
      className={`pointer-events-auto flex flex-col overflow-hidden rounded-xl border backdrop-blur-md shadow-2xl transition-all duration-300 ease-out translate-y-0 opacity-100 animate-in fade-in slide-in-from-bottom-5 ${config.bg}`}
      id={`toast-${toast.id}`}
      role="alert"
    >
      <div className="flex items-start gap-3 p-4">
        <div className="flex-shrink-0 mt-0.5">{config.icon}</div>
        <div className="flex-1 min-w-0">
          <p className="font-display font-semibold text-sm text-slate-800 leading-5">{config.title}</p>
          <p className="mt-1 text-xs text-slate-500 leading-normal">{toast.message}</p>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 ml-4 rounded-lg p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          aria-label="Dismiss notification"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      {/* Visual countdown progress bar */}
      <div className="h-1 w-full bg-slate-100">
        <div
          className={`h-full ${config.progressBarBg} transition-all duration-[4000ms] ease-linear`}
          style={{
            animation: 'shrinkWidth 4000ms linear forwards',
          }}
        />
      </div>
      <style>{`
        @keyframes shrinkWidth {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
}
