import type { InputHTMLAttributes } from 'react';

/** Labelled input used by the login / register / profile forms. */
export function FormField({ label, ...props }: { label: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted">{label}</span>
      <input
        {...props}
        className="w-full rounded-xl border border-line bg-elevated/60 px-4 py-3 text-sm outline-none transition placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/30"
      />
    </label>
  );
}
