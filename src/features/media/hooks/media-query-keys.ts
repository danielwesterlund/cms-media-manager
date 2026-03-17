import type { ListAssetsQuery } from '@/features/media/domain/media.types';

export const mediaQueryKeys = {
  all: ['media'] as const,
  assetsRoot: ['media', 'assets'] as const,
  assetRoot: ['media', 'asset'] as const,
  folders: ['media', 'folders'] as const,
  usageRoot: ['media', 'usage'] as const,
  assets: (query: ListAssetsQuery) => ['media', 'assets', { query }] as const,
  asset: (id: string) => ['media', 'asset', id] as const,
  usage: (assetId: string) => ['media', 'usage', assetId] as const
};
