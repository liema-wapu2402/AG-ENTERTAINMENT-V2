import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Flame, Info, Layers, Play, Search, Star, Tv } from 'lucide-react';
import { api } from '@/lib/api';
import { useApi } from '@/hooks/useApi';
import { useScrollY } from '@/hooks/useScrollY';
import { AsyncView } from '@/components/ui/AsyncView';
import { AdminShortcut } from '@/components/ui/AdminShortcut';
import { Badge } from '@/components/ui/Badge';
import { Button, LinkButton } from '@/components/ui/Button';
import { Carousel } from '@/components/ui/Carousel';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Tabs, type TabItem } from '@/components/ui/Tabs';
import { MediaCard } from '@/components/media/MediaCard';
import { TrailerModal } from '@/components/media/TrailerModal';
import type { Movie, MovieCategory } from '@/types';

type Filter = 'all' | MovieCategory;

// Category config drives the tabs AND the rails of the "All" view.
const CATEGORIES: { key: MovieCategory; tab: string; eyebrow: string; title: string; icon: typeof Flame; ranked?: boolean }[] = [
  { key: 'upcoming', tab: 'Upcoming', eyebrow: 'Coming soon', title: 'Upcoming movies', icon: Flame },
  { key: 'top_rated', tab: 'Top rated', eyebrow: 'Fan favourites', title: 'Top rated movies', icon: Star, ranked: true },
  { key: 'series', tab: 'TV series', eyebrow: 'Binge worthy', title: 'World best TV series', icon: Tv },
];
const TABS: TabItem<Filter>[] = [{ key: 'all', label: 'All', icon: Layers }, ...CATEGORIES.map((c) => ({ key: c.key as Filter, label: c.tab, icon: c.icon }))];

/**
 * MOVIES - "cinema" look: emerald + wine, parallax poster hero,
 * horizontal snap rails with edge fade + progress bar, ranked top list.
 */
export default function MoviesPage() {
  const movies = useApi(() => api.movies(), []);
  const [filter, setFilter] = useState<Filter>('all');
  const [search, setSearch] = useState('');
  const [trailer, setTrailer] = useState<Movie | null>(null);
  const scrollY = useScrollY();

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (movies.data ?? []).filter((m) => !q || m.title.toLowerCase().includes(q));
  }, [movies.data, search]);

  // Featured title: first upcoming movie (prefers one with a wide backdrop).
  const upcoming = (movies.data ?? []).filter((m) => m.category === 'upcoming');
  const featured = upcoming.find((m) => m.backdrop_url) ?? upcoming[0];

  return (
    <>
      {/* ---------------- HERO with parallax ---------------- */}
      <section className="relative isolate flex min-h-[70vh] items-end overflow-hidden sm:min-h-[78vh]">
        <img
          src={featured?.backdrop_url ?? '/assets/backgrounds/top-rated-bg.jpg'} alt=""
          className="absolute inset-0 -z-30 h-[120%] w-full object-cover"
          style={{ transform: `translateY(${Math.min(scrollY, 700) * 0.3}px) scale(1.05)` }}
        />
        {/* wine glow from the left, emerald from the right, fading into the page background */}
        <div className="absolute inset-0 -z-20 bg-gradient-to-r from-m2/70 via-bg/60 to-m1/25" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-bg via-bg/50 to-transparent" />

        <div className="container-page grid items-end gap-8 pb-10 pt-28 md:grid-cols-[1fr_auto] md:pb-16">
          <div className="animate-fade-up">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Badge filled>Featured</Badge>
              {featured?.quality && <Badge>{featured.quality}</Badge>}
              {featured?.genre && <Badge>{featured.genre}</Badge>}
            </div>
            <h1 className="max-w-3xl text-[clamp(2rem,6vw,4.5rem)] font-black leading-[1.05]">
              {featured ? <span className="text-gradient">{featured.title}</span> : <>Watch the <span className="text-gradient">best</span> of cinema</>}
            </h1>
            <p className="mt-4 line-clamp-3 max-w-xl text-sm text-fg/80 sm:text-base">
              {featured?.synopsis ?? 'Upcoming blockbusters, top rated films and binge-worthy series, with trailers one click away.'}
            </p>
            {featured && (
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Button size="lg" className="bg-module-gradient text-white" icon={<Play size={18} fill="currentColor" />} onClick={() => setTrailer(featured)}>Watch trailer</Button>
                <LinkButton to={`/movies/${featured.slug}`} size="lg" variant="outline" icon={<Info size={18} />} className="bg-black/30 text-white backdrop-blur">Details</LinkButton>
                <AdminShortcut to="/admin/movies" label="Manage movies" />
              </div>
            )}
          </div>
          {featured && (
            <Link to={`/movies/${featured.slug}`} className="hidden w-52 rotate-3 overflow-hidden rounded-2xl shadow-2xl shadow-m2/40 ring-2 ring-m1/60 transition hover:rotate-0 md:block lg:w-60">
              <img src={featured.poster_url} alt={`${featured.title} poster`} className="aspect-[2/3] w-full object-cover" />
            </Link>
          )}
        </div>
      </section>

      {/* ---------------- sticky filter bar ---------------- */}
      <div className="sticky top-14 z-30 border-y border-line bg-bg/80 backdrop-blur-xl lg:top-0">
        <div className="container-page flex flex-col gap-3 py-3 md:flex-row md:items-center md:justify-between">
          <Tabs items={TABS} active={filter} onChange={setFilter} />
          <label className="flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 focus-within:border-accent md:w-72">
            <Search size={16} className="text-muted" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Filter by title..." className="w-full bg-transparent text-sm outline-none placeholder:text-muted" />
          </label>
        </div>
      </div>

      <div className="container-page space-y-14 py-10">
        <AsyncView
          state={movies}
          isEmpty={() => filtered.length === 0}
          emptyMessage="No movies match your filter."
          skeleton={<div className="grid grid-cols-[repeat(auto-fill,minmax(9.5rem,1fr))] gap-4">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton aspect-[2/3]" />)}</div>}
        >
          {() => filter === 'all' ? (
            // ALL: one cinema rail per category
            <>
              {CATEGORIES.map((c) => {
                const items = filtered.filter((m) => m.category === c.key);
                return items.length > 0 && (
                  <Reveal key={c.key} effect="rise">
                    <SectionHeader eyebrow={c.eyebrow} title={c.title} />
                    <Carousel
                      items={items} keyOf={(m) => m.id} variant="snap"
                      itemClassName={c.ranked ? 'w-44 sm:w-52 pl-6' : 'w-40 sm:w-48'}
                      renderItem={(m, i) => <MediaCard movie={m} rank={c.ranked ? i + 1 : undefined} onPlayTrailer={setTrailer} />}
                    />
                  </Reveal>
                );
              })}
            </>
          ) : (
            // one category: fluid grid (as many columns as fit the screen)
            <div className="grid grid-cols-[repeat(auto-fill,minmax(9.5rem,1fr))] gap-x-4 gap-y-8 sm:gap-x-5">
              {filtered.filter((m) => m.category === filter).map((m) => (
                <div key={m.id} className="animate-fade-up"><MediaCard movie={m} onPlayTrailer={setTrailer} /></div>
              ))}
            </div>
          )}
        </AsyncView>
      </div>

      <TrailerModal movie={trailer} onClose={() => setTrailer(null)} />
    </>
  );
}
