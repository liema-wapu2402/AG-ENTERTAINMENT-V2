import { Pause, Play } from 'lucide-react';
import { Equalizer } from './Equalizer';
import { usePlayer } from '@/context/PlayerContext';
import { cx, formatTime } from '@/lib/format';
import type { Track } from '@/types';

interface Props {
  track: Track;
  index: number;
  /** The list this row belongs to - clicking plays the whole list from this track. */
  list: Track[];
  showArtist?: boolean;
}

/** One song row. Shows an equalizer while it is the active track. */
export function TrackRow({ track, index, list, showArtist = true }: Props) {
  const { current, playing, playQueue, togglePlay } = usePlayer();
  const isCurrent = current?.id === track.id;

  const onClick = () => (isCurrent ? togglePlay() : playQueue(list, index));

  return (
    <button
      onClick={onClick}
      className={cx(
        'group flex w-full items-center gap-3 rounded-xl p-2 text-left transition hover:bg-elevated sm:gap-4 sm:p-3',
        isCurrent && 'bg-elevated ring-1 ring-accent/40',
      )}
    >
      <span className="w-6 shrink-0 text-center text-sm text-muted">
        {isCurrent && playing ? <Equalizer active className="mx-auto" bars={3} /> : <span className="group-hover:hidden">{index + 1}</span>}
        {!(isCurrent && playing) && <Play size={16} className="mx-auto hidden text-accent group-hover:block" fill="currentColor" />}
      </span>

      <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-surface">
        {track.cover_url
          ? <img src={track.cover_url} alt="" loading="lazy" className="h-full w-full object-cover" />
          : <img src="/assets/brand/logo-mark.png" alt="" className="h-full w-full object-cover opacity-70" />}
        {isCurrent && playing && <span className="absolute inset-0 flex items-center justify-center bg-black/50"><Pause size={16} className="text-white" fill="currentColor" /></span>}
      </span>

      <span className="min-w-0 flex-1">
        <span className={cx('block truncate text-sm font-semibold', isCurrent && 'text-accent')}>{track.title}</span>
        {showArtist && <span className="block truncate text-xs text-muted">{track.artist?.name}{track.album ? ` · ${track.album}` : ''}</span>}
      </span>

      <span className="shrink-0 text-xs tabular-nums text-muted">{formatTime(track.duration_seconds)}</span>
    </button>
  );
}
