import { Link } from 'react-router-dom';
import { Music2 } from 'lucide-react';
import type { Artist } from '@/types';

/** Round artist avatar with name + song count (links to the artist page). */
export function ArtistCard({ artist }: { artist: Artist }) {
  return (
    <Link to={`/music/artist/${artist.slug}`} className="group block text-center">
      <div className="hover-lift mx-auto aspect-square w-full rounded-full bg-module-gradient p-[3px] transition duration-300 group-hover:rotate-[8deg] group-hover:scale-105">
        <div className="h-full w-full overflow-hidden rounded-full border-2 border-bg bg-elevated">
        {artist.image_url
          ? <img src={artist.image_url} alt={artist.name} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:-rotate-[8deg] group-hover:scale-110" />
          : <span className="flex h-full w-full items-center justify-center bg-gradient-to-br from-m1/30 to-m2/30 text-3xl font-bold text-accent">{artist.name.charAt(0)}</span>}
        </div>
      </div>
      <h3 className="mt-3 truncate text-sm font-semibold group-hover:text-accent">{artist.name}</h3>
      <p className="flex items-center justify-center gap-1 text-xs text-muted"><Music2 size={12} />{artist.tracks_count ?? 0} songs</p>
    </Link>
  );
}
