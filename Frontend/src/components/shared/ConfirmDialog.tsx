"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** style the confirm button as destructive (red) */
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

// Reusable yes/no confirmation modal. Click the backdrop or "cancel" to dismiss.
export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "تأكيد",
  cancelLabel = "إلغاء",
  danger = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  // Render into <body> via a portal so the fixed overlay is centered on the
  // VIEWPORT — not trapped inside a transformed/blurred ancestor (e.g. the
  // sticky site header), which was pinning it to the top of the screen.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!open || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-sm rounded-xl bg-white p-6 shadow-card-hover"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-headline-sm text-on-surface">{title}</h2>
        {message && (
          <p className="mt-2 text-body-md text-on-surface-variant">{message}</p>
        )}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-lg px-4 py-2 text-label-md text-on-surface-variant transition-colors hover:bg-surface-container-low"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`rounded-lg px-4 py-2 text-label-md text-white transition-all active:scale-95 ${
              danger
                ? "bg-error hover:opacity-90"
                : "bg-primary-container hover:opacity-90"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
