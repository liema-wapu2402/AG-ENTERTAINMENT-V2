import { useMemo } from 'react';
import { Play, Shuffle } from 'lucide-react';
import { api } from '@/lib/api';
import { useApi } from '@/hooks/useApi';
import { useScrollSpy } from '@/hooks/useScrollSpy';
import { useScrollY } from '@/hooks/useScrollY';
import { usePlayer } from '@/context/PlayerContext';
import { AsyncView } from '@/components/ui/AsyncView';
import { AdminShortcut } from '@/components/ui/AdminShortcut';
import { Button } from '@/components/ui/Button';
import { Carousel } from '@/components/ui/Carousel';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ArtistCard } from '@/components/music/ArtistCard';
import { Equalizer } from '@/components/music/Equalizer';
import { TrackRow } from '@/components/music/TrackRow';
import { cx } from '@/lib/format';

// Artist groups shown on the page (matches the `gender` column).
const ARTIST_GROUPS = [
  { key: 'female', title: 'Female artists' },
  { key: 'male', title: 'Male artists' },
  { key: 'group', title: 'Groups & bands' },
] as const;

/**
 * MUSIC - "studio" look: red + blue. A vinyl that spins as you scroll,
 * sticky section chips with scroll-spy, free drag-scrolling artist strips.
 */
export default function MusicPage() {
  const tracks = useApi(() => api.tracks(12), []);
  const artists = useApi(() => api.artists(), []);
  const { playQueue, playing } = usePlayer();
  const scrollY = useScrollY();

  // Sections that exist (used by the sticky chips + scroll-spy).
  const sections = useMemo(() => [
    { id: 'latest', label: 'Latest' },
    ...ARTIST_GROUPS.filter((g) => (artists.data ?? []).some((a) => a.gender === g.key)).map((g) => ({ id: `artists-${g.key}`, label: g.title })),
  ], [artists.data]);
  const active = useScrollSpy(sections.map((s) => s.id));

  const shuffleAll = () => playQueue([...(tracks.data ?? [])].sort(() => Math.random() - 0.5), 0);
  const jump = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <>
      {/* ---------------- HERO: vinyl rotates with the scroll ---------------- */}
      <section className="relative isolate overflow-hidden">
        <img src="/assets/backgrounds/service-bg.jpg" alt="" className="absolute inset-0 -z-30 h-full w-full object-cover opacity-60" />
        <div className="absolute inset-0 -z-20 bg-gradient-to-br from-m1/55 via-bg/80 to-m2/55" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-bg to-transparent" />

        <div className="container-page grid items-center gap-8 pb-12 pt-24 md:grid-cols-[1.2fr_1fr] md:pb-20 md:pt-28">
          <div className="animate-fade-up">
            <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-accent"><Equalizer active={playing} bars={6} className="h-5" /> Music</p>
            <h1 className="mt-3 text-[clamp(2.2rem,6.5vw,4.8rem)] font-black leading-[1.02]">Your sound,<br /><span className="text-gradient">your way.</span></h1>
            <p className="mt-4 max-w-lg text-sm text-fg/80 sm:text-base">Stream your favourite artists. The player stays with you while you explore the rest of the site.</p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {(tracks.data?.length ?? 0) > 0 && (
                <>
                  <Button size="lg" className="bg-module-gradient text-white" icon={<Play size={18} fill="currentColor" />} onClick={() => playQueue(tracks.data!, 0)}>Play latest</Button>
                  <Button size="lg" variant="outline" icon={<Shuffle size={18} />} onClick={shuffleAll}>Shuffle</Button>
                </>
              )}
              <AdminShortcut to="/admin/music" label="Manage music" />
            </div>
          </div>

          {/* vinyl record */}
          <div className="relative mx-auto aspect-square w-56 sm:w-72 md:w-full md:max-w-sm" aria-hidden>
            <div className="absolute inset-0 rounded-full bg-module-gradient opacity-60 blur-3xl" />
            <div className="relative h-full w-full rounded-full border border-white/10 bg-[repeating-radial-gradient(circle,#0b0b10_0,#0b0b10_3px,#16161d_4px,#16161d_5px)] shadow-2xl" style={{ transform: `rotate(${scrollY * 0.35}deg)` }}>
              <div className="absolute inset-[30%] flex items-center justify-center rounded-full bg-module-gradient">
                <img src="/assets/brand/logo-mark.png" alt="" className="h-3/5 w-3/5 rounded-full object-cover" />
              </div>
              <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-bg" />
              <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_30deg,transparent,rgb(255_255_255/0.12),transparent_30%,transparent_50%,rgb(255_255_255/0.08),transparent_80%)]" />
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- sticky chips (scroll-spy) ---------------- */}
      <div className="sticky top-14 z-30 border-y border-line bg-bg/80 backdrop-blur-xl lg:top-0">
        <div className="no-scrollbar container-page flex gap-2 overflow-x-auto py-3">
          {sections.map((s) => (
            <button key={s.id} onClick={() => jump(s.id)} className={cx('shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition', active === s.id ? 'bg-module-gradient text-white shadow-lg shadow-m2/30' : 'bg-elevated text-muted hover:text-fg')}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="container-page space-y-14 py-10">
        {/* latest releases */}
        <section>
          <SectionHeader id="latest" eyebrow="New" title="Latest releases" />
          <AsyncView
            state={tracks}
            isEmpty={(t) => t.length === 0}
            emptyMessage="No songs imported yet. An admin can upload mp3 files from the admin panel."
            skeleton={<div className="grid gap-2 lg:grid-cols-2">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton h-16" />)}</div>}
          >
            {(list) => (
              <div className="grid gap-x-8 gap-y-1 lg:grid-cols-2">
                {list.map((t, i) => <TrackRow key={t.id} track={t} index={i} list={list} />)}
              </div>
            )}
          </AsyncView>
        </section>

        {/* artists: free-scrolling story strips */}
        <AsyncView state={artists} isEmpty={(a) => a.length === 0}>
          {(all) => (
            <>
              {ARTIST_GROUPS.map((g) => {
                const items = all.filter((a) => a.gender === g.key);
                return items.length > 0 && (
                  <Reveal key={g.key} effect="slide">
                    <SectionHeader id={`artists-${g.key}`} eyebrow="Popular artists" title={g.title} />
                    <Carousel items={items} keyOf={(a) => a.id} variant="free" itemClassName="w-28 sm:w-36" renderItem={(a) => <ArtistCard artist={a} />} />
                  </Reveal>
                );
              })}
            </>
          )}
        </AsyncView>
      </div>
    </>
  );
}
