import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { BookCover } from './BookCover';
import type { Book } from '@/types';

/** Book details popup. */
export function BookModal({ book, onClose }: { book: Book | null; onClose: () => void }) {
  return (
    <Modal open={Boolean(book)} onClose={onClose} title={book?.title} className="max-w-2xl">
      {book && (
        <div className="grid gap-6 p-6 pt-14 sm:grid-cols-[200px_1fr] sm:pt-6">
          <div className="mx-auto w-40 sm:w-full"><BookCover book={book} /></div>
          <div>
            {book.genre && <Badge filled>{book.genre.name}</Badge>}
            <h2 className="mt-3 text-2xl font-bold">{book.title}</h2>
            <p className="text-muted">by {book.author}</p>
            <dl className="mt-4 flex gap-6 text-sm">
              {book.year && <div><dt className="text-xs text-muted">Published</dt><dd className="font-semibold">{book.year}</dd></div>}
              {book.pages && <div><dt className="text-xs text-muted">Pages</dt><dd className="font-semibold">{book.pages}</dd></div>}
            </dl>
            {book.synopsis && <p className="mt-4 text-sm leading-relaxed text-fg/80">{book.synopsis}</p>}
          </div>
        </div>
      )}
    </Modal>
  );
}
