import type { Asset } from '@/features/media/domain/media.types';
import { cn } from '@/lib/cn';

type MediaAssetIconProps = {
  asset: Asset;
  className?: string;
};

/**
 * Lightweight asset-type icon used by cards and rows.
 */
export function MediaAssetIcon({ asset, className }: MediaAssetIconProps) {
  const label = kindLabel(asset);
  return (
    <div
      aria-hidden="true"
      className={cn(
        'inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-muted text-xs font-semibold text-muted-foreground',
        className
      )}
      title={label}
    >
      <span className="material-symbols-outlined text-muted-foreground">{kindIcon(asset.kind)}</span>
    </div>
  );
}

/**
 * Human-friendly asset kind label.
 */
export function kindLabel(asset: Asset): string {
  switch (asset.kind) {
    case 'powerbi':
      return 'Power BI';
    case 'pdf':
      return 'PDF';
    case 'office':
      return 'Office';
    case 'tableau':
      return 'Tableau';
    case 'audio':
      return 'Audio';
    default:
      return 'Image';
  }
}

function kindIcon(kind: Asset['kind']): string {
  switch (kind) {
    case 'image':
      return 'image';
    case 'pdf':
      return 'picture_as_pdf';
    case 'office':
      return 'description';
    case 'tableau':
      return 'table_chart';
    case 'powerbi':
      return 'query_stats';
    case 'audio':
      return 'graphic_eq';
  }
}
