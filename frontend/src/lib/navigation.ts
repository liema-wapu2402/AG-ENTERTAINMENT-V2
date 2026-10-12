import { BookOpen, Clapperboard, Home, Info, Music2, Settings, type LucideIcon } from 'lucide-react';

// Single source of truth for the public modules.
// The sidebar, bottom tab bar, home tiles and footer all read this list,
// so adding a module = one entry here + one route in App.tsx.
export type ModuleKey = 'movies' | 'music' | 'books';

export interface ModuleLink {
  to: string;
  label: string;
  icon: LucideIcon;
  description: string;
  module?: ModuleKey;   // modules with their own colour palette
  image?: string;       // background of the home page tile
  tab?: boolean;        // shown in the mobile bottom tab bar
}

export const MODULES: ModuleLink[] = [
  { to: '/', label: 'Home', icon: Home, description: 'Your entertainment hub', tab: true },
  {
    to: '/movies', label: 'Movies', icon: Clapperboard, module: 'movies', tab: true,
    description: 'Upcoming releases, top rated films and the best TV series.',
    image: '/assets/backgrounds/upcoming-bg.png',
  },
  {
    to: '/music', label: 'Music', icon: Music2, module: 'music', tab: true,
    description: 'Stream your favourite artists with the new music player.',
    image: '/assets/backgrounds/service-bg.jpg',
  },
  {
    to: '/books', label: 'Books', icon: BookOpen, module: 'books', tab: true,
    description: 'Browse a curated library of books for every genre.',
    image: '/assets/backgrounds/cta-bg.jpg',
  },
  { to: '/about', label: 'About', icon: Info, description: 'About the website and its developer' },
  { to: '/settings', label: 'Settings', icon: Settings, description: 'Appearance and admin sign in', tab: true },
];

/** Finds which module palette a URL belongs to ("/movies/aquaman" -> "movies"). */
export const moduleFromPath = (pathname: string): ModuleKey | undefined =>
  MODULES.find((m) => m.module && (pathname === m.to || pathname.startsWith(`${m.to}/`)))?.module;
