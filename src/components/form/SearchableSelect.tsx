"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { ChevronDown } from "lucide-react";

interface SearchableSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  error?: string;
  icon?: React.ReactNode;
  allowCustom?: boolean;
  customLabel?: string;
}

export default function SearchableSelect({
  value,
  onChange,
  options,
  placeholder = "Type to search...",
  error,
  icon,
  allowCustom = true,
  customLabel,
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const [highlightIdx, setHighlightIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setQuery(value); }, [value]);

  const queryLower = query.toLowerCase().trim();
  const hasExactMatch = options.some((o) => o.toLowerCase() === queryLower);
  const showAddNew = allowCustom && queryLower.length > 0 && !hasExactMatch;

  const filtered = useMemo(() => {
    if (!queryLower) return options;
    return options.filter((o) => o.toLowerCase().includes(queryLower));
  }, [options, queryLower]);

  const visible = useMemo(() => {
    const list: (string | { type: "add"; label: string })[] = [...filtered];
    if (showAddNew)
      list.push({
        type: "add",
        label: customLabel || `Add "${query.trim()}"`,
      });
    return list;
  }, [filtered, showAddNew, query, customLabel]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setQuery(q);
    onChange(q);
    setIsOpen(true);
    setHighlightIdx(-1);
  };

  const handleSelect = (option: string) => {
    setQuery(option);
    onChange(option);
    setIsOpen(false);
  };

  const handleAddCustom = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    onChange(trimmed);
    setQuery(trimmed);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter") setIsOpen(true);
      return;
    }
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightIdx((prev) => Math.min(prev + 1, visible.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightIdx((prev) => Math.max(prev - 1, -1));
        break;
      case "Enter":
        e.preventDefault();
        if (highlightIdx >= 0 && highlightIdx < visible.length) {
          const item = visible[highlightIdx];
          if (typeof item === "string") handleSelect(item);
          else handleAddCustom();
        } else if (showAddNew) {
          handleAddCustom();
        } else {
          setIsOpen(false);
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
    }
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const inputStyle: React.CSSProperties = {
    width: "100%",
    boxSizing: "border-box",
    background: "rgba(255,255,255,0.04)",
    border: error
      ? "1px solid var(--danger-border)"
      : "1px solid var(--border-default)",
    color: "var(--text-primary)",
    borderRadius: "var(--radius-md)",
    padding: "9px 30px 9px 12px",
    fontSize: 13,
    fontFamily: "var(--font-body)",
    outline: "none",
    transition: "border-color var(--duration-fast) var(--ease-out)",
  };

  return (
    <div style={{ position: "relative" }}>
      <div style={{ position: "relative" }}>
        {icon && (
          <span
            style={{
              position: "absolute",
              left: 10,
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--text-muted)",
              pointerEvents: "none",
              display: "flex",
            }}
          >
            {icon}
          </span>
        )}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoComplete="off"
          style={{ ...inputStyle, paddingLeft: icon ? 32 : 12 }}
        />
        <ChevronDown
          size={13}
          style={{
            position: "absolute",
            right: 12,
            top: "50%",
            transform: "translateY(-50%)",
            color: "var(--text-muted)",
            pointerEvents: "none",
            opacity: isOpen ? 0.5 : 0.3,
          }}
        />
      </div>
      {error && (
        <p
          style={{
            fontSize: 10,
            color: "var(--danger)",
            margin: "3px 0 0",
            fontFamily: "var(--font-body)",
          }}
        >
          {error}
        </p>
      )}

      {isOpen && (
        <div
          ref={dropdownRef}
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            background: "var(--bg-elevated)",
            border: "1px solid var(--border-default)",
            borderRadius: "var(--radius-md)",
            maxHeight: 240,
            overflowY: "auto",
            zIndex: 100,
            boxShadow: "var(--shadow-lg)",
          }}
        >
          {visible.length === 0 && !showAddNew && (
            <div
              style={{
                padding: "10px 14px",
                fontSize: 12,
                color: "var(--text-muted)",
                fontFamily: "var(--font-body)",
              }}
            >
              {query.trim() ? "No matches found." : "No options available."}
            </div>
          )}

          {visible.map((item, idx) => {
            if (typeof item === "object" && "type" in item) {
              return (
                <div
                  key="add-new"
                  onClick={handleAddCustom}
                  onMouseEnter={() => setHighlightIdx(idx)}
                  style={{
                    padding: "10px 14px",
                    cursor: "pointer",
                    fontSize: 13,
                    fontFamily: "var(--font-body)",
                    color: "var(--accent-primary)",
                    borderTop: "1px solid var(--border-subtle)",
                    background:
                      highlightIdx === idx
                        ? "var(--accent-subtle)"
                        : "transparent",
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    fontWeight: 500,
                  }}
                >
                  + {item.label}
                </div>
              );
            }

            const isHighlighted = highlightIdx === idx;
            const matchStart = queryLower
              ? item.toLowerCase().indexOf(queryLower)
              : -1;

            return (
              <div
                key={item}
                onClick={() => handleSelect(item)}
                onMouseEnter={() => setHighlightIdx(idx)}
                style={{
                  padding: "10px 14px",
                  cursor: "pointer",
                  fontSize: 13,
                  fontFamily: "var(--font-body)",
                  color: "var(--text-primary)",
                  background: isHighlighted
                    ? "rgba(255,255,255,0.04)"
                    : "transparent",
                  borderBottom: "1px solid var(--border-subtle)",
                  transition: "background var(--duration-fast) var(--ease-out)",
                }}
              >
                {matchStart >= 0 ? (
                  <>
                    {item.slice(0, matchStart)}
                    <span
                      style={{
                        color: "var(--accent-primary)",
                        fontWeight: 600,
                      }}
                    >
                      {item.slice(matchStart, matchStart + queryLower.length)}
                    </span>
                    {item.slice(matchStart + queryLower.length)}
                  </>
                ) : (
                  item
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
