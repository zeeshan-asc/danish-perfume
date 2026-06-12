interface BadgeProps { children: React.ReactNode; variant?: "tag" | "season" | "status" | "occasion"; }

const seasonColors: Record<string, { bg: string; border: string; color: string }> = {
  Spring: { bg: "rgba(126,203,161,0.12)", border: "rgba(126,203,161,0.3)", color: "#7ecba1" },
  Summer: { bg: "rgba(249,199,79,0.12)", border: "rgba(249,199,79,0.3)", color: "#f9c74f" },
  Fall:   { bg: "rgba(244,132,95,0.12)", border: "rgba(244,132,95,0.3)", color: "#f4845f" },
  Winter: { bg: "rgba(144,194,231,0.12)", border: "rgba(144,194,231,0.3)", color: "#90c2e7" },
};
const statusColors: Record<string, { bg: string; border: string; color: string }> = {
  Owned:    { bg: "rgba(20,184,166,0.1)",  border: "rgba(20,184,166,0.25)",  color: "#2dd4bf" },
  Sold:     { bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.25)", color: "#f87171" },
  Wishlist: { bg: "rgba(96,165,250,0.08)", border: "rgba(96,165,250,0.25)", color: "#60a5fa" },
};

export default function Badge({ children, variant = "tag" }: BadgeProps) {
  const s = typeof children === "string" ? children : "";

  if (variant === "season" && seasonColors[s]) {
    const c = seasonColors[s];
    return <span style={{ padding: "2px 10px", borderRadius: 6, background: c.bg, border: `1px solid ${c.border}`, color: c.color, fontSize: 11, fontFamily: "DM Sans, system-ui, -apple-system, sans-serif", fontWeight: 500 }}>{children}</span>;
  }
  if (variant === "status" && statusColors[s]) {
    const c = statusColors[s];
    return <span style={{ padding: "2px 10px", borderRadius: 6, background: c.bg, border: `1px solid ${c.border}`, color: c.color, fontSize: 11, fontFamily: "DM Sans, system-ui, -apple-system, sans-serif", fontWeight: 500 }}>{children}</span>;
  }
  if (variant === "occasion") {
    return <span style={{ padding: "2px 10px", borderRadius: 6, background: "rgba(20,184,166,0.08)", border: "1px solid rgba(20,184,166,0.2)", color: "#5eead4", fontSize: 11, fontFamily: "DM Sans, system-ui, -apple-system, sans-serif", fontWeight: 500 }}>{children}</span>;
  }
  return <span style={{ padding: "3px 10px", borderRadius: 6, background: "rgba(20,184,166,0.08)", border: "1px solid rgba(20,184,166,0.2)", color: "#2dd4bf", fontSize: 11, fontFamily: "DM Sans, system-ui, -apple-system, sans-serif", fontWeight: 500 }}>{children}</span>;
}
