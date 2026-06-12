"use client";

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
  style?: React.CSSProperties;
}

export function Skeleton({ width = "100%", height = 16, borderRadius = "var(--radius-md)", style }: SkeletonProps) {
  return (
    <div
      className="skeleton"
      aria-hidden="true"
      style={{
        width,
        height,
        borderRadius,
        fontFamily: "var(--font-body)",
        ...style,
      }}
    />
  );
}

/** Pre-built skeleton for a perfume card */
export function PerfumeCardSkeleton() {
  return (
    <div
      style={{
        background: "var(--bg-tertiary)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-lg)",
        padding: "18px 20px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <Skeleton height={140} borderRadius="var(--radius-md)" />
      <Skeleton width="40%" height={11} />
      <Skeleton width="75%" height={16} />
      <Skeleton width="55%" height={12} />
      <Skeleton width="30%" height={10} />
    </div>
  );
}

/** Pre-built skeleton for a stat card */
export function StatCardSkeleton() {
  return (
    <div
      style={{
        background: "var(--bg-tertiary)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-lg)",
        padding: "18px 20px",
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <Skeleton width="45%" height={11} />
      <Skeleton width="30%" height={22} />
    </div>
  );
}

/** Pre-built skeleton for a dashboard chart panel */
export function ChartSkeleton({ height = 120 }: { height?: number }) {
  return (
    <div
      style={{
        background: "var(--bg-tertiary)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-lg)",
        padding: "18px 20px",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <Skeleton width="35%" height={11} />
      <Skeleton height={height} borderRadius="var(--radius-md)" />
    </div>
  );
}

/** Full dashboard skeleton */
export function DashboardSkeleton() {
  return (
    <div style={{ padding: "28px 0 60px" }}>
      {/* Header skeleton */}
      <div style={{ padding: "36px 0 24px", borderBottom: "1px solid var(--border-subtle)", marginBottom: 28 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
          <Skeleton width={36} height={36} borderRadius="var(--radius-md)" />
          <div>
            <Skeleton width={80} height={11} />
            <div style={{ marginTop: 6 }}>
              <Skeleton width={200} height={28} />
            </div>
          </div>
        </div>
        <div style={{ marginTop: 8 }}>
          <Skeleton width={150} height={14} />
        </div>
      </div>

      {/* Stat cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          gap: 12,
          marginBottom: 28,
        }}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>

      {/* Charts */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 12,
          marginBottom: 28,
        }}
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <ChartSkeleton key={i} height={100 + i * 20} />
        ))}
      </div>
    </div>
  );
}

/** Full collection grid skeleton */
export function CollectionGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
        gap: 14,
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <PerfumeCardSkeleton key={i} />
      ))}
    </div>
  );
}
