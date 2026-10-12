import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { Track } from '@/types';

export type RepeatMode = 'off' | 'all' | 'one';

interface PlayerCtx {
  queue: Track[];
  current: Track | null;
  playing: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  shuffle: boolean;
  repeat: RepeatMode;
  /** Replace the queue and start playing at `startIndex`. */
  playQueue: (tracks: Track[], startIndex?: number) => void;
  togglePlay: () => void;
  next: () => void;
  prev: () => void;
  seek: (seconds: number) => void;
  setVolume: (v: number) => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  close: () => void;
}

const PlayerContext = createContext<PlayerCtx | null>(null);

/**
 * Global music player. One <audio> element lives here (outside the router),
 * so music keeps playing while the user browses movies or books.
 */
export function PlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(new Audio());
  const [queue, setQueue] = useState<Track[]>([]);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.8);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<RepeatMode>('off');

  const current = queue[index] ?? null;

  // Pick the next index (random when shuffle is on).
  const nextIndex = useCallback((direction: 1 | -1) => {
    if (queue.length <= 1) return 0;
    if (shuffle && direction === 1) {
      let i = index;
      while (i === index) i = Math.floor(Math.random() * queue.length);
      return i;
    }
    return (index + direction + queue.length) % queue.length;
  }, [queue.length, shuffle, index]);

  // Load + play whenever the current track changes.
  useEffect(() => {
    const audio = audioRef.current;
    if (!current) { audio.pause(); audio.removeAttribute('src'); return; }
    audio.src = current.audio_url;
    audio.play().catch(() => setPlaying(false)); // autoplay can be blocked
  }, [current?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Wire audio events -> React state.
  useEffect(() => {
    const audio = audioRef.current;
    const onTime = () => setCurrentTime(audio.currentTime);
    const onMeta = () => setDuration(audio.duration || 0);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnded = () => {
      if (repeat === 'one') { audio.currentTime = 0; void audio.play(); return; }
      const isLast = index === queue.length - 1;
      if (isLast && repeat === 'off' && !shuffle) { setPlaying(false); return; }
      setIndex(nextIndex(1));
    };
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onMeta);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);
    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onMeta);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
    };
  }, [repeat, index, queue.length, shuffle, nextIndex]);

  useEffect(() => { audioRef.current.volume = volume; }, [volume]);

  const playQueue = useCallback((tracks: Track[], startIndex = 0) => {
    setQueue(tracks);
    setIndex(startIndex);
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!current) return;
    if (audio.paused) void audio.play(); else audio.pause();
  }, [current]);

  const value = useMemo<PlayerCtx>(() => ({
    queue, current, playing, currentTime, duration, volume, shuffle, repeat,
    playQueue, togglePlay,
    next: () => setIndex(nextIndex(1)),
    // Restart the song if it already played for a few seconds, otherwise go back.
    prev: () => {
      if (audioRef.current.currentTime > 3) audioRef.current.currentTime = 0;
      else setIndex(nextIndex(-1));
    },
    seek: (s) => { audioRef.current.currentTime = s; setCurrentTime(s); },
    setVolume: setVolumeState,
    toggleShuffle: () => setShuffle((s) => !s),
    cycleRepeat: () => setRepeat((r) => (r === 'off' ? 'all' : r === 'all' ? 'one' : 'off')),
    close: () => { audioRef.current.pause(); setQueue([]); setIndex(0); setPlaying(false); },
  }), [queue, current, playing, currentTime, duration, volume, shuffle, repeat, playQueue, togglePlay, nextIndex]);

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used inside <PlayerProvider>');
  return ctx;
}
