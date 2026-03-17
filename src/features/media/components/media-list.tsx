import { useState, type DragEvent, type DragEventHandler } from 'react';

import type { Asset } from '@/features/media/domain/media.types';
import { mediaPanel } from '@/features/media/components/media-ui.variants';
import { MediaRow } from '@/features/media/components/media-row';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/cn';

type MediaListProps = {
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
 * Presentational list view for assets.
 */
export function MediaList({
  assets,
  selectedAssetIds,
  loading = false,
  onActivateAsset,
  onConfirmAsset,
  onDragStartAsset,
  onDragEndAsset,
  onFilesDropped,
  emptyMessage = 'No assets found.'
}: MediaListProps) {
  const [dragActive, setDragActive] = useState(false);

  const onDrop: DragEventHandler<HTMLElement> = (event) => {
    event.preventDefault();
    setDragActive(false);
    if (!onFilesDropped) return;
    onFilesDropped(Array.from(event.dataTransfer.files));
  };

  if (loading) {
    return <MediaListSkeleton />;
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
      aria-label="Media list"
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
      {assets.length > 120 ? (
        <p className="ui-type-small-1 ui-type-muted mb-2">Large list detected. Consider react-window virtualization.</p>
      ) : null}
      <ul className="space-y-2">
        {assets.map((asset) => (
          <MediaRow
            key={asset.id}
            asset={asset}
            onActivateAsset={onActivateAsset}
            onConfirmAsset={onConfirmAsset}
            onDragEndAsset={onDragEndAsset}
            onDragStartAsset={onDragStartAsset}
            selected={selected.has(asset.id)}
          />
        ))}
      </ul>
    </section>
  );
}

function MediaListSkeleton() {
  return (
    <section aria-label="Loading assets">
      <ul className="space-y-2">
        {Array.from({ length: 8 }).map((_, index) => (
          <li key={`media-list-skeleton-${index}`}>
            <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-lg border border-border bg-card p-3">
              <Skeleton className="h-10 w-10" />
              <div>
                <Skeleton className="h-4 w-3/5" />
                <Skeleton className="mt-2 h-3 w-2/5" />
              </div>
              <Skeleton className="h-5 w-14" />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
