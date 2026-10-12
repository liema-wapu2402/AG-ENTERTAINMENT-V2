import { BookOpen, Clapperboard, Code2, MapPin, Music2, Palette, ShieldCheck, Users } from 'lucide-react';
import { DEVELOPER, SITE } from '@/lib/aboutContent';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Badge } from '@/components/ui/Badge';

const ICONS = [Clapperboard, Music2, BookOpen, Palette];

/** About: the website, who can do what, and the developer. */
export default function AboutPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden">
        <img src="/assets/brand/header.jpg" alt="" className="absolute inset-0 -z-30 h-full w-full object-cover opacity-40" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-bg/40 via-bg/70 to-bg" />
        <div className="container-page flex flex-col items-center py-20 text-center sm:py-28">
          <img src="/assets/brand/logo-transparent.png" alt={SITE.name} className="h-24 w-auto animate-fade-up sm:h-32" />
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.3em] text-accent">{SITE.version}</p>
          <h1 className="mt-2 text-[clamp(2rem,6vw,3.8rem)] font-black leading-tight">About <span className="text-gradient">{SITE.name}</span></h1>
          <p className="mt-4 max-w-2xl text-sm text-fg/80 sm:text-base">{SITE.summary}</p>
        </div>
      </section>

      <div className="container-page space-y-16 pb-10">
        {/* what the site offers */}
        <Reveal>
          <SectionHeader eyebrow="The website" title="What you can do here" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SITE.highlights.map((h, i) => {
              const Icon = ICONS[i % ICONS.length];
              return (
                <div key={h.title} className="hover-lift rounded-2xl border border-line bg-surface p-6">
                  <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-accent/15 text-accent"><Icon size={22} /></span>
                  <h3 className="font-semibold">{h.title}</h3>
                  <p className="mt-1 text-sm text-muted">{h.text}</p>
                </div>
              );
            })}
          </div>
        </Reveal>

        {/* visitors vs admin */}
        <Reveal>
          <SectionHeader eyebrow="Access" title="Visitors and admin" />
          <div className="grid gap-4 md:grid-cols-2">
            {SITE.roles.map((r, i) => {
              const Icon = i === 0 ? Users : ShieldCheck;
              return (
                <div key={r.title} className="flex gap-4 rounded-2xl border border-line bg-surface p-6">
                  <Icon className="mt-1 shrink-0 text-accent" />
                  <div><h3 className="font-semibold">{r.title}</h3><p className="mt-1 text-sm text-muted">{r.text}</p></div>
                </div>
              );
            })}
          </div>
        </Reveal>

        {/* developer */}
        <Reveal>
          <SectionHeader eyebrow="The developer" title={DEVELOPER.name} />
          <div className="grid gap-6 overflow-hidden rounded-3xl border border-line bg-surface md:grid-cols-[auto_1fr]">
            <div className="flex items-center justify-center bg-gradient-to-br from-accent/25 to-elevated p-8 md:p-12">
              <span className="flex h-32 w-32 items-center justify-center rounded-full bg-accent text-5xl font-black text-accent-fg shadow-2xl shadow-accent/30">AR</span>
            </div>
            <div className="p-6 md:p-10">
              <h3 className="text-2xl font-extrabold">{DEVELOPER.name}</h3>
              <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
                <span className="flex items-center gap-1.5"><Code2 size={15} className="text-accent" />{DEVELOPER.role}</span>
                <span className="flex items-center gap-1.5"><MapPin size={15} className="text-accent" />{DEVELOPER.location}</span>
              </p>
              <p className="mt-4 text-sm leading-relaxed text-fg/80">{DEVELOPER.bio}</p>
              <div className="mt-5 flex flex-wrap gap-2">{DEVELOPER.skills.map((s) => <Badge key={s}>{s}</Badge>)}</div>
            </div>
          </div>
        </Reveal>

        {/* tech stack */}
        <Reveal>
          <SectionHeader eyebrow="Built with" title="Technology" />
          <div className="flex flex-wrap gap-3">
            {SITE.stack.map((t) => <span key={t} className="rounded-full border border-line bg-surface px-5 py-2 text-sm font-medium transition hover:border-accent hover:text-accent">{t}</span>)}
          </div>
        </Reveal>
      </div>
    </>
  );
}
