import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import type { Asset, ListAssetsQuery, ListAssetsResult } from '@/features/media/domain/media.types';
import { mediaQueryKeys } from '@/features/media/hooks/media-query-keys';
import { getMediaService } from '@/features/media/services/media-service-provider';

const ASSETS_STALE_TIME_MS = 60_000;

/**
 * Queries a paginated asset list from the active media service.
 */
export function useAssetsQuery(query: ListAssetsQuery): UseQueryResult<ListAssetsResult, Error> {
  const mediaService = getMediaService();

  return useQuery<ListAssetsResult, Error>({
    queryKey: mediaQueryKeys.assets(query),
    queryFn: () => mediaService.listAssets(query),
    staleTime: ASSETS_STALE_TIME_MS
  });
}

/**
 * Queries a single asset by id from the active media service.
 */
export function useAssetQuery(id: string): UseQueryResult<Asset, Error> {
  const mediaService = getMediaService();

  return useQuery<Asset, Error>({
    queryKey: mediaQueryKeys.asset(id),
    queryFn: () => mediaService.getAsset(id),
    enabled: id.length > 0,
    staleTime: ASSETS_STALE_TIME_MS
  });
}
