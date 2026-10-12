import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Star } from 'lucide-react';
import { api } from '@/lib/api';
import { useApi } from '@/hooks/useApi';
import { AsyncView } from '@/components/ui/AsyncView';
import { Badge } from '@/components/ui/Badge';
import { Carousel } from '@/components/ui/Carousel';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { MediaCard } from '@/components/media/MediaCard';
import { TrailerModal, TrailerPlayer } from '@/components/media/TrailerModal';
import { formatRuntime } from '@/lib/format';
import type { Movie } from '@/types';

/** Movie / series detail: backdrop, info, YouTube trailer and related titles. */
export default function MovieDetailPage() {
  const { slug = '' } = useParams();
  const detail = useApi(() => api.movie(slug), [slug]);
  const [trailer, setTrailer] = useState<Movie | null>(null);

  return (
    <div className="container-page py-6">
      <Link to="/movies" className="mb-4 inline-flex items-center gap-2 text-sm text-muted hover:text-accent"><ArrowLeft size={16} /> All movies</Link>

      <AsyncView state={detail} skeleton={<div className="skeleton h-96" />}>
        {({ movie, related }) => (
          <div className="animate-fade-up space-y-12">
            <section className="relative isolate overflow-hidden rounded-3xl border border-line">
              <img src={movie.backdrop_url ?? movie.poster_url} alt="" className="absolute inset-0 -z-20 h-full w-full scale-110 object-cover blur-md" />
              <div className="absolute inset-0 -z-10 bg-gradient-to-r from-bg via-bg/85 to-bg/50" />
              <div className="grid gap-8 p-5 sm:p-8 md:grid-cols-[260px_1fr] lg:p-12">
                <img src={movie.poster_url} alt={`${movie.title} poster`} className="mx-auto w-48 rounded-2xl shadow-2xl md:w-full" />
                <div className="flex flex-col justify-center">
                  <div className="flex flex-wrap gap-2">
                    <Badge filled>{movie.category === 'series' ? 'TV series' : movie.category === 'upcoming' ? 'New' : 'Top rated'}</Badge>
                    {movie.quality && <Badge>{movie.quality}</Badge>}
                    {movie.genre && <Badge>{movie.genre}</Badge>}
                  </div>
                  <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl lg:text-5xl">{movie.title}</h1>
                  <div className="mt-4 flex flex-wrap items-center gap-5 text-sm text-muted">
                    {movie.year && <span className="flex items-center gap-1.5"><Calendar size={15} />{movie.year}</span>}
                    <span className="flex items-center gap-1.5"><Clock size={15} />{movie.episodes ? `${movie.episodes} episodes` : formatRuntime(movie.runtime_minutes)}</span>
                    {movie.rating && <span className="flex items-center gap-1.5 text-accent"><Star size={15} fill="currentColor" />{movie.rating.toFixed(1)} / 10</span>}
                  </div>
                  {movie.synopsis && <p className="mt-5 max-w-2xl leading-relaxed text-fg/80">{movie.synopsis}</p>}
                </div>
              </div>
            </section>

            <section>
              <SectionHeader eyebrow="Watch" title="Official trailer" />
              <div className="mx-auto max-w-4xl"><TrailerPlayer movie={movie} /></div>
            </section>

            {related.length > 0 && (
              <section>
                <SectionHeader eyebrow="More to stream" title="You may also like" to="/movies" />
                <Carousel items={related} keyOf={(m) => m.id} renderItem={(m) => <MediaCard movie={m} onPlayTrailer={setTrailer} />} />
              </section>
            )}
          </div>
        )}
      </AsyncView>
      <TrailerModal movie={trailer} onClose={() => setTrailer(null)} />
    </div>
  );
}
