interface BrandChartProps { data: { brand: string; count: number }[]; }

export default function BrandChart({ data }: BrandChartProps) {
  const top8 = data.slice(0, 8);
  const maxCount = Math.max(...top8.map((d) => d.count), 1);

  if (top8.length === 0) return <p className="text-sm text-center py-6 font-serif" style={{ color: "#6a6058" }}>No data yet</p>;

  return (
    <div className="space-y-2.5">
      {top8.map((item, i) => (
        <div key={item.brand} className="flex items-center gap-3">
          <span className="text-xs font-serif w-28 truncate text-right tabular-nums" style={{ color: "#8a8078" }}>{item.brand}</span>
          <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.04)" }}>
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${(item.count / maxCount) * 100}%`,
                background: `linear-gradient(90deg, rgba(180,140,80,0.4) 0%, rgba(180,140,80,0.7) 100%)`,
                transitionDelay: `${i * 80}ms`,
              }}
            />
          </div>
          <span className="text-xs font-serif w-6 text-right tabular-nums" style={{ color: "#c9a84c" }}>{item.count}</span>
        </div>
      ))}
    </div>
  );
}
