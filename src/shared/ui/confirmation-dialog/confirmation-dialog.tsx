"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";

import { Button } from "@/shared/ui/button";

type ConfirmationDialogProps = {
  open: boolean;
  title: string;
  description: string;
  pending?: boolean;
  confirmLabel?: string;
  pendingLabel?: string;
  danger?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function ConfirmationDialog({
  open,
  title,
  description,
  pending = false,
  confirmLabel = "Accepter les modifications",
  pendingLabel = "Enregistrement...",
  danger = false,
  onCancel,
  onConfirm,
}: ConfirmationDialogProps) {
  const cancelButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) cancelButton.current?.focus();
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center bg-background/85 px-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirmation-dialog-title"
          aria-describedby="confirmation-dialog-description"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          onKeyDown={(event) => {
            if (event.key === "Escape" && !pending) onCancel();
          }}
        >
          <motion.div
            className="w-full max-w-md rounded-3xl border border-border bg-surface p-6 shadow-2xl"
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
          >
            <h2 id="confirmation-dialog-title" className="text-xl font-semibold">
              {title}
            </h2>
            <p
              id="confirmation-dialog-description"
              className="mt-3 text-sm leading-6 text-secondary-text"
            >
              {description}
            </p>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                ref={cancelButton}
                type="button"
                variant="ghost"
                disabled={pending}
                onClick={onCancel}
              >
                Annuler
              </Button>
              <Button
                type="button"
                className={danger ? "bg-danger text-white hover:bg-danger/85" : undefined}
                disabled={pending}
                onClick={onConfirm}
              >
                {pending ? pendingLabel : confirmLabel}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
