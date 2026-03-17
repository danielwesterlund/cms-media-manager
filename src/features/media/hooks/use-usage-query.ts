import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import type { UsageSummary } from '@/features/media/domain/media.types';
import { mediaQueryKeys } from '@/features/media/hooks/media-query-keys';
import { getMediaService } from '@/features/media/services/media-service-provider';

const USAGE_STALE_TIME_MS = 30_000;

/**
 * Queries usage summary for a single asset from the active media service.
 */
export function useUsageQuery(assetId: string): UseQueryResult<UsageSummary, Error> {
  const mediaService = getMediaService();

  return useQuery<UsageSummary, Error>({
    queryKey: mediaQueryKeys.usage(assetId),
    queryFn: () => mediaService.getUsageSummary(assetId),
    enabled: assetId.length > 0,
    staleTime: USAGE_STALE_TIME_MS
  });
}
