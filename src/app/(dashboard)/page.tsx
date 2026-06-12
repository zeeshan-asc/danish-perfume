"use client";

import { useEffect, useMemo } from "react";
import { usePerfumes } from "@/hooks/usePerfumes";
import { IDashboardStats, Season, IPerfume } from "@/types";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { SprayCan as Spray, Star, TrendingUp, DollarSign, Package, Heart, ShoppingBag } from "lucide-react";
import { DashboardSkeleton } from "@/components/ui/Skeleton";

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

const seasonColors: Record<Season, string> = { Spring: "var(--season-spring)", Summer: "var(--season-summer)", Fall: "var(--season-fall)", Winter: "var(--season-winter)" };

// ── Shared styles ──
const panel: React.CSSProperties = {
  background: "var(--bg-tertiary)",
  border: "1px solid var(--border-subtle)",
  borderRadius: "var(--radius-lg)",
  padding: "22px 24px",
};

const sectionLabel: React.CSSProperties = {
  fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase",
  color: "var(--accent-primary)", margin: "0 0 16px", fontFamily: "var(--font-body)",
};

export default function DashboardPage() {
  const { perfumes, fetchPerfumes, loading } = usePerfumes();
  useEffect(() => { fetchPerfumes({ limit: "100", sortBy: "createdAt", sortOrder: "desc" }); }, [fetchPerfumes]);
  const stats = useMemo(() => computeStats(perfumes), [perfumes]);

  if (loading && perfumes.length === 0) return <DashboardSkeleton />;

  const maxBrand = Math.max(...stats.brandDistribution.map(d => d.count), 1);
  const maxGrowth = Math.max(...stats.collectionGrowth.map(d => d.count), 1);

  return (
    <div style={{ paddingBottom: 60 }}>
      {/* ═══════════════════════════════════════
          HERO BANNER — unified stats ribbon
          ═══════════════════════════════════════ */}
      <div className="dashboard-hero" style={{
        marginTop: 28,
        padding: "32px 36px",
        borderRadius: "var(--radius-xl)",
        background: "linear-gradient(135deg, rgba(200,164,78,0.06) 0%, rgba(200,164,78,0.02) 40%, transparent 100%), var(--bg-tertiary)",
        border: "1px solid rgba(200,164,78,0.12)",
        boxShadow: "var(--shadow-glow)",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 24,
      }}>
        {/* Left: Welcome */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{
            width: 56, height: 56, borderRadius: "var(--radius-xl)",
            background: "var(--accent-subtle)", border: "1px solid var(--accent-border)",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <Spray size={26} style={{ color: "var(--accent-primary)" }} />
          </div>
          <div>
            <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", color: "var(--accent-primary)", margin: "0 0 4px", textTransform: "uppercase", fontFamily: "var(--font-body)" }}>
              Fragrance Vault
            </p>
            <h1 style={{ fontSize: "clamp(26px, 3.5vw, 38px)", fontWeight: 600, color: "var(--text-primary)", margin: 0, letterSpacing: "-0.01em", lineHeight: 1.15, fontFamily: "var(--font-display)" }}>
              {stats.totalPerfumes > 0 ? `Your Collection · ${stats.totalPerfumes} Fragrances` : "Your Fragrance Vault"}
            </h1>
            {stats.topBrand.count > 0 && (
              <p style={{ color: "var(--text-muted)", fontSize: 13, margin: "6px 0 0", fontFamily: "var(--font-body)" }}>
                Top brand: <span style={{ color: "var(--text-secondary)", fontWeight: 600 }}>{stats.topBrand.brand}</span>
              </p>
            )}
          </div>
        </div>

        {/* Right: Inline Stats */}
        <div style={{ display: "flex", gap: 0 }}>
          {[
            { icon: Package, label: "Owned", value: stats.totalOwned, color: "var(--teal-primary)" },
            { icon: Heart, label: "Wishlist", value: stats.totalWishlist, color: "var(--info)" },
            { icon: ShoppingBag, label: "Sold", value: stats.totalSold, color: "var(--danger)" },
            { icon: DollarSign, label: "Value", value: stats.totalValue > 0 ? formatPrice(stats.totalValue) : "—", color: "var(--success)" },
          ].map((s, i) => (
            <div key={s.label} style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              padding: "0 20px",
              borderRight: i < 3 ? "1px solid var(--border-subtle)" : "none",
              gap: 4,
            }}>
              <s.icon size={16} style={{ color: s.color, opacity: 0.7 }} />
              <span style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600, fontFamily: "var(--font-body)" }}>{s.label}</span>
              <span style={{ fontSize: 18, fontWeight: 600, color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>{s.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════
          TWO-COLUMN MAIN CONTENT
          ═══════════════════════════════════════ */}
      <div className="dashboard-layout" style={{
        marginTop: 24,
        display: "grid",
        gridTemplateColumns: "1fr 360px",
        gap: 24,
      }}>
        {/* ── LEFT COLUMN ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Collection Growth — large chart */}
          <div style={panel}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <p style={{ ...sectionLabel, marginBottom: 0 }}>Collection Growth</p>
              <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-body)", fontWeight: 500 }}>Last 6 months</span>
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-evenly", height: 180, paddingTop: 16, gap: 12 }}>
              {stats.collectionGrowth.length === 0 ? (
                <p style={{ fontSize: 13, color: "var(--text-muted)", fontFamily: "var(--font-body)", alignSelf: "center" }}>No data yet — add fragrances to see growth</p>
              ) : stats.collectionGrowth.map((m, i) => {
                const heightPercent = Math.max((m.count / maxGrowth) * 100, 4);
                return (
                  <div key={m.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                    <span style={{
                      fontSize: 12, fontWeight: 600, fontFamily: "var(--font-body)",
                      color: m.count > 0 ? "var(--accent-glow)" : "transparent",
                      transition: "color 0.3s ease",
                    }}>
                      {m.count || ""}
                    </span>
                    <div style={{
                      width: "100%", maxWidth: 56,
                      borderRadius: "6px 6px 0 0",
                      height: `${heightPercent}%`,
                      background: m.count > 0
                        ? "linear-gradient(180deg, rgba(200,164,78,0.7), rgba(200,164,78,0.15))"
                        : "rgba(255,255,255,0.03)",
                      transition: "height 0.6s var(--ease-out)",
                      position: "relative",
                    }}>
                      {m.count > 0 && (
                        <div style={{
                          position: "absolute", top: -2, left: "50%", transform: "translateX(-50%)",
                          width: 4, height: 4, borderRadius: "50%", background: "var(--accent-glow)",
                        }} />
                      )}
                    </div>
                    <span style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-body)", fontWeight: 500 }}>{m.month}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Brand Rankings + Season Distribution — side by side */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            {/* Brand Rankings */}
            <div style={panel}>
              <p style={sectionLabel}>Top Brands</p>
              {stats.brandDistribution.length === 0 ? (
                <p style={{ fontSize: 12, color: "var(--text-muted)", textAlign: "center", padding: "20px 0", fontFamily: "var(--font-body)" }}>Add fragrances to see brands</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {stats.brandDistribution.slice(0, 6).map((b, i) => (
                    <div key={b.brand} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{
                        width: 20, height: 20, borderRadius: "50%",
                        background: i === 0 ? "var(--accent-muted)" : "rgba(255,255,255,0.04)",
                        color: i === 0 ? "var(--accent-primary)" : "var(--text-muted)",
                        fontSize: 10, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center",
                        fontFamily: "var(--font-body)", flexShrink: 0,
                      }}>{i + 1}</span>
                      <span style={{ flex: 1, fontSize: 13, color: "var(--text-secondary)", fontFamily: "var(--font-body)", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b.brand}</span>
                      <span style={{ fontSize: 12, color: "var(--accent-primary)", fontWeight: 600, fontFamily: "var(--font-body)" }}>{b.count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Season Distribution */}
            <div style={panel}>
              <p style={sectionLabel}>Season Split</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {stats.seasonDistribution.map((s) => (
                  <div key={s.season}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                      <span style={{ fontSize: 12, color: seasonColors[s.season], fontWeight: 600, fontFamily: "var(--font-body)" }}>{s.season}</span>
                      <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>{s.percentage}% ({s.count})</span>
                    </div>
                    <div style={{ height: 6, borderRadius: 3, background: "rgba(255,255,255,0.04)", overflow: "hidden" }}>
                      <div style={{
                        height: "100%", borderRadius: 3,
                        width: `${s.percentage}%`,
                        background: `linear-gradient(90deg, ${seasonColors[s.season]}, ${seasonColors[s.season]}88)`,
                        transition: "width 0.6s var(--ease-out)",
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Quick Stats Card */}
          <div style={panel}>
            <p style={sectionLabel}>Quick Stats</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { label: "Total Fragrances", value: stats.totalPerfumes, icon: Package, color: "var(--accent-primary)" },
                { label: "Average Rating", value: stats.avgRating > 0 ? `${stats.avgRating.toFixed(1)} / 10` : "N/A", icon: Star, color: "var(--warning)" },
                { label: "Total Value", value: stats.totalValue > 0 ? formatPrice(stats.totalValue) : "N/A", icon: DollarSign, color: "var(--success)" },
                { label: "Growth (6mo)", value: stats.collectionGrowth.reduce((a, b) => a + b.count, 0) > 0 ? `+${stats.collectionGrowth.reduce((a, b) => a + b.count, 0)} new` : "No data", icon: TrendingUp, color: "var(--teal-primary)" },
              ].map((s) => (
                <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: "var(--radius-md)",
                    background: `${s.color}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    <s.icon size={15} style={{ color: s.color }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0, fontFamily: "var(--font-body)", fontWeight: 500 }}>{s.label}</p>
                    <p style={{ fontSize: 15, color: "var(--text-primary)", margin: "1px 0 0", fontFamily: "var(--font-display)", fontWeight: 600 }}>{s.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scent Profiles */}
          <div style={panel}>
            <p style={sectionLabel}>Scent Profiles</p>
            {stats.scentTypeDistribution.length === 0 ? (
              <p style={{ fontSize: 12, color: "var(--text-muted)", textAlign: "center", padding: "20px 0", fontFamily: "var(--font-body)" }}>No scent profiles yet</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {stats.scentTypeDistribution.slice(0, 8).map((t) => (
                  <div key={t.type} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid var(--border-subtle)" }}>
                    <span style={{ fontSize: 12, color: "var(--text-secondary)", fontFamily: "var(--font-body)", fontWeight: 500 }}>{t.type}</span>
                    <span style={{
                      fontSize: 11, fontWeight: 600, color: "var(--accent-primary)", fontFamily: "var(--font-body)",
                      background: "var(--accent-subtle)", padding: "2px 10px", borderRadius: "var(--radius-full)", minWidth: 20, textAlign: "center",
                    }}>{t.count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Most Expensive / Highest Rated */}
          {(stats.mostExpensive || stats.highestRated) && (
            <div style={panel}>
              <p style={sectionLabel}>Highlights</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {stats.mostExpensive && (
                  <div>
                    <p style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 4px", fontFamily: "var(--font-body)", fontWeight: 600 }}>Most Valuable</p>
                    <Link href={`/collection/${stats.mostExpensive.id}`} style={{ display: "block", textDecoration: "none", transition: "opacity 0.15s ease" }}>
                      <p style={{ fontSize: 13, color: "var(--text-primary)", margin: 0, fontFamily: "var(--font-body)", fontWeight: 600, lineHeight: 1.3 }}>{stats.mostExpensive.name}</p>
                      <p style={{ fontSize: 12, color: "var(--accent-primary)", margin: "2px 0 0", fontFamily: "var(--font-body)", fontWeight: 500 }}>{formatPrice(stats.mostExpensive.purchase_price || 0)}</p>
                    </Link>
                  </div>
                )}
                {stats.highestRated && (
                  <div>
                    <p style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 4px", fontFamily: "var(--font-body)", fontWeight: 600 }}>Top Rated</p>
                    <Link href={`/collection/${stats.highestRated.id}`} style={{ display: "block", textDecoration: "none", transition: "opacity 0.15s ease" }}>
                      <p style={{ fontSize: 13, color: "var(--text-primary)", margin: 0, fontFamily: "var(--font-body)", fontWeight: 600, lineHeight: 1.3 }}>{stats.highestRated.name}</p>
                      <div style={{ display: "flex", alignItems: "center", gap: 3, marginTop: 2 }}>
                        <Star size={12} fill="var(--warning)" stroke="var(--warning)" />
                        <span style={{ fontSize: 12, color: "var(--warning)", fontFamily: "var(--font-body)", fontWeight: 600 }}>{stats.highestRated.rating}/10</span>
                      </div>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════
          RECENT ADDITIONS — full width
          ═══════════════════════════════════════ */}
      {stats.recentAdditions.length > 0 && (
        <div style={{ ...panel, marginTop: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <p style={{ ...sectionLabel, marginBottom: 0 }}>Recent Additions</p>
            <Link href="/collection" style={{ fontSize: 12, color: "var(--accent-primary)", fontFamily: "var(--font-body)", fontWeight: 500, textDecoration: "none" }}>View all →</Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
            {stats.recentAdditions.map((p) => (
              <Link key={p.id} href={`/collection/${p.id}`} style={{
                display: "flex", alignItems: "center", gap: 14, padding: "14px 18px",
                borderRadius: "var(--radius-lg)", border: "1px solid var(--border-default)",
                textDecoration: "none", background: "rgba(255,255,255,0.02)",
                transition: "all var(--duration-fast) var(--ease-out)", cursor: "pointer",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent-border)"; e.currentTarget.style.background = "var(--accent-subtle)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-default)"; e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
              >
                {p.imageId ? (
                  <img src={`/api/images/${p.imageId}`} alt="" width={44} height={44} style={{ borderRadius: "var(--radius-md)", objectFit: "cover", flexShrink: 0 }} />
                ) : (
                  <div style={{ width: 44, height: 44, borderRadius: "var(--radius-md)", background: "var(--accent-subtle)", border: "1px solid var(--accent-border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Spray size={18} style={{ color: "var(--accent-primary)", opacity: 0.4 }} />
                  </div>
                )}
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: 13, color: "var(--text-primary)", margin: 0, fontFamily: "var(--font-body)", fontWeight: 600, lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</p>
                  <p style={{ fontSize: 11, color: "var(--text-muted)", margin: "1px 0 0", fontFamily: "var(--font-body)" }}>{p.brand}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════
          EMPTY STATE
          ═══════════════════════════════════════ */}
      {stats.totalPerfumes === 0 && (
        <div style={{ textAlign: "center", padding: "80px 0 40px" }}>
          <div style={{ width: 72, height: 72, borderRadius: "var(--radius-xl)", background: "var(--accent-subtle)", border: "1px solid var(--accent-border)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <Spray size={32} style={{ color: "var(--accent-primary)", opacity: 0.5 }} />
          </div>
          <p style={{ fontSize: 22, color: "var(--text-primary)", marginBottom: 8, fontWeight: 600, fontFamily: "var(--font-display)" }}>Your vault awaits</p>
          <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 32, fontFamily: "var(--font-body)" }}>Track every bottle, note, and memory — one spray at a time.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/collection" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 28px", borderRadius: "var(--radius-md)", border: "1px solid var(--accent-border-strong)", background: "var(--accent-muted)", color: "var(--accent-primary)", fontSize: 14, fontFamily: "var(--font-body)", fontWeight: 600, textDecoration: "none" }}>
              <Spray size={16} /> Start Collection
            </Link>
            <Link href="/collection" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 28px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-default)", background: "rgba(255,255,255,0.04)", color: "var(--text-secondary)", fontSize: 14, fontFamily: "var(--font-body)", fontWeight: 500, textDecoration: "none" }}>
              Browse Catalog
            </Link>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════
          SEASON LEGEND FOOTER
          ═══════════════════════════════════════ */}
      <div style={{ borderTop: "1px solid var(--border-subtle)", padding: "20px 0 0", marginTop: 32, display: "flex", gap: 28, flexWrap: "wrap", alignItems: "center" }}>
        {Object.entries(seasonColors).map(([s, c]) => (
          <span key={s} style={{ fontSize: 12, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 7, fontFamily: "var(--font-body)", fontWeight: 500 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: c, display: "inline-block", boxShadow: `0 0 4px ${c}` }} /> {s}
          </span>
        ))}
        <span style={{ fontSize: 11, color: "var(--text-dim)", marginLeft: "auto", fontFamily: "var(--font-body)" }}>
          {stats.totalPerfumes > 0 ? `${stats.totalPerfumes} fragrances tracked` : "Begin your journey"}
        </span>
      </div>
    </div>
  );
}
