"use client";

import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export default function Button({ variant = "primary", size = "md", loading, children, style, disabled, ...props }: ButtonProps) {
  const styles: Record<string, React.CSSProperties> = {
    primary: { background: "rgba(20,184,166,0.1)", border: "1px solid rgba(20,184,166,0.3)", color: "#2dd4bf" },
    secondary: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#a0a0b4" },
    danger: { background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.25)", color: "#f87171" },
    ghost: { background: "transparent", border: "1px solid transparent", color: "#6b6b80" },
  };
  const sizes: Record<string, React.CSSProperties> = {
    sm: { padding: "4px 12px", fontSize: 12 },
    md: { padding: "8px 18px", fontSize: 13 },
    lg: { padding: "10px 24px", fontSize: 14 },
  };
  return (
    <button
      disabled={disabled || loading}
      {...props}
      style={{
        borderRadius: 8, fontFamily: "DM Sans, system-ui, -apple-system, sans-serif",
        cursor: (disabled || loading) ? "not-allowed" : "pointer",
        opacity: (disabled || loading) ? 0.5 : 1, display: "inline-flex", alignItems: "center", gap: 6,
        transition: "all 0.15s ease", fontWeight: 500,
        ...styles[variant], ...sizes[size], ...style,
      }}
    >
      {loading && <span style={{ width: 14, height: 14, border: "2px solid rgba(20,184,166,0.2)", borderTopColor: "#14b8a6", borderRadius: "50%", display: "inline-block", animation: "spin 0.6s linear infinite" }} />}
      {children}
    </button>
  );
}
