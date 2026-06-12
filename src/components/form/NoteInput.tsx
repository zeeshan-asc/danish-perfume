"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { X } from "lucide-react";

interface NoteInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  notesList: string[];
}

export default function NoteInput({ value, onChange, placeholder = "Type a note...", error, notesList }: NoteInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlightIdx, setHighlightIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Parse current value into tags
  const tags = useMemo(() => {
    return value
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  }, [value]);

  // Filter notes based on query
  const queryLower = query.toLowerCase().trim();
  const filtered = useMemo(() => {
    if (!queryLower) return [];
    // Exclude already-selected notes
    return notesList.filter(
      (n) =>
        n.toLowerCase().includes(queryLower) &&
        !tags.some((t) => t.toLowerCase() === n.toLowerCase())
    ).slice(0, 30);
  }, [queryLower, tags, notesList]);

  const handleSelect = (note: string) => {
    // Append note to existing comma-separated value
    const newVal = tags.length > 0 ? `${value}, ${note}` : note;
    onChange(newVal);
    setQuery("");
    setHighlightIdx(-1);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const removeTag = (tag: string) => {
    const newTags = tags.filter((t) => t !== tag);
    onChange(newTags.join(", "));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" && filtered.length > 0) {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightIdx((prev) => Math.min(prev + 1, filtered.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightIdx((prev) => Math.max(prev - 1, -1));
        break;
      case "Enter":
      case "Tab":
        e.preventDefault();
        if (highlightIdx >= 0 && highlightIdx < filtered.length) {
          handleSelect(filtered[highlightIdx]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
    }
  };

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current && !inputRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const chipStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 3,
    padding: "2px 8px",
    borderRadius: 6,
    background: "rgba(20,184,166,0.06)",
    border: "1px solid rgba(20,184,166,0.15)",
    color: "#2dd4bf",
    fontSize: 11,
    fontWeight: 500,
    fontFamily: "DM Sans, system-ui, -apple-system, sans-serif",
    whiteSpace: "nowrap",
  };

  const containerStyle: React.CSSProperties = {
    width: "100%",
    boxSizing: "border-box",
    background: "rgba(255,255,255,0.04)",
    border: error ? "1px solid rgba(248,113,113,0.4)" : "1px solid rgba(255,255,255,0.08)",
    borderRadius: 6,
    padding: "6px 10px",
    display: "flex",
    flexWrap: "wrap",
    gap: 4,
    alignItems: "center",
    minHeight: 36,
    cursor: "text",
  };

  return (
    <div style={{ position: "relative" }}>
      <div
        style={containerStyle}
        onClick={() => inputRef.current?.focus()}
      >
        {tags.map((tag) => (
          <span key={tag} style={chipStyle}>
            {tag}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); removeTag(tag); }}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#2dd4bf",
                padding: 0,
                lineHeight: 1,
                opacity: 0.6,
                display: "flex",
              }}
            >
              <X size={10} />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setIsOpen(true); setHighlightIdx(-1); }}
          onFocus={() => { if (query.trim()) setIsOpen(true); }}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? placeholder : ""}
          autoComplete="off"
          style={{
            flex: 1,
            minWidth: 80,
            border: "none",
            background: "transparent",
            color: "#f0f0f4",
            fontSize: 13,
            fontFamily: "DM Sans, system-ui, -apple-system, sans-serif",
            outline: "none",
            padding: "2px 0",
          }}
        />
      </div>
      {error && (
        <p style={{ fontSize: 10, color: "#f87171", margin: "3px 0 0", fontFamily: "DM Sans, system-ui, -apple-system, sans-serif" }}>
          {error}
        </p>
      )}

      {isOpen && filtered.length > 0 && (
        <div
          ref={dropdownRef}
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            background: "#1a1a24",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 8,
            maxHeight: 220,
            overflowY: "auto",
            zIndex: 100,
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          }}
        >
          {filtered.map((note, idx) => {
            const matchStart = note.toLowerCase().indexOf(queryLower);
            return (
              <div
                key={note}
                onClick={() => handleSelect(note)}
                onMouseEnter={() => setHighlightIdx(idx)}
                style={{
                  padding: "8px 14px",
                  cursor: "pointer",
                  fontSize: 12,
                  fontFamily: "DM Sans, system-ui, -apple-system, sans-serif",
                  color: "#f0f0f4",
                  background: highlightIdx === idx ? "rgba(255,255,255,0.06)" : "transparent",
                  borderBottom: "1px solid rgba(255,255,255,0.03)",
                }}
              >
                {matchStart >= 0 && queryLower.length > 0 ? (
                  <>
                    {note.slice(0, matchStart)}
                    <span style={{ color: "#2dd4bf", fontWeight: 600 }}>
                      {note.slice(matchStart, matchStart + queryLower.length)}
                    </span>
                    {note.slice(matchStart + queryLower.length)}
                  </>
                ) : (
                  note
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
