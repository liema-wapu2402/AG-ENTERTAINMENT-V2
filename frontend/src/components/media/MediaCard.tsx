import { Link } from 'react-router-dom';
import { Clock, Play, Star } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { formatRuntime } from '@/lib/format';
import type { Movie } from '@/types';

/** Poster card used for movies AND TV series (carousels, grids, related lists). */
export function MediaCard({ movie, onPlayTrailer, rank }: { movie: Movie; onPlayTrailer?: (m: Movie) => void; rank?: number }) {
  // series show "N eps", movies show the runtime
  const length = movie.episodes ? `${movie.episodes} eps` : formatRuntime(movie.runtime_minutes);

  return (
    <article className="group hover-lift relative isolate">
      {/* big outlined rank number (top rated rail) */}
      {rank !== undefined && <span aria-hidden className="text-outline pointer-events-none absolute -left-1 bottom-14 z-10 text-7xl font-black leading-none drop-shadow">{rank}</span>}
      <div className="shine gradient-border relative aspect-[2/3] overflow-hidden rounded-xl bg-elevated ring-1 ring-line">
        <Link to={`/movies/${movie.slug}`} aria-label={movie.title}>
          <img src={movie.poster_url} alt={`${movie.title} poster`} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        </Link>
        {movie.quality && <Badge filled className="absolute left-2 top-2">{movie.quality}</Badge>}
        {/* hover overlay with a trailer button */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition group-hover:opacity-100">
          <button
            onClick={() => onPlayTrailer?.(movie)}
            className="pointer-events-auto flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-xs font-bold text-accent-fg hover:brightness-110"
          >
            <Play size={14} fill="currentColor" /> Trailer
          </button>
        </div>
      </div>
      <div className="mt-3 space-y-1">
        <Link to={`/movies/${movie.slug}`} className="line-clamp-1 text-sm font-semibold hover:text-accent">{movie.title}</Link>
        <div className="flex items-center gap-3 text-xs text-muted">
          <span>{movie.year ?? '—'}</span>
          <span className="flex items-center gap-1"><Clock size={12} />{length}</span>
          {movie.rating && <span className="ml-auto flex items-center gap-1 text-accent"><Star size={12} fill="currentColor" />{movie.rating.toFixed(1)}</span>}
        </div>
      </div>
    </article>
  );
}
