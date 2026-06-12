"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";

interface ToastItem {
  id: string;
  message: string;
  type: "success" | "error" | "warning" | "info";
}

const toastIcons: Record<string, React.ComponentType<{ size: number }>> = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const toastColors: Record<
  string,
  { bg: string; border: string; color: string; accent: string }
> = {
  success: {
    bg: "var(--success-subtle)",
    border: "rgba(52,211,153,0.25)",
    color: "var(--success)",
    accent: "#34d399",
  },
  error: {
    bg: "var(--danger-subtle)",
    border: "rgba(248,113,113,0.25)",
    color: "var(--danger)",
    accent: "#f87171",
  },
  warning: {
    bg: "rgba(251,191,36,0.08)",
    border: "rgba(251,191,36,0.25)",
    color: "var(--warning)",
    accent: "#fbbf24",
  },
  info: {
    bg: "var(--info-subtle)",
    border: "rgba(96,165,250,0.25)",
    color: "var(--info)",
    accent: "#60a5fa",
  },
};

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const handler = (e: Event) => {
      const { id, message, type } = (e as CustomEvent).detail;
      setToasts((prev) => [...prev, { id, message, type }]);
    };
    window.addEventListener("toast-add" as any, handler);
    return () => window.removeEventListener("toast-add" as any, handler);
  }, []);

  const dismiss = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    if (toasts.length === 0) return;
    const latest = toasts[toasts.length - 1];
    const timer = setTimeout(() => dismiss(latest.id), 4000);
    return () => clearTimeout(timer);
  }, [toasts]);

  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 100,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        maxWidth: 400,
      }}
    >
      {toasts.map((toast) => {
        const Icon = toastIcons[toast.type];
        const c = toastColors[toast.type];
        return (
          <div
            key={toast.id}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
              padding: "12px 16px",
              background: "var(--bg-glass)",
              backdropFilter: "blur(20px) saturate(140%)",
              WebkitBackdropFilter: "blur(20px) saturate(140%)",
              border: `1px solid ${c.border}`,
              borderRadius: "var(--radius-lg)",
              boxShadow: "var(--shadow-md)",
              animation: "scaleIn 0.2s var(--ease-out)",
              fontFamily: "var(--font-body)",
            }}
          >
            <span style={{ color: c.accent, flexShrink: 0, marginTop: 0, display: "flex" }}>
              <Icon size={18} />
            </span>
            <p
              style={{
                fontSize: 13,
                color: "var(--text-primary)",
                margin: 0,
                lineHeight: 1.5,
                flex: 1,
                fontWeight: 500,
              }}
            >
              {toast.message}
            </p>
            <button
              onClick={() => dismiss(toast.id)}
              aria-label="Dismiss"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--text-muted)",
                padding: 0,
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
              }}
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
