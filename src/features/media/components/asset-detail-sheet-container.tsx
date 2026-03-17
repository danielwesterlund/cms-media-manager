import { toast } from 'sonner';

import type { AssetEditableMetadata } from '@/features/media/domain/media.schemas';
import { AssetDetailSheet } from '@/features/media/components/asset-detail-sheet';
import { useAssetMutations } from '@/features/media/hooks/use-asset-mutations';
import { useAssetQuery } from '@/features/media/hooks/use-assets-query';
import { useUsageQuery } from '@/features/media/hooks/use-usage-query';
import { mediaUiSelectors, useMediaUiActions, useMediaUiStore } from '@/features/media/state/media-ui.store';

/**
 * Smart container for asset detail sheet data/mutations.
 */
export function AssetDetailSheetContainer() {
  const activeAssetId = useMediaUiStore(mediaUiSelectors.activeAssetId);
  const { closeAssetDetail } = useMediaUiActions();
  const assetQuery = useAssetQuery(activeAssetId ?? '');
  const usageQuery = useUsageQuery(activeAssetId ?? '');
  const mutations = useAssetMutations();

  const onSave = async (values: AssetEditableMetadata) => {
    if (!activeAssetId) return;

    try {
      await mutations.updateAsset.mutateAsync({ id: activeAssetId, patch: values });
      toast.success('Asset metadata saved.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save metadata.');
    }
  };

  return (
    <AssetDetailSheet
      asset={assetQuery.data ?? null}
      onClose={closeAssetDetail}
      onSave={onSave}
      saving={mutations.updateAsset.isPending}
      usage={usageQuery.data ?? null}
    />
  );
}
