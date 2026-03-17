import { notify } from '@/components/ui/notification';

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
  const selectedAssetIds = useMediaUiStore(mediaUiSelectors.selectedAssetIds);
  const { clearSelection, closeAssetDetail } = useMediaUiActions();
  const selectedCount = selectedAssetIds.length;
  const singleSelectedAssetId =
    selectedCount === 1
      ? selectedAssetIds[0]
      : null;
  const detailAssetId =
    selectedCount === 1 && activeAssetId && selectedAssetIds.includes(activeAssetId)
      ? activeAssetId
      : singleSelectedAssetId;
  const assetQuery = useAssetQuery(detailAssetId ?? '');
  const usageQuery = useUsageQuery(detailAssetId ?? '');
  const mutations = useAssetMutations();

  const onSave = async (values: AssetEditableMetadata) => {
    if (!detailAssetId) return;

    try {
      await mutations.updateAsset.mutateAsync({ id: detailAssetId, patch: values });
      notify.success('Asset metadata saved.');
    } catch (error) {
      notify.error(error instanceof Error ? error.message : 'Failed to save metadata.');
    }
  };

  const onSaveBulk = async (values: Partial<AssetEditableMetadata>) => {
    if (selectedAssetIds.length <= 1) return;

    try {
      await mutations.bulkUpdateAssets.mutateAsync({
        ids: selectedAssetIds,
        ops: { metadataPatch: values }
      });
      notify.success('Bulk metadata updated.');
    } catch (error) {
      notify.error(error instanceof Error ? error.message : 'Failed to apply bulk metadata.');
    }
  };

  const onCloseInspector = () => {
    clearSelection();
    closeAssetDetail();
  };

  return (
    <AssetDetailSheet
      asset={selectedCount === 1 ? assetQuery.data ?? null : null}
      onClose={onCloseInspector}
      onSave={onSave}
      onSaveBulk={onSaveBulk}
      selectedCount={selectedCount}
      saving={mutations.updateAsset.isPending || mutations.bulkUpdateAssets.isPending}
      usage={selectedCount === 1 ? usageQuery.data ?? null : null}
    />
  );
}
