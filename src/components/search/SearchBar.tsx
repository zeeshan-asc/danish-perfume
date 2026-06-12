"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Search } from "lucide-react";

interface SearchBarProps { onSearch: (query: string) => void; debounceMs?: number; }

export default function SearchBar({ onSearch, debounceMs = 300 }: SearchBarProps) {
  const [value, setValue] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => onSearch(value), debounceMs);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [value, debounceMs, onSearch]);

  return (
    <div style={{ position: "relative" }}>
      <Search size={15} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "#6b6b80" }} />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search by name, brand, or scent type..."
        style={{
          width: "100%", boxSizing: "border-box",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          color: "#f0f0f4",
          borderRadius: 8,
          padding: "10px 16px 10px 38px",
          fontSize: 14,
          fontFamily: "DM Sans, system-ui, -apple-system, sans-serif",
          outline: "none",
          transition: "border-color 0.15s ease",
        }}
        onFocus={(e) => e.target.style.borderColor = "rgba(20,184,166,0.3)"}
        onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
      />
    </div>
  );
}
