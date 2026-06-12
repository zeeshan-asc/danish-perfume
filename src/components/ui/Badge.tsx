"use client";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "tag" | "season" | "status" | "occasion" | "default";
}

const seasonColors: Record<string, { bg: string; border: string; color: string }> = {
  Spring: {
    bg: "rgba(126,203,161,0.12)",
    border: "rgba(126,203,161,0.30)",
    color: "var(--season-spring)",
  },
  Summer: {
    bg: "rgba(249,199,79,0.12)",
    border: "rgba(249,199,79,0.30)",
    color: "var(--season-summer)",
  },
  Fall: {
    bg: "rgba(244,132,95,0.12)",
    border: "rgba(244,132,95,0.30)",
    color: "var(--season-fall)",
  },
  Winter: {
    bg: "rgba(144,194,231,0.12)",
    border: "rgba(144,194,231,0.30)",
    color: "var(--season-winter)",
  },
};

const statusColors: Record<string, { bg: string; border: string; color: string }> = {
  Owned: {
    bg: "var(--teal-subtle)",
    border: "var(--teal-border)",
    color: "var(--teal-primary)",
  },
  Sold: {
    bg: "var(--danger-subtle)",
    border: "var(--danger-border)",
    color: "var(--danger)",
  },
  Wishlist: {
    bg: "var(--info-subtle)",
    border: "rgba(96,165,250,0.25)",
    color: "var(--info)",
  },
};

const tagStyle: React.CSSProperties = {
  padding: "3px 10px",
  borderRadius: "var(--radius-sm)",
  background: "var(--accent-subtle)",
  border: "1px solid var(--accent-border)",
  color: "var(--accent-primary)",
  fontSize: 11,
  fontFamily: "var(--font-body)",
  fontWeight: 500,
  letterSpacing: "0.02em",
  whiteSpace: "nowrap",
};

const occasionStyle: React.CSSProperties = {
  padding: "3px 10px",
  borderRadius: "var(--radius-sm)",
  background: "rgba(200,164,78,0.06)",
  border: "1px solid rgba(200,164,78,0.18)",
  color: "var(--accent-glow)",
  fontSize: 11,
  fontFamily: "var(--font-body)",
  fontWeight: 500,
  whiteSpace: "nowrap",
};

export default function Badge({ children, variant = "default" }: BadgeProps) {
  const s = typeof children === "string" ? children : "";

  if (variant === "season" && seasonColors[s]) {
    const c = seasonColors[s];
    return (
      <span
        style={{
          padding: "3px 10px",
          borderRadius: "var(--radius-sm)",
          background: c.bg,
          border: `1px solid ${c.border}`,
          color: c.color,
          fontSize: 11,
          fontFamily: "var(--font-body)",
          fontWeight: 500,
          whiteSpace: "nowrap",
        }}
      >
        {children}
      </span>
    );
  }

  if (variant === "status" && statusColors[s]) {
    const c = statusColors[s];
    return (
      <span
        style={{
          padding: "3px 10px",
          borderRadius: "var(--radius-sm)",
          background: c.bg,
          border: `1px solid ${c.border}`,
          color: c.color,
          fontSize: 11,
          fontFamily: "var(--font-body)",
          fontWeight: 500,
          whiteSpace: "nowrap",
        }}
      >
        {children}
      </span>
    );
  }

  if (variant === "occasion") {
    return <span style={occasionStyle}>{children}</span>;
  }

  return <span style={tagStyle}>{children}</span>;
}
