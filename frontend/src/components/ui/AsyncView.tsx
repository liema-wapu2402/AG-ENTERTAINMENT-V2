import type { ReactNode } from 'react';
import { AlertTriangle, Inbox } from 'lucide-react';
import { Button } from './Button';
import { SkeletonRow } from './Skeleton';

interface Props<T> {
  state: { data: T | null; loading: boolean; error: string | null; reload: () => void };
  /** Rendered once data is available. */
  children: (data: T) => ReactNode;
  skeleton?: ReactNode;
  /** Return true when the loaded data should be treated as "empty". */
  isEmpty?: (data: T) => boolean;
  emptyMessage?: string;
}

/**
 * One place that handles loading / error / empty states, so pages only
 * describe the happy path:  <AsyncView state={movies}>{(list) => ...}</AsyncView>
 */
export function AsyncView<T>({ state, children, skeleton, isEmpty, emptyMessage = 'Nothing here yet.' }: Props<T>) {
  if (state.loading && !state.data) return <>{skeleton ?? <SkeletonRow />}</>;
  if (state.error) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-line bg-surface p-8 text-center">
        <AlertTriangle className="text-accent" />
        <p className="text-sm text-muted">{state.error}</p>
        <Button size="sm" variant="outline" onClick={state.reload}>Try again</Button>
      </div>
    );
  }
  if (!state.data || (isEmpty && isEmpty(state.data))) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-line p-10 text-center text-muted">
        <Inbox /> <p className="text-sm">{emptyMessage}</p>
      </div>
    );
  }
  return <>{children(state.data)}</>;
}
