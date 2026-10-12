import axios from "axios";
import type {
  AdminRow,
  Artist,
  BookGenre,
  DashboardData,
  HomePayload,
  Movie,
  MovieCategory,
  Paginated,
  SearchResults,
  Track,
  User,
} from "@/types";

// One axios instance for the whole app. The auth token (Laravel Sanctum)
// is attached automatically to every request.
export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  headers: { Accept: "application/json" },
});

export const TOKEN_KEY = "ag-token";

http.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/** Turns an axios error into a readable message (supports Laravel validation errors). */
export function errorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as
      | { message?: string; errors?: Record<string, string[]> }
      | undefined;
    const first = data?.errors ? Object.values(data.errors)[0]?.[0] : undefined;
    return first ?? data?.message ?? err.message;
  }
  return "Something went wrong";
}

// Small helper so every call returns just the payload.
const get = async <T>(url: string, params?: object) =>
  (await http.get<T>(url, { params })).data;

/** All API calls live here, so pages never build URLs by hand. */
export const api = {
  home: () => get<HomePayload>("/home"),
  search: (q: string) => get<SearchResults>("/search", { q }),

  // movies
  movies: (category?: MovieCategory) => get<Movie[]>("/movies", { category }),
  movie: (slug: string) =>
    get<{ movie: Movie; related: Movie[] }>(`/movies/${slug}`),

  // music
  artists: () => get<Artist[]>("/artists"),
  artist: (slug: string) => get<Artist>(`/artists/${slug}`),
  tracks: (limit = 12) => get<Track[]>("/tracks", { limit }),

  // books
  bookGenres: () => get<BookGenre[]>("/book-genres"),

  // auth (admin only - visitors never sign in)
  login: async (login: string, password: string) =>
    (
      await http.post<{ token: string; user: User }>("/auth/login", {
        login,
        password,
      })
    ).data,
  me: () => get<User>("/auth/me"),
  logout: () => http.post("/auth/logout"),
};

/** Admin panel calls. `resource` = movies | artists | tracks | book-genres | books. */
export const adminApi = {
  dashboard: () => get<DashboardData>("/admin/dashboard"),

  list: (resource: string, params: Record<string, unknown>) =>
    get<Paginated<AdminRow>>(`/admin/${resource}`, params),

  /** Create (id undefined) or update. FormData is used so images / mp3 files can be uploaded. */
  save: async (resource: string, form: FormData, id?: number) => {
    if (id) {
      form.append("_method", "PATCH"); // multipart + PATCH needs method spoofing in Laravel
      return (await http.post<AdminRow>(`/admin/${resource}/${id}`, form)).data;
    }
    return (await http.post<AdminRow>(`/admin/${resource}`, form)).data;
  },

  remove: (resource: string, id: number) =>
    http.delete(`/admin/${resource}/${id}`),

  /** CSV import for movies / books. */
  importCsv: async (resource: string, file: File) => {
    const form = new FormData();
    form.append("file", file);
    return (
      await http.post<{
        imported: number;
        errors: string[];
        error_count: number;
      }>(`/admin/${resource}/import`, form)
    ).data;
  },

  /** Upload many mp3 files for one artist. */
  uploadTracks: async (artistId: string, files: File[]) => {
    const form = new FormData();
    form.append("artist_id", artistId);
    files.forEach((f) => form.append("files[]", f));
    return (await http.post<{ imported: number }>("/admin/tracks/upload", form))
      .data;
  },

  /** Update the signed-in admin's name / username / email / password. */
  updateAccount: async (payload: Record<string, string>) =>
    (await http.patch<User>("/admin/account", payload)).data,

  /** Import mp3 files already copied into storage/app/public/music. */
  scanMusic: async () =>
    (
      await http.post<{ imported: number; titles: string[] }>(
        "/admin/music/scan"
      )
    ).data,
};
