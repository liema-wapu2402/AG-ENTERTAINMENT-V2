import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { api, TOKEN_KEY } from '@/lib/api';
import type { User } from '@/types';

interface AuthCtx {
  user: User | null;
  loading: boolean;
  login: (login: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User) => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthCtx | null>(null);

/** Keeps the signed-in admin (Laravel Sanctum token). Visitors are never signed in - the public site is view-only. */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(Boolean(localStorage.getItem(TOKEN_KEY)));

  // On first load, restore the session if a token is saved.
  useEffect(() => {
    if (!localStorage.getItem(TOKEN_KEY)) return;
    api.me()
      .then(setUser)
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setLoading(false));
  }, []);

  const startSession = (res: { token: string; user: User }) => {
    localStorage.setItem(TOKEN_KEY, res.token);
    setUser(res.user);
  };

  const login = useCallback(async (l: string, p: string) => startSession(await api.login(l, p)), []);
  const logout = useCallback(async () => {
    try { await api.logout(); } finally {
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
    }
  }, []);

  const value = useMemo(() => ({ user, loading, login, logout, setUser, isAdmin: user?.role === 'admin' }), [user, loading, login, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
