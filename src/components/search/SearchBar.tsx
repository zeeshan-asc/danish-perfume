"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  debounceMs?: number;
}

export default function SearchBar({ onSearch, debounceMs = 300 }: SearchBarProps) {
  const [value, setValue] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => onSearch(value), debounceMs);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [value, debounceMs, onSearch]);

  return (
    <div style={{ position: "relative" }}>
      <Search
        size={16}
        style={{
          position: "absolute",
          left: 14,
          top: "50%",
          transform: "translateY(-50%)",
          color: "var(--text-muted)",
        }}
      />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search by name, brand, or scent type..."
        aria-label="Search perfumes"
        style={{
          width: "100%",
          boxSizing: "border-box",
          background: "var(--bg-tertiary)",
          border: "1px solid var(--border-default)",
          color: "var(--text-primary)",
          borderRadius: "var(--radius-lg)",
          padding: "12px 18px 12px 42px",
          fontSize: 14,
          fontFamily: "var(--font-body)",
          outline: "none",
          transition: "all var(--duration-fast) var(--ease-out)",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "var(--accent-border)";
          e.target.style.boxShadow = "var(--shadow-glow)";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "var(--border-default)";
          e.target.style.boxShadow = "none";
        }}
      />
      {value && (
        <button
          onClick={() => setValue("")}
          aria-label="Clear search"
          style={{
            position: "absolute",
            right: 14,
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--text-muted)",
            padding: 2,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "color var(--duration-fast) var(--ease-out)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--text-primary)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--text-muted)";
          }}
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
