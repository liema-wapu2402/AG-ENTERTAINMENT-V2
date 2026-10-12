import type { ReactNode } from 'react';
import { cx } from '@/lib/format';

/** Small pill used for quality (HD/4K), genre, category... */
export function Badge({ children, filled = false, className }: { children: ReactNode; filled?: boolean; className?: string }) {
  return (
    <span className={cx(
      'inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide',
      filled ? 'bg-accent text-accent-fg' : 'border border-fg/25 text-fg/80',
      className,
    )}>
      {children}
    </span>
  );
}
