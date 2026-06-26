"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Info, X } from "lucide-react";

type ToastType = "success" | "warning" | "error" | "info";

type Toast = {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
};

const icons: Record<ToastType, React.ElementType> = {
  success: CheckCircle2,
  warning: AlertTriangle,
  error: AlertTriangle,
  info: Info,
};

const colors: Record<ToastType, string> = {
  success: "border-moss/40 bg-moss/10 text-moss",
  warning: "border-amber/40 bg-amber/10 text-amber",
  error: "border-coral/40 bg-coral/10 text-coral",
  info: "border-cyan/40 bg-cyan/10 text-cyan",
};

const autoDismiss: Record<ToastType, number> = {
  success: 4000,
  warning: 6000,
  error: 8000,
  info: 5000,
};

let addToastFn: ((toast: Omit<Toast, "id">) => void) | null = null;

export function notify(toast: Omit<Toast, "id">) {
  addToastFn?.(toast);
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const add = useCallback((toast: Omit<Toast, "id">) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { ...toast, id }]);
  }, []);

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    addToastFn = add;
    return () => { addToastFn = null; };
  }, [add]);

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-72 sm:w-80 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = icons[toast.type];
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 80, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className={`pointer-events-auto rounded-lg border px-4 py-3 backdrop-blur-xl shadow-xl ${colors[toast.type]}`}
            >
              <div className="flex items-start gap-3">
                <Icon size={18} className="mt-0.5 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">{toast.title}</p>
                  {toast.message && <p className="mt-0.5 text-xs opacity-80">{toast.message}</p>}
                </div>
                <button onClick={() => remove(toast.id)} className="shrink-0 opacity-60 hover:opacity-100 transition">
                  <X size={14} />
                </button>
              </div>
              <AutoDismissBar duration={autoDismiss[toast.type]} onDone={() => remove(toast.id)} />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

function AutoDismissBar({ duration, onDone }: { duration: number; onDone: () => void }) {
  const [w, setW] = useState(100);
  useEffect(() => {
    const start = performance.now();
    const id = requestAnimationFrame(function tick(now) {
      const elapsed = now - start;
      const pct = Math.max(0, 100 - (elapsed / duration) * 100);
      setW(pct);
      if (pct > 0) requestAnimationFrame(tick);
      else onDone();
    });
    return () => cancelAnimationFrame(id);
  }, [duration, onDone]);
  return <div className="mt-2 h-0.5 rounded-full bg-white/20 overflow-hidden"><div className="h-full bg-white/40 transition-none" style={{ width: `${w}%` }} /></div>;
}
