import { LinkButton } from '@/components/ui/Button';

export default function NotFoundPage() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <img src="/assets/brand/logo-transparent.png" alt="" className="h-20 w-auto opacity-80" />
      <h1 className="text-6xl font-extrabold text-gradient">404</h1>
      <p className="text-muted">This page doesn't exist.</p>
      <LinkButton to="/">Back to home</LinkButton>
    </div>
  );
}
