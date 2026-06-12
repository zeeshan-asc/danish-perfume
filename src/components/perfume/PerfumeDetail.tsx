"use client";

import { IPerfume } from "@/types";
import Badge from "@/components/ui/Badge";
import { SprayCan as Spray, Star } from "lucide-react";
import { formatDate, formatPrice } from "@/lib/utils";

interface PerfumeDetailProps {
  perfume: IPerfume;
  onEdit: () => void;
  onDelete: () => void;
}

export default function PerfumeDetail({
  perfume,
  onEdit,
  onDelete,
}: PerfumeDetailProps) {
  return (
    <div>
      {/* Image */}
      {perfume.imageId ? (
        <img
          src={`/api/images/${perfume.imageId}`}
          alt={perfume.name}
          style={{
            width: "100%",
            maxHeight: 240,
            objectFit: "cover",
            borderRadius: "var(--radius-lg)",
            marginBottom: 22,
            border: "1px solid var(--border-subtle)",
          }}
        />
      ) : (
        <div
          style={{
            width: "100%",
            height: 100,
            borderRadius: "var(--radius-lg)",
            marginBottom: 22,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "var(--accent-subtle)",
            border: "1px solid var(--accent-border)",
          }}
        >
          <Spray size={36} style={{ color: "var(--accent-primary)", opacity: 0.35 }} />
        </div>
      )}

      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 18,
        }}
      >
        <div>
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
          <h1
            style={{
              fontSize: 24,
              fontWeight: 600,
              color: "var(--text-primary)",
              margin: "0 0 8px",
              fontFamily: "var(--font-display)",
              letterSpacing: "-0.01em",
              lineHeight: 1.2,
            }}
          >
            {perfume.name}
          </h1>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            {perfume.status && <Badge variant="status">{perfume.status}</Badge>}
            {perfume.rating && (
              <span
                style={{
                  fontSize: 13,
                  color: "var(--warning)",
                  fontWeight: 600,
                  fontFamily: "var(--font-body)",
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <Star size={14} fill="var(--warning)" stroke="var(--warning)" />
                {perfume.rating}/10
              </span>
            )}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={onEdit}
            style={{
              padding: "7px 16px",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--accent-border)",
              background: "var(--accent-subtle)",
              color: "var(--accent-primary)",
              fontSize: 12,
              fontFamily: "var(--font-body)",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all var(--duration-fast) var(--ease-out)",
            }}
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            style={{
              padding: "7px 16px",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--danger-border)",
              background: "var(--danger-subtle)",
              color: "var(--danger)",
              fontSize: 12,
              fontFamily: "var(--font-body)",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all var(--duration-fast) var(--ease-out)",
            }}
          >
            Delete
          </button>
        </div>
      </div>

      {/* Meta boxes */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
          gap: 10,
          marginBottom: 18,
        }}
      >
        {perfume.scent_type && (
          <MetaBox label="Scent Type" value={perfume.scent_type} />
        )}
        {perfume.longevity && (
          <MetaBox label="Longevity" value={perfume.longevity} />
        )}
        {perfume.purchase_price && perfume.purchase_price > 0 && (
          <MetaBox label="Price" value={formatPrice(perfume.purchase_price)} />
        )}
        {perfume.purchase_date && (
          <MetaBox
            label="Purchased"
            value={formatDate(perfume.purchase_date)}
          />
        )}
      </div>

      {/* Season + Occasion */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 18 }}>
        {perfume.seasons?.map((s) => (
          <Badge key={s} variant="season">
            {s}
          </Badge>
        ))}
        {perfume.occasion && (
          <Badge variant="occasion">{perfume.occasion}</Badge>
        )}
      </div>

      {/* Notes */}
      {(perfume.notes?.top || perfume.notes?.heart || perfume.notes?.base) && (
        <div style={{ marginBottom: 18 }}>
          <p
            style={{
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--accent-primary)",
              margin: "0 0 12px",
              fontFamily: "var(--font-body)",
            }}
          >
            Fragrance Notes
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 8,
            }}
          >
            {[
              {
                label: "Top",
                val: perfume.notes?.top,
                color: "var(--season-spring)",
              },
              {
                label: "Heart",
                val: perfume.notes?.heart,
                color: "var(--season-summer)",
              },
              {
                label: "Base",
                val: perfume.notes?.base,
                color: "var(--season-fall)",
              },
            ].map((n) => (
              <div
                key={n.label}
                style={{
                  background: "rgba(255,255,255,0.02)",
                  borderRadius: "var(--radius-md)",
                  padding: "10px 12px",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <p
                  style={{
                    fontSize: 9,
                    fontWeight: 600,
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    color: n.color,
                    margin: "0 0 4px",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {n.label}
                </p>
                <p
                  style={{
                    fontSize: 12,
                    color: "var(--text-secondary)",
                    margin: 0,
                    lineHeight: 1.5,
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {n.val || "—"}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {perfume.inspired_by && (
        <p
          style={{
            fontSize: 12,
            color: "var(--text-muted)",
            fontStyle: "italic",
            margin: "0 0 16px",
            fontFamily: "var(--font-body)",
          }}
        >
          Inspired by: {perfume.inspired_by}
        </p>
      )}

      {/* Analysis */}
      {perfume.analysis && (
        <div style={{ marginBottom: 18 }}>
          <p
            style={{
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--accent-primary)",
              margin: "0 0 8px",
              fontFamily: "var(--font-body)",
            }}
          >
            Analysis
          </p>
          <p
            style={{
              fontSize: 14,
              color: "var(--text-secondary)",
              lineHeight: 1.75,
              margin: 0,
              fontFamily: "var(--font-body)",
            }}
          >
            {perfume.analysis}
          </p>
        </div>
      )}

      {/* Tags */}
      {perfume.tags && perfume.tags.length > 0 && (
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
          {perfume.tags.map((t) => (
            <Badge key={t} variant="tag">
              {t}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

function MetaBox({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.02)",
        borderRadius: "var(--radius-md)",
        padding: "10px 14px",
        border: "1px solid var(--border-subtle)",
      }}
    >
      <p
        style={{
          fontSize: 10,
          color: "var(--text-muted)",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          margin: "0 0 3px",
          fontFamily: "var(--font-body)",
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontSize: 13,
          color: "var(--text-secondary)",
          margin: 0,
          fontFamily: "var(--font-body)",
          fontWeight: 500,
        }}
      >
        {value}
      </p>
    </div>
  );
}
