"use client";

import { useCallback, useState } from "react";
import { IBrand } from "@/types";

const BRAND_CACHE = new Map<string, IBrand[]>();

export function useBrands() {
  const [loading, setLoading] = useState(false);

  const fetchBrands = useCallback(async (search: string): Promise<IBrand[]> => {
    const cacheKey = search.toLowerCase();
    const cached = BRAND_CACHE.get(cacheKey);
    if (cached && !search) return cached; // only cache empty search (full list)

    setLoading(true);
    try {
      const params = search ? `?search=${encodeURIComponent(search)}&limit=20` : "?limit=50";
      const res = await fetch(`/api/brands${params}`);
      if (!res.ok) return [];
      const json = await res.json();
      const brands: IBrand[] = json.data || [];
      if (!search) BRAND_CACHE.set(cacheKey, brands);
      return brands;
    } catch {
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const addBrand = useCallback(async (name: string): Promise<IBrand | null> => {
    try {
      const res = await fetch("/api/brands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) return null;
      const json = await res.json();
      BRAND_CACHE.clear(); // invalidate cache
      return json.data || null;
    } catch {
      return null;
    }
  }, []);

  return { fetchBrands, addBrand, loading };
}
