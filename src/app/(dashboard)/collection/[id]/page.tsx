"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { usePerfumes } from "@/hooks/usePerfumes";
import { useToast } from "@/hooks/useToast";
import PerfumeDetail from "@/components/perfume/PerfumeDetail";
import PerfumeForm from "@/components/perfume/PerfumeForm";
import DeleteConfirm from "@/components/perfume/DeleteConfirm";
import { IPerfume } from "@/types";
import { ArrowLeft } from "lucide-react";

export default function PerfumeDetailPage() {
  const params = useParams(); const router = useRouter();
  const { getPerfume, deletePerfume } = usePerfumes();
  const { addToast } = useToast();
  const [perfume, setPerfume] = useState<IPerfume | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const id = params?.id as string;

  useEffect(() => { const f = async () => { if (!id) return; const d = await getPerfume(id); setPerfume(d); setLoading(false); }; f(); }, [id, getPerfume]);

  const handleDelete = async () => {
    if (!perfume) return;
    const r = await deletePerfume(perfume.id || perfume._id);
    if (r.error) { addToast(r.error, "error"); } else { addToast("Deleted", "success"); router.push("/collection"); }
    setShowDelete(false);
  };

  const handleFormSaved = async () => { setShowForm(false); if (id) { const d = await getPerfume(id); setPerfume(d); } };

  if (loading) return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh", color: "#6b6b80", fontFamily: "DM Sans, system-ui, -apple-system, sans-serif" }}>Loading...</div>;
  if (!perfume) return <div style={{ maxWidth: 600, margin: "0 auto", padding: "60px 20px", textAlign: "center" }}><p style={{ fontSize: 15, color: "#a0a0b4", marginBottom: 16, fontFamily: "DM Sans, system-ui, -apple-system, sans-serif" }}>Perfume not found</p><button onClick={() => router.push("/collection")} style={{ padding: "8px 18px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)", color: "#a0a0b4", fontSize: 13, fontFamily: "DM Sans, system-ui, -apple-system, sans-serif", cursor: "pointer", fontWeight: 500 }}>Back to Collection</button></div>;

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "28px 0 40px" }}>
      <button onClick={() => router.push("/collection")} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, marginBottom: 24, fontFamily: "DM Sans, system-ui, -apple-system, sans-serif", color: "#6b6b80", border: "none", background: "none", cursor: "pointer", fontWeight: 500, padding: 0 }}>
        <ArrowLeft size={14} /> Back to Collection
      </button>
      <PerfumeDetail perfume={perfume} onEdit={() => setShowForm(true)} onDelete={() => setShowDelete(true)} />
      {showForm && <PerfumeForm perfume={perfume} onClose={() => setShowForm(false)} onSaved={handleFormSaved} />}
      {showDelete && <DeleteConfirm perfumeName={perfume.name} onConfirm={handleDelete} onCancel={() => setShowDelete(false)} />}
    </div>
  );
}
