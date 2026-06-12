"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useRouter, usePathname } from "next/navigation";
import { SprayCan as Spray, LogOut, LayoutDashboard, Library } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => { await logout(); router.push("/login"); };

  const navLinks = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/collection", label: "Collection", icon: Library },
  ];

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 40,
      background: "rgba(11,11,16,0.85)",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
      backdropFilter: "blur(12px)",
    }}>
      <div style={{ width: "90%", maxWidth: 1400, margin: "0 auto", height: 52, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <div style={{ width: 26, height: 26, borderRadius: 6, background: "rgba(20,184,166,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Spray size={14} style={{ color: "#14b8a6" }} />
            </div>
            <span style={{ fontSize: 14, fontWeight: 500, color: "#f0f0f4", letterSpacing: "0.02em", fontFamily: "DM Sans, system-ui, -apple-system, sans-serif" }}>
              Fragrance Vault
            </span>
          </Link>
          <div style={{ display: "flex", gap: 2 }}>
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "6px 14px", borderRadius: 6, fontSize: 13,
                    fontFamily: "DM Sans, system-ui, -apple-system, sans-serif",
                    textDecoration: "none", fontWeight: 500,
                    background: active ? "rgba(20,184,166,0.08)" : "transparent",
                    color: active ? "#2dd4bf" : "#a0a0b4",
                    transition: "all 0.15s ease",
                  }}
                >
                  <Icon size={14} />
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 13, color: "#a0a0b4", fontWeight: 500 }}>{user?.username}</span>
          <button onClick={handleLogout}
            style={{
              display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 6,
              border: "1px solid rgba(255,255,255,0.06)", background: "transparent",
              fontSize: 12, color: "#6b6b80", fontFamily: "DM Sans, system-ui, -apple-system, sans-serif",
              cursor: "pointer", transition: "all 0.15s ease", fontWeight: 500,
            }}>
            <LogOut size={12} /> Exit
          </button>
        </div>
      </div>
    </nav>
  );
}
