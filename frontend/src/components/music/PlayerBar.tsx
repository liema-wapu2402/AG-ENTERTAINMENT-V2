import { useState } from 'react';
import { ChevronUp, Pause, Play, Repeat, Repeat1, Shuffle, SkipBack, SkipForward, Volume1, Volume2, VolumeX, X } from 'lucide-react';
import { usePlayer } from '@/context/PlayerContext';
import { NowPlaying } from './NowPlaying';
import { cx, formatTime } from '@/lib/format';

/** Reusable range slider styled with the accent colour (seek + volume). */
export function RangeSlider({ value, max, onChange, className, label }: { value: number; max: number; onChange: (v: number) => void; className?: string; label: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <input
      type="range" min={0} max={max || 1} step="any" value={value} aria-label={label}
      onChange={(e) => onChange(Number(e.target.value))}
      className={cx('h-1.5 cursor-pointer appearance-none rounded-full accent-[rgb(var(--accent))]', className)}
      style={{ background: `linear-gradient(to right, rgb(var(--accent)) ${pct}%, rgb(var(--line)) ${pct}%)` }}
    />
  );
}

/**
 * Persistent mini player docked at the bottom of the screen.
 * Tap the arrow (or the song info) to open the full "Now Playing" view.
 */
export function PlayerBar({ sidebarCollapsed }: { sidebarCollapsed: boolean }) {
  const p = usePlayer();
  const [expanded, setExpanded] = useState(false);
  if (!p.current) return null;

  const VolumeIcon = p.volume === 0 ? VolumeX : p.volume < 0.5 ? Volume1 : Volume2;

  return (
    <>
      <div className={cx('fixed right-0 left-0 bottom-[calc(3.5rem+env(safe-area-inset-bottom))] z-40 border-t border-line glass transition-all duration-300 lg:bottom-0', sidebarCollapsed ? 'lg:left-[72px]' : 'lg:left-64')}>
        {/* thin progress line - mobile only (the full seek bar is hidden on small screens) */}
        <div className="h-0.5 w-full bg-line md:hidden"><div className="h-full bg-accent" style={{ width: `${p.duration ? (p.currentTime / p.duration) * 100 : 0}%` }} /></div>

        <div className="container-page flex h-[72px] items-center gap-3 sm:gap-6">
          {/* song info */}
          <button onClick={() => setExpanded(true)} className="flex min-w-0 flex-1 items-center gap-3 text-left md:w-1/4 md:flex-none">
            <img
              src={p.current.cover_url ?? '/assets/brand/logo-mark.png'} alt=""
              className={cx('h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-accent/60 animate-spin-slow', !p.playing && '[animation-play-state:paused]')}
            />
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold">{p.current.title}</span>
              <span className="block truncate text-xs text-muted">{p.current.artist?.name}</span>
            </span>
          </button>

          {/* controls + seek */}
          <div className="flex flex-col items-center gap-1 md:flex-1">
            <div className="flex items-center gap-1 sm:gap-3">
              <button onClick={p.toggleShuffle} aria-label="Shuffle" className={cx('hidden rounded-full p-2 sm:block', p.shuffle ? 'text-accent' : 'text-muted hover:text-fg')}><Shuffle size={16} /></button>
              <button onClick={p.prev} aria-label="Previous" className="rounded-full p-2 hover:text-accent"><SkipBack size={20} fill="currentColor" /></button>
              <button onClick={p.togglePlay} aria-label={p.playing ? 'Pause' : 'Play'} className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-fg shadow-lg shadow-accent/30 transition hover:scale-105">
                {p.playing ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
              </button>
              <button onClick={p.next} aria-label="Next" className="rounded-full p-2 hover:text-accent"><SkipForward size={20} fill="currentColor" /></button>
              <button onClick={p.cycleRepeat} aria-label="Repeat" className={cx('hidden rounded-full p-2 sm:block', p.repeat !== 'off' ? 'text-accent' : 'text-muted hover:text-fg')}>
                {p.repeat === 'one' ? <Repeat1 size={16} /> : <Repeat size={16} />}
              </button>
            </div>
            <div className="hidden w-full max-w-xl items-center gap-2 text-[11px] tabular-nums text-muted md:flex">
              <span className="w-9 text-right">{formatTime(p.currentTime)}</span>
              <RangeSlider className="flex-1" label="Seek" value={p.currentTime} max={p.duration} onChange={p.seek} />
              <span className="w-9">{formatTime(p.duration)}</span>
            </div>
          </div>

          {/* volume + expand + close */}
          <div className="flex items-center justify-end gap-2 md:w-1/4">
            <div className="hidden items-center gap-2 lg:flex">
              <button onClick={() => p.setVolume(p.volume === 0 ? 0.8 : 0)} aria-label="Mute" className="text-muted hover:text-fg"><VolumeIcon size={18} /></button>
              <RangeSlider className="w-24" label="Volume" value={p.volume} max={1} onChange={p.setVolume} />
            </div>
            <button onClick={() => setExpanded(true)} aria-label="Open player" className="rounded-full p-2 text-muted hover:text-accent"><ChevronUp size={20} /></button>
            <button onClick={p.close} aria-label="Close player" className="hidden rounded-full p-2 text-muted hover:text-accent sm:block"><X size={18} /></button>
          </div>
        </div>
      </div>

      <NowPlaying open={expanded} onClose={() => setExpanded(false)} />
    </>
  );
}
