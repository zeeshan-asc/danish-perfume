"use client";

import { SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  label?: string;
}

export default function Select({ error, label, style, ...props }: SelectProps) {
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
      <select
        {...props}
        style={{
          width: "100%",
          boxSizing: "border-box",
          background: "rgba(255,255,255,0.04)",
          border: error ? "1px solid var(--danger-border)" : "1px solid var(--border-default)",
          color: "var(--text-primary)",
          borderRadius: "var(--radius-md)",
          padding: "9px 14px",
          fontSize: 13,
          fontFamily: "var(--font-body)",
          outline: "none",
          cursor: "pointer",
          transition: "border-color var(--duration-fast) var(--ease-out)",
          appearance: "none",
          WebkitAppearance: "none",
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23757075' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 12px center",
          paddingRight: 32,
          ...style,
        }}
      />
      {error && (
        <p style={{ fontSize: 11, color: "var(--danger)", margin: "4px 0 0", fontFamily: "var(--font-body)" }}>
          {error}
        </p>
      )}
    </div>
  );
}
