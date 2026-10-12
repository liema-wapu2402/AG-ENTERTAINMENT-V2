import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import { MODULES } from '@/lib/navigation';

/** Site footer - links are generated from the module list. */
export function Footer() {
  return (
    <footer className="mt-20 border-t border-line bg-surface/50">
      <div className="container-page flex flex-col items-center justify-between gap-6 py-10 md:flex-row">
        <Link to="/" className="flex items-center gap-3">
          <img src="/assets/brand/logo-wordmark.png" alt="AG Entertainment" className="h-9 w-auto" />
        </Link>
        <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted">
          {MODULES.map((m) => <li key={m.to}><Link className="hover:text-accent" to={m.to}>{m.label}</Link></li>)}
        </ul>
        <div className="flex gap-3 text-muted">
          {[Facebook, Instagram, Twitter].map((Icon, i) => (
            <a key={i} href="#" aria-label="Social link" className="rounded-full border border-line p-2 transition hover:border-accent hover:text-accent"><Icon size={16} /></a>
          ))}
        </div>
      </div>
      <p className="border-t border-line py-4 text-center text-xs text-muted">© {new Date().getFullYear()} AG Entertainment · Version 2</p>
    </footer>
  );
}
