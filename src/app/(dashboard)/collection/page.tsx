"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { usePerfumes } from "@/hooks/usePerfumes";
import { IPerfume } from "@/types";
import SearchBar from "@/components/search/SearchBar";
import FilterPanel from "@/components/search/FilterPanel";
import PerfumeCard from "@/components/perfume/PerfumeCard";
import PerfumeForm from "@/components/perfume/PerfumeForm";
import DeleteConfirm from "@/components/perfume/DeleteConfirm";
import { useToast } from "@/hooks/useToast";
import PerfumeDetail from "@/components/perfume/PerfumeDetail";
import Modal from "@/components/ui/Modal";
import { CollectionGridSkeleton } from "@/components/ui/Skeleton";
import {
  Plus, ChevronLeft, ChevronRight, SprayCan as Spray,
  Package, Star, DollarSign, X, ArrowUpDown,
} from "lucide-react";

const defaultFilters = {
  brand: "", status: "", season: "", scentType: "",
  minRating: "", maxRating: "", minPrice: "", maxPrice: "",
  sortBy: "createdAt", sortOrder: "desc",
};

const sortOptions = [
  { value: "createdAt", label: "Date Added" },
  { value: "name", label: "Name" },
  { value: "brand", label: "Brand" },
  { value: "rating", label: "Rating" },
  { value: "purchase_price", label: "Price" },
];

