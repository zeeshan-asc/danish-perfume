"use client";

import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "accent";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const variantStyles: Record<string, React.CSSProperties> = {
  primary: {
    background: "var(--accent-subtle)",
    border: "1px solid var(--accent-border)",
    color: "var(--accent-glow)",
  },
  accent: {
    background: "var(--accent-muted)",
    border: "1px solid var(--accent-border-strong)",
    color: "var(--accent-primary)",
  },
  secondary: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid var(--border-default)",
    color: "var(--text-secondary)",
  },
  danger: {
    background: "var(--danger-subtle)",
    border: "1px solid var(--danger-border)",
    color: "var(--danger)",
  },
  ghost: {
    background: "transparent",
    border: "1px solid transparent",
    color: "var(--text-muted)",
  },
};

const hoverStyles: Record<string, React.CSSProperties> = {
  primary: {
    background: "var(--accent-muted)",
    borderColor: "var(--accent-border-strong)",
  },
  accent: {
    background: "rgba(200,164,78,0.22)",
    borderColor: "rgba(200,164,78,0.6)",
  },
  secondary: {
    background: "rgba(255,255,255,0.06)",
    borderColor: "var(--border-hover)",
    color: "var(--text-primary)",
  },
  danger: {
    background: "rgba(248,113,113,0.14)",
    borderColor: "rgba(248,113,113,0.45)",
  },
  ghost: {
    background: "rgba(255,255,255,0.03)",
    color: "var(--text-secondary)",
  },
};

const sizeStyles: Record<string, React.CSSProperties> = {
  sm: { padding: "5px 14px", fontSize: 12, borderRadius: "var(--radius-sm)" },
  md: { padding: "8px 20px", fontSize: 13, borderRadius: "var(--radius-md)" },
  lg: { padding: "10px 26px", fontSize: 14, borderRadius: "var(--radius-md)" },
};

export default function Button({
  variant = "primary",
  size = "md",
  loading,
  children,
  style,
  disabled,
  onMouseEnter,
  onMouseLeave,
  ...props
}: ButtonProps) {
  const baseStyle: React.CSSProperties = {
    fontFamily: "var(--font-body)",
    cursor: disabled || loading ? "not-allowed" : "pointer",
    opacity: disabled || loading ? 0.5 : 1,
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    transition: "all var(--duration-fast) var(--ease-out)",
    fontWeight: 500,
    letterSpacing: "0.01em",
    ...variantStyles[variant],
    ...sizeStyles[size],
    ...style,
  };

  return (
    <button
      disabled={disabled || loading}
      {...props}
      style={baseStyle}
      onMouseEnter={(e) => {
        if (!disabled && !loading) {
          const target = e.currentTarget;
          Object.assign(target.style, hoverStyles[variant]);
        }
        onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        const target = e.currentTarget;
        target.style.background = variantStyles[variant].background as string;
        target.style.borderColor = variantStyles[variant].border as string;
        target.style.color = variantStyles[variant].color as string;
        onMouseLeave?.(e);
      }}
    >
      {loading && (
        <span
          style={{
            width: 14,
            height: 14,
            border: "2px solid rgba(200,164,78,0.2)",
            borderTopColor: "var(--accent-primary)",
            borderRadius: "50%",
            display: "inline-block",
            animation: "spin 0.6s linear infinite",
          }}
        />
      )}
      {children}
    </button>
  );
}
