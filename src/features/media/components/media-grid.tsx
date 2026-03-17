import { useState, type DragEvent, type DragEventHandler } from 'react';

import type { Asset } from '@/features/media/domain/media.types';
import { mediaPanel } from '@/features/media/components/media-ui.variants';
import { MediaCard } from '@/features/media/components/media-card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/cn';

type MediaGridProps = {
  assets: Asset[];
  selectedAssetIds: string[];
  loading?: boolean;
  onActivateAsset: (assetId: string, intent: 'single' | 'toggle' | 'range') => void;
  onConfirmAsset: (assetId: string) => void;
  onDragStartAsset?: (assetId: string, event: DragEvent<HTMLElement>) => void;
  onDragEndAsset?: (assetId: string) => void;
  onFilesDropped?: (files: File[]) => void;
  emptyMessage?: string;
};

/**
 * Presentational grid view for assets.
 */
export function MediaGrid({
  assets,
  selectedAssetIds,
  loading = false,
  onActivateAsset,
  onConfirmAsset,
  onDragStartAsset,
  onDragEndAsset,
  onFilesDropped,
  emptyMessage = 'No assets found.'
}: MediaGridProps) {
  const [dragActive, setDragActive] = useState(false);

  const onDrop: DragEventHandler<HTMLElement> = (event) => {
    event.preventDefault();
    setDragActive(false);
    if (!onFilesDropped) return;
    onFilesDropped(Array.from(event.dataTransfer.files));
  };

  if (loading) {
    return <MediaGridSkeleton />;
  }

  if (assets.length === 0) {
    return (
      <section className={cn(mediaPanel(), 'ui-type-body-2 ui-type-muted border-dashed p-8 text-center')}>
        {emptyMessage}
      </section>
    );
  }

  const selected = new Set(selectedAssetIds);

  return (
    <section
      aria-label="Media grid"
      className={dragActive ? 'rounded-lg border-2 border-dashed border-primary p-2' : undefined}
      onDragEnter={(event) => {
        event.preventDefault();
        setDragActive(true);
      }}
      onDragLeave={(event) => {
        event.preventDefault();
        setDragActive(false);
      }}
      onDragOver={(event) => event.preventDefault()}
      onDrop={onDrop}
    >
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {assets.map((asset) => (
          <li key={asset.id}>
            <MediaCard
              asset={asset}
              onActivateAsset={onActivateAsset}
              onConfirmAsset={onConfirmAsset}
              onDragEndAsset={onDragEndAsset}
              onDragStartAsset={onDragStartAsset}
              selected={selected.has(asset.id)}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

function MediaGridSkeleton() {
  return (
    <section aria-label="Loading assets">
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <li key={`media-grid-skeleton-${index}`}>
            <div className="rounded-lg border border-border bg-card p-3">
              <Skeleton className="mb-3 h-10 w-10" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="mt-2 h-3 w-3/5" />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
