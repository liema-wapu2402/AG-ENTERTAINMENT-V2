import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Play, Shuffle } from 'lucide-react';
import { api } from '@/lib/api';
import { useApi } from '@/hooks/useApi';
import { usePlayer } from '@/context/PlayerContext';
import { AsyncView } from '@/components/ui/AsyncView';
import { Button } from '@/components/ui/Button';
import { TrackRow } from '@/components/music/TrackRow';

/** Artist page: header + the artist's songs (click any song to start the queue). */
export default function ArtistPage() {
  const { slug = '' } = useParams();
  const artist = useApi(() => api.artist(slug), [slug]);
  const { playQueue } = usePlayer();

  return (
    <div className="container-page py-6">
      <Link to="/music" className="mb-4 inline-flex items-center gap-2 text-sm text-muted hover:text-accent"><ArrowLeft size={16} /> All music</Link>

      <AsyncView state={artist} skeleton={<div className="skeleton h-64" />}>
        {(a) => {
          const tracks = (a.tracks ?? []).map((t) => ({ ...t, artist: { id: a.id, slug: a.slug, name: a.name } }));
          return (
            <div className="animate-fade-up space-y-8">
              <header className="flex flex-col items-center gap-6 rounded-3xl border border-line bg-surface p-6 text-center sm:flex-row sm:p-8 sm:text-left">
                {a.image_url
                  ? <img src={a.image_url} alt={a.name} className="h-40 w-40 rounded-full object-cover shadow-2xl ring-4 ring-accent/40" />
                  : <span className="flex h-40 w-40 items-center justify-center rounded-full bg-elevated text-5xl font-bold text-accent">{a.name.charAt(0)}</span>}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">Artist</p>
                  <h1 className="mt-1 text-3xl font-extrabold sm:text-5xl">{a.name}</h1>
                  <p className="mt-2 text-sm text-muted">{tracks.length} songs</p>
                  {tracks.length > 0 && (
                    <div className="mt-4 flex flex-wrap justify-center gap-3 sm:justify-start">
                      <Button icon={<Play size={16} fill="currentColor" />} onClick={() => playQueue(tracks, 0)}>Play all</Button>
                      <Button variant="outline" icon={<Shuffle size={16} />} onClick={() => playQueue([...tracks].sort(() => Math.random() - 0.5), 0)}>Shuffle</Button>
                    </div>
                  )}
                </div>
              </header>

              {tracks.length === 0
                ? <p className="rounded-2xl border border-dashed border-line p-10 text-center text-sm text-muted">No songs for this artist yet. Add mp3 files to <code>storage/app/public/music/{a.slug}/</code> and run <code>php artisan music:import</code>.</p>
                : <div className="space-y-1">{tracks.map((t, i) => <TrackRow key={t.id} track={t} index={i} list={tracks} showArtist={false} />)}</div>}
            </div>
          );
        }}
      </AsyncView>
    </div>
  );
}
