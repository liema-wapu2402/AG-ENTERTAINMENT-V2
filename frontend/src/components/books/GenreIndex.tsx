import { iconFor } from '@/lib/icons';
import { useScrollSpy } from '@/hooks/useScrollSpy';
import { cx } from '@/lib/format';

export interface GenreLink { id: string; label: string; icon: string; count: number }

const jump = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

/**
 * Shelf index with scroll-spy:
 *  - small screens: sticky chip bar under the header
 *  - large screens: sticky vertical list beside the shelves
 */
export function GenreIndex({ genres, layout }: { genres: GenreLink[]; layout: 'bar' | 'side' }) {
  const active = useScrollSpy(genres.map((g) => g.id));

  if (layout === 'bar') {
    return (
      <div className="sticky top-14 z-30 border-y border-line bg-bg/80 backdrop-blur-xl lg:hidden">
        <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-3">
          {genres.map((g) => {
            const Icon = iconFor(g.icon);
            return (
              <button key={g.id} onClick={() => jump(g.id)} className={cx('flex shrink-0 items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium', active === g.id ? 'bg-module-gradient text-white' : 'bg-elevated text-muted')}>
                <Icon size={14} />{g.label}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <nav className="sticky top-6 hidden w-56 shrink-0 self-start lg:block" aria-label="Genres">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted">Shelves</p>
      <ul className="space-y-1 border-l-2 border-line">
        {genres.map((g) => {
          const Icon = iconFor(g.icon);
          return (
            <li key={g.id}>
              <button onClick={() => jump(g.id)} className={cx('-ml-[2px] flex w-full items-center gap-3 border-l-2 py-2 pl-4 pr-2 text-left text-sm transition', active === g.id ? 'border-accent font-semibold text-accent' : 'border-transparent text-muted hover:text-fg')}>
                <Icon size={16} className="shrink-0" /><span className="flex-1 truncate">{g.label}</span>
                <span className="text-xs tabular-nums opacity-70">{g.count}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
