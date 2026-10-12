import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cx } from '@/lib/format';

/** Page buttons: 1 … 4 5 6 … 20 */
export function Pagination({ page, last, onChange }: { page: number; last: number; onChange: (p: number) => void }) {
  if (last <= 1) return null;
  const pages = Array.from({ length: last }, (_, i) => i + 1).filter((p) => p === 1 || p === last || Math.abs(p - page) <= 1);
  const btn = 'flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-sm transition';

  return (
    <nav className="mt-5 flex flex-wrap items-center justify-center gap-1" aria-label="Pagination">
      <button disabled={page <= 1} onClick={() => onChange(page - 1)} className={cx(btn, 'text-muted hover:bg-elevated disabled:opacity-40')} aria-label="Previous page"><ChevronLeft size={16} /></button>
      {pages.map((p, i) => (
        <span key={p} className="flex items-center gap-1">
          {i > 0 && p - pages[i - 1] > 1 && <span className="px-1 text-muted">…</span>}
          <button onClick={() => onChange(p)} className={cx(btn, p === page ? 'bg-accent font-bold text-accent-fg' : 'text-muted hover:bg-elevated')}>{p}</button>
        </span>
      ))}
      <button disabled={page >= last} onClick={() => onChange(page + 1)} className={cx(btn, 'text-muted hover:bg-elevated disabled:opacity-40')} aria-label="Next page"><ChevronRight size={16} /></button>
    </nav>
  );
}
