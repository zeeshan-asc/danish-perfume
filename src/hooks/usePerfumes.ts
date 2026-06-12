"use client";

import { useState, useCallback } from "react";
import { IPerfume, IPerfumeFormData } from "@/types";

interface UsePerfumesReturn {
  perfumes: IPerfume[];
  total: number;
  page: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  fetchPerfumes: (params?: Record<string, string>) => Promise<void>;
  createPerfume: (data: IPerfumeFormData, imageFile?: File) => Promise<{ error?: string; details?: Record<string, string[]> }>;
  updatePerfume: (id: string, data: Partial<IPerfumeFormData>, imageFile?: File, removeImage?: boolean) => Promise<{ error?: string; details?: Record<string, string[]> }>;
  deletePerfume: (id: string) => Promise<{ error?: string }>;
  getPerfume: (id: string) => Promise<IPerfume | null>;
}

export function usePerfumes(): UsePerfumesReturn {
  const [perfumes, setPerfumes] = useState<IPerfume[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPerfumes = useCallback(async (params?: Record<string, string>) => {
    setLoading(true);
    setError(null);
    try {
      const searchParams = new URLSearchParams(params);
      const res = await fetch(`/api/perfumes?${searchParams.toString()}`);

      if (res.status === 401) {
        window.location.href = "/login";
        return;
      }

      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "Failed to fetch perfumes");
        return;
      }

      setPerfumes(json.data.perfumes);
      setTotal(json.data.total);
      setPage(json.data.page);
      setTotalPages(json.data.totalPages);
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const getPerfume = useCallback(async (id: string): Promise<IPerfume | null> => {
    try {
      const res = await fetch(`/api/perfumes/${id}`);

      if (res.status === 401) {
        window.location.href = "/login";
        return null;
      }

      const json = await res.json();

      if (!res.ok) {
        return null;
      }

      return json.data;
    } catch {
      return null;
    }
  }, []);

  const createPerfume = useCallback(async (data: IPerfumeFormData, imageFile?: File) => {
    try {
      const formData = new FormData();
      formData.append("data", JSON.stringify(data));
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const res = await fetch("/api/perfumes", {
        method: "POST",
        body: formData,
      });

      if (res.status === 401) {
        window.location.href = "/login";
        return { error: "Authentication required" };
      }

      const json = await res.json();

      if (!res.ok) {
        return { error: json.error, details: json.details };
      }

      return {};
    } catch {
      return { error: "Connection error. Please try again." };
    }
  }, []);

  const updatePerfume = useCallback(async (id: string, data: Partial<IPerfumeFormData>, imageFile?: File, removeImage?: boolean) => {
    try {
      const formData = new FormData();
      formData.append("data", JSON.stringify(data));
      if (imageFile) {
        formData.append("image", imageFile);
      }
      if (removeImage) {
        formData.append("removeImage", "true");
      }

      const res = await fetch(`/api/perfumes/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (res.status === 401) {
        window.location.href = "/login";
        return { error: "Authentication required" };
      }

      const json = await res.json();

      if (!res.ok) {
        return { error: json.error, details: json.details };
      }

      return {};
    } catch {
      return { error: "Connection error. Please try again." };
    }
  }, []);

  const deletePerfume = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/perfumes/${id}`, { method: "DELETE" });

      if (res.status === 401) {
        window.location.href = "/login";
        return { error: "Authentication required" };
      }

      const json = await res.json();

      if (!res.ok) {
        return { error: json.error };
      }

      return {};
    } catch {
      return { error: "Connection error. Please try again." };
    }
  }, []);

  return {
    perfumes,
    total,
    page,
    totalPages,
    loading,
    error,
    fetchPerfumes,
    createPerfume,
    updatePerfume,
    deletePerfume,
    getPerfume,
  };
}
