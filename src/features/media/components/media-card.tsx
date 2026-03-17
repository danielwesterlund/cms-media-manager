import type { DragEvent, KeyboardEvent, MouseEvent } from 'react';

import { CheckboxIndicator } from '@/components/ui/checkbox';
import type { Asset } from '@/features/media/domain/media.types';
import { kindLabel } from '@/features/media/components/media-asset-icon';
import { MediaAssetThumbnail } from '@/features/media/components/media-asset-thumbnail';
import { mediaBadge, selectableSurface } from '@/features/media/components/media-ui.variants';
import { cn } from '@/lib/cn';

type MediaCardProps = {
  asset: Asset;
  selected?: boolean;
  disabled?: boolean;
  onActivateAsset: (assetId: string, intent: 'single' | 'toggle' | 'range') => void;
  onConfirmAsset: (assetId: string) => void;
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
  onActivateAsset,
  onConfirmAsset,
  onDragStartAsset,
  onDragEndAsset
}: MediaCardProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (disabled) return;

    if (event.key === ' ') {
      event.preventDefault();
      onActivateAsset(asset.id, 'toggle');
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      onActivateAsset(asset.id, 'single');
    }
  };

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    if (disabled) return;
    if (event.shiftKey) {
      onActivateAsset(asset.id, 'range');
      return;
    }
    if (event.metaKey || event.ctrlKey) {
      onActivateAsset(asset.id, 'toggle');
      return;
    }
    onActivateAsset(asset.id, 'single');
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
      onClick={handleClick}
      onDragEnd={() => onDragEndAsset?.(asset.id)}
      onDragStart={(event) => onDragStartAsset?.(asset.id, event)}
      onDoubleClick={() => onConfirmAsset(asset.id)}
      onKeyDown={handleKeyDown}
      role="checkbox"
      tabIndex={disabled ? -1 : 0}
    >
      <div className="relative mb-3 overflow-hidden rounded-md border border-border bg-muted/40">
        <CheckboxIndicator checked={selected} className="absolute left-2 top-2 z-10" disabled={disabled} />
        <div className="h-28 w-full">
          <MediaAssetThumbnail asset={asset} className="h-full w-full" />
        </div>
        <span className={cn(mediaBadge({ tone: selected ? 'info' : 'neutral' }), 'absolute right-2 top-2')}>
          {kindLabel(asset)}
        </span>
      </div>
      <h3 className="ui-type-body-2-strong line-clamp-2">{asset.title}</h3>
      <p className="ui-type-small-1 ui-type-muted mt-1 truncate">{asset.fileName}</p>
    </article>
  );
}
