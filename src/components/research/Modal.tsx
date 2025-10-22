"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

export function Modal({ open, onClose, titleId = "modal-title", descId = "modal-desc", children }: { open: boolean; onClose: () => void; titleId?: string; descId?: string; children: React.ReactNode }) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);
  const prevOverflow = useRef<string | null>(null);
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        const list = Array.from(focusables).filter((el) => !el.hasAttribute("disabled"));
        if (list.length === 0) return;
        const first = list[0];
        const last = list[list.length - 1];
        if (!e.shiftKey && document.activeElement === last) {
          first.focus();
          e.preventDefault();
        } else if (e.shiftKey && document.activeElement === first) {
          last.focus();
          e.preventDefault();
        }
      }
    }
    if (open) {
      lastFocused.current = (document.activeElement as HTMLElement) || null;
      document.addEventListener("keydown", onKey);
      // lock body scroll while modal is open
      prevOverflow.current = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      setTimeout(() => {
        const el = dialogRef.current?.querySelector<HTMLElement>("[data-autofocus]");
        el?.focus();
      }, 10);
    } else {
      document.removeEventListener("keydown", onKey);
      lastFocused.current?.focus?.();
      if (prevOverflow.current !== null) document.body.style.overflow = prevOverflow.current;
    }
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Defer portal target until mounted to avoid SSR document reference
  useEffect(() => {
    if (typeof document !== "undefined") setContainer(document.body);
  }, []);

  if (!container) return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div className="fixed inset-0 z-[1000]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-black/60" onClick={onClose} />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              aria-describedby={descId}
              ref={dialogRef}
              className="max-w-7xl w-[98vw] md:w-[92vw] lg:w-[90vw] max-h-[96vh] overflow-auto rounded-2xl bg-[#0b0f1a]/90 backdrop-blur-xl border border-white/10 shadow-2xl p-6 md:p-8 text-white"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              {children}
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    container
  );
}
