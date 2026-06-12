"use client";

import { useToast } from "@/hooks/useToast";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

const colors = {
  success: { bg: "rgba(20,184,166,0.1)", border: "rgba(20,184,166,0.25)", text: "#2dd4bf" },
  error:   { bg: "rgba(248,113,113,0.1)",  border: "rgba(248,113,113,0.25)",  text: "#f87171" },
  info:    { bg: "rgba(96,165,250,0.1)", border: "rgba(96,165,250,0.25)", text: "#60a5fa" },
};
const icons = { success: CheckCircle, error: AlertCircle, info: Info };

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();
  if (toasts.length === 0) return null;
  return (
    <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 100, display: "flex", flexDirection: "column", gap: 8, maxWidth: 360 }}>
      {toasts.map(t => {
        const Icon = icons[t.type]; const c = colors[t.type];
        return (
          <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 8, background: c.bg, border: `1px solid ${c.border}`, color: c.text, fontSize: 13, fontFamily: "DM Sans, system-ui, -apple-system, sans-serif", boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}>
            <Icon size={16} />
            <span style={{ flex: 1 }}>{t.message}</span>
            <button onClick={() => removeToast(t.id)} style={{ background: "none", border: "none", cursor: "pointer", color: c.text, padding: 0, opacity: 0.6, lineHeight: 1 }}><X size={14} /></button>
          </div>
        );
      })}
    </div>
  );
}
