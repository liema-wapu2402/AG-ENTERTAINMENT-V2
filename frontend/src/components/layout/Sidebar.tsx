import { NavLink, Link } from "react-router-dom";
import {
  ChevronsLeft,
  ChevronsRight,
  Eye,
  LogOut,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";
import { MODULES } from "@/lib/navigation";
import { useAuth } from "@/context/AuthContext";
import { SearchBox } from "./SearchBox";
import { cx } from "@/lib/format";

interface Props {
  collapsed: boolean; // desktop: icon-only rail
  onToggleCollapsed: () => void;
  mobileOpen: boolean; // mobile: off-canvas drawer
  onCloseMobile: () => void;
}

/**
 * Compact account chip at the bottom of the sidebar.
 *  - nobody signed in -> "User panel" (links to the admin sign in)
 *  - admin signed in  -> "Admin panel" (links to /admin) + small sign out button
 * In the collapsed rail it shrinks to a single icon.
 */
function AccountPanel({
  rail,
  onNavigate,
}: {
  rail: boolean;
  onNavigate: () => void;
}) {
  const { user, isAdmin, logout } = useAuth();
  const admin = Boolean(user && isAdmin);
  const Icon = admin ? ShieldCheck : Eye;
  const label = admin ? "Admin panel" : "User panel";
  const to = admin ? "/admin" : "/settings#admin";
  const title = admin
    ? `Admin panel - ${user!.name}`
    : "User panel - admin sign in";

  return (
    <div
      className={cx(
        "flex min-w-0 items-center gap-1.5",
        rail ? "lg:w-full" : "flex-1"
      )}
    >
      <Link
        to={to}
        onClick={onNavigate}
        title={title}
        className={cx(
          "flex h-9 min-w-0 flex-1 items-center gap-2 rounded-lg border border-accent/40 bg-accent/10 px-2.5 text-[11px] font-bold uppercase tracking-wider text-accent transition hover:bg-accent hover:text-accent-fg",
          rail && "lg:justify-center lg:px-0"
        )}
      >
        <Icon size={16} className="shrink-0" />
        <span className={cx("truncate", rail && "lg:hidden")}>{label}</span>
      </Link>

      {admin && (
        <button
          onClick={() => void logout()}
          aria-label="Sign out"
          title="Sign out"
          className={cx(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line text-muted transition hover:border-red-400 hover:text-red-400",
            rail && "lg:hidden"
          )}
        >
          <LogOut size={15} />
        </button>
      )}
    </div>
  );
}

/**
 * Responsive sidebar.
 *  - Desktop (lg+): fixed rail, can collapse to icons only.
 *  - Mobile / tablet: slide-in drawer (never wider than 85% of the screen).
 * Its background uses the Settings colours, so it adapts to every theme.
 */
export function Sidebar({
  collapsed,
  onToggleCollapsed,
  mobileOpen,
  onCloseMobile,
}: Props) {
  // On mobile the drawer is always "expanded"; the collapsed rail only applies on desktop.
  const rail = collapsed;

  return (
    <>
      {/* dark overlay behind the mobile drawer */}
      <div
        onClick={onCloseMobile}
        className={cx(
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition lg:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      />

      <aside
        className={cx(
          "fixed inset-y-0 left-0 z-50 flex w-[min(20rem,85vw)] flex-col overflow-hidden border-r border-line bg-sidebar transition-all duration-300",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          rail ? "lg:w-[72px]" : "lg:w-64"
        )}
      >
        {/* background tint from the current module palette (movies / music / books) */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-m1/10 via-transparent to-m2/10" />

        {/* brand */}
        <div className="relative flex items-center h-16 gap-3 px-4 shrink-0">
          <Link
            to="/"
            onClick={onCloseMobile}
            className="flex items-center min-w-0 gap-3"
          >
            <img
              src="/assets/brand/logo-mark.png"
              alt="AG Entertainment"
              className="object-cover rounded-full h-9 w-9 shrink-0"
            />
            <span
              className={cx(
                "truncate text-sm font-extrabold tracking-wider",
                rail && "lg:hidden"
              )}
            >
              AG ENTERTAINMENT
            </span>
          </Link>
          <button
            onClick={onCloseMobile}
            aria-label="Close menu"
            className="ml-auto rounded-lg p-1.5 text-muted hover:bg-elevated lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* search: full input when expanded, icon button when collapsed */}
        <div className="relative px-3 pb-2 shrink-0">
          <div className={cx(rail && "lg:hidden")}>
            <SearchBox onNavigate={onCloseMobile} />
          </div>
          {rail && (
            <button
              onClick={onToggleCollapsed}
              aria-label="Search"
              className="hidden w-full justify-center rounded-xl bg-elevated p-2.5 text-muted hover:text-accent lg:flex"
            >
              <Search size={20} />
            </button>
          )}
        </div>

        {/* main navigation, generated from lib/navigation.ts (scrolls on short screens) */}
        <nav className="relative flex-1 min-h-0 px-3 py-2 space-y-1 overflow-y-auto">
          {MODULES.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              onClick={onCloseMobile}
              title={rail ? label : undefined}
              className={({ isActive }) =>
                cx(
                  "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                  rail && "lg:justify-center",
                  isActive
                    ? "bg-accent text-accent-fg shadow-lg shadow-accent/20"
                    : "text-muted hover:bg-elevated hover:text-fg"
                )
              }
            >
              <Icon size={20} className="shrink-0" />
              <span className={cx(rail && "lg:hidden")}>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* bottom: account chip + collapse toggle (one row expanded, stacked in the rail) */}
        <div
          className={cx(
            "relative flex shrink-0 items-center gap-2 border-t border-line bg-sidebar/60 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur",
            rail && "lg:flex-col"
          )}
        >
          <AccountPanel rail={rail} onNavigate={onCloseMobile} />

          {/* desktop only: the drawer on mobile has its own close button */}
          <button
            onClick={onToggleCollapsed}
            aria-label={rail ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!rail}
            title={rail ? "Expand sidebar" : "Collapse sidebar"}
            className={cx(
              "hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line text-muted transition hover:border-accent/50 hover:bg-elevated hover:text-accent lg:flex",
              rail && "lg:w-full"
            )}
          >
            {rail ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
          </button>
        </div>
      </aside>
    </>
  );
}
