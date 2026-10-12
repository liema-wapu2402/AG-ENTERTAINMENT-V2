import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

/** Sticky top bar, only visible on mobile / tablet (where the sidebar is a drawer). */
export function Topbar({ onOpenMenu }: { onOpenMenu: () => void }) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-line bg-bg/80 px-4 backdrop-blur-xl lg:hidden">
      <button onClick={onOpenMenu} aria-label="Open menu" className="rounded-lg p-2 hover:bg-elevated"><Menu size={22} /></button>
      <Link to="/" className="flex items-center gap-2">
        <img src="/assets/brand/logo-mark.png" alt="" className="h-8 w-8 rounded-full object-cover" />
        <span className="text-sm font-extrabold tracking-wider">AG ENTERTAINMENT</span>
      </Link>
      <ThemeToggle />
    </header>
  );
}
