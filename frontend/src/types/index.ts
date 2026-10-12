// Shared TypeScript types - they mirror the JSON returned by the Laravel API.

export type MovieCategory = 'upcoming' | 'top_rated' | 'series';

export interface Movie {
  id: number;
  slug: string;
  title: string;
  category: MovieCategory;
  year: number | null;
  quality: string | null;        // HD, 2K, 4K ...
  runtime_minutes: number | null; // movies only
  episodes: number | null;        // series only
  rating: number | null;          // 0 - 10
  genre: string | null;
  synopsis: string | null;
  poster_url: string;
  backdrop_url: string | null;
  trailer_url: string | null;      // full YouTube link saved in the DB
  trailer_youtube_id: string | null; // parsed by the backend, used for the embed
}

export interface Artist {
  id: number;
  slug: string;
  name: string;
  gender: 'female' | 'male' | 'group';
  image_url: string | null;
  tracks_count?: number;
  tracks?: Track[];
}

export interface Track {
  id: number;
  title: string;
  album: string | null;
  duration_seconds: number | null;
  audio_url: string;       // streamable mp3 URL
  cover_url: string | null;
  artist?: Pick<Artist, 'id' | 'slug' | 'name'>;
}

export interface Book {
  id: number;
  slug: string;
  title: string;
  author: string;
  year: number | null;
  pages: number | null;
  synopsis: string | null;
  cover_url: string | null;
  genre?: Pick<BookGenre, 'id' | 'slug' | 'name'>;
}

export interface BookGenre {
  id: number;
  slug: string;
  name: string;
  icon: string;          // key into the icon map in lib/icons.ts
  description: string | null;
  books?: Book[];
}

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  pp_url: string | null;
}

/** Laravel paginator JSON (used by every admin list). */
export interface Paginated<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

/** Admin list rows can carry extra raw columns and counters. */
export type AdminRow = { id: number } & Record<string, unknown>;

export interface DashboardData {
  counts: Record<'movies' | 'series' | 'artists' | 'tracks' | 'genres' | 'books', number>;
  latest: {
    movies: { id: number; title: string; category: string; created_at: string }[];
    tracks: { id: number; title: string; artist?: { name: string }; created_at: string }[];
    books: { id: number; title: string; author: string; created_at: string }[];
  };
}

export interface HomePayload {
  stats: { movies: number; tracks: number; books: number; artists: number };
  movies: Movie[];
  artists: Artist[];
  books: Book[];
}

export interface SearchResults {
  movies: Movie[];
  tracks: Track[];
  books: Book[];
}
