import { NavLink, Link } from "react-router-dom";
import {
  ChevronsLeft,
  ChevronsRight,
  Eye,
  LayoutDashboard,
  LogIn,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";
import { MODULES } from "@/lib/navigation";
import { useAuth } from "@/context/AuthContext";
import { AccountCard, PanelLink } from "@/components/ui/AccountCard";
import { SearchBox } from "./SearchBox";
import { cx } from "@/lib/format";

interface Props {
  collapsed: boolean; // desktop: icon-only rail
  onToggleCollapsed: () => void;
  mobileOpen: boolean; // mobile: off-canvas drawer
  onCloseMobile: () => void;
}

/**
 * Account tab at the bottom of the public sidebar.
 *  - nobody signed in -> "User panel" with a Sign in button (opens /login)
 *  - admin signed in  -> still "User panel", with an "Open admin panel" button
 *    (signing out lives inside the admin panel)
 * In the collapsed rail it shrinks to a single icon button.
 */
function AccountPanel({
  rail,
  onNavigate,
}: {
  rail: boolean;
  onNavigate: () => void;
}) {
  const { user, isAdmin } = useAuth();
  const admin = Boolean(user && isAdmin);

  if (rail) {
    return (
      <Link
        to={admin ? "/admin" : "/login"}
        onClick={onNavigate}
        title={admin ? "Open admin panel" : "User panel - sign in"}
        className="items-center justify-center hidden w-full transition border h-11 rounded-xl border-accent/40 bg-accent/10 text-accent hover:bg-accent hover:text-accent-fg lg:flex"
      >
        {admin ? <ShieldCheck size={20} /> : <Eye size={20} />}
      </Link>
    );
  }

  return (
    <AccountCard
      label="User panel"
      icon={Eye}
      title={admin ? user!.name : "Visitor"}
      subtitle={admin ? `Signed in as @${user!.username}` : "View only"}
    >
      {admin ? (
        <PanelLink to="/admin" icon={LayoutDashboard} onClick={onNavigate}>
          Open admin panel
        </PanelLink>
      ) : (
        <PanelLink to="/login" icon={LogIn} onClick={onNavigate}>
          Sign in
        </PanelLink>
      )}
    </AccountCard>
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
                    : "text-muted hover:translate-x-1 hover:bg-elevated hover:text-fg"
                )
              }
            >
              <Icon size={20} className="shrink-0" />
              <span className={cx(rail && "lg:hidden")}>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* bottom: account tab (+ collapse button on desktop). Dark/light mode now lives in Settings. */}
        <div className="relative shrink-0 space-y-2 border-t border-line bg-sidebar/60 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur">
          <AccountPanel rail={rail} onNavigate={onCloseMobile} />
          <div
            className={cx(
              "hidden lg:flex",
              rail ? "justify-center" : "justify-end"
            )}
          >
            <button
              onClick={onToggleCollapsed}
              aria-label={rail ? "Expand sidebar" : "Collapse sidebar"}
              className="p-2 transition rounded-xl text-muted hover:bg-elevated hover:text-accent"
            >
              {rail ? <ChevronsRight size={20} /> : <ChevronsLeft size={20} />}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
