export default function Spinner({ size = 24 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        border: "2px solid rgba(200,164,78,0.12)",
        borderTopColor: "var(--accent-primary)",
        borderRadius: "50%",
        animation: "spin 0.7s linear infinite",
        display: "inline-block",
      }}
      role="status"
      aria-label="Loading"
    />
  );
}
