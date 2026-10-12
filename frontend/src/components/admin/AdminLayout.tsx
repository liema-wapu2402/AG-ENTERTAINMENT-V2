import { Link, NavLink, Outlet, useLocation, Navigate } from "react-router-dom";
import {
  BookOpen,
  Clapperboard,
  Disc3,
  ExternalLink,
  Layers,
  LayoutDashboard,
  LogOut,
  Music2,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Skeleton } from "@/components/ui/Skeleton";
import { cx } from "@/lib/format";

// Admin navigation, grouped by module (each group uses its module colours).
const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  {
    to: "/admin/movies",
    label: "Movies & series",
    icon: Clapperboard,
    module: "movies",
  },
  {
    to: "/admin/music/artists",
    label: "Artists",
    icon: Disc3,
    module: "music",
  },
  { to: "/admin/music/songs", label: "Songs", icon: Music2, module: "music" },
  {
    to: "/admin/books/genres",
    label: "Book genres",
    icon: Layers,
    module: "books",
  },
  {
    to: "/admin/books",
    label: "Books",
    icon: BookOpen,
    module: "books",
    end: true,
  },
] as const;

/** Highlighted tab that opens the public website (opens in a new tab so the admin panel stays open). */
function ViewSiteTab({ compact = false }: { compact?: boolean }) {
  return (
    <a
      href="/"
      target="_blank"
      rel="noreferrer"
      className={cx(
        "group relative flex shrink-0 items-center overflow-hidden border border-accent/40 bg-module-gradient font-semibold text-accent-fg transition hover:brightness-110 active:scale-[0.98]",
        compact
          ? "gap-2 rounded-full px-4 py-1.5 text-sm"
          : "gap-3 rounded-xl px-4 py-2.5 text-sm shadow-lg shadow-accent/20"
      )}
    >
      {/* soft light sheen on hover */}
      <span className="absolute inset-0 transition opacity-0 pointer-events-none bg-gradient-to-b from-white/20 to-transparent group-hover:opacity-100" />
      <ExternalLink size={compact ? 15 : 18} className="relative shrink-0" />
      <span className="relative truncate">User Panel</span>
    </a>
  );
}

/** Colour palette for the page being edited (movies / music / books). */
const moduleOf = (path: string) =>
  path.includes("/movies")
    ? "movies"
    : path.includes("/music")
      ? "music"
      : path.includes("/books")
        ? "books"
        : undefined;

/**
 * Admin frame: only for a signed-in admin (everyone else is sent to Settings).
 * It has its own layout - top bar + side menu - separate from the public site.
 */
export function AdminLayout() {
  const { user, loading, isAdmin, logout } = useAuth();
  const { pathname } = useLocation();

  if (loading)
    return (
      <div className="py-10 container-page">
        <Skeleton className="h-64" />
      </div>
    );
  if (!user || !isAdmin) return <Navigate to="/settings#admin" replace />;

  return (
    <div className="min-h-screen module-bg" data-module={moduleOf(pathname)}>
      <header className="sticky top-0 z-40 border-b border-line bg-sidebar/90 backdrop-blur-xl">
        <div className="flex items-center gap-3 px-4 h-14 sm:px-6">
          <Link to="/admin" className="flex items-center gap-2">
            <img
              src="/assets/brand/logo-mark.png"
              alt=""
              className="object-cover w-8 h-8 rounded-full"
            />
            <span className="hidden text-sm font-extrabold tracking-wider sm:block">
              AG ENTERTAINMENT
            </span>
          </Link>
          <span className="flex items-center gap-1 px-3 py-1 text-xs font-bold tracking-wider uppercase rounded-full bg-accent/15 text-accent">
            <ShieldCheck size={13} /> Admin
          </span>
          <div className="flex items-center gap-1 ml-auto">
            <ThemeToggle />
            <button
              onClick={() => void logout()}
              aria-label="Sign out"
              className="flex items-center gap-2 px-3 py-2 text-sm rounded-xl text-muted hover:bg-red-500/10 hover:text-red-400"
            >
              <LogOut size={16} />
              <span className="hidden sm:block">Sign out</span>
            </button>
          </div>
        </div>
        {/* phones / tablets: horizontal menu under the top bar */}
        <nav className="flex gap-2 px-4 pb-3 overflow-x-auto no-scrollbar lg:hidden">
          {NAV.map(({ to, label, icon: Icon, ...rest }) => (
            <NavLink
              key={to}
              to={to}
              end={"end" in rest}
              className={({ isActive }) =>
                cx(
                  "flex shrink-0 items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium",
                  isActive
                    ? "bg-module-gradient text-white"
                    : "bg-elevated text-muted"
                )
              }
            >
              <Icon size={15} />
              {label}
            </NavLink>
          ))}
          <ViewSiteTab compact />
        </nav>
      </header>

      <div className="flex gap-8 px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:py-8">
        {/* desktop: side menu */}
        <aside className="sticky hidden w-56 space-y-1 top-20 h-fit shrink-0 lg:block">
          {NAV.map(({ to, label, icon: Icon, ...rest }) => (
            <NavLink
              key={to}
              to={to}
              end={"end" in rest}
              data-module={"module" in rest ? rest.module : undefined}
              className={({ isActive }) =>
                cx(
                  "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition",
                  isActive
                    ? "bg-module-gradient text-white shadow-lg shadow-m2/20"
                    : "text-muted hover:bg-elevated hover:text-fg"
                )
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
          {/* divider + highlighted link to the public site, right after "Books" */}
          <div className="!my-3 border-t border-line" />
          <ViewSiteTab />
        </aside>
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
