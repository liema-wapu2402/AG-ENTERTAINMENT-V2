import { ExternalLink } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { LinkButtonExternal } from './LinkButtonExternal';
import { youtubeEmbedUrl, youtubeSearchUrl } from '@/lib/youtube';
import type { Movie } from '@/types';

/**
 * Trailer player. Trailers are YouTube links stored in the database -
 * no mp4 files are shipped any more. If a movie has no link yet we
 * offer a YouTube search instead of showing a broken player.
 */
export function TrailerPlayer({ movie }: { movie: Movie }) {
  if (movie.trailer_youtube_id) {
    return (
      <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
        <iframe
          src={youtubeEmbedUrl(movie.trailer_youtube_id)}
          title={`${movie.title} trailer`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="h-full w-full"
        />
      </div>
    );
  }
  return (
    <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-line bg-elevated/50 p-6 text-center">
      <p className="text-sm text-muted">No trailer link saved for this title yet.</p>
      <LinkButtonExternal href={youtubeSearchUrl(movie.title)}><ExternalLink size={16} /> Find the trailer on YouTube</LinkButtonExternal>
    </div>
  );
}

/** Same player inside a popup (used on cards and carousels). */
export function TrailerModal({ movie, onClose }: { movie: Movie | null; onClose: () => void }) {
  return (
    <Modal open={Boolean(movie)} onClose={onClose} title={movie?.title}>
      {movie && (
        <div className="p-4 pt-12 sm:p-6 sm:pt-14">
          <h3 className="mb-4 text-lg font-bold">{movie.title} — Trailer</h3>
          <TrailerPlayer movie={movie} />
        </div>
      )}
    </Modal>
  );
}
