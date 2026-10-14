import { useEffect } from "react";
import { createPortal } from "react-dom";
import { Loader2 } from "lucide-react";

interface Props {
  open: boolean;
  message?: string;
}

/**
 * Full-screen loading modal (no close button on purpose - it disappears by itself
 * when the action finishes). Used while signing in and signing out.
 */
export function LoadingModal({ open, message = "Please wait..." }: Props) {
  // lock page scroll while the modal is open
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;
  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-fade-in"
      role="alertdialog"
      aria-modal="true"
      aria-busy="true"
      aria-live="assertive"
      aria-label={message}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <div className="relative flex flex-col items-center w-full max-w-xs gap-4 px-8 py-8 border shadow-2xl rounded-2xl border-line bg-surface animate-fade-up">
        <span className="relative flex items-center justify-center w-14 h-14">
          <span
            aria-hidden
            className="absolute inset-0 rounded-full animate-ping bg-accent/20"
          />
          <Loader2 size={34} className="relative animate-spin text-accent" />
        </span>
        <p className="text-sm font-semibold text-center">{message}</p>
      </div>
    </div>,
    document.body
  );
}
