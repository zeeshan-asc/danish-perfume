"use client";

import { useState } from "react";
import { IPerfume } from "@/types";
import { Pencil, Trash2, SprayCan as Spray } from "lucide-react";

const seasonColors: Record<string, string> = {
  Spring: "var(--season-spring)",
  Summer: "var(--season-summer)",
  Fall: "var(--season-fall)",
  Winter: "var(--season-winter)",
};

interface PerfumeCardProps {
  perfume: IPerfume;
  onView?: (perfume: IPerfume) => void;
  onEdit?: (perfume: IPerfume) => void;
  onDelete?: (perfume: IPerfume) => void;
}

export default function PerfumeCard({
  perfume,
  onView,
  onEdit,
  onDelete,
}: PerfumeCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      onClick={() => onView?.(perfume)}
      className="group"
      style={{
        background: "var(--bg-tertiary)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-lg)",
        padding: "18px 20px",
        cursor: "pointer",
        transition: "all var(--duration-normal) var(--ease-out)",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(200,164,78,0.15)";
        e.currentTarget.style.boxShadow = "var(--shadow-glow)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--border-subtle)";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Season dots */}
      {perfume.seasons && perfume.seasons.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            display: "flex",
            gap: 4,
            zIndex: 2,
          }}
        >
          {perfume.seasons.map((s) => (
            <span
              key={s}
              title={s}
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: seasonColors[s] || "#555",
                display: "inline-block",
                boxShadow: `0 0 6px ${seasonColors[s] || "#555"}`,
              }}
            />
          ))}
        </div>
      )}

      {/* Image area */}
      {perfume.imageId && !imageError ? (
        <img
          src={`/api/images/${perfume.imageId}`}
          alt={perfume.name}
          style={{
            width: "100%",
            height: 150,
            objectFit: "cover",
            borderRadius: "var(--radius-md)",
            marginBottom: 14,
          }}
          width={300}
          height={150}
          onError={() => setImageError(true)}
        />
      ) : (
        <div
          style={{
            width: "100%",
            height: 52,
            borderRadius: "var(--radius-md)",
            marginBottom: 14,
            background: "var(--accent-subtle)",
            border: "1px solid var(--accent-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Spray size={20} style={{ color: "var(--accent-primary)", opacity: 0.3 }} />
        </div>
      )}

      {/* Brand */}
      <p
        style={{
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--accent-primary)",
          margin: "0 0 4px",
          fontFamily: "var(--font-body)",
        }}
      >
        {perfume.brand}
      </p>

      {/* Name */}
      <h3
        style={{
          fontSize: 16,
          fontWeight: 600,
          color: "var(--text-primary)",
          margin: "0 0 12px",
          lineHeight: 1.3,
          paddingRight: 56,
          fontFamily: "var(--font-display)",
          letterSpacing: "0.01em",
        }}
      >
        {perfume.name}
      </h3>

      {/* Info rows */}
      {perfume.scent_type && (
        <p
          style={{
            fontSize: 12,
            color: "var(--text-secondary)",
            margin: "0 0 4px",
            fontFamily: "var(--font-body)",
          }}
        >
          <span style={{ color: "var(--text-muted)" }}>Scent: </span>
          {perfume.scent_type}
        </p>
      )}

      {perfume.status && (
        <span
          style={{
            display: "inline-block",
            fontSize: 11,
            padding: "2px 9px",
            borderRadius: "var(--radius-sm)",
            fontWeight: 500,
            fontFamily: "var(--font-body)",
            ...(perfume.status === "Owned"
              ? {
                  background: "var(--teal-subtle)",
                  color: "var(--teal-primary)",
                  border: "1px solid var(--teal-border)",
                }
              : perfume.status === "Sold"
              ? {
                  background: "var(--danger-subtle)",
                  color: "var(--danger)",
                  border: "1px solid var(--danger-border)",
                }
              : {
                  background: "var(--info-subtle)",
                  color: "var(--info)",
                  border: "1px solid rgba(96,165,250,0.25)",
                }),
            marginTop: 6,
          }}
        >
          {perfume.status}
        </span>
      )}

      {/* Hover hint */}
      <p
        style={{
          fontSize: 10,
          color: "var(--text-dim)",
          margin: "10px 0 0",
          fontFamily: "var(--font-body)",
          transition: "color var(--duration-fast) var(--ease-out)",
          fontWeight: 500,
        }}
      >
        Click to view details →
      </p>

      {/* Edit/Delete buttons (show on hover) */}
      <div
        style={{
          position: "absolute",
          bottom: 14,
          right: 14,
          display: "flex",
          gap: 4,
          opacity: 0,
          transition: "opacity var(--duration-fast) var(--ease-out)",
        }}
        className="group-hover-opacity-100"
        onClick={(e) => e.stopPropagation()}
      >
        {onEdit && (
          <button
            onClick={() => onEdit(perfume)}
            title="Edit"
            style={{
              padding: 5,
              background: "var(--bg-tertiary)",
              border: "1px solid var(--border-default)",
              cursor: "pointer",
              color: "var(--text-muted)",
              borderRadius: "var(--radius-sm)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all var(--duration-fast) var(--ease-out)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--accent-primary)";
              e.currentTarget.style.borderColor = "var(--accent-border)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--text-muted)";
              e.currentTarget.style.borderColor = "var(--border-default)";
            }}
          >
            <Pencil size={12} />
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(perfume)}
            title="Delete"
            style={{
              padding: 5,
              background: "var(--bg-tertiary)",
              border: "1px solid var(--border-default)",
              cursor: "pointer",
              color: "var(--text-muted)",
              borderRadius: "var(--radius-sm)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all var(--duration-fast) var(--ease-out)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--danger)";
              e.currentTarget.style.borderColor = "var(--danger-border)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--text-muted)";
              e.currentTarget.style.borderColor = "var(--border-default)";
            }}
          >
            <Trash2 size={12} />
          </button>
        )}
      </div>
    </div>
  );
}
