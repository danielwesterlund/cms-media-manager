import type { DragEvent, KeyboardEvent } from 'react';

import type { Asset } from '@/features/media/domain/media.types';
import { kindLabel } from '@/features/media/components/media-asset-icon';
import { MediaAssetThumbnail } from '@/features/media/components/media-asset-thumbnail';
import { mediaBadge, selectableSurface } from '@/features/media/components/media-ui.variants';
import { cn } from '@/lib/cn';

type MediaCardProps = {
  asset: Asset;
  selected?: boolean;
  disabled?: boolean;
  onToggleSelect: (assetId: string) => void;
  onOpenDetail: (assetId: string) => void;
  onDragStartAsset?: (assetId: string, event: DragEvent<HTMLElement>) => void;
  onDragEndAsset?: (assetId: string) => void;
};

/**
 * Presentational selectable media card.
 */
export function MediaCard({
  asset,
  selected = false,
  disabled = false,
  onToggleSelect,
  onOpenDetail,
  onDragStartAsset,
  onDragEndAsset
}: MediaCardProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (disabled) return;

    if (event.key === ' ') {
      event.preventDefault();
      onToggleSelect(asset.id);
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      onOpenDetail(asset.id);
    }
  };

  return (
    <article
      aria-checked={selected}
      aria-label={asset.title}
      className={cn(
        selectableSurface({ selected, disabled }),
        'group flex h-full cursor-pointer flex-col p-3'
      )}
      draggable={!disabled}
      onClick={() => onToggleSelect(asset.id)}
      onDragEnd={() => onDragEndAsset?.(asset.id)}
      onDragStart={(event) => onDragStartAsset?.(asset.id, event)}
      onDoubleClick={() => onOpenDetail(asset.id)}
      onKeyDown={handleKeyDown}
      role="checkbox"
      tabIndex={disabled ? -1 : 0}
    >
      <div className="relative mb-3 overflow-hidden rounded-md border border-border bg-muted/40">
        <div className="h-28 w-full">
          <MediaAssetThumbnail asset={asset} className="h-full w-full" />
        </div>
        <span className={cn(mediaBadge({ tone: selected ? 'info' : 'neutral' }), 'absolute right-2 top-2')}>
          {kindLabel(asset)}
        </span>
      </div>
      <h3 className="line-clamp-2 text-sm font-medium leading-5">{asset.title}</h3>
      <p className="mt-1 truncate text-xs text-muted-foreground">{asset.fileName}</p>
    </article>
  );
}
