import type { ReactNode } from 'react';
import { Check } from 'lucide-react';
import { TrackTools } from '@/components/admin/TrackTools';
import { Badge } from '@/components/ui/Badge';
import { formatTime } from '@/lib/format';
import { GENRE_ICONS } from '@/lib/icons';
import type { ResourceConfig } from './types';

// ---------------------------------------------------------------------------
// One config object per admin screen. AdminResourcePage turns it into a
// table + add/edit form + delete + import. To add a resource: add a config here,
// a route in App.tsx and a controller in Laravel.
// ---------------------------------------------------------------------------

/** Small square image (or initial letter) used in the first column. */
const Thumb = ({ src, label }: { src?: unknown; label: string }): ReactNode => (
  <div className="flex items-center gap-3">
    {src ? <img src={String(src)} alt="" className="h-10 w-10 shrink-0 rounded-lg object-cover" />
      : <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-elevated font-bold text-accent">{label.charAt(0)}</span>}
    <span className="min-w-0 truncate font-semibold">{label}</span>
  </div>
);

const str = (v: unknown) => (v == null || v === '' ? '—' : String(v));
const nested = (v: unknown, key: string) => str((v as Record<string, unknown> | undefined)?.[key]);

export const movies: ResourceConfig = {
  resource: 'movies', title: 'Movies & series', singular: 'movie', module: 'movies', viewPath: '/movies',
  searchPlaceholder: 'Search title or genre...',
  filter: { name: 'category', label: 'All categories', options: [{ value: 'upcoming', label: 'Upcoming' }, { value: 'top_rated', label: 'Top rated' }, { value: 'series', label: 'TV series' }] },
  columns: [
    { label: 'Title', render: (r) => Thumb({ src: r.poster_url, label: String(r.title) }) },
    { label: 'Category', render: (r) => <Badge filled={r.category === 'series'}>{String(r.category).replace('_', ' ')}</Badge> },
    { label: 'Year', render: (r) => str(r.year) },
    { label: 'Quality', render: (r) => str(r.quality) },
    { label: 'Rating', render: (r) => str(r.rating) },
    { label: 'Trailer', render: (r) => (r.trailer_url ? <Check size={16} className="text-accent" /> : '—') },
  ],
  fields: [
    { name: 'title', label: 'Title', type: 'text', required: true, full: true },
    { name: 'category', label: 'Category', type: 'select', required: true, options: [{ value: 'upcoming', label: 'Upcoming' }, { value: 'top_rated', label: 'Top rated' }, { value: 'series', label: 'TV series' }] },
    { name: 'genre', label: 'Genre', type: 'text' },
    { name: 'year', label: 'Year', type: 'number' },
    { name: 'quality', label: 'Quality (HD, 4K...)', type: 'text' },
    { name: 'rating', label: 'Rating (0-10)', type: 'number', step: '0.1' },
    { name: 'runtime_minutes', label: 'Runtime (minutes)', type: 'number' },
    { name: 'episodes', label: 'Episodes (series)', type: 'number' },
    { name: 'trailer_url', label: 'YouTube trailer link', type: 'url', full: true, help: 'Paste a youtube.com or youtu.be link. No video file needed.' },
    { name: 'synopsis', label: 'Synopsis', type: 'textarea' },
    { name: 'poster_file', label: 'Poster image', type: 'file', accept: 'image/*', preview: 'poster_url' },
    { name: 'backdrop_file', label: 'Wide backdrop (optional)', type: 'file', accept: 'image/*', preview: 'backdrop_url' },
  ],
  csv: {
    headers: ['title', 'category', 'year', 'quality', 'runtime_minutes', 'episodes', 'rating', 'genre', 'synopsis', 'trailer_url', 'poster'],
    sample: 'Example Movie,upcoming,2026,HD,120,,8.1,Action,Short description,https://www.youtube.com/watch?v=XXXXXXXXXXX,',
  },
};

export const artists: ResourceConfig = {
  resource: 'artists', title: 'Artists', singular: 'artist', module: 'music', viewPath: '/music',
  searchPlaceholder: 'Search artists...',
  columns: [
    { label: 'Artist', render: (r) => Thumb({ src: r.image_url, label: String(r.name) }) },
    { label: 'Type', render: (r) => <Badge>{String(r.gender)}</Badge> },
    { label: 'Songs', render: (r) => str(r.tracks_count) },
  ],
  fields: [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'gender', label: 'Type', type: 'select', required: true, options: [{ value: 'female', label: 'Female artist' }, { value: 'male', label: 'Male artist' }, { value: 'group', label: 'Group / band' }] },
    { name: 'image_file', label: 'Photo', type: 'file', accept: 'image/*', preview: 'image_url' },
  ],
};

