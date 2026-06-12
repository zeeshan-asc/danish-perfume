"use client";

import { IPerfume } from "@/types";
import Badge from "@/components/ui/Badge";
import { SprayCan as Spray, Star } from "lucide-react";
import { formatDate, formatPrice } from "@/lib/utils";

interface PerfumeDetailProps { perfume: IPerfume; onEdit: () => void; onDelete: () => void; }

export default function PerfumeDetail({ perfume, onEdit, onDelete }: PerfumeDetailProps) {
  return (
    <div>
      {/* Image */}
      {perfume.imageId ? (
        <img src={`/api/images/${perfume.imageId}`} alt={perfume.name} style={{ width: "100%", maxHeight: 240, objectFit: "cover", borderRadius: 10, marginBottom: 20, border: "1px solid rgba(255,255,255,0.06)" }} />
      ) : (
        <div style={{ width: "100%", height: 100, borderRadius: 10, marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <Spray size={32} style={{ color: "rgba(20,184,166,0.25)" }} />
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div>
          <p style={{ fontSize: 10, color: "#14b8a6", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 3px", fontFamily: "DM Sans, system-ui, -apple-system, sans-serif" }}>
            {perfume.brand}
          </p>
          <h1 style={{ fontSize: 22, fontWeight: 500, color: "#f0f0f4", margin: "0 0 6px", fontFamily: "DM Serif Display, Georgia, serif", letterSpacing: "-0.01em" }}>
            {perfume.name}
          </h1>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {perfume.status && <Badge variant="status">{perfume.status}</Badge>}
            {perfume.rating && (
              <span style={{ fontSize: 13, color: "#fbbf24", fontWeight: 500, fontFamily: "DM Sans, system-ui, -apple-system, sans-serif", display: "flex", alignItems: "center", gap: 4 }}>
                <Star size={14} fill="#fbbf24" /> {perfume.rating}/10
              </span>
            )}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={onEdit} style={{ padding: "6px 14px", borderRadius: 6, border: "1px solid rgba(20,184,166,0.25)", background: "rgba(20,184,166,0.08)", color: "#2dd4bf", fontSize: 12, fontFamily: "DM Sans, system-ui, -apple-system, sans-serif", fontWeight: 500, cursor: "pointer" }}>
            Edit
          </button>
          <button onClick={onDelete} style={{ padding: "6px 14px", borderRadius: 6, border: "1px solid rgba(248,113,113,0.25)", background: "rgba(248,113,113,0.06)", color: "#f87171", fontSize: 12, fontFamily: "DM Sans, system-ui, -apple-system, sans-serif", fontWeight: 500, cursor: "pointer" }}>
            Delete
          </button>
        </div>
      </div>

      {/* Meta boxes */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 10, marginBottom: 16 }}>
        {perfume.scent_type && <MetaBox label="Scent Type" value={perfume.scent_type} />}
        {perfume.longevity && <MetaBox label="Longevity" value={perfume.longevity} />}
        {perfume.purchase_price && perfume.purchase_price > 0 && <MetaBox label="Price" value={formatPrice(perfume.purchase_price)} />}
        {perfume.purchase_date && <MetaBox label="Purchased" value={formatDate(perfume.purchase_date)} />}
      </div>

      {/* Season + Occasion */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
        {perfume.seasons?.map(s => <Badge key={s} variant="season">{s}</Badge>)}
        {perfume.occasion && <Badge variant="occasion">{perfume.occasion}</Badge>}
      </div>

      {/* Notes */}
      {(perfume.notes?.top || perfume.notes?.heart || perfume.notes?.base) && (
        <div style={{ marginBottom: 16 }}>
          <p style={{ fontSize: 10, color: "#14b8a6", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 10px", fontFamily: "DM Sans, system-ui, -apple-system, sans-serif" }}>
            Fragrance Notes
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {[{ label: "Top", val: perfume.notes?.top, color: "#7ecba1" }, { label: "Heart", val: perfume.notes?.heart, color: "#f9c74f" }, { label: "Base", val: perfume.notes?.base, color: "#f4845f" }].map(n => (
              <div key={n.label} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 6, padding: "8px 10px" }}>
                <p style={{ fontSize: 9, color: n.color, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", margin: "0 0 3px", fontFamily: "DM Sans, system-ui, -apple-system, sans-serif" }}>{n.label}</p>
                <p style={{ fontSize: 11, color: "#a0a0b4", margin: 0, lineHeight: 1.5, fontFamily: "DM Sans, system-ui, -apple-system, sans-serif" }}>{n.val || "—"}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {perfume.inspired_by && <p style={{ fontSize: 12, color: "#6b6b80", fontStyle: "italic", margin: "0 0 14px", fontFamily: "DM Sans, system-ui, -apple-system, sans-serif" }}>Inspired by: {perfume.inspired_by}</p>}

      {/* Analysis */}
      {perfume.analysis && (
        <div style={{ marginBottom: 16 }}>
          <p style={{ fontSize: 10, color: "#14b8a6", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 6px", fontFamily: "DM Sans, system-ui, -apple-system, sans-serif" }}>
            Analysis
          </p>
          <p style={{ fontSize: 14, color: "#a0a0b4", lineHeight: 1.7, margin: 0, fontFamily: "DM Sans, system-ui, -apple-system, sans-serif" }}>
            {perfume.analysis}
          </p>
        </div>
      )}

      {/* Tags */}
      {perfume.tags && perfume.tags.length > 0 && (
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {perfume.tags.map(t => <Badge key={t} variant="tag">{t}</Badge>)}
        </div>
      )}
    </div>
  );
}

function MetaBox({ label, value }: { label: string; value: string }) {
  return <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 6, padding: "8px 12px" }}>
    <p style={{ fontSize: 10, color: "#6b6b80", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 2px", fontFamily: "DM Sans, system-ui, -apple-system, sans-serif" }}>{label}</p>
    <p style={{ fontSize: 12, color: "#a0a0b4", margin: 0, fontFamily: "DM Sans, system-ui, -apple-system, sans-serif" }}>{value}</p>
  </div>;
}
