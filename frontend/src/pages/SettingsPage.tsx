import { Check, Moon, RotateCcw, Sun } from "lucide-react";
import { ACCENTS, BACKGROUNDS } from "@/lib/themes";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cx } from "@/lib/format";

/** A titled card used by every settings block. */
function Panel({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="p-5 border rounded-3xl border-line bg-surface sm:p-7">
      <h2 className="text-lg font-bold">{title}</h2>
      {hint && <p className="mt-1 text-sm text-muted">{hint}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}

/** Round colour swatch button (backgrounds + accents share it). */
function Swatch({
  color,
  label,
  active,
  onClick,
}: {
  color: string;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      aria-label={label}
      aria-pressed={active}
      className="group flex flex-col items-center gap-1.5"
    >
      <span
        className={cx(
          "flex h-12 w-12 items-center justify-center rounded-full border-2 transition group-hover:scale-110 sm:h-14 sm:w-14",
          active ? "border-accent shadow-lg shadow-accent/30" : "border-line"
        )}
        style={{ background: color }}
      >
        {active && (
          <Check size={18} className="text-white mix-blend-difference" />
        )}
      </span>
      <span
        className={cx(
          "text-[11px]",
          active ? "font-semibold text-accent" : "text-muted"
        )}
      >
        {label}
      </span>
    </button>
  );
}

/** Settings: appearance only (admin sign in now lives on its own page: /login). */
export default function SettingsPage() {
  const theme = useTheme();

  return (
    <div className="max-w-4xl py-8 space-y-6 container-page sm:py-12">
      <SectionHeader eyebrow="Settings" title="Make it yours" />

      <Panel
        title="Appearance"
        hint="Saved on this device. Movies, music and books keep their own colours but adapt to the background you pick."
      >
        <div className="space-y-6">
          <div>
            <p className="mb-2 text-xs font-semibold tracking-wider uppercase text-muted">
              Mode
            </p>
            <div className="inline-flex p-1 border rounded-full border-line bg-elevated">
              {(
                [
                  ["dark", "Dark", Moon],
                  ["light", "Light", Sun],
                ] as const
              ).map(([key, label, Icon]) => (
                <button
                  key={key}
                  onClick={() => theme.setMode(key)}
                  className={cx(
                    "flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition",
                    theme.mode === key
                      ? "bg-accent text-accent-fg shadow"
                      : "text-muted hover:text-fg"
                  )}
                >
                  <Icon size={16} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold tracking-wider uppercase text-muted">
              {theme.mode === "dark" ? "Dark" : "Light"} backgrounds
            </p>
            <div className="flex flex-wrap gap-4">
              {BACKGROUNDS.filter((b) => b.mode === theme.mode).map((b) => (
                <Swatch
                  key={b.id}
                  label={b.name}
                  color={`rgb(${b.rgb.join(",")})`}
                  active={theme.bg[theme.mode] === b.id}
                  onClick={() => theme.setBackground(b.id)}
                />
              ))}
            </div>
          </div>

          <div>
            <p className="mb-1 text-xs font-semibold tracking-wider uppercase text-muted">
              Accent colour
            </p>
            <p className="mb-3 text-xs text-muted">
              Used on Home, About, Settings and the admin panel.
            </p>
            <div className="flex flex-wrap gap-4">
              {ACCENTS.map((a) => (
                <Swatch
                  key={a.id}
                  label={a.name}
                  color={`rgb(${a.rgb.join(",")})`}
                  active={theme.accent === a.id}
                  onClick={() => theme.setAccent(a.id)}
                />
              ))}
            </div>
          </div>

          {/* live preview of the three module palettes on the chosen background */}
          <div>
            <p className="mb-3 text-xs font-semibold tracking-wider uppercase text-muted">
              Module colours
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {(
                [
                  ["movies", "Movies", "Emerald + wine"],
                  ["music", "Music", "Red + blue"],
                  ["books", "Books", "Yellow + orange"],
                ] as const
              ).map(([key, name, colors]) => (
                <div
                  key={key}
                  data-module={key}
                  className="overflow-hidden border rounded-2xl border-line bg-bg"
                >
                  <div className="h-14 bg-module-gradient" />
                  <div className="p-3">
                    <p className="text-sm font-semibold text-accent">{name}</p>
                    <p className="text-xs text-muted">{colors}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            icon={<RotateCcw size={14} />}
            onClick={theme.reset}
          >
            Reset to default
          </Button>
        </div>
      </Panel>
    </div>
  );
}
