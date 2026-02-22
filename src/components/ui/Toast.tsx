"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils/format";

export type ToastVariant = "success" | "error" | "info";

type ToastProps = {
  id: string;
  message: string;
  variant: ToastVariant;
  onDismiss: (id: string) => void;
};

const variantStyles: Record<
  ToastVariant,
  { bg: string; border: string; icon: React.ReactNode }
> = {
  success: {
    bg: "bg-green-900/90",
    border: "border-green-500/50",
    icon: <CheckCircle className="h-5 w-5 text-green-400 shrink-0" />,
  },
  error: {
    bg: "bg-red-900/90",
    border: "border-red-500/50",
    icon: <XCircle className="h-5 w-5 text-red-400 shrink-0" />,
  },
  info: {
    bg: "bg-blue-900/90",
    border: "border-blue-500/50",
    icon: <Info className="h-5 w-5 text-blue-400 shrink-0" />,
  },
};

export function Toast({ id, message, variant, onDismiss }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    const enterTimer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(enterTimer);
  }, []);

  useEffect(() => {
    const dismissTimer = setTimeout(() => {
      setIsLeaving(true);
      setTimeout(() => onDismiss(id), 300);
    }, 4000);

    return () => clearTimeout(dismissTimer);
  }, [id, onDismiss]);

  const handleDismiss = () => {
    setIsLeaving(true);
    setTimeout(() => onDismiss(id), 300);
  };

  const style = variantStyles[variant];

  return (
    <div
      className={cn(
        "pointer-events-auto flex items-center gap-3 min-w-[320px] max-w-[420px] px-4 py-3 rounded-lg border shadow-lg backdrop-blur-sm transition-all duration-300",
        style.bg,
        style.border,
        isVisible && !isLeaving
          ? "translate-x-0 opacity-100"
          : "translate-x-full opacity-0"
      )}
      role="alert"
    >
      {style.icon}
      <p className="text-sm text-charcoal-100 flex-1">{message}</p>
      <button
        onClick={handleDismiss}
        className="shrink-0 text-charcoal-300 hover:text-charcoal-100 transition-colors"
        aria-label="Dismiss notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
