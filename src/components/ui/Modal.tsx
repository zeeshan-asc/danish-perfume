"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface ModalProps { isOpen: boolean; onClose: () => void; title?: string; children: React.ReactNode; size?: string; }

export default function Modal({ isOpen, onClose, title, children, size = "md" }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const sizes: Record<string, string> = { sm: "380px", md: "520px", lg: "660px", xl: "860px" };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
      document.addEventListener("keydown", handler);
      return () => { document.body.style.overflow = ""; document.removeEventListener("keydown", handler); };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div ref={overlayRef} onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }}>
      <div style={{
        width: "100%", maxWidth: sizes[size], maxHeight: "85vh", overflowY: "auto",
        background: "#14141c",
        border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
      }}>
        {title && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <h2 style={{ fontSize: 15, color: "#f0f0f4", margin: 0, fontWeight: 500, fontFamily: "DM Sans, system-ui, -apple-system, sans-serif" }}>{title}</h2>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#6b6b80", padding: 4, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center" }}><X size={16} /></button>
          </div>
        )}
        <div style={{ padding: "20px 24px" }}>{children}</div>
      </div>
    </div>
  );
}
