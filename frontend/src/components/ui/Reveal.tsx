import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cx } from '@/lib/format';

/** Entrance effects (one per module): rise = from below, slide = from the left, zoom = scale up. */
export type RevealEffect = 'rise' | 'slide' | 'zoom';

const HIDDEN: Record<RevealEffect, string> = {
  rise: 'translate-y-8 opacity-0',
  slide: '-translate-x-10 opacity-0',
  zoom: 'scale-95 opacity-0',
};

/** Animates its content in the first time it scrolls into view. */
export function Reveal({ children, className, effect = 'rise' }: { children: ReactNode; className?: string; effect?: RevealEffect }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); io.disconnect(); }
    }, { threshold: 0.08 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return <div ref={ref} className={cx('transition duration-700 ease-out motion-reduce:transition-none', visible ? 'translate-x-0 translate-y-0 scale-100 opacity-100' : HIDDEN[effect], className)}>{children}</div>;
}
