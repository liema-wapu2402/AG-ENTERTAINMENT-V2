import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface Props { eyebrow?: string; title: string; to?: string; actionLabel?: string; children?: ReactNode; id?: string; sticky?: boolean }

/** Section heading: small green eyebrow + title + optional "see all" link. */
export function SectionHeader({ eyebrow, title, to, actionLabel = 'See all', children, id, sticky }: Props) {
  return (
    <div id={id} className={`mb-5 flex scroll-mt-32 items-end justify-between gap-4 ${sticky ? 'sticky top-14 z-20 -mx-4 bg-bg/80 px-4 py-3 backdrop-blur-xl lg:top-0' : ''}`}>
      <div>
        {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">{eyebrow}</p>}
        <h2 className="text-xl font-bold sm:text-2xl lg:text-3xl">{title}</h2>
      </div>
      <div className="flex items-center gap-3">
        {children}
        {to && (
          <Link to={to} className="group flex items-center gap-1 text-sm font-medium text-muted hover:text-accent">
            {actionLabel} <ArrowRight size={16} className="transition group-hover:translate-x-1" />
          </Link>
        )}
      </div>
    </div>
  );
}
