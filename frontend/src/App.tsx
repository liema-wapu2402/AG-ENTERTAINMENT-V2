import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Skeleton } from "@/components/ui/Skeleton";
import * as resources from "@/admin/resources";

// Each page is lazy-loaded, so the first visit only downloads what it needs.
const HomePage = lazy(() => import("@/pages/HomePage"));
const MoviesPage = lazy(() => import("@/pages/MoviesPage"));
const MovieDetailPage = lazy(() => import("@/pages/MovieDetailPage"));
const MusicPage = lazy(() => import("@/pages/MusicPage"));
const ArtistPage = lazy(() => import("@/pages/ArtistPage"));
const BooksPage = lazy(() => import("@/pages/BooksPage"));
const AboutPage = lazy(() => import("@/pages/AboutPage"));
const SettingsPage = lazy(() => import("@/pages/SettingsPage"));
const AdminLoginPage = lazy(() => import("@/pages/AdminLoginPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));
const AdminDashboardPage = lazy(
  () => import("@/pages/admin/AdminDashboardPage")
);
const AdminResourcePage = lazy(() => import("@/pages/admin/AdminResourcePage"));
const AdminSettingsPage = lazy(() => import("@/pages/admin/AdminSettingsPage"));

/**
 * Routes.
 *  - Public site (no sign in): home, movies, music, books, about, settings.
 *  - /login: admin sign in page.
 *  - /admin/*: admin panel with its own layout (redirects to /login when not signed in as admin).
 */
export default function App() {
  return (
    <Suspense
      fallback={
        <div className="py-10 container-page">
          <Skeleton className="h-64" />
        </div>
      }
    >
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="movies" element={<MoviesPage />} />
          <Route path="movies/:slug" element={<MovieDetailPage />} />
          <Route path="music" element={<MusicPage />} />
          <Route path="music/artist/:slug" element={<ArtistPage />} />
          <Route path="books" element={<BooksPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* admin sign in: a page of its own, no sidebar */}
        <Route path="login" element={<AdminLoginPage />} />

        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route
            path="movies"
            element={
              <AdminResourcePage key="movies" config={resources.movies} />
            }
          />
          <Route
            path="music"
            element={<Navigate to="/admin/music/artists" replace />}
          />
          <Route
            path="music/artists"
            element={
              <AdminResourcePage key="artists" config={resources.artists} />
            }
          />
          <Route
            path="music/songs"
            element={
              <AdminResourcePage key="tracks" config={resources.tracks} />
            }
          />
          <Route
            path="books"
            element={<AdminResourcePage key="books" config={resources.books} />}
          />
          <Route path="settings" element={<AdminSettingsPage />} />
          <Route
            path="books/genres"
            element={
              <AdminResourcePage key="genres" config={resources.genres} />
            }
          />
        </Route>
      </Routes>
    </Suspense>
  );
}
