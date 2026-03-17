import type { DragEvent, KeyboardEvent, MouseEvent } from 'react';

import { CheckboxIndicator } from '@/components/ui/checkbox';
import type { Asset } from '@/features/media/domain/media.types';
import { kindLabel } from '@/features/media/components/media-asset-icon';
import { MediaAssetThumbnail } from '@/features/media/components/media-asset-thumbnail';
import { mediaBadge, selectableSurface } from '@/features/media/components/media-ui.variants';
import { cn } from '@/lib/cn';

type MediaRowProps = {
  asset: Asset;
  selected?: boolean;
  disabled?: boolean;
  onActivateAsset: (assetId: string, intent: 'single' | 'toggle' | 'range') => void;
  onConfirmAsset: (assetId: string) => void;
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
  onActivateAsset,
  onConfirmAsset,
  onDragStartAsset,
  onDragEndAsset
}: MediaRowProps) {
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
    <li>
      <article
        aria-checked={selected}
        aria-label={asset.title}
        className={cn(
          selectableSurface({ selected, disabled }),
          'grid cursor-pointer grid-cols-[auto_auto_1fr_auto] items-center gap-3 p-3'
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
        <CheckboxIndicator checked={selected} disabled={disabled} />
        <div className="h-14 w-20 overflow-hidden rounded-md border border-border bg-muted/40">
          <MediaAssetThumbnail asset={asset} className="h-full w-full" />
        </div>
        <div className="min-w-0">
          <h3 className="ui-type-body-2-strong truncate">{asset.title}</h3>
          <p className="ui-type-small-1 ui-type-muted truncate">{asset.fileName}</p>
        </div>
        <span className={mediaBadge({ tone: selected ? 'info' : 'neutral' })}>
          {kindLabel(asset)}
        </span>
      </article>
    </li>
  );
}
