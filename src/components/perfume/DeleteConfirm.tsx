"use client";

import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { AlertTriangle } from "lucide-react";

interface DeleteConfirmProps {
  perfumeName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConfirm({
  perfumeName,
  onConfirm,
  onCancel,
}: DeleteConfirmProps) {
  return (
    <Modal isOpen onClose={onCancel} size="sm">
      <div style={{ textAlign: "center", padding: "8px 0" }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "var(--radius-xl)",
            background: "var(--danger-subtle)",
            border: "1px solid var(--danger-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
          }}
        >
          <AlertTriangle size={28} style={{ color: "var(--danger)" }} />
        </div>
        <h3
          style={{
            fontSize: 17,
            fontWeight: 600,
            color: "var(--text-primary)",
            margin: "0 0 6px",
            fontFamily: "var(--font-display)",
            letterSpacing: "0.01em",
          }}
        >
          Delete Perfume?
        </h3>
        <p
          style={{
            fontSize: 13,
            color: "var(--text-secondary)",
            margin: "0 0 24px",
            fontFamily: "var(--font-body)",
            lineHeight: 1.6,
          }}
        >
          <strong style={{ color: "var(--text-primary)" }}>{perfumeName}</strong>{" "}
          will be permanently removed. This action cannot be undone.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}
