import { Compass, Heart, Landmark, Lightbulb, Rocket, Search, Skull, Sparkles, Wand2, type LucideIcon } from 'lucide-react';

// Genre icon keys stored in the database -> lucide icons.
export const GENRE_ICONS: Record<string, LucideIcon> = {
  wand: Wand2,
  rocket: Rocket,
  search: Search,
  heart: Heart,
  skull: Skull,
  landmark: Landmark,
  lightbulb: Lightbulb,
  compass: Compass,
};

export const iconFor = (key: string): LucideIcon => GENRE_ICONS[key] ?? Sparkles;
