import type {
  Asset,
  FolderNode,
  ListAssetsQuery,
  ListAssetsResult,
  UploadJob,
  UsageSummary
} from '@/features/media/domain/media.types';
import type { Domain } from '@/features/media/domain/media.constants';
import type { AssetEditableMetadataPatch } from '@/features/media/domain/media.schemas';

/**
 * Bulk operation payload for multi-asset updates.
 */
export type BulkAssetOps = {
  metadataPatch?: AssetEditableMetadataPatch;
  addTags?: string[];
  removeTags?: string[];
  setDomain?: Domain;
  setFolderId?: string | null;
};

/**
 * Folder deletion behavior options.
 */
export type DeleteFolderStrategy = {
  moveContentsToFolderId?: string | null;
};

/**
 * UI-side media service contract.
 */
export interface MediaService {
  /**
   * Lists media assets with search, filter, sort, and pagination.
   */
  listAssets(query: ListAssetsQuery): Promise<ListAssetsResult>;

  /**
   * Fetches a single asset by ID.
   */
  getAsset(id: string): Promise<Asset>;

  /**
   * Applies a metadata patch to a single asset.
   */
  updateAsset(id: string, patch: AssetEditableMetadataPatch): Promise<Asset>;

  /**
   * Applies bulk operations across multiple assets.
   */
  bulkUpdateAssets(ids: string[], ops: BulkAssetOps): Promise<Asset[]>;

  /**
   * Lists the folder tree.
   */
  listFolders(): Promise<FolderNode[]>;

  /**
   * Creates a folder under a parent folder or root.
   */
  createFolder(parentId: string | null, name: string): Promise<FolderNode>;

  /**
   * Renames an existing folder.
   */
  renameFolder(id: string, name: string): Promise<FolderNode>;

  /**
   * Moves a folder under a new parent folder or root.
   */
  moveFolder(id: string, newParentId: string | null): Promise<FolderNode>;

  /**
   * Deletes a folder using a chosen asset-handling strategy.
   */
  deleteFolder(id: string, strategy: DeleteFolderStrategy): Promise<void>;

  /**
   * Moves assets into a destination folder or root.
   */
  moveAssets(assetIds: string[], folderId: string | null): Promise<Asset[]>;

  /**
   * Returns usage counts for a single asset.
   */
  getUsageSummary(assetId: string): Promise<UsageSummary>;

  /**
   * Starts uploads and returns tracked upload jobs.
   */
  startUpload(files: File[], targetFolderId: string | null): Promise<UploadJob[]>;
}
