import type { ReactNode } from 'react';

/** Primary-looking button that opens an external URL in a new tab. */
export function LinkButtonExternal({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-fg transition hover:brightness-110">
      {children}
    </a>
  );
}
