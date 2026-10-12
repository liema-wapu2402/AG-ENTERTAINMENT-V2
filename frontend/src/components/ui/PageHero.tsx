import type { ReactNode } from 'react';

interface Props { image: string; eyebrow: string; title: ReactNode; subtitle?: string; children?: ReactNode }

/** Compact banner at the top of the Movies / Music / Books pages (keeps the three modules visually consistent). */
export function PageHero({ image, eyebrow, title, subtitle, children }: Props) {
  return (
    <section className="relative isolate overflow-hidden">
      <img src={image} alt="" className="absolute inset-0 -z-20 h-full w-full object-cover" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-bg via-bg/80 to-bg/40" />
      <div className="container-page animate-fade-up py-14 sm:py-20 lg:py-24">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">{eyebrow}</p>
        <h1 className="mt-2 max-w-3xl text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">{title}</h1>
        {subtitle && <p className="mt-3 max-w-2xl text-sm text-muted sm:text-base">{subtitle}</p>}
        {children && <div className="mt-6">{children}</div>}
      </div>
    </section>
  );
}
