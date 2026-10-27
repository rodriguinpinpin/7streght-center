import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useGym } from '../../context/GymContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useGym();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 right-4 sm:bottom-5 sm:right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start justify-between gap-3 p-3.5 rounded-xl border shadow-xl backdrop-blur-md transition-all animate-slide-up ${
              isSuccess
                ? 'bg-[#121A15]/95 border-emerald-500/50 text-emerald-100 shadow-emerald-950/30'
                : isError
                ? 'bg-[#211215]/95 border-rose-500/50 text-rose-100 shadow-rose-950/30'
                : 'bg-[#15151B]/95 border-neutral-700 text-neutral-100 shadow-neutral-950/30'
            }`}
          >
            <div className="flex items-start gap-2.5">
              {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />}
              {isError && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />}
              {!isSuccess && !isError && <Info className="w-4 h-4 text-[#DC1F32] shrink-0 mt-0.5" />}
              <p className="text-xs font-medium leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 text-neutral-400 hover:text-white rounded transition-colors shrink-0"
              aria-label="Cerrar notificación"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