export const tracks: ResourceConfig = {
  resource: 'tracks', title: 'Songs', singular: 'song', module: 'music', viewPath: '/music',
  searchPlaceholder: 'Search songs or albums...',
  columns: [
    { label: 'Song', render: (r) => Thumb({ src: r.cover_url, label: String(r.title) }) },
    { label: 'Artist', render: (r) => nested(r.artist, 'name') },
    { label: 'Album', render: (r) => str(r.album) },
    { label: 'Length', render: (r) => (r.duration_seconds ? formatTime(Number(r.duration_seconds)) : '—') },
  ],
  fields: [
    { name: 'artist_id', label: 'Artist', type: 'select', required: true, optionsFrom: { resource: 'artists', label: 'name' } },
    { name: 'title', label: 'Title', type: 'text', required: true },
    { name: 'album', label: 'Album', type: 'text' },
    { name: 'audio_file', label: 'MP3 file', type: 'file', accept: '.mp3,audio/mpeg', requiredOnCreate: true, help: 'Replace the file by choosing a new one. Max 50 MB.' },
    { name: 'cover_file', label: 'Cover image', type: 'file', accept: 'image/*', preview: 'cover_url' },
  ],
  toolbar: (reload) => <TrackTools reload={reload} />,
};

export const genres: ResourceConfig = {
  resource: 'book-genres', title: 'Book genres', singular: 'genre', module: 'books', viewPath: '/books',
  searchPlaceholder: 'Search genres...',
  columns: [
    { label: 'Genre', render: (r) => <span className="font-semibold">{String(r.name)}</span> },
    { label: 'Icon', render: (r) => str(r.icon) },
    { label: 'Books', render: (r) => str(r.books_count) },
    { label: 'Order', render: (r) => str(r.sort_order) },
  ],
  fields: [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'icon', label: 'Icon', type: 'select', required: true, options: Object.keys(GENRE_ICONS).map((k) => ({ value: k, label: k })) },
    { name: 'description', label: 'Short description', type: 'text', full: true },
    { name: 'sort_order', label: 'Shelf order', type: 'number' },
  ],
};

export const books: ResourceConfig = {
  resource: 'books', title: 'Books', singular: 'book', module: 'books', viewPath: '/books',
  searchPlaceholder: 'Search title or author...',
  columns: [
    { label: 'Book', render: (r) => Thumb({ src: r.cover_url, label: String(r.title) }) },
    { label: 'Author', render: (r) => str(r.author) },
    { label: 'Genre', render: (r) => nested(r.genre, 'name') },
    { label: 'Year', render: (r) => str(r.year) },
  ],
  fields: [
    { name: 'title', label: 'Title', type: 'text', required: true },
    { name: 'author', label: 'Author', type: 'text', required: true },
    { name: 'genre_id', label: 'Genre', type: 'select', required: true, optionsFrom: { resource: 'book-genres', label: 'name' } },
    { name: 'year', label: 'Year published', type: 'number' },
    { name: 'pages', label: 'Pages', type: 'number' },
    { name: 'synopsis', label: 'Synopsis', type: 'textarea' },
    { name: 'cover_file', label: 'Cover image (optional)', type: 'file', accept: 'image/*', preview: 'cover_url', help: 'Without a cover the site draws one from the title.' },
  ],
  csv: {
    headers: ['title', 'author', 'genre', 'year', 'pages', 'synopsis'],
    sample: 'Example Book,Jane Author,Fantasy,2020,320,Short description',
  },
};
