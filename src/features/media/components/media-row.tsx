import type { DragEvent, KeyboardEvent } from 'react';

import type { Asset } from '@/features/media/domain/media.types';
import { kindLabel } from '@/features/media/components/media-asset-icon';
import { MediaAssetThumbnail } from '@/features/media/components/media-asset-thumbnail';
import { mediaBadge, selectableSurface } from '@/features/media/components/media-ui.variants';
import { cn } from '@/lib/cn';

type MediaRowProps = {
  asset: Asset;
  selected?: boolean;
  disabled?: boolean;
  onToggleSelect: (assetId: string) => void;
  onOpenDetail: (assetId: string) => void;
  onDragStartAsset?: (assetId: string, event: DragEvent<HTMLElement>) => void;
  onDragEndAsset?: (assetId: string) => void;
};

/**
 * Presentational selectable media row.
 */
export function MediaRow({
  asset,
  selected = false,
  disabled = false,
  onToggleSelect,
  onOpenDetail,
  onDragStartAsset,
  onDragEndAsset
}: MediaRowProps) {
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
    <li>
      <article
        aria-checked={selected}
        aria-label={asset.title}
        className={cn(
          selectableSurface({ selected, disabled }),
          'grid cursor-pointer grid-cols-[auto_1fr_auto] items-center gap-3 p-3'
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
        <div className="h-14 w-20 overflow-hidden rounded-md border border-border bg-muted/40">
          <MediaAssetThumbnail asset={asset} className="h-full w-full" />
        </div>
        <div className="min-w-0">
          <h3 className="truncate text-sm font-medium">{asset.title}</h3>
          <p className="truncate text-xs text-muted-foreground">{asset.fileName}</p>
        </div>
        <span className={mediaBadge({ tone: selected ? 'info' : 'neutral' })}>
          {kindLabel(asset)}
        </span>
      </article>
    </li>
  );
}
