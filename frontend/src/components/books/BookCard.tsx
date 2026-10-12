import { BookCover } from './BookCover';
import type { Book } from '@/types';

/** Clickable book (cover + title + author). */
export function BookCard({ book, onOpen }: { book: Book; onOpen: (b: Book) => void }) {
  return (
    <button onClick={() => onOpen(book)} className="group block w-full origin-bottom-left text-left transition duration-300 [transform-style:preserve-3d] hover:[transform:perspective(700px)_rotateY(-14deg)_translateY(-6px)]">
      <div className="shine relative overflow-hidden rounded-r-lg rounded-l-sm">
        <BookCover book={book} className="transition duration-500 group-hover:scale-105" />
      </div>
      <h3 className="mt-3 line-clamp-1 text-sm font-semibold group-hover:text-accent">{book.title}</h3>
      <p className="line-clamp-1 text-xs text-muted">{book.author}</p>
    </button>
  );
}
