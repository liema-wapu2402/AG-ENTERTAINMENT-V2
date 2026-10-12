import { useEffect } from 'react';
import { ChevronDown, Pause, Play, Repeat, Repeat1, Shuffle, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { usePlayer } from '@/context/PlayerContext';
import { RangeSlider } from './PlayerBar';
import { Equalizer } from './Equalizer';
import { cx, formatTime } from '@/lib/format';

/**
 * Full-screen "Now Playing" sheet: big spinning vinyl cover, full controls
 * and the up-next queue. Replaces the old single-page player.
 */
export function NowPlaying({ open, onClose }: { open: boolean; onClose: () => void }) {
  const p = usePlayer();

  // Esc closes the sheet.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!p.current) return null;
  const cover = p.current.cover_url ?? '/assets/brand/logo-mark.png';

  return (
    <div className={cx('fixed inset-0 z-[90] overflow-y-auto bg-bg transition duration-500', open ? 'translate-y-0' : 'pointer-events-none translate-y-full')} aria-hidden={!open}>
      {/* blurred cover as ambient background */}
      <img src={cover} alt="" className="pointer-events-none absolute inset-0 h-full w-full scale-125 object-cover opacity-20 blur-3xl" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-bg" />

      <div className="container-page relative flex min-h-full flex-col gap-8 py-6 lg:flex-row lg:items-center lg:gap-16">
        <button onClick={onClose} aria-label="Close" className="absolute left-4 top-4 z-10 rounded-full bg-elevated p-2 hover:text-accent"><ChevronDown /></button>

        {/* left: vinyl + controls */}
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center pt-12 lg:pt-0">
          <div className="relative">
            <img
              src={cover} alt=""
              className={cx('h-64 w-64 rounded-full border-4 border-surface object-cover shadow-2xl shadow-accent/20 animate-spin-slow sm:h-80 sm:w-80', !p.playing && '[animation-play-state:paused]')}
            />
            <span className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-surface bg-bg" />
          </div>

          <div className="mt-8 w-full text-center">
            <Equalizer active={p.playing} bars={7} className="mx-auto mb-3 h-6" />
            <h2 className="truncate text-2xl font-bold sm:text-3xl">{p.current.title}</h2>
            <p className="mt-1 truncate text-muted">{p.current.artist?.name}{p.current.album ? ` · ${p.current.album}` : ''}</p>
          </div>

          <div className="mt-6 flex w-full items-center gap-3 text-xs tabular-nums text-muted">
            <span className="w-10 text-right">{formatTime(p.currentTime)}</span>
            <RangeSlider className="flex-1" label="Seek" value={p.currentTime} max={p.duration} onChange={p.seek} />
            <span className="w-10">{formatTime(p.duration)}</span>
          </div>

          <div className="mt-4 flex items-center gap-4 sm:gap-6">
            <button onClick={p.toggleShuffle} aria-label="Shuffle" className={cx('rounded-full p-2', p.shuffle ? 'text-accent' : 'text-muted hover:text-fg')}><Shuffle size={20} /></button>
            <button onClick={p.prev} aria-label="Previous" className="rounded-full p-2 hover:text-accent"><SkipBack size={28} fill="currentColor" /></button>
            <button onClick={p.togglePlay} aria-label={p.playing ? 'Pause' : 'Play'} className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-accent-fg shadow-xl shadow-accent/30 transition hover:scale-105">
              {p.playing ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
            </button>
            <button onClick={p.next} aria-label="Next" className="rounded-full p-2 hover:text-accent"><SkipForward size={28} fill="currentColor" /></button>
            <button onClick={p.cycleRepeat} aria-label="Repeat" className={cx('rounded-full p-2', p.repeat !== 'off' ? 'text-accent' : 'text-muted hover:text-fg')}>
              {p.repeat === 'one' ? <Repeat1 size={20} /> : <Repeat size={20} />}
            </button>
          </div>

          <div className="mt-6 flex w-full max-w-xs items-center gap-3 text-muted">
            <Volume2 size={18} />
            <RangeSlider className="flex-1" label="Volume" value={p.volume} max={1} onChange={p.setVolume} />
          </div>
        </div>

        {/* right: queue */}
        <div className="mx-auto w-full max-w-lg flex-1 pb-8">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-widest text-muted">Up next · {p.queue.length} songs</h3>
          <ul className="max-h-[50vh] space-y-1 overflow-y-auto rounded-2xl border border-line bg-surface/60 p-2 backdrop-blur lg:max-h-[70vh]">
            {p.queue.map((t, i) => (
              <li key={`${t.id}-${i}`}>
                <button onClick={() => p.playQueue(p.queue, i)} className={cx('flex w-full items-center gap-3 rounded-xl p-2 text-left hover:bg-elevated', t.id === p.current?.id && 'bg-elevated text-accent')}>
                  <img src={t.cover_url ?? '/assets/brand/logo-mark.png'} alt="" className="h-10 w-10 rounded-lg object-cover" />
                  <span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium">{t.title}</span><span className="block truncate text-xs text-muted">{t.artist?.name}</span></span>
                  <span className="text-xs tabular-nums text-muted">{formatTime(t.duration_seconds)}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
