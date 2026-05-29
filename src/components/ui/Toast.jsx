import React, { useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppContext } from '../../context/AppContext';
import { CheckCircle2, AlertTriangle, Info, X, AlertCircle } from 'lucide-react';

const Toast = () => {
  const { toasts, removeToast } = useContext(AppContext);

  const icons = {
    success: <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />,
    danger: <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />,
    warning: <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />,
    info: <Info className="h-5 w-5 text-blue-500 shrink-0" />
  };

  const bgColors = {
    success: 'border-emerald-500/20 bg-emerald-50/70 dark:bg-emerald-950/10 dark:border-emerald-500/10 text-emerald-900 dark:text-emerald-300',
    danger: 'border-red-500/20 bg-red-50/70 dark:bg-red-950/10 dark:border-red-500/10 text-red-900 dark:text-red-300',
    warning: 'border-amber-500/20 bg-amber-50/70 dark:bg-amber-950/10 dark:border-amber-500/10 text-amber-900 dark:text-amber-300',
    info: 'border-blue-500/20 bg-blue-50/70 dark:bg-blue-950/10 dark:border-blue-500/10 text-blue-900 dark:text-blue-300'
  };

  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-3 w-full max-w-sm pointer-events-none px-4 sm:px-0">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-xl border backdrop-blur-md shadow-lg ${bgColors[toast.type] || bgColors.info}`}
          >
            <div className="flex items-center gap-3">
              {icons[toast.type] || icons.info}
              <p className="text-sm font-medium leading-tight">
                {toast.message}
              </p>
            </div>
            
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded-md text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer shrink-0"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Toast;
