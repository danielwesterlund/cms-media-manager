import { Skeleton } from '@/components/ui/skeleton';

export function LoadingPlaceholder() {
  return (
    <section aria-label="Loading media assets" className="placeholder-shell">
      <Skeleton className="placeholder-line" />
      <Skeleton className="placeholder-line" />
      <Skeleton className="placeholder-grid" />
    </section>
  );
}
