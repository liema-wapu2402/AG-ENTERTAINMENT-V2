import { useState, type FormEvent } from 'react';
import { KeyRound, Save, UserRound } from 'lucide-react';
import { adminApi, errorMessage } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { AppearanceSettings } from '@/components/settings/AppearanceSettings';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';

/**
 * Admin settings:
 *  1. Account - name, username, email and (optionally) a new password
 *  2. Appearance - same theme options as the public Settings page
 */
export default function AdminSettingsPage() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name ?? '', username: user?.username ?? '', email: user?.email ?? '',
    current_password: '', password: '', password_confirmation: '',
  });
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [key]: e.target.value });

  const save = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true); setMessage(null);
    try {
      setUser(await adminApi.updateAccount(form));
      setForm({ ...form, current_password: '', password: '', password_confirmation: '' });
      setMessage({ ok: true, text: 'Account saved.' });
    } catch (err) { setMessage({ ok: false, text: errorMessage(err) }); }
    finally { setBusy(false); }
  };

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Admin</p>
        <h1 className="text-2xl font-extrabold sm:text-3xl">Settings</h1>
        <p className="text-sm text-muted">Your account and how the website looks.</p>
      </header>

      <form onSubmit={save} className="space-y-6 rounded-3xl border border-line bg-surface p-5 sm:p-7">
        <section>
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold"><UserRound size={18} className="text-accent" /> Account</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Full name" value={form.name} onChange={set('name')} required />
            <FormField label="Username" value={form.username} onChange={set('username')} required autoComplete="username" />
            <div className="sm:col-span-2"><FormField label="Email" type="email" value={form.email} onChange={set('email')} required autoComplete="email" /></div>
          </div>
        </section>

        <section>
          <h2 className="mb-1 flex items-center gap-2 text-lg font-bold"><KeyRound size={18} className="text-accent" /> Change password</h2>
          <p className="mb-4 text-sm text-muted">Leave empty to keep your current password.</p>
          <div className="grid gap-4 sm:grid-cols-3">
            <FormField label="Current password" type="password" value={form.current_password} onChange={set('current_password')} autoComplete="current-password" />
            <FormField label="New password" type="password" value={form.password} onChange={set('password')} autoComplete="new-password" />
            <FormField label="Confirm new password" type="password" value={form.password_confirmation} onChange={set('password_confirmation')} autoComplete="new-password" />
          </div>
        </section>

        {message && <p className={`rounded-lg p-3 text-sm ${message.ok ? 'bg-accent/10 text-accent' : 'bg-red-500/10 text-red-400'}`}>{message.text}</p>}
        <Button type="submit" icon={<Save size={16} />} disabled={busy}>{busy ? 'Saving...' : 'Save account'}</Button>
      </form>

      <AppearanceSettings />
    </div>
  );
}
