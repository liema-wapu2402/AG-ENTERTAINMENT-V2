import { Link } from 'react-router-dom';
import { BookOpen, Clapperboard, Disc3, Layers, Music2, Tv } from 'lucide-react';
import { adminApi } from '@/lib/api';
import { useApi } from '@/hooks/useApi';
import { useAuth } from '@/context/AuthContext';
import { AsyncView } from '@/components/ui/AsyncView';

// Stat cards: label, count key, icon, module palette and the screen they open.
const STATS = [
  { label: 'Movies', key: 'movies', icon: Clapperboard, module: 'movies', to: '/admin/movies' },
  { label: 'TV series', key: 'series', icon: Tv, module: 'movies', to: '/admin/movies' },
  { label: 'Artists', key: 'artists', icon: Disc3, module: 'music', to: '/admin/music/artists' },
  { label: 'Songs', key: 'tracks', icon: Music2, module: 'music', to: '/admin/music/songs' },
  { label: 'Genres', key: 'genres', icon: Layers, module: 'books', to: '/admin/books/genres' },
  { label: 'Books', key: 'books', icon: BookOpen, module: 'books', to: '/admin/books' },
] as const;

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const data = useApi(() => adminApi.dashboard(), []);

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Admin panel</p>
        <h1 className="text-2xl font-extrabold sm:text-3xl">Welcome, {user?.name}</h1>
        <p className="text-sm text-muted">Pick a module to add, edit, delete or import content. Visitors see changes immediately.</p>
      </header>

      <AsyncView state={data} skeleton={<div className="grid grid-cols-2 gap-4 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton h-28" />)}</div>}>
        {(d) => (
          <>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
              {STATS.map(({ label, key, icon: Icon, module, to }) => (
                <Link key={key} to={to} data-module={module} className="hover-lift group relative overflow-hidden rounded-2xl border border-line bg-surface p-5">
                  <span className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-module-gradient opacity-20 transition group-hover:scale-150" />
                  <Icon className="text-accent" />
                  <p className="mt-3 text-3xl font-black">{d.counts[key]}</p>
                  <p className="text-sm text-muted">{label}</p>
                </Link>
              ))}
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              {([
                ['Latest movies', 'movies', d.latest.movies.map((m) => ({ id: m.id, title: m.title, sub: m.category.replace('_', ' ') }))],
                ['Latest songs', 'music', d.latest.tracks.map((t) => ({ id: t.id, title: t.title, sub: t.artist?.name ?? '' }))],
                ['Latest books', 'books', d.latest.books.map((b) => ({ id: b.id, title: b.title, sub: b.author }))],
              ] as const).map(([title, module, items]) => (
                <section key={title} data-module={module} className="rounded-2xl border border-line bg-surface p-5">
                  <h2 className="mb-3 flex items-center gap-2 font-bold"><span className="h-2 w-6 rounded-full bg-module-gradient" />{title}</h2>
                  {items.length === 0 ? <p className="text-sm text-muted">Nothing yet.</p> : (
                    <ul className="divide-y divide-line">
                      {items.map((i) => <li key={i.id} className="py-2"><p className="truncate text-sm font-medium">{i.title}</p><p className="truncate text-xs text-muted">{i.sub}</p></li>)}
                    </ul>
                  )}
                </section>
              ))}
            </div>
          </>
        )}
      </AsyncView>
    </div>
  );
}
