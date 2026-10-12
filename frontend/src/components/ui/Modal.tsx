import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cx } from '@/lib/format';

interface Props { open: boolean; onClose: () => void; title?: string; className?: string; children: ReactNode }

/** Accessible modal: Esc / backdrop click closes, page scroll is locked while open. */
export function Modal({ open, onClose, title, className, children }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open, onClose]);

  if (!open) return null;
  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in" role="dialog" aria-modal="true" aria-label={title}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className={cx('relative max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-line bg-surface shadow-2xl animate-fade-up', className)}>
        <button onClick={onClose} aria-label="Close" className="absolute right-3 top-3 z-10 rounded-full bg-black/50 p-2 text-white transition hover:bg-accent hover:text-accent-fg">
          <X size={18} />
        </button>
        {children}
      </div>
    </div>,
    document.body,
  );
}
