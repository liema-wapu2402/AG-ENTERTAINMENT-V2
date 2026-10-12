import type { LucideIcon } from 'lucide-react';
import { cx } from '@/lib/format';

export interface TabItem<K extends string> { key: K; label: string; icon?: LucideIcon }

interface Props<K extends string> { items: TabItem<K>[]; active: K; onChange: (key: K) => void; className?: string }

/** Scrollable pill tabs (movie categories, book genres ...). */
export function Tabs<K extends string>({ items, active, onChange, className }: Props<K>) {
  return (
    <div className={cx('no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0', className)} role="tablist">
      {items.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          role="tab"
          aria-selected={active === key}
          onClick={() => onChange(key)}
          className={cx(
            'flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition',
            active === key ? 'border-accent bg-accent text-accent-fg' : 'border-line text-muted hover:border-accent hover:text-accent',
          )}
        >
          {Icon && <Icon size={16} />}{label}
        </button>
      ))}
    </div>
  );
}
