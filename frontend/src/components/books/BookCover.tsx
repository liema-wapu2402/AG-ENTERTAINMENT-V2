import { cx, hueFromString } from '@/lib/format';
import type { Book } from '@/types';

/**
 * Book cover. Uses the uploaded image when there is one, otherwise draws a
 * good looking cover from the title (colour is derived from the title,
 * so every book always gets the same cover).
 */
export function BookCover({ book, className }: { book: Pick<Book, 'title' | 'author' | 'cover_url'>; className?: string }) {
  if (book.cover_url) {
    return <img src={book.cover_url} alt={`${book.title} cover`} loading="lazy" className={cx('aspect-[2/3] w-full rounded-r-lg rounded-l-sm object-cover shadow-xl', className)} />;
  }
  const hue = hueFromString(book.title);
  return (
    <div
      className={cx('relative flex aspect-[2/3] w-full flex-col justify-between overflow-hidden rounded-r-lg rounded-l-sm p-4 text-white shadow-xl', className)}
      style={{ background: `linear-gradient(145deg, hsl(${hue} 70% 38%), hsl(${(hue + 50) % 360} 65% 18%))` }}
    >
      {/* spine highlight */}
      <span className="absolute inset-y-0 left-0 w-2 bg-black/25" />
      <span className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10" />
      <span className="absolute -bottom-8 -left-4 h-28 w-28 rounded-full bg-white/5" />
      <h3 className="relative line-clamp-4 pl-2 text-base font-extrabold leading-tight drop-shadow sm:text-lg">{book.title}</h3>
      <p className="relative pl-2 text-[11px] font-medium uppercase tracking-widest text-white/80">{book.author}</p>
    </div>
  );
}
