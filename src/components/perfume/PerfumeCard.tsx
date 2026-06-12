"use client";

import { useState } from "react";
import { IPerfume } from "@/types";
import Badge from "@/components/ui/Badge";
import { Pencil, Trash2, SprayCan as Spray } from "lucide-react";

const seasonColors: Record<string, string> = {
  Spring: "#7ecba1", Summer: "#f9c74f", Fall: "#f4845f", Winter: "#90c2e7",
};

interface PerfumeCardProps {
  perfume: IPerfume;
  onView?: (perfume: IPerfume) => void;
  onEdit?: (perfume: IPerfume) => void;
  onDelete?: (perfume: IPerfume) => void;
}

export default function PerfumeCard({ perfume, onView, onEdit, onDelete }: PerfumeCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      onClick={() => onView?.(perfume)}
      className="group"
      style={{
        background: "#14141c",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 10,
        padding: "18px 20px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        position: "relative",
      }}
    >
      {/* Season dots */}
      {perfume.seasons && perfume.seasons.length > 0 && (
        <div style={{ position: "absolute", top: 14, right: 14, display: "flex", gap: 3 }}>
          {perfume.seasons.map((s) => (
            <span key={s} title={s} style={{ width: 7, height: 7, borderRadius: "50%", background: seasonColors[s] || "#555", display: "inline-block" }} />
          ))}
        </div>
      )}

      {/* Image area */}
      {perfume.imageId && !imageError ? (
        <img
          src={`/api/images/${perfume.imageId}`}
          alt={perfume.name}
          style={{ width: "100%", height: 140, objectFit: "cover", borderRadius: 8, marginBottom: 12 }}
          width={300} height={140}
          onError={() => setImageError(true)}
        />
      ) : (
        <div style={{ width: "100%", height: 44, borderRadius: 8, marginBottom: 12, background: "rgba(255,255,255,0.02)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Spray size={18} style={{ color: "rgba(20,184,166,0.2)" }} />
        </div>
      )}

      {/* Brand */}
      <p style={{ fontSize: 10, color: "#14b8a6", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 3px", fontFamily: "DM Sans, system-ui, -apple-system, sans-serif" }}>
        {perfume.brand}
      </p>

      {/* Name */}
      <h3 style={{ fontSize: 15, fontWeight: 500, color: "#f0f0f4", margin: "0 0 10px", lineHeight: 1.3, paddingRight: 50, fontFamily: "DM Sans, system-ui, -apple-system, sans-serif" }}>
        {perfume.name}
      </h3>

      {/* Info row */}
      {perfume.scent_type && (
        <p style={{ fontSize: 12, color: "#a0a0b4", margin: "0 0 3px", fontFamily: "DM Sans, system-ui, -apple-system, sans-serif" }}>
          <span style={{ color: "#6b6b80" }}>Scent: </span>{perfume.scent_type}
        </p>
      )}

      {perfume.status && (
        <p style={{ fontSize: 11, color: "#6b6b80", margin: "0 0 3px", fontFamily: "DM Sans, system-ui, -apple-system, sans-serif" }}>
          {perfume.status}
        </p>
      )}

      {/* Hover: click to view */}
      <p style={{ fontSize: 10, color: "#4a4a5a", margin: "6px 0 0", fontFamily: "DM Sans, system-ui, -apple-system, sans-serif", transition: "color 0.15s" }}
         className="group-hover:text-teal-500">
        Click to view details →
      </p>

      {/* Edit/Delete buttons */}
      <div
        style={{
          position: "absolute", bottom: 12, right: 12,
          display: "flex", gap: 2,
          opacity: 0, transition: "opacity 0.15s ease",
        }}
        className="group-hover:opacity-100"
        onClick={(e) => e.stopPropagation()}
      >
        {onEdit && (
          <button onClick={() => onEdit(perfume)} title="Edit"
            style={{ padding: 4, background: "none", border: "none", cursor: "pointer", color: "#6b6b80", borderRadius: 4, display: "flex" }}>
            <Pencil size={11} />
          </button>
        )}
        {onDelete && (
          <button onClick={() => onDelete(perfume)} title="Delete"
            style={{ padding: 4, background: "none", border: "none", cursor: "pointer", color: "#6b6b80", borderRadius: 4, display: "flex" }}>
            <Trash2 size={11} />
          </button>
        )}
      </div>
    </div>
  );
}
