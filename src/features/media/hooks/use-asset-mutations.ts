import {
  useMutation,
  useQueryClient,
  type QueryKey,
  type UseMutationResult
} from '@tanstack/react-query';

import type { Asset, FolderNode, ListAssetsResult } from '@/features/media/domain/media.types';
import type { AssetEditableMetadataPatch } from '@/features/media/domain/media.schemas';
import { mediaQueryKeys } from '@/features/media/hooks/media-query-keys';
import { getMediaService } from '@/features/media/services/media-service-provider';
import type { BulkAssetOps, DeleteFolderStrategy } from '@/features/media/services/media-service';

type UpdateAssetVars = { id: string; patch: AssetEditableMetadataPatch };
type BulkUpdateAssetsVars = { ids: string[]; ops: BulkAssetOps };
type MoveAssetsVars = { assetIds: string[]; folderId: string | null };
type CreateFolderVars = { parentId: string | null; name: string };
type RenameFolderVars = { id: string; name: string };
type MoveFolderVars = { id: string; newParentId: string | null };
type DeleteFolderVars = { id: string; strategy: DeleteFolderStrategy };

type UpdateOptimisticContext = {
  previousAsset?: Asset;
  previousAssetLists: Array<[QueryKey, ListAssetsResult | undefined]>;
  previousAssetsById?: Record<string, Asset | undefined>;
};

export type UseAssetMutationsResult = {
  updateAsset: UseMutationResult<Asset, Error, UpdateAssetVars, UpdateOptimisticContext>;
  bulkUpdateAssets: UseMutationResult<Asset[], Error, BulkUpdateAssetsVars, UpdateOptimisticContext>;
  moveAssets: UseMutationResult<Asset[], Error, MoveAssetsVars, unknown>;
  createFolder: UseMutationResult<FolderNode, Error, CreateFolderVars, unknown>;
  renameFolder: UseMutationResult<FolderNode, Error, RenameFolderVars, unknown>;
  moveFolder: UseMutationResult<FolderNode, Error, MoveFolderVars, unknown>;
  deleteFolder: UseMutationResult<void, Error, DeleteFolderVars, unknown>;
};

/**
 * Media mutations backed by MediaService with cache updates.
 */
