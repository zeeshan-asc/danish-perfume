"use client";

import { useEffect, useMemo } from "react";
import { usePerfumes } from "@/hooks/usePerfumes";
import { IDashboardStats, Season, IPerfume } from "@/types";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { SprayCan as Spray } from "lucide-react";

function computeStats(perfumes: IPerfume[]): IDashboardStats {
  const owned = perfumes.filter((p) => p.status === "Owned");
  const wishlist = perfumes.filter((p) => p.status === "Wishlist");
  const sold = perfumes.filter((p) => p.status === "Sold");
  const totalValue = owned.reduce((sum, p) => sum + (p.purchase_price || 0), 0);
  const ratings = perfumes.filter((p) => p.rating).map((p) => p.rating!);
  const avgRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
  const brandMap = new Map<string, number>();
  perfumes.forEach((p) => brandMap.set(p.brand, (brandMap.get(p.brand) || 0) + 1));
  const brandDistribution = Array.from(brandMap.entries()).map(([brand, count]) => ({ brand, count })).sort((a, b) => b.count - a.count);
  const topBrand = brandDistribution[0] || { brand: "None", count: 0 };
  const mostExpensive = owned.length > 0 ? owned.reduce((max, p) => ((p.purchase_price || 0) > (max.purchase_price || 0) ? p : max), owned[0]) : null;
  const highestRated = perfumes.filter(p => p.rating).length > 0 ? perfumes.filter(p => p.rating).reduce((max, p) => ((p.rating || 0) < (max.rating || 0) ? max : p)) : null;
  const recentAdditions = [...perfumes].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);
  const seasonCounts: Record<Season, number> = { Spring: 0, Summer: 0, Fall: 0, Winter: 0 };
  perfumes.forEach((p) => p.seasons?.forEach(s => { if (s in seasonCounts) seasonCounts[s as Season]++; }));
  const totalSeason = Object.values(seasonCounts).reduce((a, b) => a + b, 0);
  const seasonDistribution = (Object.entries(seasonCounts) as [Season, number][]).map(([season, count]) => ({ season, count, percentage: totalSeason > 0 ? Math.round((count / totalSeason) * 100) : 0 }));
  const scentMap = new Map<string, number>();
  perfumes.forEach((p) => { if (p.scent_type) scentMap.set(p.scent_type, (scentMap.get(p.scent_type) || 0) + 1); });
  const scentTypeDistribution = Array.from(scentMap.entries()).map(([type, count]) => ({ type, count })).sort((a, b) => b.count - a.count);
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthMap = new Map<string, number>(); const last6Months: string[] = [];
  for (let i = 5; i >= 0; i--) { const d = new Date(); d.setMonth(d.getMonth() - i); const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`; last6Months.push(key); monthMap.set(key, 0); }
  perfumes.forEach((p) => { const d = new Date(p.createdAt); const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`; if (monthMap.has(key)) monthMap.set(key, monthMap.get(key)! + 1); });
  const collectionGrowth = last6Months.map(m => ({ month: m.split(" ")[0], count: monthMap.get(m) || 0 }));
  return { totalPerfumes: perfumes.length, totalOwned: owned.length, totalWishlist: wishlist.length, totalSold: sold.length, totalValue, avgRating, topBrand, mostExpensive, highestRated, recentAdditions, brandDistribution, seasonDistribution, scentTypeDistribution, collectionGrowth };
}

const seasonColors: Record<Season, string> = { Spring: "#7ecba1", Summer: "#f9c74f", Fall: "#f4845f", Winter: "#90c2e7" };

const cardStyle: React.CSSProperties = {
  background: "#14141c",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: 10,
  padding: "18px 20px",
};

const sectionTitle: React.CSSProperties = {
  fontSize: 11, color: "#14b8a6", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase",
  margin: "0 0 14px", fontFamily: "DM Sans, system-ui, -apple-system, sans-serif",
};

