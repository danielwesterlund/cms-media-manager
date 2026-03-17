import { useState } from 'react';

import type { Asset } from '@/features/media/domain/media.types';
import { MediaAssetIcon } from '@/features/media/components/media-asset-icon';
import { cn } from '@/lib/cn';

type MediaAssetThumbnailProps = {
  asset: Asset;
  className?: string;
};

/**
 * Renders an asset thumbnail image when available with icon fallback.
 */
export function MediaAssetThumbnail({ asset, className }: MediaAssetThumbnailProps) {
  const [failed, setFailed] = useState(false);
  const hasImage = asset.kind === 'image' && Boolean(asset.thumbnailUrl) && !failed;

  if (hasImage) {
    return (
      <img
        alt=""
        aria-hidden="true"
        className={cn('h-full w-full object-cover', className)}
        onError={() => setFailed(true)}
        src={asset.thumbnailUrl}
      />
    );
  }

  return <MediaAssetIcon asset={asset} className={className} />;
}
