import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { ArrowLeft, LogIn, ShieldCheck } from "lucide-react";
import { errorMessage } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

/**
 * Admin sign in - a page of its own (no sidebar), reached from the
 * "Sign in" button at the bottom of the sidebar. Visitors never need it.
 */
export default function AdminLoginPage() {
  const { isAdmin, loading, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ login: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // already signed in -> straight to the admin panel
  if (!loading && isAdmin) return <Navigate to="/admin" replace />;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await login(form.login, form.password);
      navigate("/admin", { replace: true });
    } catch (err) {
      setError(errorMessage(err));
      setBusy(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen px-4 py-10 overflow-hidden module-bg isolate">
      <img
        src="/assets/backgrounds/hero-bg.jpg"
        alt=""
        className="absolute inset-0 object-cover w-full h-full -z-20 opacity-30"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-bg/60 via-bg/80 to-bg" />
      {/* floating colour glows (moving background) */}
      <span
        aria-hidden
        className="absolute w-64 h-64 rounded-full -left-20 top-1/4 -z-10 animate-pulse bg-accent/20 blur-3xl"
      />
      <span
        aria-hidden
        className="absolute -right-16 bottom-1/4 -z-10 h-72 w-72 animate-pulse rounded-full bg-m2/20 blur-3xl [animation-delay:1.2s]"
      />

      {/* top bar: back to the website + theme switch */}
      <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3 sm:p-5">
        <Link
          to="/"
          className="flex items-center gap-2 rounded-full border border-line bg-surface/70 px-3 py-1.5 text-xs text-muted backdrop-blur transition hover:border-accent hover:text-accent sm:text-sm"
        >
          <ArrowLeft size={14} /> Back to website
        </Link>
        <ThemeToggle />
      </div>

      {/* compact card with a light running around its border */}
      <div className="relative w-full max-w-xs animate-fade-up overflow-hidden rounded-2xl p-[1.5px] shadow-2xl sm:max-w-sm">
        <span
          aria-hidden
          className="absolute -inset-full animate-spin-slow bg-[conic-gradient(from_0deg,transparent_0_55%,rgb(var(--m1))_78%,rgb(var(--m2))_92%,transparent_100%)]"
        />
        <div className="relative rounded-[calc(1rem-1.5px)] bg-surface p-5 sm:p-6">
          <img
            src="/assets/brand/logo-transparent.png"
            alt="AG Entertainment"
            className="w-auto h-12 mx-auto mb-2"
          />
          <span className="mx-auto mb-2 flex w-fit items-center gap-1.5 rounded-full bg-accent/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent">
            <ShieldCheck size={12} /> Admin
          </span>
          <h1 className="text-lg font-extrabold text-center">Admin sign in</h1>
          <p className="mb-4 mt-0.5 text-center text-xs text-muted">
            Visitors can browse without signing in.
          </p>

          <form onSubmit={submit} className="space-y-3">
            <FormField
              label="Username or email"
              value={form.login}
              onChange={(e) => setForm({ ...form, login: e.target.value })}
              required
              autoComplete="username"
              autoFocus
            />
            <FormField
              label="Password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              autoComplete="current-password"
            />
            {error && (
              <p className="rounded-lg bg-red-500/10 p-2.5 text-xs text-red-400">
                {error}
              </p>
            )}
            <Button
              type="submit"
              className="w-full"
              icon={<LogIn size={16} />}
              disabled={busy}
            >
              {busy ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
