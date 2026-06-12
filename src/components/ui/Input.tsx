"use client";

import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

export default function Input({
  error,
  label,
  style,
  ...props
}: InputProps) {
  return (
    <div>
      {label && (
        <label
          style={{
            fontSize: 12,
            color: "var(--text-secondary)",
            marginBottom: 5,
            display: "block",
            fontWeight: 500,
            fontFamily: "var(--font-body)",
          }}
        >
          {label}
        </label>
      )}
      <input
        {...props}
        style={{
          width: "100%",
          boxSizing: "border-box",
          background: "rgba(255,255,255,0.04)",
          border: error
            ? "1px solid var(--danger-border)"
            : "1px solid var(--border-default)",
          color: "var(--text-primary)",
          borderRadius: "var(--radius-md)",
          padding: "9px 14px",
          fontSize: 13,
          fontFamily: "var(--font-body)",
          outline: "none",
          transition: "border-color var(--duration-fast) var(--ease-out)",
          ...style,
        }}
        onFocus={(e) => {
          if (!error)
            e.target.style.borderColor = "var(--accent-border)";
          props.onFocus?.(e as any);
        }}
        onBlur={(e) => {
          if (!error)
            e.target.style.borderColor = "var(--border-default)";
          props.onBlur?.(e as any);
        }}
      />
      {error && (
        <p
          style={{
            fontSize: 11,
            color: "var(--danger)",
            margin: "4px 0 0",
            fontFamily: "var(--font-body)",
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}
