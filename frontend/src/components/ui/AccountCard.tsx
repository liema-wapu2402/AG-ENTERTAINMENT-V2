import type { LucideIcon } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Link, type LinkProps } from "react-router-dom";
import { cx } from "@/lib/format";

/**
 * Compact account card used at the bottom of BOTH sidebars (public + admin):
 *  - a folder-style tab with a pulsing status dot ("USER PANEL" / "ADMIN PANEL")
 *  - a card whose border has a light running around it (moving design)
 *  - action buttons passed as children (icon + words)
 */
export function AccountCard({
  label,
  icon: Icon,
  title,
  subtitle,
  children,
}: {
  label: string;
  icon: LucideIcon;
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div>
      {/* tab */}
      <div className="relative z-10 ml-3 inline-flex items-center gap-1.5 rounded-t-lg bg-accent px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-accent-fg">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex w-full h-full rounded-full animate-ping bg-accent-fg opacity-60" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent-fg" />
        </span>
        <Icon size={11} /> {label}
      </div>

      {/* moving border: a big rotating gradient hidden behind the card, only the 1.5px edge shows */}
      <div className="relative overflow-hidden rounded-xl rounded-tl-none p-[1.5px]">
        <span
          aria-hidden
          className="absolute -inset-full animate-spin-slow bg-[conic-gradient(from_0deg,transparent_0_55%,rgb(var(--m1))_78%,rgb(var(--m2))_92%,transparent_100%)]"
        />

        <section className="relative overflow-hidden rounded-[calc(0.75rem-1.5px)] bg-sidebar p-2.5">
          {/* tint + floating glow (adapts to the theme + module colours) */}
          <span
            aria-hidden
            className="absolute inset-0 bg-gradient-to-br from-accent/15 via-elevated/40 to-m2/15"
          />
          <span
            aria-hidden
            className="absolute w-16 h-16 rounded-full -right-6 -top-6 animate-pulse bg-module-gradient opacity-30 blur-xl"
          />

          <div className="relative flex items-center gap-2.5">
            <span className="flex items-center justify-center w-8 h-8 rounded-full shrink-0 bg-accent/20 text-accent ring-1 ring-accent/40">
              <Icon size={16} />
            </span>
            <div className="flex-1 min-w-0">
              <p className="line-clamp-2 break-words text-[13px] font-semibold leading-tight">
                {title}
              </p>
              <p className="truncate text-[11px] text-muted">{subtitle}</p>
            </div>
          </div>

          <div className="relative mt-2.5 space-y-1.5">{children}</div>
        </section>
      </div>
    </div>
  );
}

type Tone = "primary" | "outline" | "danger";
const TONES: Record<Tone, string> = {
  primary: "bg-accent text-accent-fg hover:brightness-110",
  outline:
    "border border-accent/50 bg-accent/10 text-accent hover:bg-accent hover:text-accent-fg",
  danger:
    "border border-line text-muted hover:border-red-400 hover:bg-red-500/10 hover:text-red-400",
};
const base =
  "group flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-bold transition active:scale-95";

/** Icon + words button (link or button) used inside the account card. The icon slides on hover. */
export function PanelLink({
  tone = "primary",
  icon: Icon,
  children,
  ...rest
}: { tone?: Tone; icon: LucideIcon; children: ReactNode } & LinkProps) {
  return (
    <Link className={cx(base, TONES[tone])} {...rest}>
      <Icon
        size={14}
        className="shrink-0 transition group-hover:translate-x-0.5"
      />
      {children}
    </Link>
  );
}

export function PanelButton({
  tone = "danger",
  icon: Icon,
  children,
  ...rest
}: {
  tone?: Tone;
  icon: LucideIcon;
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cx(base, TONES[tone])} {...rest}>
      <Icon
        size={14}
        className="shrink-0 transition group-hover:translate-x-0.5"
      />
      {children}
    </button>
  );
}
