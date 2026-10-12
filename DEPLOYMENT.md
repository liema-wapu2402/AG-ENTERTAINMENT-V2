# Deploying AG Entertainment

Order matters: **Aiven (DB) → Render (API) → Vercel (frontend) → back to Render (CORS)**.

```
Browser ──> Vercel (React, static)  ──/api calls──>  Render (Laravel, Docker)  ──SSL──>  Aiven MySQL
```

## 0. Push to GitHub
Render and Vercel both deploy from a Git repo. Push this whole folder (it must contain `backend/`, `frontend/`, `render.yaml`).
`.env` is already git-ignored — never commit it.

## 1. Aiven (MySQL)
1. Aiven Console → **Create service → MySQL** → pick the free plan (or any plan) and a region near your users (Singapore/Mumbai for PH).
2. Wait until it's **Running**, then open the service **Overview** and copy: **Host, Port, User (avnadmin), Password, Database (defaultdb)**.
3. Download the **CA certificate** (`ca.pem`) from the same page and open it in a text editor — you'll paste its full contents into Render.
4. Under **Allowed IP addresses**, make sure it's open to Render (default `0.0.0.0/0` works; tighten later if you want).

## 2. Render (Laravel API)
1. Generate an app key locally: `echo "base64:$(openssl rand -base64 32)"`
2. Render → **New → Blueprint** → select your repo. It reads `render.yaml` and asks for the secrets:

| Variable | Value |
|---|---|
| `APP_KEY` | the `base64:...` key from step 1 |
| `APP_URL` | `https://<service-name>.onrender.com` (you can set it after the first deploy, then redeploy) |
| `FRONTEND_URL` | leave a placeholder for now; fill after Vercel |
| `DB_HOST`, `DB_PORT`, `DB_PASSWORD` | from Aiven |
| `DB_DATABASE`, `DB_USERNAME` | `defaultdb`, `avnadmin` (already preset) |
| `AIVEN_CA_CERT` | full contents of `ca.pem`, including the BEGIN/END lines |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | your admin login for Settings → Admin |

3. Deploy. On boot the container runs `migrate --force` and (because `RUN_SEED=true`) seeds movies, artists, books and the admin.
4. Check `https://<service-name>.onrender.com/up` → OK, and `/api/movies` → JSON.
5. **After the first successful deploy set `RUN_SEED=false`.** Seeders overwrite rows by slug, so leaving it on would revert admin edits on every deploy.

## 3. Vercel (React)
1. **Add New → Project** → import the repo → **Root Directory: `frontend`** (Vite is auto-detected; `vercel.json` handles SPA routing so `/admin`, `/movies/...` don't 404 on refresh).
2. Environment variables:
   - `VITE_API_URL` = `https://<service-name>.onrender.com/api`
   - `VITE_STORAGE_URL` — leave empty (the API already returns absolute `/storage` URLs based on `APP_URL`).
3. Deploy, then copy the Vercel URL.

## 4. Close the loop
Render → service → Environment: set `FRONTEND_URL=https://<project>.vercel.app` (no trailing slash; comma-separate a custom domain too), set `APP_URL` if you hadn't, and redeploy. Without this the browser blocks API calls with a CORS error.

Then open the Vercel site → Settings → Admin → sign in with `ADMIN_EMAIL`/`ADMIN_PASSWORD` (or username `admin`).

## Storage (read this)
Posters, covers, avatars and **mp3 uploads** are saved on the Render container's disk (`storage/app/public`).
- **Free plan:** disk is ephemeral — uploads disappear on every redeploy/restart, and the DB rows will point to missing files.
- **Fix A (simplest):** upgrade to a paid instance and attach a Persistent Disk mounted at `/var/www/html/storage/app/public`.
- **Fix B (better long-term):** move uploads to S3-compatible storage (Cloudflare R2 / S3). The models call `Storage::disk('public')` directly, so this needs a small code change — ask and I'll do it.

Also: the free Render plan sleeps after inactivity, so the first request can take ~30–60 s.

## Troubleshooting
- **`SQLSTATE[HY000] [2002]` / connection refused** → wrong `DB_HOST`/`DB_PORT`, or Aiven IP allow-list.
- **`Connections using insecure transport are prohibited`** → `AIVEN_CA_CERT` is empty or malformed.
- **CORS error in browser console** → `FRONTEND_URL` doesn't exactly match the Vercel origin (scheme, no trailing slash). Vercel *preview* URLs differ from the production one.
- **Images/audio 404** → `APP_URL` wrong, or the free-plan disk was wiped.
- **500 errors** → Render → Logs (`LOG_CHANNEL=stderr`). Temporarily set `APP_DEBUG=true` only if needed.
