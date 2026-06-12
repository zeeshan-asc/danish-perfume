import { IPerfume } from "@/types";
import PerfumeCard from "./PerfumeCard";
import { SprayCan as Spray } from "lucide-react";

interface PerfumeGridProps {
  perfumes: IPerfume[];
  onView?: (perfume: IPerfume) => void;
  onEdit?: (perfume: IPerfume) => void;
  onDelete?: (perfume: IPerfume) => void;
  emptyMessage?: string;
  showAddCta?: boolean;
}

export default function PerfumeGrid({
  perfumes,
  onView,
  onEdit,
  onDelete,
  emptyMessage = "No fragrances yet",
  showAddCta = false,
}: PerfumeGridProps) {
  if (perfumes.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "60px 0" }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "var(--radius-xl)",
            background: "var(--accent-subtle)",
            border: "1px solid var(--accent-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 18px",
          }}
        >
          <Spray size={28} style={{ color: "var(--accent-primary)", opacity: 0.3 }} />
        </div>
        <p
          style={{
            fontSize: 15,
            color: "var(--text-secondary)",
            marginBottom: 8,
            fontFamily: "var(--font-display)",
            fontWeight: 600,
          }}
        >
          {emptyMessage}
        </p>
        {showAddCta && (
          <p
            style={{
              fontSize: 13,
              color: "var(--text-muted)",
              fontFamily: "var(--font-body)",
            }}
          >
            Click{" "}
            <span style={{ color: "var(--accent-primary)", fontWeight: 600 }}>
              + Add Perfume
            </span>{" "}
            to get started
          </p>
        )}
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
        gap: 14,
      }}
    >
      {perfumes.map((perfume) => (
        <PerfumeCard
          key={perfume.id || perfume._id}
          perfume={perfume}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
