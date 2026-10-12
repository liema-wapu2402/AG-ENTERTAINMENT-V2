import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { ACCENTS, BACKGROUNDS, DEFAULT_BG, buildTokens, type Mode } from '@/lib/themes';

interface ThemeState { mode: Mode; bg: Record<Mode, string>; accent: string }

interface ThemeCtx extends ThemeState {
  setMode: (m: Mode) => void;
  toggle: () => void;
  setBackground: (id: string) => void;
  setAccent: (id: string) => void;
  reset: () => void;
}

const KEY = 'ag-theme-v2';
const INITIAL: ThemeState = { mode: 'dark', bg: { ...DEFAULT_BG }, accent: 'emerald' };

const ThemeContext = createContext<ThemeCtx | null>(null);

/** Reads the saved theme (falls back to the original dark AG theme). */
function load(): ThemeState {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) ?? 'null') as Partial<ThemeState> | null;
    if (saved) return { ...INITIAL, ...saved, bg: { ...INITIAL.bg, ...saved.bg } };
  } catch { /* ignore corrupt storage */ }
  return INITIAL;
}

/**
 * Dark / light mode + a background colour per mode + an accent colour.
 * Everything is applied as CSS variables on <html>, so modules re-tint instantly.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ThemeState>(load);

  useEffect(() => {
    const bg = BACKGROUNDS.find((b) => b.id === state.bg[state.mode]) ?? BACKGROUNDS.find((b) => b.mode === state.mode)!;
    const accent = ACCENTS.find((a) => a.id === state.accent) ?? ACCENTS[0];
    const root = document.documentElement;

    root.classList.toggle('dark', state.mode === 'dark');
    for (const [name, value] of Object.entries(buildTokens(bg, accent))) root.style.setProperty(name, value);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', `rgb(${bg.rgb.join(',')})`);
    localStorage.setItem(KEY, JSON.stringify(state));
  }, [state]);

  const setMode = useCallback((mode: Mode) => setState((s) => ({ ...s, mode })), []);
  const toggle = useCallback(() => setState((s) => ({ ...s, mode: s.mode === 'dark' ? 'light' : 'dark' })), []);
  const setBackground = useCallback((id: string) => setState((s) => {
    const option = BACKGROUNDS.find((b) => b.id === id);
    return option ? { ...s, mode: option.mode, bg: { ...s.bg, [option.mode]: id } } : s;
  }), []);
  const setAccent = useCallback((accent: string) => setState((s) => ({ ...s, accent })), []);
  const reset = useCallback(() => setState(INITIAL), []);

  const value = useMemo(() => ({ ...state, setMode, toggle, setBackground, setAccent, reset }), [state, setMode, toggle, setBackground, setAccent, reset]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
}
