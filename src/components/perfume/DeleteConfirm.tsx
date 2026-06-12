"use client";

import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { AlertTriangle } from "lucide-react";

interface DeleteConfirmProps { perfumeName: string; onConfirm: () => void; onCancel: () => void; }

export default function DeleteConfirm({ perfumeName, onConfirm, onCancel }: DeleteConfirmProps) {
  return (
    <Modal isOpen onClose={onCancel} size="sm">
      <div style={{ textAlign: "center", padding: "6px 0" }}>
        <AlertTriangle size={32} style={{ color: "#f87171", marginBottom: 12 }} />
        <h3 style={{ fontSize: 15, color: "#f0f0f4", margin: "0 0 6px", fontWeight: 500, fontFamily: "DM Sans, system-ui, -apple-system, sans-serif" }}>Delete Perfume?</h3>
        <p style={{ fontSize: 13, color: "#a0a0b4", margin: "0 0 20px", fontFamily: "DM Sans, system-ui, -apple-system, sans-serif" }}>
          <strong style={{ color: "#f0f0f4" }}>{perfumeName}</strong> will be permanently removed.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <Button variant="secondary" onClick={onCancel}>Cancel</Button>
          <Button variant="danger" onClick={onConfirm}>Delete</Button>
        </div>
      </div>
    </Modal>
  );
}
