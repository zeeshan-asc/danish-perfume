"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Navbar from "@/components/layout/Navbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => { if (!loading && !user) router.replace("/login"); }, [user, loading, router]);

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0b0b10", color: "#14b8a6", fontFamily: "DM Sans, system-ui, -apple-system, sans-serif" }}>
      Loading...
    </div>
  );
  if (!user) return null;

  return (
    <>
      <Navbar />
      <main style={{ width: "90%", maxWidth: 1400, margin: "0 auto" }}>
        {children}
      </main>
    </>
  );
}
