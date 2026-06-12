"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useRouter, usePathname } from "next/navigation";
import { SprayCan as Spray, LogOut, LayoutDashboard, Library, Menu, X } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    setMobileOpen(false);
    await logout();
    router.push("/login");
  };

  const navLinks = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/collection", label: "Collection", icon: Library },
  ];

  return (
    <>
      {/* ═══ Floating Navbar ═══ */}
      <nav
        style={{
          position: "sticky",
          top: 8,
          zIndex: 40,
          margin: "8px auto 0",
          width: "calc(100% - 16px)",
          maxWidth: 1400,
          background: "var(--bg-glass)",
          backdropFilter: "blur(16px) saturate(140%)",
          WebkitBackdropFilter: "blur(16px) saturate(140%)",
          border: "1px solid rgba(200,164,78,0.10)",
          borderRadius: "var(--radius-xl)",
          boxShadow: "var(--shadow-md), 0 0 30px rgba(200,164,78,0.04)",
          height: 52,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 14px",
        }}
      >
        {/* Left: Logo + Desktop Nav */}
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <Link
            href="/"
            style={{
              display: "flex", alignItems: "center", gap: 8,
              textDecoration: "none", flexShrink: 0,
            }}
          >
            <div style={{
              width: 28, height: 28, borderRadius: "var(--radius-md)",
              background: "var(--accent-subtle)", border: "1px solid var(--accent-border)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Spray size={14} style={{ color: "var(--accent-primary)" }} />
            </div>
            <span className="navbar-brand" style={{
              fontSize: 15, fontWeight: 600, color: "var(--text-primary)",
              letterSpacing: "0.03em", fontFamily: "var(--font-display)",
            }}>
              Fragrance Vault
            </span>
          </Link>

          {/* Desktop nav links — hidden on mobile */}
          <div className="navbar-links" style={{ display: "flex", gap: 4 }}>
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = pathname === link.href;
              return (
                <Link key={link.href} href={link.href} style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "6px 14px", borderRadius: "var(--radius-md)",
                  fontSize: 13, fontFamily: "var(--font-body)",
                  textDecoration: "none", fontWeight: 500,
                  background: active ? "var(--accent-subtle)" : "transparent",
                  color: active ? "var(--accent-glow)" : "var(--text-secondary)",
                  border: active ? "1px solid var(--accent-border)" : "1px solid transparent",
                  transition: "all var(--duration-fast) var(--ease-out)",
                }}>
                  <Icon size={14} />
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right: Desktop user + logout; Mobile hamburger */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Desktop user info */}
          <span className="navbar-user" style={{
            fontSize: 12, color: "var(--text-secondary)",
            fontWeight: 500, fontFamily: "var(--font-body)",
          }}>
            {user?.username}
          </span>

          {/* Desktop logout */}
          <button onClick={handleLogout} className="navbar-logout" style={{
            display: "flex", alignItems: "center", gap: 5,
            padding: "5px 12px", borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-default)", background: "transparent",
            fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-body)",
            cursor: "pointer", transition: "all var(--duration-fast) var(--ease-out)", fontWeight: 500,
          }}>
            <LogOut size={12} /> Exit
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="navbar-hamburger"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            style={{
              display: "none",
              alignItems: "center", justifyContent: "center",
              width: 34, height: 34, borderRadius: "var(--radius-md)",
              border: "1px solid var(--border-default)", background: "transparent",
              color: "var(--text-secondary)", cursor: "pointer",
            }}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* ═══ Mobile Slide-Out Menu ═══ */}
      {mobileOpen && (
        <>
          {/* Overlay */}
          <div
            onClick={() => setMobileOpen(false)}
            style={{
              position: "fixed", inset: 0, zIndex: 45,
              background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
            }}
          />
          {/* Menu panel */}
          <div style={{
            position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 50,
            width: 280, maxWidth: "85vw",
            background: "var(--bg-elevated)",
            borderLeft: "1px solid var(--border-default)",
            boxShadow: "var(--shadow-lg)",
            display: "flex", flexDirection: "column",
            padding: "60px 20px 20px",
            animation: "slideInRight 0.2s var(--ease-out)",
          }}>
            {/* Close button */}
            <button
              onClick={() => setMobileOpen(false)}
              style={{
                position: "absolute", top: 12, right: 12,
                width: 34, height: 34, borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-default)", background: "transparent",
                color: "var(--text-secondary)", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <X size={18} />
            </button>

            {/* User info */}
            <div style={{
              padding: "12px 16px", borderRadius: "var(--radius-lg)",
              background: "var(--bg-tertiary)", border: "1px solid var(--border-subtle)",
              marginBottom: 16,
            }}>
              <p style={{ fontSize: 11, color: "var(--text-muted)", margin: "0 0 2px", fontFamily: "var(--font-body)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>
                Signed in as
              </p>
              <p style={{ fontSize: 14, color: "var(--text-primary)", margin: 0, fontFamily: "var(--font-body)", fontWeight: 600 }}>
                {user?.username}
              </p>
            </div>

            {/* Nav links */}
            <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    style={{
                      display: "flex", alignItems: "center", gap: 10,
                      padding: "12px 16px", borderRadius: "var(--radius-md)",
                      fontSize: 14, fontFamily: "var(--font-body)",
                      textDecoration: "none", fontWeight: 500,
                      background: active ? "var(--accent-subtle)" : "transparent",
                      color: active ? "var(--accent-glow)" : "var(--text-secondary)",
                      border: active ? "1px solid var(--accent-border)" : "1px solid transparent",
                      transition: "all var(--duration-fast) var(--ease-out)",
                    }}
                  >
                    <Icon size={18} />
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Mobile logout */}
            <button
              onClick={handleLogout}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                padding: "12px 16px", borderRadius: "var(--radius-md)",
                border: "1px solid var(--danger-border)", background: "var(--danger-subtle)",
                color: "var(--danger)", fontSize: 14, fontFamily: "var(--font-body)",
                cursor: "pointer", fontWeight: 600, marginTop: 12,
              }}
            >
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </>
      )}
    </>
  );
}
