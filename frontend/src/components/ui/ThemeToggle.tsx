import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { cx } from '@/lib/format';

/** Dark / light switch. `showLabel` is used in the expanded sidebar. */
export function ThemeToggle({ showLabel = false, className }: { showLabel?: boolean; className?: string }) {
  const { mode, toggle } = useTheme();
  const Icon = mode === 'dark' ? Sun : Moon;
  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark / light mode"
      className={cx('flex items-center gap-3 rounded-xl p-2.5 text-muted transition hover:bg-elevated hover:text-accent', className)}
    >
      <Icon size={20} className="shrink-0" />
      {showLabel && <span className="text-sm font-medium">{mode === 'dark' ? 'Light mode' : 'Dark mode'}</span>}
    </button>
  );
}
