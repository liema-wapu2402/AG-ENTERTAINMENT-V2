import { NavLink } from 'react-router-dom';
import { MODULES } from '@/lib/navigation';
import { cx } from '@/lib/format';

/** Mobile tab bar (fixed at the bottom, hidden on desktop where the sidebar is used). */
export function BottomNav() {
  const tabs = MODULES.filter((m) => m.tab);
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-sidebar/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden" aria-label="Main">
      <ul className="mx-auto flex max-w-xl">
        {tabs.map(({ to, label, icon: Icon }) => (
          <li key={to} className="flex-1">
            <NavLink to={to} end={to === '/'} className={({ isActive }) => cx('flex h-14 flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition', isActive ? 'text-accent' : 'text-muted')}>
              {({ isActive }) => (
                <>
                  <Icon size={20} className={cx('transition', isActive && '-translate-y-0.5 scale-110')} />
                  <span>{label}</span>
                  <span className={cx('absolute top-0 h-0.5 w-8 rounded-full bg-module-gradient transition', isActive ? 'opacity-100' : 'opacity-0')} />
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
