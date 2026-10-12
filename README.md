# AG Entertainment — Version 2

Laravel (API) + React (TSX) + Tailwind + MySQL.

**Visitors** open the site with no sign in (Home, Movies, Music, Books, About, Settings) and can only view.
**Admin** signs in from *Settings > Admin* and gets the admin panel at `/admin` to add, edit, delete and import movies, music and books.

```
AG-Entertainment-v2/
├── backend/    Laravel API  (models, migrations, seeders, controllers, music importer)
├── frontend/   React + TypeScript + Tailwind (Vite)
├── setup-backend.ps1   Windows helper
└── setup-backend.sh    macOS / Linux / Git Bash helper
```

## 1. Backend (Laravel)

`backend/` contains only the **custom** Laravel files. The helper script downloads a fresh Laravel
skeleton, merges it around your files (nothing of yours is overwritten) and installs the packages.

**Windows (PowerShell, from this folder):** `./setup-backend.ps1`
**macOS / Linux / Git Bash:** `bash setup-backend.sh`

Then:

1. Create a NEW empty MySQL database for version 2:
   `mysql -u root -p -e "CREATE DATABASE ag_entertainment_v2 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"`
2. Open `backend/.env` and set:
   ```
   APP_URL=http://localhost:8000
   FRONTEND_URL=http://localhost:5173
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=ag_entertainment_v2
   DB_USERNAME=root
   DB_PASSWORD=

   # first administrator (created by the seeder)
   ADMIN_NAME="Amiel Andrei C. Reyes"
   ADMIN_USERNAME=admin
   ADMIN_EMAIL=you@example.com
   ADMIN_PASSWORD=choose-a-strong-password
   ```
   If `ADMIN_PASSWORD` is empty, the seeder prints a random password once.
3. From `backend/`:
   ```
   php artisan migrate --seed      # tables + movies, artists, books
   php artisan storage:link        # makes mp3 / covers / avatars public
   php artisan serve               # http://localhost:8000
   ```

### Already ran the old version?
Use a new database (above) or run `php artisan migrate:fresh --seed` (this erases the old tables).

### Admin panel
Sign in at **Settings > Admin** (or `/admin`). Movies: add/edit/delete, poster upload, YouTube trailer link, CSV import. Music: artists, songs (single or many mp3 uploads), "Import music folder". Books: genres, books, cover upload, CSV import.
For big mp3 uploads raise `upload_max_filesize` and `post_max_size` (e.g. 64M) in `php.ini`.

### Music (real mp3 files)
Put mp3 files in artist folders inside `backend/storage/app/public/music/`, then run `php artisan music:import`.
```
music/Adele/Hello.mp3          music/Adele/artist.jpg   (optional artist photo)
music/Adele/Hello.jpg          (optional cover with the same name)   music/Adele/cover.jpg (default cover)
music/Billie Eilish/01 - Bad Guy.mp3
```
Safe to re-run: existing files are updated, not duplicated. Duration is read with `phansys/getid3`.
The mp3 files were **not** in the zips you uploaded, so the music page stays empty until you add them.

### Movie trailers (YouTube links)
Paste each YouTube link in `backend/database/seeders/data/trailers.php`, then run
`php artisan db:seed --class=MovieSeeder`. Titles without a link show a "Find the trailer on YouTube" button.

### Move your old users (optional)
Old passwords were created with `password_hash()` (bcrypt), so they work in Laravel as they are:
```sql
INSERT INTO ag_entertainment.users (name, username, email, contact, password, created_at, updated_at)
SELECT fname, username, email, CAST(contact AS CHAR), password, NOW(), NOW() FROM auth_db.users;
```
Old profile pictures from `upload/` can be copied to `backend/storage/app/public/profiles/` and saved in the `pp` column as `profiles/<file>`.

## 2. Frontend (React + TSX)
```
cd frontend
npm install
npm run dev        # http://localhost:5173  (proxies /api and /storage to Laravel on :8000)
npm run build      # production build in frontend/dist
```
For production set `VITE_API_URL` (see `.env.example`).

## Frontend structure
```
src/
├── components/
│   ├── ui/        Button, Badge, Carousel, Tabs, Modal, AsyncView, Skeleton, Reveal, PageHero, FormField ...
│   ├── layout/    AppLayout, Sidebar, Topbar, Footer, SearchBox
│   ├── media/     MediaCard, TrailerModal (YouTube embed)
│   ├── music/     PlayerBar, NowPlaying, TrackRow, ArtistCard, Equalizer
│   └── books/     BookCard, BookCover (generated covers), BookModal
├── context/       ThemeContext (dark/light), AuthContext, PlayerContext (global audio)
├── hooks/         useApi, useDebounce, useLocalStorage
├── lib/           api.ts (all API calls), navigation.ts (module list), format, icons, youtube
├── pages/         Home, Movies, MovieDetail, Music, Artist, Books, About, Settings, NotFound, admin/
├── admin/         resource configs (columns + form fields) for the admin panel
└── types/         shared TypeScript types
```
Adding a module = one entry in `lib/navigation.ts` + one route in `App.tsx`.

## API
`GET /api/home` · `/api/search?q=` · `/api/movies?category=` · `/api/movies/{slug}` · `/api/artists` · `/api/artists/{slug}` · `/api/tracks?limit=` · `/api/book-genres`
`POST /api/auth/login|logout` · `GET /api/auth/me` (admin token, Laravel Sanctum)
Admin only (`/api/admin/...`): `dashboard`, CRUD for `movies`, `artists`, `tracks`, `book-genres`, `books`, plus `movies/import`, `books/import`, `tracks/upload`, `music/scan`.

## Security note
The old `db_conn.php` contained live database credentials. Treat them as exposed and change that password on your host.
