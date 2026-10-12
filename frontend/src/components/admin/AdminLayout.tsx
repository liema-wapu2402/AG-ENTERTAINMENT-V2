import { Link, NavLink, Outlet, useLocation, Navigate } from "react-router-dom";
import {
  BookOpen,
  Clapperboard,
  Disc3,
  Eye,
  Layers,
  LayoutDashboard,
  LogOut,
  Music2,
  Settings,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  AccountCard,
  PanelButton,
  PanelLink,
} from "@/components/ui/AccountCard";
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
  { to: "/admin/settings", label: "Settings", icon: Settings },
] as const;

/**
 * Bottom of the admin side menu: "Admin panel" tab, who is signed in, and two buttons:
 * "Open user panel" (the public website) and "Sign out".
 */
function AdminAccount({ onSignOut }: { onSignOut: () => void }) {
  const { user } = useAuth();
  return (
    <AccountCard
      label="Admin panel"
      icon={ShieldCheck}
      title={user?.name ?? "Administrator"}
      subtitle={`@${user?.username}`}
    >
      <PanelLink to="/" tone="outline" icon={Eye}>
        Open user panel
      </PanelLink>
      <PanelButton tone="danger" icon={LogOut} onClick={onSignOut}>
        Sign out
      </PanelButton>
    </AccountCard>
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
 * Admin frame: only for a signed-in admin (everyone else is sent to /login).
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
  if (!user || !isAdmin) return <Navigate to="/login" replace />;

  const signOut = () => void logout();

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
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </div>
        {/* phones / tablets: horizontal menu under the top bar (sign out is the last chip) */}
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
          <Link
            to="/"
            className="flex shrink-0 items-center gap-2 rounded-full border border-accent/60 bg-accent/10 px-4 py-1.5 text-sm font-semibold text-accent"
          >
            <Eye size={15} />
            Open user panel
          </Link>
          <button
            onClick={signOut}
            className="flex shrink-0 items-center gap-2 rounded-full border border-line px-4 py-1.5 text-sm font-medium text-muted hover:border-red-400 hover:text-red-400"
          >
            <LogOut size={15} />
            Sign out
          </button>
        </nav>
      </header>

      <div className="flex gap-8 px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:py-8">
        {/* desktop: side menu - links on top, account (Open user panel + Sign out) pinned to the bottom */}
        <aside className="sticky top-20 hidden h-[calc(100vh-6.5rem)] w-56 shrink-0 flex-col lg:flex">
          <div className="space-y-1">
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
                      : "text-muted hover:translate-x-1 hover:bg-elevated hover:text-fg"
                  )
                }
              >
                <Icon size={18} />
                {label}
              </NavLink>
            ))}
          </div>
          <div className="pt-4 mt-auto">
            <AdminAccount onSignOut={signOut} />
          </div>
        </aside>
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
