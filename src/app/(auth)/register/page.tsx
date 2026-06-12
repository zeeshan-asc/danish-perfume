import RegisterForm from "@/components/auth/RegisterForm";
import { SprayCan as Spray } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px 20px 40px",
        background:
          "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(200,164,78,0.04) 0%, transparent 70%), var(--bg-deep)",
      }}
    >
      <div style={{ width: "100%", maxWidth: 440 }}>
        {/* Brand Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: "var(--radius-xl)",
              background: "var(--accent-subtle)",
              border: "1px solid var(--accent-border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              boxShadow: "var(--shadow-glow)",
            }}
          >
            <Spray size={24} style={{ color: "var(--accent-primary)" }} />
          </div>
          <h1
            style={{
              fontSize: 26,
              fontWeight: 600,
              color: "var(--text-primary)",
              margin: "0 0 6px",
              fontFamily: "var(--font-display)",
              letterSpacing: "0.02em",
            }}
          >
            Create Account
          </h1>
          <p
            style={{
              fontSize: 14,
              color: "var(--text-muted)",
              margin: 0,
              fontFamily: "var(--font-body)",
              lineHeight: 1.5,
            }}
          >
            Start building your fragrance collection
          </p>
        </div>

        {/* Register Card */}
        <div
          className="glass-elevated"
          style={{
            borderRadius: "var(--radius-xl)",
            padding: "28px 26px",
          }}
        >
          <RegisterForm />
        </div>

        <p
          style={{
            textAlign: "center",
            marginTop: 20,
            fontSize: 13,
            color: "var(--text-muted)",
            fontFamily: "var(--font-body)",
          }}
        >
          Already have an account?{" "}
          <Link
            href="/login"
            style={{
              color: "var(--accent-primary)",
              textDecoration: "none",
              fontWeight: 500,
              transition: "color var(--duration-fast) var(--ease-out)",
            }}
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
