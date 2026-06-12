"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { IPerfume } from "@/types";

interface FilterPanelProps {
  perfumes: IPerfume[];
  filters: { brand: string; status: string; season: string; scentType: string; minRating: string; maxRating: string; minPrice: string; maxPrice: string; sortBy: string; sortOrder: string; };
  onFilterChange: (key: string, value: string) => void;
  onClear: () => void;
}

const inputStyle: React.CSSProperties = {
  width: "100%", boxSizing: "border-box", background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)", color: "#f0f0f4", borderRadius: 6,
  padding: "8px 12px", fontSize: 13, fontFamily: "DM Sans, system-ui, -apple-system, sans-serif",
  outline: "none",
};

const pillStyle = (active: boolean): React.CSSProperties => ({
  padding: "5px 14px", borderRadius: 6, fontSize: 12, fontFamily: "DM Sans, system-ui, -apple-system, sans-serif",
  fontWeight: 500, cursor: "pointer", transition: "all 0.15s ease",
  border: active ? "1px solid rgba(20,184,166,0.4)" : "1px solid rgba(255,255,255,0.08)",
  background: active ? "rgba(20,184,166,0.1)" : "rgba(255,255,255,0.04)",
  color: active ? "#2dd4bf" : "#a0a0b4",
});

export default function FilterPanel({ perfumes, filters, onFilterChange, onClear }: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const uniqueBrands = Array.from(new Set(perfumes.map(p => p.brand).filter(Boolean))).sort();
  const hasActive = filters.brand || filters.status || filters.season || filters.scentType || filters.minRating || filters.maxRating || filters.minPrice || filters.maxPrice;

  return (
    <div style={{ background: "#14141c", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, overflow: "hidden" }}>
      <button onClick={() => setIsOpen(!isOpen)} style={{
        width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "10px 16px", background: "none", border: "none", cursor: "pointer",
        fontSize: 13, color: "#a0a0b4", fontFamily: "DM Sans, system-ui, -apple-system, sans-serif", fontWeight: 500,
      }}>
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          Filters {hasActive && <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#14b8a6", display: "inline-block" }} />}
        </span>
        {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {isOpen && (
        <div style={{ padding: "0 16px 16px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12, marginTop: 12 }}>
            <div>
              <label style={{ fontSize: 11, color: "#6b6b80", marginBottom: 4, display: "block", fontWeight: 500, fontFamily: "DM Sans, system-ui, -apple-system, sans-serif" }}>Brand</label>
              <select value={filters.brand} onChange={(e) => onFilterChange("brand", e.target.value)} style={inputStyle}>
                <option value="">All Brands</option>
                {uniqueBrands.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 11, color: "#6b6b80", marginBottom: 4, display: "block", fontWeight: 500, fontFamily: "DM Sans, system-ui, -apple-system, sans-serif" }}>Status</label>
              <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                {["", "Owned", "Wishlist", "Sold"].map(v => (
                  <button key={v} onClick={() => onFilterChange("status", v)} style={pillStyle(filters.status === v)}>{v || "All"}</button>
                ))}
              </div>
            </div>
            <div>
              <label style={{ fontSize: 11, color: "#6b6b80", marginBottom: 4, display: "block", fontWeight: 500, fontFamily: "DM Sans, system-ui, -apple-system, sans-serif" }}>Season</label>
              <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                {["", "Spring", "Summer", "Fall", "Winter"].map(v => (
                  <button key={v} onClick={() => onFilterChange("season", v)} style={pillStyle(filters.season === v)}>{v || "All"}</button>
                ))}
              </div>
            </div>
            <div>
              <label style={{ fontSize: 11, color: "#6b6b80", marginBottom: 4, display: "block", fontWeight: 500, fontFamily: "DM Sans, system-ui, -apple-system, sans-serif" }}>Scent Type</label>
              <input type="text" value={filters.scentType} onChange={(e) => onFilterChange("scentType", e.target.value)} placeholder="e.g. Gourmand" style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: "#6b6b80", marginBottom: 4, display: "block", fontWeight: 500, fontFamily: "DM Sans, system-ui, -apple-system, sans-serif" }}>Rating</label>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <input type="number" min="1" max="10" value={filters.minRating} onChange={(e) => onFilterChange("minRating", e.target.value)} placeholder="1" style={{ ...inputStyle, width: 55 }} />
                <span style={{ color: "#4a4a5a", fontSize: 12 }}>to</span>
                <input type="number" min="1" max="10" value={filters.maxRating} onChange={(e) => onFilterChange("maxRating", e.target.value)} placeholder="10" style={{ ...inputStyle, width: 55 }} />
              </div>
            </div>
            <div>
              <label style={{ fontSize: 11, color: "#6b6b80", marginBottom: 4, display: "block", fontWeight: 500, fontFamily: "DM Sans, system-ui, -apple-system, sans-serif" }}>Sort</label>
              <select value={filters.sortBy} onChange={(e) => onFilterChange("sortBy", e.target.value)} style={inputStyle}>
                <option value="createdAt">Date Added</option>
                <option value="name">Name</option>
                <option value="brand">Brand</option>
                <option value="rating">Rating</option>
                <option value="purchase_price">Price</option>
              </select>
              <div style={{ marginTop: 4 }}>
                <button onClick={() => onFilterChange("sortOrder", filters.sortOrder === "asc" ? "desc" : "asc")} style={pillStyle(false)}>
                  {filters.sortOrder === "asc" ? "↑ Asc" : "↓ Desc"}
                </button>
              </div>
            </div>
          </div>
          {hasActive && (
            <button onClick={onClear} style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 4, padding: "5px 12px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.06)", background: "transparent", color: "#6b6b80", fontSize: 12, fontFamily: "DM Sans, system-ui, -apple-system, sans-serif", cursor: "pointer", fontWeight: 500 }}>
              <X size={12} /> Clear filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
