"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { usePerfumes } from "@/hooks/usePerfumes";
import { useToast } from "@/hooks/useToast";
import PerfumeDetail from "@/components/perfume/PerfumeDetail";
import PerfumeForm from "@/components/perfume/PerfumeForm";
import DeleteConfirm from "@/components/perfume/DeleteConfirm";
import Spinner from "@/components/ui/Spinner";
import { IPerfume } from "@/types";
import { ArrowLeft } from "lucide-react";

export default function PerfumeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getPerfume, deletePerfume } = usePerfumes();
  const { addToast } = useToast();
  const [perfume, setPerfume] = useState<IPerfume | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const id = params?.id as string;

  useEffect(() => {
    const f = async () => {
      if (!id) return;
      const d = await getPerfume(id);
      setPerfume(d);
      setLoading(false);
    };
    f();
  }, [id, getPerfume]);

  const handleDelete = async () => {
    if (!perfume) return;
    const r = await deletePerfume(perfume.id || perfume._id);
    if (r.error) {
      addToast(r.error, "error");
    } else {
      addToast("Deleted", "success");
      router.push("/collection");
    }
    setShowDelete(false);
  };

  const handleFormSaved = async () => {
    setShowForm(false);
    if (id) {
      const d = await getPerfume(id);
      setPerfume(d);
    }
  };

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          gap: 12,
        }}
      >
        <Spinner size={20} />
        <span
          style={{
            color: "var(--text-muted)",
            fontFamily: "var(--font-body)",
            fontSize: 14,
          }}
        >
          Loading...
        </span>
      </div>
    );

  if (!perfume)
    return (
      <div
        style={{
          maxWidth: 600,
          margin: "0 auto",
          padding: "60px 20px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: 16,
            color: "var(--text-secondary)",
            marginBottom: 20,
            fontFamily: "var(--font-display)",
            fontWeight: 600,
          }}
        >
          Perfume not found
        </p>
        <button
          onClick={() => router.push("/collection")}
          style={{
            padding: "10px 22px",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-default)",
            background: "rgba(255,255,255,0.04)",
            color: "var(--text-secondary)",
            fontSize: 13,
            fontFamily: "var(--font-body)",
            cursor: "pointer",
            fontWeight: 500,
            transition: "all var(--duration-fast) var(--ease-out)",
          }}
        >
          Back to Collection
        </button>
      </div>
    );

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "28px 0 40px" }}>
      <button
        onClick={() => router.push("/collection")}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 7,
          fontSize: 13,
          marginBottom: 28,
          fontFamily: "var(--font-body)",
          color: "var(--text-muted)",
          border: "none",
          background: "none",
          cursor: "pointer",
          fontWeight: 500,
          padding: 0,
          transition: "color var(--duration-fast) var(--ease-out)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "var(--accent-primary)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "var(--text-muted)";
        }}
      >
        <ArrowLeft size={15} /> Back to Collection
      </button>
      <PerfumeDetail
        perfume={perfume}
        onEdit={() => setShowForm(true)}
        onDelete={() => setShowDelete(true)}
      />
      {showForm && (
        <PerfumeForm
          perfume={perfume}
          onClose={() => setShowForm(false)}
          onSaved={handleFormSaved}
        />
      )}
      {showDelete && (
        <DeleteConfirm
          perfumeName={perfume.name}
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(false)}
        />
      )}
    </div>
  );
}