export default function DashboardPage() {
  const { perfumes, fetchPerfumes, loading } = usePerfumes();
  useEffect(() => { fetchPerfumes({ limit: "100", sortBy: "createdAt", sortOrder: "desc" }); }, [fetchPerfumes]);
  const stats = useMemo(() => computeStats(perfumes), [perfumes]);

  return (
    <div>
      {/* ── Clean Header ── */}
      <div style={{
        padding: "36px 0 24px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 12, marginBottom: 6 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(20,184,166,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Spray size={18} style={{ color: "#14b8a6" }} />
          </div>
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", color: "#14b8a6", margin: 0, textTransform: "uppercase", fontFamily: "DM Sans, system-ui, -apple-system, sans-serif" }}>
              Dashboard
            </p>
            <h1 style={{ fontSize: "clamp(22px, 3vw, 36px)", fontWeight: 500, color: "#f0f0f4", margin: "2px 0 0", letterSpacing: "-0.01em", lineHeight: 1.2, fontFamily: "DM Sans, system-ui, -apple-system, sans-serif" }}>
              Your Fragrance Vault
            </h1>
          </div>
        </div>
        <p style={{ color: "#6b6b80", fontSize: 14, margin: "4px 0 0", fontFamily: "DM Sans, system-ui, -apple-system, sans-serif" }}>
          {stats.totalPerfumes} fragrances · {stats.topBrand.count > 0 ? `Top: ${stats.topBrand.brand}` : "Begin your journey"}
        </p>
      </div>

      <div style={{ padding: "28px 0 60px" }}>
        {/* ── Stat Cards ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12, marginBottom: 28 }}>
          {[
            { label: "Total", value: stats.totalPerfumes, color: "#14b8a6" },
            { label: "Owned", value: stats.totalOwned, color: "#2dd4bf" },
            { label: "Wishlist", value: stats.totalWishlist, color: "#60a5fa" },
            { label: "Sold", value: stats.totalSold, color: "#f87171" },
            { label: "Avg Rating", value: stats.avgRating > 0 ? stats.avgRating.toFixed(1) : "—", color: "#fbbf24" },
            { label: "Total Value", value: stats.totalValue > 0 ? formatPrice(stats.totalValue) : "—", color: "#34d399" },
          ].map((stat) => (
            <div key={stat.label} style={cardStyle}>
              <p style={{ fontSize: 11, color: "#6b6b80", margin: "0 0 4px", fontWeight: 500, fontFamily: "DM Sans, system-ui, -apple-system, sans-serif" }}>{stat.label}</p>
              <p style={{ fontSize: 22, color: stat.color, margin: 0, fontWeight: 600, fontFamily: "DM Sans, system-ui, -apple-system, sans-serif" }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* ── Charts ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 12, marginBottom: 28 }}>
          {/* Brand Chart */}
          <div style={cardStyle}>
            <p style={sectionTitle}>Top Brands</p>
            {stats.brandDistribution.slice(0, 8).map((b, i) => {
              const max = Math.max(...stats.brandDistribution.map(d => d.count), 1);
              return (
                <div key={b.brand} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 5 }}>
                  <span style={{ fontSize: 12, color: "#a0a0b4", width: 100, textAlign: "right", fontFamily: "DM Sans, system-ui, -apple-system, sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b.brand}</span>
                  <div style={{ flex: 1, height: 5, borderRadius: 3, background: "rgba(255,255,255,0.04)" }}>
                    <div style={{ height: "100%", borderRadius: 3, width: `${(b.count / max) * 100}%`, background: "linear-gradient(90deg, rgba(20,184,166,0.3), rgba(20,184,166,0.6))", transition: "width 0.4s ease" }} />
                  </div>
                  <span style={{ fontSize: 11, color: "#2dd4bf", width: 20, textAlign: "right", fontFamily: "DM Sans, system-ui, -apple-system, sans-serif", fontWeight: 500 }}>{b.count}</span>
                </div>
              );
            })}
            {stats.brandDistribution.length === 0 && <p style={{ fontSize: 12, color: "#6b6b80", textAlign: "center", padding: 16, fontFamily: "DM Sans, system-ui, -apple-system, sans-serif" }}>Add fragrances to see brands</p>}
          </div>

          {/* Season Chart */}
          <div style={cardStyle}>
            <p style={sectionTitle}>Seasons</p>
            {stats.seasonDistribution.map((s) => (
              <div key={s.season} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 5 }}>
                <span style={{ fontSize: 12, color: seasonColors[s.season], width: 56, fontWeight: 500, fontFamily: "DM Sans, system-ui, -apple-system, sans-serif" }}>{s.season}</span>
                <div style={{ flex: 1, height: 5, borderRadius: 3, background: "rgba(255,255,255,0.04)" }}>
                  <div style={{ height: "100%", borderRadius: 3, width: `${s.percentage}%`, background: seasonColors[s.season], opacity: 0.5 }} />
                </div>
                <span style={{ fontSize: 11, color: "#a0a0b4", width: 30, textAlign: "right", fontFamily: "DM Sans, system-ui, -apple-system, sans-serif" }}>{s.percentage}%</span>
              </div>
            ))}
          </div>

          {/* Scent Types */}
          <div style={cardStyle}>
            <p style={sectionTitle}>Scent Profiles</p>
            {stats.scentTypeDistribution.slice(0, 8).map((t) => (
              <div key={t.type} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <span style={{ fontSize: 12, color: "#a0a0b4", fontFamily: "DM Sans, system-ui, -apple-system, sans-serif" }}>{t.type}</span>
                <span style={{ fontSize: 12, color: "#14b8a6", fontWeight: 500, fontFamily: "DM Sans, system-ui, -apple-system, sans-serif" }}>{t.count}</span>
              </div>
            ))}
            {stats.scentTypeDistribution.length === 0 && <p style={{ fontSize: 12, color: "#6b6b80", textAlign: "center", padding: 16, fontFamily: "DM Sans, system-ui, -apple-system, sans-serif" }}>No scent profiles yet</p>}
          </div>

          {/* Collection Growth */}
          <div style={cardStyle}>
            <p style={sectionTitle}>Growth (6 Months)</p>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 80 }}>
              {stats.collectionGrowth.length === 0 ? <p style={{ fontSize: 12, color: "#6b6b80", fontFamily: "DM Sans, system-ui, -apple-system, sans-serif" }}>No data yet</p> :
                stats.collectionGrowth.map((m, i) => {
                  const max = Math.max(...stats.collectionGrowth.map(d => d.count), 1);
                  return (
                    <div key={m.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                      <span style={{ fontSize: 10, color: m.count > 0 ? "#2dd4bf" : "transparent", fontFamily: "DM Sans, system-ui, -apple-system, sans-serif", fontWeight: 600 }}>{m.count || ""}</span>
                      <div style={{ width: "100%", borderRadius: "2px 2px 0 0", height: `${Math.max((m.count / max) * 100, 4)}%`, background: m.count > 0 ? "linear-gradient(180deg, rgba(20,184,166,0.4), rgba(20,184,166,0.1))" : "rgba(255,255,255,0.03)", transition: "height 0.4s ease" }} />
                      <span style={{ fontSize: 10, color: "#6b6b80", fontFamily: "DM Sans, system-ui, -apple-system, sans-serif" }}>{m.month}</span>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {/* ── Recent additions ── */}
        {stats.recentAdditions.length > 0 && (
          <div style={{ ...cardStyle, marginBottom: 28 }}>
            <p style={sectionTitle}>Recent Additions</p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {stats.recentAdditions.map((p) => (
                <Link key={p.id} href={`/collection/${p.id}`} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 14px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.06)", textDecoration: "none", background: "rgba(255,255,255,0.02)", transition: "all 0.15s ease" }}>
                  {p.imageId ? <img src={`/api/images/${p.imageId}`} alt="" width={32} height={32} style={{ borderRadius: 6, objectFit: "cover" }} /> : <Spray size={16} style={{ color: "rgba(20,184,166,0.3)" }} />}
                  <div>
                    <p style={{ fontSize: 12, color: "#f0f0f4", margin: 0, fontFamily: "DM Sans, system-ui, -apple-system, sans-serif", fontWeight: 500 }}>{p.name}</p>
                    <p style={{ fontSize: 10, color: "#6b6b80", margin: 0, fontFamily: "DM Sans, system-ui, -apple-system, sans-serif" }}>{p.brand}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ── Empty State ── */}
        {stats.totalPerfumes === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(20,184,166,0.08)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <Spray size={22} style={{ color: "rgba(20,184,166,0.4)" }} />
            </div>
            <p style={{ fontSize: 16, color: "#f0f0f4", marginBottom: 6, fontWeight: 500, fontFamily: "DM Sans, system-ui, -apple-system, sans-serif" }}>Your vault is empty</p>
            <p style={{ fontSize: 13, color: "#6b6b80", marginBottom: 24, fontFamily: "DM Sans, system-ui, -apple-system, sans-serif" }}>Start building your fragrance collection</p>
            <Link href="/collection" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 20px", borderRadius: 8, border: "1px solid rgba(20,184,166,0.3)", background: "rgba(20,184,166,0.1)", color: "#2dd4bf", fontSize: 13, fontFamily: "DM Sans, system-ui, -apple-system, sans-serif", fontWeight: 500, textDecoration: "none" }}>
              <Spray size={14} /> Go to Collection
            </Link>
          </div>
        )}

        {/* ── Season Legend ── */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.04)", padding: "18px 0 0", marginTop: 20 }}>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap", alignItems: "center" }}>
            {Object.entries(seasonColors).map(([s, c]) => (
              <span key={s} style={{ fontSize: 12, color: c, display: "flex", alignItems: "center", gap: 6, fontFamily: "DM Sans, system-ui, -apple-system, sans-serif", fontWeight: 500 }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: c, display: "inline-block" }} /> {s}
              </span>
            ))}
            <span style={{ fontSize: 12, color: "#4a4a5a", marginLeft: "auto", fontFamily: "DM Sans, system-ui, -apple-system, sans-serif" }}>
              Click any card to expand details
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
