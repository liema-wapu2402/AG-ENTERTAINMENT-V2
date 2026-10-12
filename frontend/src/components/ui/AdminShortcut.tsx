import { Link } from 'react-router-dom';
import { Pencil } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

/** Only shown to a signed-in admin: jumps from the public page to its editor. Visitors never see it. */
export function AdminShortcut({ to, label }: { to: string; label: string }) {
  const { isAdmin } = useAuth();
  if (!isAdmin) return null;
  return (
    <Link to={to} className="inline-flex items-center gap-2 rounded-full border border-accent/50 bg-accent/10 px-4 py-2 text-xs font-semibold text-accent backdrop-blur transition hover:bg-accent hover:text-accent-fg">
      <Pencil size={14} /> {label}
    </Link>
  );
}
