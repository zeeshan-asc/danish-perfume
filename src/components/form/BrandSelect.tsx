"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useBrands } from "@/hooks/useBrands";
import { IBrand } from "@/types";
import { Search, Plus, ChevronDown } from "lucide-react";

interface BrandSelectProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export default function BrandSelect({ value, onChange, error }: BrandSelectProps) {
  const { fetchBrands, addBrand, loading } = useBrands();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const [options, setOptions] = useState<IBrand[]>([]);
  const [highlightIdx, setHighlightIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const loadBrands = useCallback(async (search: string) => {
    const results = await fetchBrands(search);
    setOptions(results);
    setHighlightIdx(-1);
  }, [fetchBrands]);

  // Initialize on mount
  useEffect(() => { loadBrands(""); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync external value
  useEffect(() => { setQuery(value); }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setQuery(q);
    onChange(q);
    setIsOpen(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => loadBrands(q), 200);
  };

  const handleSelect = (brand: IBrand) => {
    setQuery(brand.name);
    onChange(brand.name);
    setIsOpen(false);
  };

  const handleAddNew = async () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    const brand = await addBrand(trimmed);
    if (brand) {
      setQuery(brand.name);
      onChange(brand.name);
      setIsOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter") setIsOpen(true);
      return;
    }
    const visible = getVisibleOptions();
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
          const selected = visible[highlightIdx];
          if ("name" in selected) handleSelect(selected);
          else handleAddNew();
        } else if (query.trim() && options.length === 0) {
          handleAddNew();
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

  const queryLower = query.toLowerCase().trim();
  const hasExactMatch = options.some((b) => b.name.toLowerCase() === queryLower);
  const showAddNew = queryLower.length > 0 && !hasExactMatch;

  function getVisibleOptions(): (IBrand | { type: "add"; label: string })[] {
    const filtered = queryLower
      ? options.filter((b) => b.name.toLowerCase().includes(queryLower))
      : options;
    const result: (IBrand | { type: "add"; label: string })[] = filtered;
    if (showAddNew) result.push({ type: "add", label: `Add "${query.trim()}"` });
    return result;
  }

  const visible = getVisibleOptions();

  const inputStyle: React.CSSProperties = {
    width: "100%",
    boxSizing: "border-box",
    background: "rgba(255,255,255,0.04)",
    border: error
      ? "1px solid var(--danger-border)"
      : "1px solid var(--border-default)",
    color: "var(--text-primary)",
    borderRadius: "var(--radius-md)",
    padding: "9px 14px 9px 36px",
    fontSize: 13,
    fontFamily: "var(--font-body)",
    outline: "none",
  };

  return (
    <div style={{ position: "relative" }}>
      <div style={{ position: "relative" }}>
        <Search
          size={14}
          style={{
            position: "absolute",
            left: 12,
            top: "50%",
            transform: "translateY(-50%)",
            color: "var(--text-muted)",
            pointerEvents: "none",
          }}
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => {
            setIsOpen(true);
            if (!options.length) loadBrands("");
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search or type a brand..."
          autoComplete="off"
          style={inputStyle}
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
          {loading && (
            <div
              style={{
                padding: "10px 14px",
                fontSize: 12,
                color: "var(--text-muted)",
                fontFamily: "var(--font-body)",
              }}
            >
              Loading...
            </div>
          )}

          {!loading && visible.length === 0 && !showAddNew && (
            <div
              style={{
                padding: "10px 14px",
                fontSize: 12,
                color: "var(--text-muted)",
                fontFamily: "var(--font-body)",
              }}
            >
              {query.trim() ? "No brands found. Press Enter to add." : "No brands yet."}
            </div>
          )}

          {visible.map((item, idx) => {
            if ("type" in item) {
              return (
                <div
                  key="add-new"
                  onClick={handleAddNew}
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
                  <Plus size={13} /> {item.label}
                </div>
              );
            }
            const brand = item as IBrand;
            const isHighlighted = highlightIdx === idx;
            return (
              <div
                key={brand.id || brand._id}
                onClick={() => handleSelect(brand)}
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
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  borderBottom: "1px solid var(--border-subtle)",
                  transition: "background var(--duration-fast) var(--ease-out)",
                }}
              >
                {brand.name}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
