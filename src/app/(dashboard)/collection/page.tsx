"use client";

import { useEffect, useState, useCallback } from "react";
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
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";

const defaultFilters = { brand: "", status: "", season: "", scentType: "", minRating: "", maxRating: "", minPrice: "", maxPrice: "", sortBy: "createdAt", sortOrder: "desc" };

export default function CollectionPage() {
  const { perfumes, total, page, totalPages, loading, fetchPerfumes, deletePerfume } = usePerfumes();
  const { addToast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState(defaultFilters);
  const [showForm, setShowForm] = useState(false);
  const [editingPerfume, setEditingPerfume] = useState<IPerfume | null>(null);
  const [deletingPerfume, setDeletingPerfume] = useState<IPerfume | null>(null);
  const [viewingPerfume, setViewingPerfume] = useState<IPerfume | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const buildParams = useCallback(() => {
    const params: Record<string, string> = { page: String(currentPage), limit: "20", sortBy: filters.sortBy, sortOrder: filters.sortOrder };
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

  useEffect(() => { fetchPerfumes(buildParams()); }, [buildParams, fetchPerfumes]);

  const handleView = (perfume: IPerfume) => setViewingPerfume(perfume);
  const handleEdit = (perfume: IPerfume) => { setEditingPerfume(perfume); setShowForm(true); };
  const handleDelete = async () => {
    if (!deletingPerfume) return;
    const result = await deletePerfume(deletingPerfume.id || deletingPerfume._id);
    if (result.error) addToast(result.error, "error");
    else { addToast("Perfume removed", "success"); fetchPerfumes(buildParams()); }
    setDeletingPerfume(null);
  };

  const onFilterChange = useCallback((key: string, value: string) => { setFilters(prev => ({ ...prev, [key]: value })); setCurrentPage(1); }, []);
  const onClear = useCallback(() => { setFilters(defaultFilters); setSearchQuery(""); setCurrentPage(1); }, []);

  const pillBase: React.CSSProperties = { padding: "6px 16px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)", color: "#a0a0b4", fontSize: 13, fontFamily: "DM Sans, system-ui, -apple-system, sans-serif", fontWeight: 500, display: "flex", alignItems: "center", gap: 4, cursor: "pointer" };

  return (
    <div>
      {/* ── Header ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", padding: "28px 0 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", marginBottom: 24 }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", color: "#14b8a6", margin: "0 0 2px", textTransform: "uppercase", fontFamily: "DM Sans, system-ui, -apple-system, sans-serif" }}>
            My Collection
          </p>
          <h1 style={{ fontSize: "clamp(20px, 2.5vw, 30px)", fontWeight: 500, color: "#f0f0f4", margin: 0, fontFamily: "DM Sans, system-ui, -apple-system, sans-serif" }}>
            Fragrance Catalog
          </h1>
        </div>
        <button onClick={() => setShowForm(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: "1px solid rgba(20,184,166,0.3)", background: "rgba(20,184,166,0.1)", color: "#2dd4bf", fontSize: 13, fontFamily: "DM Sans, system-ui, -apple-system, sans-serif", fontWeight: 500, cursor: "pointer", transition: "all 0.15s ease" }}>
          <Plus size={14} /> Add Perfume
        </button>
      </div>

      {/* ── Toolbar ── */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ marginBottom: 12 }}><SearchBar onSearch={(q) => { setSearchQuery(q); setCurrentPage(1); }} /></div>
        <FilterPanel perfumes={perfumes} filters={filters} onFilterChange={onFilterChange} onClear={onClear} />
      </div>

      <p style={{ fontSize: 13, color: "#6b6b80", marginBottom: 16, fontFamily: "DM Sans, system-ui, -apple-system, sans-serif", fontWeight: 500 }}>
        {loading ? "Loading..." : `Showing ${perfumes.length} of ${total} fragrances`}{searchQuery ? ` matching "${searchQuery}"` : ""}
      </p>

      {/* ── Grid ── */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#6b6b80", fontFamily: "DM Sans, system-ui, -apple-system, sans-serif" }}>Loading...</div>
      ) : perfumes.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <p style={{ fontSize: 15, color: "#a0a0b4", marginBottom: 6, fontFamily: "DM Sans, system-ui, -apple-system, sans-serif" }}>No fragrances yet</p>
          <p style={{ fontSize: 13, color: "#6b6b80", fontFamily: "DM Sans, system-ui, -apple-system, sans-serif" }}>Click <span style={{ color: "#2dd4bf" }}>+ Add Perfume</span> to get started</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 14 }}>
          {perfumes.map((perfume, idx) => (
            <PerfumeCard key={perfume.id || perfume._id} perfume={perfume} onView={handleView} onEdit={handleEdit} onDelete={setDeletingPerfume} />
          ))}
        </div>
      )}

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 4, marginTop: 32 }}>
          <button disabled={currentPage <= 1} onClick={() => setCurrentPage(p => p - 1)}
            style={{ ...pillBase, opacity: currentPage <= 1 ? 0.3 : 1, cursor: currentPage <= 1 ? "default" : "pointer" }}>
            <ChevronLeft size={14} /> Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(pnum => (
            <button key={pnum} onClick={() => setCurrentPage(pnum)}
              style={{ width: 32, height: 32, borderRadius: 6, border: currentPage === pnum ? "1px solid rgba(20,184,166,0.4)" : "1px solid rgba(255,255,255,0.06)", background: currentPage === pnum ? "rgba(20,184,166,0.1)" : "transparent", color: currentPage === pnum ? "#2dd4bf" : "#a0a0b4", fontSize: 13, fontFamily: "DM Sans, system-ui, -apple-system, sans-serif", fontWeight: 500, cursor: "pointer" }}>
              {pnum}
            </button>
          ))}
          <button disabled={currentPage >= totalPages} onClick={() => setCurrentPage(p => p + 1)}
            style={{ ...pillBase, opacity: currentPage >= totalPages ? 0.3 : 1, cursor: currentPage >= totalPages ? "default" : "pointer" }}>
            Next <ChevronRight size={14} />
          </button>
        </div>
      )}

      {showForm && <PerfumeForm perfume={editingPerfume} onClose={() => { setShowForm(false); setEditingPerfume(null); }} onSaved={() => { setShowForm(false); setEditingPerfume(null); fetchPerfumes(buildParams()); }} />}
      {deletingPerfume && <DeleteConfirm perfumeName={deletingPerfume.name} onConfirm={handleDelete} onCancel={() => setDeletingPerfume(null)} />}
      {viewingPerfume && (
        <Modal isOpen onClose={() => setViewingPerfume(null)} title="" size="md">
          <div style={{ maxHeight: "75vh", overflowY: "auto", padding: "4px 0" }}>
            <PerfumeDetail
              perfume={viewingPerfume}
              onEdit={() => { setViewingPerfume(null); setEditingPerfume(viewingPerfume); setShowForm(true); }}
              onDelete={() => { setViewingPerfume(null); setDeletingPerfume(viewingPerfume); }}
            />
          </div>
        </Modal>
      )}
    </div>
  );
}
