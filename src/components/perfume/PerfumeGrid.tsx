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

export default function PerfumeGrid({ perfumes, onView, onEdit, onDelete, emptyMessage = "No fragrances yet", showAddCta = false }: PerfumeGridProps) {
  if (perfumes.length === 0) {
    return (
      <div className="text-center py-20 animate-fade">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6"
          style={{ background: "rgba(20,184,166,0.04)", border: "1px solid rgba(20,184,166,0.08)" }}>
          <Spray size={32} style={{ color: "rgba(20,184,166,0.2)" }} />
        </div>
        <p className="text-sm font-serif mb-3" style={{ color: "#a0a0b4" }}>{emptyMessage}</p>
        {showAddCta && (
          <p className="text-xs font-serif" style={{ color: "#6b6b80" }}>
            Click <span style={{ color: "#2dd4bf" }}>+ Add Perfume</span> to get started
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))" }}>
      {perfumes.map((perfume, idx) => (
        <PerfumeCard key={perfume.id || perfume._id} perfume={perfume} onView={onView} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}