export default function CollectionPage() {
  const { perfumes, total, totalPages, loading, fetchPerfumes, deletePerfume } = usePerfumes();
  const { addToast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState(defaultFilters);
  const [showForm, setShowForm] = useState(false);
  const [editingPerfume, setEditingPerfume] = useState<IPerfume | null>(null);
  const [deletingPerfume, setDeletingPerfume] = useState<IPerfume | null>(null);
  const [viewingPerfume, setViewingPerfume] = useState<IPerfume | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [initialLoad, setInitialLoad] = useState(true);

  const buildParams = useCallback(() => {
    const params: Record<string, string> = {
      page: String(currentPage), limit: "16",
      sortBy: filters.sortBy, sortOrder: filters.sortOrder,
    };
    if (searchQuery) params.search = searchQuery;
    if (filters.brand) params.brand = filters.brand;
    if (filters.status) params.status = filters.status;
    if (filters.season) params.season = filters.season;
    if (filters.scentType) params.scent_type = filters.scentType;
    if (filters.minRating) params.minRating = filters.minRating;
    if (filters.maxRating) params.maxRating = filters.maxRating;
    if (filters.minPrice) params.minPrice = filters.minPrice;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    return params;
  }, [searchQuery, filters, currentPage]);

  useEffect(() => {
    fetchPerfumes(buildParams()).finally(() => setInitialLoad(false));
  }, [buildParams, fetchPerfumes]);

  const handleView = (perfume: IPerfume) => setViewingPerfume(perfume);
  const handleEdit = (perfume: IPerfume) => { setEditingPerfume(perfume); setShowForm(true); };
  const handleDelete = async () => {
    if (!deletingPerfume) return;
    const result = await deletePerfume(deletingPerfume.id || deletingPerfume._id);
    if (result.error) addToast(result.error, "error");
    else { addToast("Perfume removed", "success"); fetchPerfumes(buildParams()); }
    setDeletingPerfume(null);
  };

  const onFilterChange = useCallback((key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  }, []);
  const onClear = useCallback(() => { setFilters(defaultFilters); setSearchQuery(""); setCurrentPage(1); }, []);

  // Active filter chips
  const activeChips = useMemo(() => {
    const chips: { key: string; label: string; value: string }[] = [];
    if (searchQuery) chips.push({ key: "search", label: "Search", value: searchQuery });
    if (filters.brand) chips.push({ key: "brand", label: "Brand", value: filters.brand });
    if (filters.status) chips.push({ key: "status", label: "Status", value: filters.status });
    if (filters.season) chips.push({ key: "season", label: "Season", value: filters.season });
    if (filters.scentType) chips.push({ key: "scentType", label: "Scent", value: filters.scentType });
    if (filters.minRating) chips.push({ key: "minRating", label: "Min Rating", value: `≥ ${filters.minRating}` });
    if (filters.maxRating) chips.push({ key: "maxRating", label: "Max Rating", value: `≤ ${filters.maxRating}` });
    if (filters.minPrice) chips.push({ key: "minPrice", label: "Min Price", value: `≥ $${filters.minPrice}` });
    if (filters.maxPrice) chips.push({ key: "maxPrice", label: "Max Price", value: `≤ $${filters.maxPrice}` });
    return chips;
  }, [searchQuery, filters]);

  const removeChip = (key: string) => {
    if (key === "search") { setSearchQuery(""); return; }
    onFilterChange(key, "");
  };

  const currentSortLabel = sortOptions.find(o => o.value === filters.sortBy)?.label || "Date Added";

  return (
    <div style={{ paddingBottom: 60 }}>
      {/* ═══════════════════════════════════════
          HERO HEADER — with collection stats
          ═══════════════════════════════════════ */}
      <div className="collection-hero" style={{
        marginTop: 28,
        padding: "28px 32px",
        borderRadius: "var(--radius-xl)",
        background: "linear-gradient(135deg, rgba(200,164,78,0.04) 0%, transparent 100%), var(--bg-tertiary)",
        border: "1px solid rgba(200,164,78,0.10)",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 20,
      }}>
        {/* Left: Title */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{
            width: 50, height: 50, borderRadius: "var(--radius-lg)",
            background: "var(--accent-subtle)", border: "1px solid var(--accent-border)",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <Spray size={22} style={{ color: "var(--accent-primary)" }} />
          </div>
          <div>
            <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", color: "var(--accent-primary)", margin: "0 0 4px", textTransform: "uppercase", fontFamily: "var(--font-body)" }}>
              My Collection
            </p>
            <h1 style={{ fontSize: "clamp(24px, 3vw, 34px)", fontWeight: 600, color: "var(--text-primary)", margin: 0, letterSpacing: "-0.01em", fontFamily: "var(--font-display)" }}>
              Fragrance Catalog
            </h1>
          </div>
        </div>

        {/* Right: Quick stats + Add */}
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div className="collection-hero-stats" style={{ display: "flex", gap: 0 }}>
            {[
              { label: "Total", value: total, color: "var(--accent-primary)" },
              { label: "Owned", value: perfumes.filter(p => p.status === "Owned").length, color: "var(--teal-primary)" },
              { label: "Wishlist", value: perfumes.filter(p => p.status === "Wishlist").length, color: "var(--info)" },
            ].map((s, i, arr) => (
              <div key={s.label} style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                padding: "0 18px",
                borderRight: i < arr.length - 1 ? "1px solid var(--border-subtle)" : "none",
                gap: 2,
              }}>
                <span style={{ fontSize: 9, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600, fontFamily: "var(--font-body)" }}>{s.label}</span>
                <span style={{ fontSize: 17, fontWeight: 600, color: s.color, fontFamily: "var(--font-display)" }}>{s.value}</span>
              </div>
            ))}
          </div>
          <button onClick={() => setShowForm(true)} style={{
            display: "flex", alignItems: "center", gap: 7,
            padding: "10px 20px", borderRadius: "var(--radius-md)",
            border: "1px solid var(--accent-border-strong)",
            background: "var(--accent-muted)", color: "var(--accent-primary)",
            fontSize: 13, fontFamily: "var(--font-body)", fontWeight: 600,
            cursor: "pointer", transition: "all var(--duration-fast) var(--ease-out)",
            whiteSpace: "nowrap",
          }}>
            <Plus size={16} /> Add Perfume
          </button>
        </div>
      </div>

      {/* ═══════════════════════════════════════
          TOOLBAR — Search + Sort + Filter toggle
          ═══════════════════════════════════════ */}
      <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 12 }}>
        {/* Search + Sort row */}
        <div className="collection-toolbar" style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ flex: 1 }}>
            <SearchBar onSearch={(q) => { setSearchQuery(q); setCurrentPage(1); }} />
          </div>
          {/* Sort dropdown */}
          <div style={{ position: "relative", flexShrink: 0 }}>
            <select
              value={filters.sortBy}
              onChange={(e) => onFilterChange("sortBy", e.target.value)}
              style={{
                appearance: "none", WebkitAppearance: "none",
                padding: "11px 36px 11px 14px",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--border-default)",
                background: `var(--bg-tertiary) url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23757075' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") no-repeat right 12px center`,
                color: "var(--text-secondary)", fontSize: 13,
                fontFamily: "var(--font-body)", fontWeight: 500,
                cursor: "pointer", outline: "none",
              }}
            >
              {sortOptions.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <button
              onClick={() => onFilterChange("sortOrder", filters.sortOrder === "asc" ? "desc" : "asc")}
              title={`Sort ${filters.sortOrder === "asc" ? "descending" : "ascending"}`}
              style={{
                position: "absolute", right: 38, top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none", cursor: "pointer",
                color: "var(--accent-primary)", padding: 2, display: "flex",
              }}
            >
              <ArrowUpDown size={13} style={{ transform: filters.sortOrder === "asc" ? "scaleY(-1)" : "none" }} />
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        <FilterPanel perfumes={perfumes} filters={filters} onFilterChange={onFilterChange} onClear={onClear} />
      </div>

      {/* ═══════════════════════════════════════
          ACTIVE FILTER CHIPS
          ═══════════════════════════════════════ */}
      {activeChips.length > 0 && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 16, marginBottom: 8 }}>
          {activeChips.map(chip => (
            <span key={chip.key} style={{
              display: "flex", alignItems: "center", gap: 5,
              padding: "5px 12px", borderRadius: "var(--radius-full)",
              background: "var(--accent-subtle)", border: "1px solid var(--accent-border)",
              color: "var(--accent-primary)", fontSize: 12,
              fontFamily: "var(--font-body)", fontWeight: 500,
            }}>
              <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>{chip.label}:</span> {chip.value}
              <button onClick={() => removeChip(chip.key)} style={{
                background: "none", border: "none", cursor: "pointer",
                color: "var(--accent-primary)", padding: 0, display: "flex",
                opacity: 0.5, marginLeft: 2,
              }}>
                <X size={11} />
              </button>
            </span>
          ))}
          <button onClick={onClear} style={{
            padding: "5px 12px", borderRadius: "var(--radius-full)",
            background: "transparent", border: "1px solid var(--border-default)",
            color: "var(--text-muted)", fontSize: 11,
            fontFamily: "var(--font-body)", fontWeight: 500, cursor: "pointer",
            transition: "all var(--duration-fast) var(--ease-out)",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--danger-border)"; e.currentTarget.style.color = "var(--danger)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-default)"; e.currentTarget.style.color = "var(--text-muted)"; }}
          >
            Clear all
          </button>
        </div>
      )}

      {/* ═══════════════════════════════════════
          RESULTS ROW
          ═══════════════════════════════════════ */}
      <div className="collection-page-info" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: activeChips.length === 0 ? 20 : 12, marginBottom: 20 }}>
        <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0, fontFamily: "var(--font-body)", fontWeight: 500 }}>
          {loading && initialLoad ? "Loading..." : `${total} fragrance${total !== 1 ? "s" : ""}${searchQuery ? ` matching "${searchQuery}"` : ""}`}
        </p>
        <span style={{ fontSize: 11, color: "var(--text-dim)", fontFamily: "var(--font-body)" }}>
          Page {currentPage}{totalPages > 1 ? ` of ${totalPages}` : ""} · {perfumes.length} shown
        </span>
      </div>

      {/* ═══════════════════════════════════════
          GRID / SKELETON / EMPTY
          ═══════════════════════════════════════ */}
      {loading && initialLoad ? (
        <CollectionGridSkeleton count={8} />
      ) : perfumes.length === 0 ? (
        /* ── Empty State ── */
        <div style={{ textAlign: "center", padding: "80px 0 40px" }}>
          <div style={{
            width: 80, height: 80, borderRadius: "var(--radius-xl)",
            background: "var(--accent-subtle)", border: "1px solid var(--accent-border)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 20px",
          }}>
            <Spray size={36} style={{ color: "var(--accent-primary)", opacity: 0.4 }} />
          </div>
          {searchQuery || activeChips.length > 0 ? (
            <>
              <p style={{ fontSize: 20, color: "var(--text-primary)", marginBottom: 8, fontWeight: 600, fontFamily: "var(--font-display)" }}>
                No matches found
              </p>
              <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 24, fontFamily: "var(--font-body)" }}>
                Try adjusting your filters or search terms
              </p>
              <button onClick={onClear} style={{
                padding: "10px 22px", borderRadius: "var(--radius-md)",
                border: "1px solid var(--accent-border)", background: "var(--accent-subtle)",
                color: "var(--accent-primary)", fontSize: 13, fontFamily: "var(--font-body)",
                fontWeight: 600, cursor: "pointer",
              }}>
                Clear all filters
              </button>
            </>
          ) : (
            <>
              <p style={{ fontSize: 20, color: "var(--text-primary)", marginBottom: 8, fontWeight: 600, fontFamily: "var(--font-display)" }}>
                Your collection is empty
              </p>
              <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 28, fontFamily: "var(--font-body)", lineHeight: 1.6 }}>
                Start building your fragrance catalog — track every bottle, note, and memory
              </p>
              <button onClick={() => setShowForm(true)} style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "12px 28px", borderRadius: "var(--radius-md)",
                border: "1px solid var(--accent-border-strong)",
                background: "var(--accent-muted)", color: "var(--accent-primary)",
                fontSize: 14, fontFamily: "var(--font-body)", fontWeight: 600,
                cursor: "pointer",
              }}>
                <Plus size={16} /> Add Your First Perfume
              </button>
            </>
          )}
        </div>
      ) : (
        /* ── Card Grid ── */
        <div className="collection-grid" style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
          gap: 16,
        }}>
          {perfumes.map((perfume) => (
            <PerfumeCard
              key={perfume.id || perfume._id}
              perfume={perfume}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={setDeletingPerfume}
            />
          ))}
        </div>
      )}

      {/* ═══════════════════════════════════════
          PAGINATION
          ═══════════════════════════════════════ */}
      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 4, marginTop: 40 }}>
          <button disabled={currentPage <= 1} onClick={() => setCurrentPage(p => p - 1)} style={{
            display: "flex", alignItems: "center", gap: 5, padding: "9px 16px",
            borderRadius: "var(--radius-md)", border: "1px solid var(--border-default)",
            background: "rgba(255,255,255,0.02)", color: currentPage <= 1 ? "var(--text-dim)" : "var(--text-secondary)",
            fontSize: 13, fontFamily: "var(--font-body)", fontWeight: 500,
            cursor: currentPage <= 1 ? "default" : "pointer",
            opacity: currentPage <= 1 ? 0.4 : 1,
            transition: "all var(--duration-fast) var(--ease-out)",
          }}>
            <ChevronLeft size={15} /> Previous
          </button>

          {/* Page buttons with ellipsis */}
          {(() => {
            const buttons: (number | "...")[] = [];
            if (totalPages <= 7) {
              for (let i = 1; i <= totalPages; i++) buttons.push(i);
            } else {
              buttons.push(1);
              if (currentPage > 3) buttons.push("...");
              const start = Math.max(2, currentPage - 1);
              const end = Math.min(totalPages - 1, currentPage + 1);
              for (let i = start; i <= end; i++) buttons.push(i);
              if (currentPage < totalPages - 2) buttons.push("...");
              buttons.push(totalPages);
            }
            return buttons.map((b, i) =>
              b === "..." ? (
                <span key={`ellipsis-${i}`} style={{ padding: "0 4px", color: "var(--text-dim)", fontSize: 13, fontFamily: "var(--font-body)" }}>...</span>
              ) : (
                <button key={b} onClick={() => setCurrentPage(b)} style={{
                  width: 36, height: 36, borderRadius: "var(--radius-md)",
                  border: currentPage === b ? "1px solid var(--accent-border-strong)" : "1px solid var(--border-default)",
                  background: currentPage === b ? "var(--accent-subtle)" : "transparent",
                  color: currentPage === b ? "var(--accent-primary)" : "var(--text-secondary)",
                  fontSize: 13, fontFamily: "var(--font-body)", fontWeight: 600,
                  cursor: "pointer", transition: "all var(--duration-fast) var(--ease-out)",
                }}>
                  {b}
                </button>
              )
            );
          })()}

          <button disabled={currentPage >= totalPages} onClick={() => setCurrentPage(p => p + 1)} style={{
            display: "flex", alignItems: "center", gap: 5, padding: "9px 16px",
            borderRadius: "var(--radius-md)", border: "1px solid var(--border-default)",
            background: "rgba(255,255,255,0.02)", color: currentPage >= totalPages ? "var(--text-dim)" : "var(--text-secondary)",
            fontSize: 13, fontFamily: "var(--font-body)", fontWeight: 500,
            cursor: currentPage >= totalPages ? "default" : "pointer",
            opacity: currentPage >= totalPages ? 0.4 : 1,
            transition: "all var(--duration-fast) var(--ease-out)",
          }}>
            Next <ChevronRight size={15} />
          </button>
        </div>
      )}

      {/* ═══════════════════════════════════════
          MODALS
          ═══════════════════════════════════════ */}
      {showForm && (
        <PerfumeForm perfume={editingPerfume} onClose={() => { setShowForm(false); setEditingPerfume(null); }} onSaved={() => { setShowForm(false); setEditingPerfume(null); fetchPerfumes(buildParams()); }} />
      )}
      {deletingPerfume && (
        <DeleteConfirm perfumeName={deletingPerfume.name} onConfirm={handleDelete} onCancel={() => setDeletingPerfume(null)} />
      )}
      {viewingPerfume && (
        <Modal isOpen onClose={() => setViewingPerfume(null)} title="" size="md">
          <div style={{ maxHeight: "75vh", overflowY: "auto", padding: "4px 0" }}>
            <PerfumeDetail perfume={viewingPerfume} onEdit={() => { setViewingPerfume(null); setEditingPerfume(viewingPerfume); setShowForm(true); }} onDelete={() => { setViewingPerfume(null); setDeletingPerfume(viewingPerfume); }} />
          </div>
        </Modal>
      )}
    </div>
  );
}
