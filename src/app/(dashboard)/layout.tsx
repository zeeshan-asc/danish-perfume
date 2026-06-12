"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Spinner from "@/components/ui/Spinner";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading, router]);

  if (loading)
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg-deep)",
          color: "var(--accent-primary)",
          fontFamily: "var(--font-body)",
          gap: 12,
        }}
      >
        <Spinner size={20} />
        <span style={{ fontSize: 14, color: "var(--text-secondary)" }}>Loading...</span>
      </div>
    );

  if (!user) return null;

  return (
    <>
      <Navbar />
      <main style={{ width: "90%", maxWidth: 1400, margin: "0 auto", paddingTop: 14 }}>
        {children}
      </main>
    </>
  );
}
