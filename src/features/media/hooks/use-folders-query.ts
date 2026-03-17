import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import type { FolderNode } from '@/features/media/domain/media.types';
import { mediaQueryKeys } from '@/features/media/hooks/media-query-keys';
import { getMediaService } from '@/features/media/services/media-service-provider';

const FOLDERS_STALE_TIME_MS = 120_000;

/**
 * Queries the media folder tree from the active media service.
 */
export function useFoldersQuery(): UseQueryResult<FolderNode[], Error> {
  const mediaService = getMediaService();

  return useQuery<FolderNode[], Error>({
    queryKey: mediaQueryKeys.folders,
    queryFn: () => mediaService.listFolders(),
    staleTime: FOLDERS_STALE_TIME_MS
  });
}
