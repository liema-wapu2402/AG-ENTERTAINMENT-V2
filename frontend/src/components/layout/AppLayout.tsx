import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { Footer } from './Footer';
import { BottomNav } from './BottomNav';
import { PlayerBar } from '@/components/music/PlayerBar';
import { moduleFromPath } from '@/lib/navigation';
import { usePlayer } from '@/context/PlayerContext';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { cx } from '@/lib/format';

/**
 * Shell shared by every page: sidebar + (mobile) top bar + page content +
 * footer + the global music player. Pages render inside <Outlet />.
 */
export function AppLayout() {
  const [collapsed, setCollapsed] = useLocalStorage('ag-sidebar-collapsed', false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { current } = usePlayer();
  const { pathname } = useLocation();

  // Scroll to top + close the drawer on every route change.
  useEffect(() => { window.scrollTo(0, 0); setMobileOpen(false); }, [pathname]);

  return (
    // data-module switches the colour palette (movies / music / books) for everything inside
    <div className="module-bg min-h-screen" data-module={moduleFromPath(pathname)}>
      <Sidebar
        collapsed={collapsed}
        onToggleCollapsed={() => setCollapsed((c) => !c)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />
      {/* content is pushed right of the sidebar on desktop */}
      <div className={cx('transition-all duration-300', collapsed ? 'lg:pl-[72px]' : 'lg:pl-64', 'pb-16 lg:pb-0', current && 'pb-36 lg:pb-24')}>
        <Topbar onOpenMenu={() => setMobileOpen(true)} />
        <main><Outlet /></main>
        <Footer />
      </div>
      <PlayerBar sidebarCollapsed={collapsed} />
      <BottomNav />
    </div>
  );
}
