import { cx } from '@/lib/format';

/**
 * Animated equalizer bars (the old "loader strokes" of the first player).
 * Bars only move while `active` is true.
 */
export function Equalizer({ active, bars = 5, className }: { active: boolean; bars?: number; className?: string }) {
  return (
    <span className={cx('flex h-4 items-end gap-[3px]', className)} aria-hidden>
      {Array.from({ length: bars }).map((_, i) => (
        <span
          key={i}
          className={cx('w-[3px] origin-bottom rounded-full bg-accent', active ? 'animate-equalizer' : 'scale-y-[0.25]')}
          style={{ height: '100%', animationDelay: `${i * 0.15}s`, animationDuration: `${0.8 + (i % 3) * 0.2}s` }}
        />
      ))}
    </span>
  );
}
