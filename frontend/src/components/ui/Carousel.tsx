import { useCallback, useEffect, useRef, useState, type PointerEvent, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cx } from '@/lib/format';

/**
 * Three scrolling patterns - one per module:
 *  - "snap"  (movies): cinema rail, cards snap to the left edge, edges fade, progress bar below
 *  - "free"  (music):  free momentum scrolling, drag with the mouse like a story strip
 *  - "shelf" (books):  cards snap to the centre and stand on a shelf board
 */
export type CarouselVariant = 'snap' | 'free' | 'shelf';

interface Props<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  keyOf: (item: T) => string | number;
  /** Tailwind width classes of each slide, e.g. "w-40 sm:w-48". */
  itemClassName?: string;
  variant?: CarouselVariant;
}

export function Carousel<T>({ items, renderItem, keyOf, itemClassName = 'w-40 sm:w-48', variant = 'snap' }: Props<T>) {
  const track = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, startX: 0, startLeft: 0, moved: false });
  const [progress, setProgress] = useState(0);   // 0..1
  const [edges, setEdges] = useState({ start: true, end: false });

  const measure = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? el.scrollLeft / max : 0);
    setEdges({ start: el.scrollLeft < 8, end: el.scrollLeft > max - 8 });
  }, []);

  useEffect(() => { measure(); window.addEventListener('resize', measure); return () => window.removeEventListener('resize', measure); }, [measure, items.length]);

  const scroll = (dir: 1 | -1) => track.current?.scrollBy({ left: dir * track.current.clientWidth * 0.8, behavior: 'smooth' });

  // Mouse drag-to-scroll (only for the "free" pattern; touch already scrolls natively).
  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    if (variant !== 'free' || e.pointerType !== 'mouse' || !track.current) return;
    drag.current = { active: true, startX: e.clientX, startLeft: track.current.scrollLeft, moved: false };
  };
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag.current.active || !track.current) return;
    const dx = e.clientX - drag.current.startX;
    if (Math.abs(dx) > 4) drag.current.moved = true;
    track.current.scrollLeft = drag.current.startLeft - dx;
  };
  const onUp = () => { drag.current.active = false; };
  // A drag must not count as a click on a card.
  const onClickCapture = (e: React.MouseEvent) => { if (drag.current.moved) { e.preventDefault(); e.stopPropagation(); drag.current.moved = false; } };

  // soft fade on the edges that still have content to scroll to (cinema rail only)
  const mask = variant === 'snap'
    ? `linear-gradient(to right, ${edges.start ? '#000' : 'transparent'}, #000 6%, #000 94%, ${edges.end ? '#000' : 'transparent'})`
    : undefined;

  return (
    <div className="group/carousel relative">
      <div
        ref={track}
        onScroll={measure}
        onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerLeave={onUp}
        onClickCapture={onClickCapture}
        style={mask ? { maskImage: mask, WebkitMaskImage: mask } : undefined}
        className={cx(
          'no-scrollbar -mx-1 flex overflow-x-auto px-1 pt-1',
          variant === 'snap' && 'snap-x snap-mandatory gap-4 pb-3',
          variant === 'free' && 'cursor-grab select-none gap-5 pb-3 active:cursor-grabbing sm:gap-7',
          variant === 'shelf' && 'snap-x snap-mandatory items-end gap-5 px-4 pb-0 sm:gap-7',
        )}
      >
        {items.map((item, i) => (
          <div key={keyOf(item)} className={cx('shrink-0', variant === 'shelf' ? 'snap-center' : variant === 'snap' ? 'snap-start' : '', itemClassName)}>
            {renderItem(item, i)}
          </div>
        ))}
      </div>

      {/* shelf board the books stand on */}
      {variant === 'shelf' && (
        <div className="relative z-10 -mt-1 h-3 rounded-sm bg-module-gradient shadow-[0_12px_20px_-6px_rgb(var(--m2)/0.55)]">
          <div className="absolute inset-x-0 top-0 h-px bg-white/40" />
        </div>
      )}

      {/* progress bar (cinema rail) */}
      {variant === 'snap' && items.length > 4 && (
        <div className="mx-auto mt-2 h-1 w-32 overflow-hidden rounded-full bg-line sm:w-48">
          <div className="h-full rounded-full bg-module-gradient transition-[width]" style={{ width: `${Math.max(12, progress * 100)}%` }} />
        </div>
      )}

      {/* arrows only on devices with a mouse; touch users just swipe */}
      {(['left', 'right'] as const).map((side) => (
        <button
          key={side}
          onClick={() => scroll(side === 'left' ? -1 : 1)}
          aria-label={side === 'left' ? 'Scroll left' : 'Scroll right'}
          className={`absolute top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-bg/85 text-fg opacity-0 shadow-lg backdrop-blur transition hover:bg-accent hover:text-accent-fg group-hover/carousel:opacity-100 md:flex ${side === 'left' ? '-left-3' : '-right-3'}`}
        >
          {side === 'left' ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      ))}
    </div>
  );
}
