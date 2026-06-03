"use client";

import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from "lucide-react";
import { useToastStore, type Toast } from "@/stores/toast-store";
import { cn } from "@/lib/utils";

const typeStyles = {
  success: {
    bg: "bg-white/80 dark:bg-grey-900/80 border-success-500/30",
    text: "text-grey-900 dark:text-grey-50",
    icon: CheckCircle,
    iconColor: "text-success-500",
  },
  error: {
    bg: "bg-white/80 dark:bg-grey-900/80 border-error-500/30",
    text: "text-grey-900 dark:text-grey-50",
    icon: AlertCircle,
    iconColor: "text-error-500",
  },
  warning: {
    bg: "bg-white/80 dark:bg-grey-900/80 border-warning-500/30",
    text: "text-grey-900 dark:text-grey-50",
    icon: AlertTriangle,
    iconColor: "text-warning-500",
  },
  info: {
    bg: "bg-white/80 dark:bg-grey-900/80 border-primary-500/30",
    text: "text-grey-900 dark:text-grey-50",
    icon: Info,
    iconColor: "text-primary-500",
  },
};

function ToastItem({ toast }: { toast: Toast }) {
  const dismissToast = useToastStore((s) => s.dismissToast);
  const styles = typeStyles[toast.type];
  const Icon = styles.icon;

  return (
    <div
      role="alert"
      className={cn(
        "pointer-events-auto flex w-full max-w-md items-start gap-3.5 rounded-xl border p-4 shadow-lg backdrop-blur-md transition-all duration-300",
        "animate-in fade-in slide-in-from-right-10",
        styles.bg,
      )}
    >
      <span className="flex shrink-0 pt-0.5">
        <Icon className={cn("size-5", styles.iconColor)} strokeWidth={2} />
      </span>

      <div className="flex-1 min-w-0">
        <p className={cn("text-[14px] font-medium leading-normal", styles.text)}>
          {toast.message}
        </p>
      </div>

      <button
        type="button"
        onClick={() => dismissToast(toast.id)}
        className="shrink-0 rounded-lg p-0.5 text-grey-400 hover:bg-grey-100 dark:hover:bg-grey-800 hover:text-grey-700 dark:hover:text-grey-200 transition-colors"
        aria-label="Dismiss toast"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}

export function ToastProvider() {
  const toasts = useToastStore((s) => s.toasts);

  return (
    <div
      aria-live="assertive"
      aria-relevant="additions"
      className="fixed top-4 right-4 z-[9999] flex w-full max-w-sm flex-col gap-3 px-4 pointer-events-none sm:top-6 sm:right-6"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}