export function useAssetMutations(): UseAssetMutationsResult {
  const mediaService = getMediaService();
  const queryClient = useQueryClient();

  const updateAsset = useMutation<Asset, Error, UpdateAssetVars, UpdateOptimisticContext>({
    mutationFn: ({ id, patch }) => mediaService.updateAsset(id, patch),
    onMutate: async ({ id, patch }) => {
      await queryClient.cancelQueries({ queryKey: mediaQueryKeys.asset(id) });
      await queryClient.cancelQueries({ queryKey: mediaQueryKeys.assetsRoot });

      const previousAsset = queryClient.getQueryData<Asset>(mediaQueryKeys.asset(id));
      const previousAssetLists = queryClient.getQueriesData<ListAssetsResult>({
        queryKey: mediaQueryKeys.assetsRoot
      });

      if (previousAsset) {
        queryClient.setQueryData<Asset>(mediaQueryKeys.asset(id), {
          ...previousAsset,
          ...patch
        });
      }

      queryClient.setQueriesData<ListAssetsResult>({ queryKey: mediaQueryKeys.assetsRoot }, (old) => {
        if (!old) return old;
        return {
          ...old,
          items: old.items.map((item) => (item.id === id ? ({ ...item, ...patch } as Asset) : item))
        };
      });

      return { previousAsset, previousAssetLists };
    },
    onError: (_error, vars, context) => {
      if (!context) return;
      if (context.previousAsset) {
        queryClient.setQueryData<Asset>(mediaQueryKeys.asset(vars.id), context.previousAsset);
      }
      for (const [key, value] of context.previousAssetLists) {
        queryClient.setQueryData(key, value);
      }
    },
    onSettled: (_data, _error, vars) => {
      void queryClient.invalidateQueries({ queryKey: mediaQueryKeys.asset(vars.id) });
      void queryClient.invalidateQueries({ queryKey: mediaQueryKeys.assetsRoot });
    }
  });

  const bulkUpdateAssets = useMutation<Asset[], Error, BulkUpdateAssetsVars, UpdateOptimisticContext>({
    mutationFn: ({ ids, ops }) => mediaService.bulkUpdateAssets(ids, ops),
    onMutate: async ({ ids, ops }) => {
      await queryClient.cancelQueries({ queryKey: mediaQueryKeys.assetsRoot });
      for (const id of ids) {
        await queryClient.cancelQueries({ queryKey: mediaQueryKeys.asset(id) });
      }

      const previousAssetLists = queryClient.getQueriesData<ListAssetsResult>({
        queryKey: mediaQueryKeys.assetsRoot
      });
      const previousAssetsById: Record<string, Asset | undefined> = {};
      for (const id of ids) {
        previousAssetsById[id] = queryClient.getQueryData<Asset>(mediaQueryKeys.asset(id));
      }

      queryClient.setQueriesData<ListAssetsResult>({ queryKey: mediaQueryKeys.assetsRoot }, (old) => {
        if (!old) return old;
        return {
          ...old,
          items: old.items.map((item) => (ids.includes(item.id) ? applyBulkOpsOptimistic(item, ops) : item))
        };
      });

      for (const id of ids) {
        const cachedAsset = previousAssetsById[id];
        if (!cachedAsset) continue;
        queryClient.setQueryData<Asset>(mediaQueryKeys.asset(id), applyBulkOpsOptimistic(cachedAsset, ops));
      }

      return { previousAssetLists, previousAssetsById };
    },
    onError: (_error, vars, context) => {
      if (!context) return;
      for (const [key, value] of context.previousAssetLists) {
        queryClient.setQueryData(key, value);
      }
      if (context.previousAssetsById) {
        for (const id of vars.ids) {
          queryClient.setQueryData(mediaQueryKeys.asset(id), context.previousAssetsById[id]);
        }
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: mediaQueryKeys.assetsRoot });
      void queryClient.invalidateQueries({ queryKey: mediaQueryKeys.assetRoot });
    }
  });

  const moveAssets = useMutation<Asset[], Error, MoveAssetsVars>({
    mutationFn: ({ assetIds, folderId }) => mediaService.moveAssets(assetIds, folderId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: mediaQueryKeys.assetsRoot });
      void queryClient.invalidateQueries({ queryKey: mediaQueryKeys.folders });
    }
  });

  const createFolder = useMutation({
    mutationFn: ({ parentId, name }: CreateFolderVars) => mediaService.createFolder(parentId, name),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: mediaQueryKeys.folders });
    }
  });

  const renameFolder = useMutation({
    mutationFn: ({ id, name }: RenameFolderVars) => mediaService.renameFolder(id, name),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: mediaQueryKeys.folders });
    }
  });

  const moveFolder = useMutation({
    mutationFn: ({ id, newParentId }: MoveFolderVars) => mediaService.moveFolder(id, newParentId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: mediaQueryKeys.folders });
      void queryClient.invalidateQueries({ queryKey: mediaQueryKeys.assetsRoot });
    }
  });

  const deleteFolder = useMutation({
    mutationFn: ({ id, strategy }: DeleteFolderVars) => mediaService.deleteFolder(id, strategy),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: mediaQueryKeys.folders });
      void queryClient.invalidateQueries({ queryKey: mediaQueryKeys.assetsRoot });
    }
  });

  return {
    updateAsset,
    bulkUpdateAssets,
    moveAssets,
    createFolder,
    renameFolder,
    moveFolder,
    deleteFolder
  };
}

function applyBulkOpsOptimistic(asset: Asset, ops: BulkAssetOps): Asset {
  const tags = new Set(asset.tags);
  ops.addTags?.forEach((tag) => tags.add(tag));
  ops.removeTags?.forEach((tag) => tags.delete(tag));

  return {
    ...asset,
    ...(ops.metadataPatch ?? {}),
    ...(ops.setDomain ? { domain: ops.setDomain } : {}),
    ...(ops.setFolderId !== undefined ? { folderId: ops.setFolderId } : {}),
    tags: [...tags]
  };
}
