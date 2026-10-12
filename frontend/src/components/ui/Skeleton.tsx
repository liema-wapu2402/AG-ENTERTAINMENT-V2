import { cx } from '@/lib/format';

/** Loading placeholder block with a shimmer effect. */
export const Skeleton = ({ className }: { className?: string }) => <div className={cx('skeleton', className)} />;

/** A row of poster-shaped skeletons (used while carousels load). */
export const SkeletonRow = ({ count = 6, className = 'h-64 w-40 sm:w-48' }: { count?: number; className?: string }) => (
  <div className="flex gap-4 overflow-hidden">
    {Array.from({ length: count }).map((_, i) => <Skeleton key={i} className={`shrink-0 ${className}`} />)}
  </div>
);
