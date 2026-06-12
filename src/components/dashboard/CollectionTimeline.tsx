interface CollectionTimelineProps { data: { month: string; count: number }[]; }

export default function CollectionTimeline({ data }: CollectionTimelineProps) {
  const maxCount = Math.max(...data.map((d) => d.count), 1);
  if (data.length === 0) return <p className="text-sm text-center py-6 font-serif" style={{ color: "#6a6058" }}>No data yet</p>;

  return (
    <div className="flex items-end gap-1.5 h-28">
      {data.map((item, i) => (
        <div key={item.month} className="flex-1 flex flex-col items-center gap-1.5">
          <span className="text-[10px] font-serif tabular-nums" style={{ color: item.count > 0 ? "#c9a84c" : "transparent" }}>
            {item.count || ""}
          </span>
          <div
            className="w-full rounded-t-sm transition-all duration-500 ease-out"
            style={{
              height: `${Math.max((item.count / maxCount) * 100, 3)}%`,
              background: item.count > 0
                ? "linear-gradient(180deg, rgba(180,140,80,0.5) 0%, rgba(180,140,80,0.2) 100%)"
                : "rgba(255,255,255,0.03)",
              transitionDelay: `${i * 100}ms`,
            }}
          />
          <span className="text-[10px] font-serif" style={{ color: "#5a5550" }}>{item.month}</span>
        </div>
      ))}
    </div>
  );
}
