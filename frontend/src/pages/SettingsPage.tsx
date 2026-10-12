import { useState, type FormEvent } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Check, LogOut, Moon, RotateCcw, ShieldCheck, Sun } from 'lucide-react';
import { errorMessage } from '@/lib/api';
import { ACCENTS, BACKGROUNDS } from '@/lib/themes';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Button, LinkButton } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { cx } from '@/lib/format';

/** A titled card used by every settings block. */
function Panel({ id, title, hint, children }: { id?: string; title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 rounded-3xl border border-line bg-surface p-5 sm:p-7">
      <h2 className="text-lg font-bold">{title}</h2>
      {hint && <p className="mt-1 text-sm text-muted">{hint}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}

/** Round colour swatch button (backgrounds + accents share it). */
function Swatch({ color, label, active, onClick, ring }: { color: string; label: string; active: boolean; onClick: () => void; ring?: string }) {
  return (
    <button onClick={onClick} title={label} aria-label={label} aria-pressed={active} className="group flex flex-col items-center gap-1.5">
      <span
        className={cx('flex h-12 w-12 items-center justify-center rounded-full border-2 transition group-hover:scale-110 sm:h-14 sm:w-14', active ? 'border-accent shadow-lg shadow-accent/30' : 'border-line')}
        style={{ background: color, outline: ring }}
      >
        {active && <Check size={18} className="text-white mix-blend-difference" />}
      </span>
      <span className={cx('text-[11px]', active ? 'font-semibold text-accent' : 'text-muted')}>{label}</span>
    </button>
  );
}

export default function SettingsPage() {
  const theme = useTheme();
  const { user, isAdmin, login, logout } = useAuth();
  const { hash } = useLocation();
  const [form, setForm] = useState({ login: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true); setError('');
    try { await login(form.login, form.password); setForm({ login: '', password: '' }); }
    catch (err) { setError(errorMessage(err)); }
    finally { setBusy(false); }
  };

  return (
    <div className="container-page max-w-4xl space-y-6 py-8 sm:py-12">
      <SectionHeader eyebrow="Settings" title="Make it yours" />

      {/* ---------------- appearance ---------------- */}
      <Panel title="Appearance" hint="Saved on this device. Movies, music and books keep their own colours but adapt to the background you pick.">
        <div className="space-y-6">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">Mode</p>
            <div className="inline-flex rounded-full border border-line bg-elevated p-1">
              {([['dark', 'Dark', Moon], ['light', 'Light', Sun]] as const).map(([key, label, Icon]) => (
                <button key={key} onClick={() => theme.setMode(key)} className={cx('flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition', theme.mode === key ? 'bg-accent text-accent-fg shadow' : 'text-muted hover:text-fg')}>
                  <Icon size={16} />{label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">{theme.mode === 'dark' ? 'Dark' : 'Light'} backgrounds</p>
            <div className="flex flex-wrap gap-4">
              {BACKGROUNDS.filter((b) => b.mode === theme.mode).map((b) => (
                <Swatch key={b.id} label={b.name} color={`rgb(${b.rgb.join(',')})`} active={theme.bg[theme.mode] === b.id} onClick={() => theme.setBackground(b.id)} />
              ))}
            </div>
          </div>

          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted">Accent colour</p>
            <p className="mb-3 text-xs text-muted">Used on Home, About, Settings and the admin panel.</p>
            <div className="flex flex-wrap gap-4">
              {ACCENTS.map((a) => <Swatch key={a.id} label={a.name} color={`rgb(${a.rgb.join(',')})`} active={theme.accent === a.id} onClick={() => theme.setAccent(a.id)} />)}
            </div>
          </div>

          {/* live preview of the three module palettes on the chosen background */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">Module colours</p>
            <div className="grid gap-3 sm:grid-cols-3">
              {([['movies', 'Movies', 'Emerald + wine'], ['music', 'Music', 'Red + blue'], ['books', 'Books', 'Yellow + orange']] as const).map(([key, name, colors]) => (
                <div key={key} data-module={key} className="overflow-hidden rounded-2xl border border-line bg-bg">
                  <div className="h-14 bg-module-gradient" />
                  <div className="p-3"><p className="text-sm font-semibold text-accent">{name}</p><p className="text-xs text-muted">{colors}</p></div>
                </div>
              ))}
            </div>
          </div>

          <Button variant="outline" size="sm" icon={<RotateCcw size={14} />} onClick={theme.reset}>Reset to default</Button>
        </div>
      </Panel>

      {/* ---------------- admin sign in ---------------- */}
      <Panel id="admin" title="Admin" hint="Visitors don't need to sign in to use the website. Only the administrator signs in, to edit content.">
        {isAdmin && user ? (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/15 text-accent"><ShieldCheck /></span>
              <div><p className="font-semibold">{user.name}</p><p className="text-sm text-muted">Signed in as administrator · @{user.username}</p></div>
            </div>
            <div className="flex flex-wrap gap-3">
              <LinkButton to="/admin" size="md">Open admin panel</LinkButton>
              <Button variant="outline" icon={<LogOut size={16} />} onClick={() => void logout()}>Sign out</Button>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} className={cx('grid gap-4 sm:grid-cols-2', hash === '#admin' && 'rounded-2xl ring-2 ring-accent/40 ring-offset-8 ring-offset-surface')}>
            <FormField label="Username or email" value={form.login} onChange={(e) => setForm({ ...form, login: e.target.value })} required autoComplete="username" />
            <FormField label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required autoComplete="current-password" />
            {error && <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400 sm:col-span-2">{error}</p>}
            <div className="sm:col-span-2"><Button type="submit" size="lg" disabled={busy}>{busy ? 'Signing in...' : 'Sign in as admin'}</Button></div>
          </form>
        )}
      </Panel>

      <p className="text-center text-xs text-muted">Want to know more? <Link to="/about" className="text-accent hover:underline">About AG Entertainment</Link></p>
    </div>
  );
}
