"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { IPerfume } from "@/types";

interface FilterPanelProps {
  perfumes: IPerfume[];
  filters: {
    brand: string; status: string; season: string; scentType: string;
    minRating: string; maxRating: string; minPrice: string; maxPrice: string;
    sortBy: string; sortOrder: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onClear: () => void;
}

const inputStyle: React.CSSProperties = {
  width: "100%", boxSizing: "border-box",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid var(--border-default)",
  color: "var(--text-primary)", borderRadius: "var(--radius-sm)",
  padding: "8px 12px", fontSize: 13,
  fontFamily: "var(--font-body)", outline: "none",
  transition: "border-color var(--duration-fast) var(--ease-out)",
};

const pillStyle = (active: boolean): React.CSSProperties => ({
  padding: "6px 14px", borderRadius: "var(--radius-sm)", fontSize: 12,
  fontFamily: "var(--font-body)", fontWeight: 500,
  cursor: "pointer", transition: "all var(--duration-fast) var(--ease-out)",
  border: active
    ? "1px solid var(--accent-border-strong)"
    : "1px solid var(--border-default)",
  background: active
    ? "var(--accent-subtle)"
    : "rgba(255,255,255,0.03)",
  color: active ? "var(--accent-primary)" : "var(--text-secondary)",
});

export default function FilterPanel({
  perfumes,
  filters,
  onFilterChange,
  onClear,
}: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const uniqueBrands = Array.from(
    new Set(perfumes.map((p) => p.brand).filter(Boolean))
  ).sort();
  const hasActive =
    filters.brand || filters.status || filters.season || filters.scentType ||
    filters.minRating || filters.maxRating || filters.minPrice || filters.maxPrice;

  return (
    <div
      style={{
        background: "var(--bg-tertiary)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        transition: "all var(--duration-fast) var(--ease-out)",
      }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 18px",
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: 13,
          color: "var(--text-secondary)",
          fontFamily: "var(--font-body)",
          fontWeight: 500,
          transition: "color var(--duration-fast) var(--ease-out)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "var(--text-primary)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "var(--text-secondary)";
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          Filters
          {hasActive && (
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "var(--accent-primary)",
                display: "inline-block",
              }}
            />
          )}
        </span>
        {isOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
      </button>

      {isOpen && (
        <div
          style={{
            padding: "0 18px 18px",
            borderTop: "1px solid var(--border-subtle)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))",
              gap: 14,
              marginTop: 14,
            }}
          >
            {/* Brand */}
            <div>
              <label
                style={{
                  fontSize: 11, color: "var(--text-muted)", marginBottom: 4,
                  display: "block", fontWeight: 600,
                  fontFamily: "var(--font-body)",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                Brand
              </label>
              <select
                value={filters.brand}
                onChange={(e) => onFilterChange("brand", e.target.value)}
                style={{
                  ...inputStyle,
                  appearance: "none",
                  WebkitAppearance: "none",
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23757075' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 10px center",
                  paddingRight: 28,
                  backgroundOrigin: "content-box",
                }}
              >
                <option value="">All Brands</option>
                {uniqueBrands.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label
                style={{
                  fontSize: 11, color: "var(--text-muted)", marginBottom: 4,
                  display: "block", fontWeight: 600,
                  fontFamily: "var(--font-body)",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                Status
              </label>
              <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                {["", "Owned", "Wishlist", "Sold"].map((v) => (
                  <button
                    key={v}
                    onClick={() => onFilterChange("status", v)}
                    style={pillStyle(filters.status === v)}
                  >
                    {v || "All"}
                  </button>
                ))}
              </div>
            </div>

            {/* Season */}
            <div>
              <label
                style={{
                  fontSize: 11, color: "var(--text-muted)", marginBottom: 4,
                  display: "block", fontWeight: 600,
                  fontFamily: "var(--font-body)",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                Season
              </label>
              <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                {["", "Spring", "Summer", "Fall", "Winter"].map((v) => (
                  <button
                    key={v}
                    onClick={() => onFilterChange("season", v)}
                    style={pillStyle(filters.season === v)}
                  >
                    {v || "All"}
                  </button>
                ))}
              </div>
            </div>

            {/* Scent Type */}
            <div>
              <label
                style={{
                  fontSize: 11, color: "var(--text-muted)", marginBottom: 4,
                  display: "block", fontWeight: 600,
                  fontFamily: "var(--font-body)",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                Scent Type
              </label>
              <input
                type="text"
                value={filters.scentType}
                onChange={(e) => onFilterChange("scentType", e.target.value)}
                placeholder="e.g. Gourmand"
                style={inputStyle}
              />
            </div>

            {/* Rating */}
            <div>
              <label
                style={{
                  fontSize: 11, color: "var(--text-muted)", marginBottom: 4,
                  display: "block", fontWeight: 600,
                  fontFamily: "var(--font-body)",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                Rating
              </label>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={filters.minRating}
                  onChange={(e) => onFilterChange("minRating", e.target.value)}
                  placeholder="1"
                  style={{ ...inputStyle, width: 60 }}
                />
                <span style={{ color: "var(--text-dim)", fontSize: 12 }}>to</span>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={filters.maxRating}
                  onChange={(e) => onFilterChange("maxRating", e.target.value)}
                  placeholder="10"
                  style={{ ...inputStyle, width: 60 }}
                />
              </div>
            </div>

            {/* Sort */}
            <div>
              <label
                style={{
                  fontSize: 11, color: "var(--text-muted)", marginBottom: 4,
                  display: "block", fontWeight: 600,
                  fontFamily: "var(--font-body)",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                Sort
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => onFilterChange("sortBy", e.target.value)}
                style={{
                  ...inputStyle,
                  appearance: "none",
                  WebkitAppearance: "none",
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23757075' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 10px center",
                  paddingRight: 28,
                }}
              >
                <option value="createdAt">Date Added</option>
                <option value="name">Name</option>
                <option value="brand">Brand</option>
                <option value="rating">Rating</option>
                <option value="purchase_price">Price</option>
              </select>
              <div style={{ marginTop: 4 }}>
                <button
                  onClick={() =>
                    onFilterChange(
                      "sortOrder",
                      filters.sortOrder === "asc" ? "desc" : "asc"
                    )
                  }
                  style={pillStyle(false)}
                >
                  {filters.sortOrder === "asc" ? "↑ Ascending" : "↓ Descending"}
                </button>
              </div>
            </div>
          </div>

          {/* Clear */}
          {hasActive && (
            <button
              onClick={onClear}
              style={{
                marginTop: 14,
                display: "flex",
                alignItems: "center",
                gap: 5,
                padding: "6px 14px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border-default)",
                background: "transparent",
                color: "var(--text-muted)",
                fontSize: 12,
                fontFamily: "var(--font-body)",
                cursor: "pointer",
                fontWeight: 500,
                transition: "all var(--duration-fast) var(--ease-out)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--danger-border)";
                e.currentTarget.style.color = "var(--danger)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border-default)";
                e.currentTarget.style.color = "var(--text-muted)";
              }}
            >
              <X size={12} /> Clear all filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
