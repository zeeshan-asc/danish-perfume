import RegisterForm from "@/components/auth/RegisterForm";
import { SprayCan as Spray } from "lucide-react";

export default function RegisterPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px 20px 40px", background: "#0b0b10" }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: "rgba(20,184,166,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
            <Spray size={20} style={{ color: "#14b8a6" }} />
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 500, color: "#f0f0f4", margin: "0 0 4px", fontFamily: "DM Sans, system-ui, -apple-system, sans-serif" }}>Create Account</h1>
          <p style={{ fontSize: 14, color: "#6b6b80", margin: 0, fontFamily: "DM Sans, system-ui, -apple-system, sans-serif" }}>Start building your fragrance collection</p>
        </div>
        <div style={{ background: "#14141c", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "24px 22px" }}>
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
