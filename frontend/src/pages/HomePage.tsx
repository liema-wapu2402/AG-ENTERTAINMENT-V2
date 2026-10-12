import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clapperboard, Globe2, Headphones, Play } from 'lucide-react';
import { api } from '@/lib/api';
import { MODULES } from '@/lib/navigation';
import { useApi } from '@/hooks/useApi';
import { AsyncView } from '@/components/ui/AsyncView';
import { Carousel } from '@/components/ui/Carousel';
import { LinkButton } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { MediaCard } from '@/components/media/MediaCard';
import { TrailerModal } from '@/components/media/TrailerModal';
import { ArtistCard } from '@/components/music/ArtistCard';
import { BookCard } from '@/components/books/BookCard';
import { BookModal } from '@/components/books/BookModal';
import type { Book, Movie } from '@/types';

// Feature cards ("Our Services" of the old site) - plain data, rendered by one loop.
const FEATURES = [
  { icon: Clapperboard, title: 'Watch movies everywhere', text: 'Trailers, new releases and top rated series in one place - on any device.' },
  { icon: Headphones, title: 'Listen to music anywhere', text: 'A full music player that keeps playing while you browse the site.' },
  { icon: BookOpen, title: 'Read what you love', text: 'A library of books grouped by genre, ready to explore.' },
  { icon: Globe2, title: 'Responsive by design', text: 'Phone, tablet or desktop - with dark and light mode.' },
];

export default function HomePage() {
  const home = useApi(() => api.home(), []);
  const [trailer, setTrailer] = useState<Movie | null>(null);
  const [book, setBook] = useState<Book | null>(null);
  const tiles = MODULES.filter((m) => m.image); // Movies / Music / Books

  return (
    <>
      {/* ---------- HERO (looping video from the original site) ---------- */}
      <section className="relative isolate flex min-h-[78vh] items-center overflow-hidden">
        <video autoPlay loop muted playsInline poster="/assets/backgrounds/hero-bg.jpg" className="absolute inset-0 -z-20 h-full w-full object-cover">
          <source src="/assets/backgrounds/header.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-bg via-bg/60 to-black/40" />
        <div className="container-page animate-fade-up py-20">
          <img src="/assets/brand/logo-transparent.png" alt="AG Entertainment" className="mb-6 h-20 w-auto sm:h-24" />
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">AG Entertainment · Version 2</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
            Enjoy streaming <span className="text-gradient">movies, music &amp; books</span> in one place.
          </h1>
          <div className="mt-8 flex flex-wrap gap-3">
            <LinkButton to="/movies" size="lg" icon={<Play size={18} fill="currentColor" />}>Explore movies</LinkButton>
            <LinkButton to="/music" size="lg" variant="outline" className="bg-black/30 text-white backdrop-blur">Play music</LinkButton>
            <LinkButton to="/books" size="lg" variant="outline" className="bg-black/30 text-white backdrop-blur">Browse books</LinkButton>
          </div>
        </div>
      </section>

      <div className="container-page space-y-16 py-12">
        {/* ---------- MODULE TILES (generated from lib/navigation.ts) ---------- */}
        <Reveal>
          <div className="grid gap-4 md:grid-cols-3">
            {tiles.map(({ to, label, icon: Icon, description, image, module }) => (
              <Link key={to} to={to} data-module={module} className="group hover-lift relative isolate overflow-hidden rounded-2xl border border-line p-6 pt-24">
                <img src={image} alt="" className="absolute inset-0 -z-20 h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/90 via-black/55 to-m1/30" />
                <Icon className="mb-3 text-accent" />
                <h3 className="text-xl font-bold text-white">{label}</h3>
                <p className="mt-1 text-sm text-white/70">{description}</p>
              </Link>
            ))}
          </div>
        </Reveal>

        {/* ---------- STATS ---------- */}
        <AsyncView state={home} skeleton={<div className="skeleton h-24" />}>
          {(d) => (
            <>
              <Reveal>
                <dl className="grid grid-cols-2 gap-4 rounded-2xl border border-line bg-surface p-6 text-center md:grid-cols-4">
                  {([['Movies & series', d.stats.movies], ['Songs', d.stats.tracks], ['Artists', d.stats.artists], ['Books', d.stats.books]] as const).map(([label, value]) => (
                    <div key={label}><dd className="text-3xl font-extrabold text-accent">{value}</dd><dt className="text-xs text-muted">{label}</dt></div>
                  ))}
                </dl>
              </Reveal>

              <Reveal className="rounded-3xl" >
                <div data-module="movies">
                <SectionHeader eyebrow="Online streaming" title="Latest movies & series" to="/movies" />
                <Carousel items={d.movies} keyOf={(m) => m.id} renderItem={(m) => <MediaCard movie={m} onPlayTrailer={setTrailer} />} />
                </div>
              </Reveal>

              <Reveal>
                <div data-module="music">
                  <SectionHeader eyebrow="Music" title="Popular artists" to="/music" />
                  <Carousel items={d.artists} keyOf={(a) => a.id} variant="free" itemClassName="w-28 sm:w-36" renderItem={(a) => <ArtistCard artist={a} />} />
                </div>
              </Reveal>

              <Reveal>
                <div data-module="books">
                  <SectionHeader eyebrow="Library" title="Featured books" to="/books" />
                  <Carousel items={d.books} keyOf={(b) => b.id} variant="shelf" itemClassName="w-32 sm:w-40" renderItem={(b) => <BookCard book={b} onOpen={setBook} />} />
                </div>
              </Reveal>
            </>
          )}
        </AsyncView>

        {/* ---------- FEATURES ---------- */}
        <Reveal>
          <SectionHeader eyebrow="Our services" title="Why AG Entertainment?" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map(({ icon: Icon, title, text }) => (
              <div key={title} className="hover-lift rounded-2xl border border-line bg-surface p-6">
                <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-accent/15 text-accent"><Icon size={22} /></span>
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-1 text-sm text-muted">{text}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      <TrailerModal movie={trailer} onClose={() => setTrailer(null)} />
      <BookModal book={book} onClose={() => setBook(null)} />
    </>
  );
}
