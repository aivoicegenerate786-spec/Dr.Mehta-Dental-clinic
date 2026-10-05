"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import { Close } from "../icons";
import BookingFlow from "./BookingFlow";

export default function BookingDialog({
  open,
  onClose,
  preset,
  flowKey,
}: {
  open: boolean;
  onClose: () => void;
  preset?: string;
  flowKey: number;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          role="dialog"
          aria-modal="true"
          aria-label="Book an appointment"
        >
          <button
            type="button"
            aria-label="Close booking"
            onClick={onClose}
            className="absolute inset-0 bg-ink/70 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: 60, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="relative h-[94dvh] w-full overflow-y-auto rounded-t-[28px] bg-paper shadow-2xl sm:h-auto sm:max-h-[92dvh] sm:max-w-5xl sm:rounded-[28px]"
            data-lenis-prevent
          >
            <div className="sticky top-0 z-10 flex justify-center bg-paper pt-2.5 sm:hidden">
              <span className="h-1 w-10 rounded-full bg-ink/15" />
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 z-20 grid h-10 w-10 place-items-center rounded-full border border-ink/10 bg-paper text-ink transition-all hover:rotate-90 hover:border-ink sm:right-5 sm:top-5"
            >
              <Close className="h-4 w-4" />
            </button>
            <BookingFlow key={flowKey} preset={preset} onDone={onClose} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
