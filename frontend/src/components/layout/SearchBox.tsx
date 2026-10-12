import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, Clapperboard, Loader2, Music2, Search, X } from 'lucide-react';
import { api } from '@/lib/api';
import { useDebounce } from '@/hooks/useDebounce';
import { usePlayer } from '@/context/PlayerContext';
import type { SearchResults } from '@/types';

/**
 * Global search (movies + songs + books) shown in the sidebar.
 * Debounced so the API is only called once the user stops typing.
 */
export function SearchBox({ onNavigate }: { onNavigate?: () => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const debounced = useDebounce(query.trim());
  const box = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { playQueue } = usePlayer();

  // Fetch results when the debounced query changes.
  useEffect(() => {
    if (debounced.length < 2) { setResults(null); return; }
    let cancelled = false;
    setLoading(true);
    api.search(debounced).then((r) => !cancelled && setResults(r)).catch(() => !cancelled && setResults(null)).finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [debounced]);

  // Close the dropdown when clicking outside.
  useEffect(() => {
    const onClick = (e: MouseEvent) => { if (!box.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const go = (to: string) => { setOpen(false); setQuery(''); onNavigate?.(); navigate(to); };
  const total = results ? results.movies.length + results.tracks.length + results.books.length : 0;

  /** One clickable result row (shared by the three groups). */
  const Row = ({ icon: Icon, title, sub, onClick }: { icon: typeof Book; title: string; sub?: string | null; onClick: () => void }) => (
    <button onClick={onClick} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm hover:bg-elevated">
      <Icon size={16} className="shrink-0 text-accent" />
      <span className="min-w-0"><span className="block truncate font-medium">{title}</span>{sub && <span className="block truncate text-xs text-muted">{sub}</span>}</span>
    </button>
  );

  return (
    <div ref={box} className="relative">
      <div className="flex items-center gap-2 rounded-xl bg-elevated px-3 py-2.5 ring-1 ring-transparent focus-within:ring-accent">
        <Search size={18} className="shrink-0 text-muted" />
        <input
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder="Search movies, songs, books..."
          className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-muted"
        />
        {loading ? <Loader2 size={16} className="animate-spin text-muted" /> : query && (
          <button onClick={() => { setQuery(''); setResults(null); }} aria-label="Clear"><X size={16} className="text-muted" /></button>
        )}
      </div>

      {open && debounced.length >= 2 && !loading && results && (
        <div className="absolute left-0 top-full z-50 mt-2 max-h-80 w-72 overflow-y-auto rounded-xl border border-line bg-surface p-2 shadow-2xl sm:w-80">
          {total === 0 && <p className="p-3 text-sm text-muted">No results for “{debounced}”.</p>}
          {results.movies.map((m) => <Row key={`m${m.id}`} icon={Clapperboard} title={m.title} sub={m.year?.toString()} onClick={() => go(`/movies/${m.slug}`)} />)}
          {results.tracks.map((t) => <Row key={`t${t.id}`} icon={Music2} title={t.title} sub={t.artist?.name} onClick={() => { playQueue([t]); setOpen(false); }} />)}
          {results.books.map((b) => <Row key={`b${b.id}`} icon={Book} title={b.title} sub={b.author} onClick={() => go(`/books?book=${b.slug}`)} />)}
        </div>
      )}
    </div>
  );
}
