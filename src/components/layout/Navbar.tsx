"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useRouter, usePathname } from "next/navigation";
import { SprayCan as Spray, LogOut, LayoutDashboard, Library } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const navLinks = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/collection", label: "Collection", icon: Library },
  ];

  return (
    <nav
      style={{
        position: "sticky",
        top: 10,
        zIndex: 40,
        margin: "10px auto 0",
        width: "90%",
        maxWidth: 1400,
        background: "var(--bg-glass)",
        backdropFilter: "blur(16px) saturate(140%)",
        WebkitBackdropFilter: "blur(16px) saturate(140%)",
        border: "1px solid rgba(200,164,78,0.10)",
        borderRadius: "var(--radius-xl)",
        boxShadow: "var(--shadow-md), 0 0 30px rgba(200,164,78,0.04)",
        height: 54,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
      }}
    >
      {/* Left: Logo + Nav Links */}
      <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
        {/* Brand Logo */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9,
            textDecoration: "none",
            transition: "opacity var(--duration-fast) var(--ease-out)",
          }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: "var(--radius-md)",
              background: "var(--accent-subtle)",
              border: "1px solid var(--accent-border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Spray size={15} style={{ color: "var(--accent-primary)" }} />
          </div>
          <span
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: "var(--text-primary)",
              letterSpacing: "0.03em",
              fontFamily: "var(--font-display)",
            }}
          >
            Fragrance Vault
          </span>
        </Link>

        {/* Nav Links */}
        <div style={{ display: "flex", gap: 4 }}>
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "7px 16px",
                  borderRadius: "var(--radius-md)",
                  fontSize: 13,
                  fontFamily: "var(--font-body)",
                  textDecoration: "none",
                  fontWeight: 500,
                  background: active
                    ? "var(--accent-subtle)"
                    : "transparent",
                  color: active
                    ? "var(--accent-glow)"
                    : "var(--text-secondary)",
                  border: active
                    ? "1px solid var(--accent-border)"
                    : "1px solid transparent",
                  transition: "all var(--duration-fast) var(--ease-out)",
                }}
              >
                <Icon size={14} />
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Right: User + Logout */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <span
          style={{
            fontSize: 13,
            color: "var(--text-secondary)",
            fontWeight: 500,
            fontFamily: "var(--font-body)",
          }}
        >
          {user?.username}
        </span>
        <button
          onClick={handleLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 14px",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-default)",
            background: "transparent",
            fontSize: 12,
            color: "var(--text-muted)",
            fontFamily: "var(--font-body)",
            cursor: "pointer",
            transition: "all var(--duration-fast) var(--ease-out)",
            fontWeight: 500,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--border-hover)";
            e.currentTarget.style.color = "var(--text-secondary)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--border-default)";
            e.currentTarget.style.color = "var(--text-muted)";
          }}
        >
          <LogOut size={13} /> Exit
        </button>
      </div>
    </nav>
  );
}
