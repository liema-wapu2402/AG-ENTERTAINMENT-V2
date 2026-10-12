import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { api } from '@/lib/api';
import { iconFor } from '@/lib/icons';
import { useApi } from '@/hooks/useApi';
import { AsyncView } from '@/components/ui/AsyncView';
import { AdminShortcut } from '@/components/ui/AdminShortcut';
import { Carousel } from '@/components/ui/Carousel';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { BookCard } from '@/components/books/BookCard';
import { BookModal } from '@/components/books/BookModal';
import { GenreIndex } from '@/components/books/GenreIndex';
import type { Book } from '@/types';

/**
 * BOOKS - "library" look: yellow + orange. Every genre is a shelf
 * (snap-to-centre rail on a shelf board) with a sticky shelf index.
 */
export default function BooksPage() {
  const genres = useApi(() => api.bookGenres(), []);
  const [search, setSearch] = useState('');
  const [params, setParams] = useSearchParams();

  // books with their genre attached (the popup shows it)
  const shelves = useMemo(
    () => (genres.data ?? []).map((g) => ({ ...g, books: (g.books ?? []).map((b) => ({ ...b, genre: { id: g.id, slug: g.slug, name: g.name } })) })),
    [genres.data],
  );
  const q = search.trim().toLowerCase();
  const visible = shelves
    .map((g) => ({ ...g, books: g.books.filter((b) => !q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)) }))
    .filter((g) => g.books.length > 0);

  // `?book=slug` (from the sidebar search) opens the popup directly
  const openBook = shelves.flatMap((g) => g.books).find((b) => b.slug === params.get('book')) ?? null;
  const setBook = (b: Book | null) => setParams(b ? { book: b.slug } : {}, { replace: true });

  const index = visible.map((g) => ({ id: `shelf-${g.slug}`, label: g.name, icon: g.icon, count: g.books.length }));
  const total = shelves.reduce((n, g) => n + g.books.length, 0);

  return (
    <>
      {/* ---------------- HERO ---------------- */}
      <section className="relative isolate overflow-hidden">
        <img src="/assets/backgrounds/cta-bg.jpg" alt="" className="absolute inset-0 -z-30 h-full w-full object-cover opacity-50" />
        <div className="absolute inset-0 -z-20 bg-gradient-to-br from-m1/50 via-bg/75 to-m2/55" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-bg to-transparent" />
        <div className="container-page grid items-center gap-8 pb-12 pt-24 md:grid-cols-[1.3fr_1fr] md:pb-16 md:pt-28">
          <div className="animate-fade-up">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">Books · {total} titles</p>
            <h1 className="mt-3 text-[clamp(2.2rem,6.5vw,4.6rem)] font-black leading-[1.03]">Find your next <span className="text-gradient">great read.</span></h1>
            <p className="mt-4 max-w-lg text-sm text-fg/80 sm:text-base">Walk the shelves: fantasy, sci-fi, history, self-improvement and more.</p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <label className="flex w-full max-w-sm items-center gap-2 rounded-full border border-line bg-surface/80 px-4 py-3 backdrop-blur focus-within:border-accent">
                <Search size={16} className="text-muted" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Title or author..." className="w-full bg-transparent text-sm outline-none placeholder:text-muted" />
              </label>
              <AdminShortcut to="/admin/books" label="Manage books" />
            </div>
          </div>

          {/* leaning book stack (pure CSS art) */}
          <div className="relative mx-auto hidden h-56 w-64 md:block" aria-hidden>
            {[
              ['bottom-0 left-2 w-52 h-9 bg-m2', '-rotate-2'], ['bottom-9 left-6 w-48 h-9 bg-m1', 'rotate-1'],
              ['bottom-[4.5rem] left-3 w-44 h-9 bg-m2/80', '-rotate-1'], ['bottom-[6.75rem] left-8 w-40 h-9 bg-m1/80', 'rotate-2'],
            ].map(([pos, rot], i) => <span key={i} className={`absolute rounded-md shadow-xl ring-1 ring-white/20 ${pos} ${rot}`} />)}
            <span className="absolute bottom-0 left-0 right-0 h-2 rounded bg-module-gradient" />
          </div>
        </div>
      </section>

      <GenreIndex genres={index} layout="bar" />

      <div className="container-page flex gap-10 py-10">
        <GenreIndex genres={index} layout="side" />

        <div className="min-w-0 flex-1 space-y-16">
          <AsyncView state={genres} isEmpty={() => visible.length === 0} emptyMessage="No books found." skeleton={<div className="skeleton h-72" />}>
            {() => visible.map((g) => {
              const Icon = iconFor(g.icon);
              return (
                <Reveal key={g.id} effect="zoom">
                  <SectionHeader id={`shelf-${g.slug}`} eyebrow={g.description ?? 'Genre'} title={g.name}>
                    <Icon className="text-accent" />
                  </SectionHeader>
                  <Carousel items={g.books} keyOf={(b) => b.id} variant="shelf" itemClassName="w-32 sm:w-40" renderItem={(b) => <BookCard book={b} onOpen={setBook} />} />
                </Reveal>
              );
            })}
          </AsyncView>
        </div>
      </div>

      <BookModal book={openBook} onClose={() => setBook(null)} />
    </>
  );
}
