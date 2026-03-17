import type { Asset, FolderNode, ListAssetsQuery, ListAssetsResult, UploadJob, UsageSummary } from '@/features/media/domain/media.types';
import type { AssetEditableMetadataPatch } from '@/features/media/domain/media.schemas';
import { COMPONENTS, DOMAINS, TECHNOLOGY_AREAS, TOPICS } from '@/features/media/domain/media.constants';
import type { BulkAssetOps, DeleteFolderStrategy, MediaService } from '@/features/media/services/media-service';
import { buildFolderTree, createMockMediaDataset, type FolderRecord } from '@/features/media/services/mock/mock-data';

type MutableState = ReturnType<typeof createMockMediaDataset>;

/**
 * In-memory deterministic MediaService mock for UI development.
 */
export class MockMediaService implements MediaService {
  private state: MutableState;
  private uploadSeq = 1;
  private folderSeq = 1;

  constructor(seedState?: MutableState) {
    this.state = seedState ?? createMockMediaDataset();
  }

  /** Lists media assets with basic search/filter/sort/pagination. */
  async listAssets(query: ListAssetsQuery): Promise<ListAssetsResult> {
    const filtered = this.applyQuery(this.state.assets, query);
    const page = Math.max(1, query.pagination.page);
    const pageSize = Math.max(1, query.pagination.pageSize);
    const totalItems = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const offset = (page - 1) * pageSize;

    return {
      items: filtered.slice(offset, offset + pageSize),
      totalItems,
      page,
      pageSize,
      totalPages
    };
  }

  /** Fetches a single asset by id. */
  async getAsset(id: string): Promise<Asset> {
    return this.requireAsset(id);
  }

  /** Applies editable metadata patch to an asset. */
  async updateAsset(id: string, patch: AssetEditableMetadataPatch): Promise<Asset> {
    const asset = this.requireAsset(id);
    const updated = { ...asset, ...patch, updatedAt: new Date().toISOString() } as Asset;
    this.replaceAsset(updated);
    return updated;
  }

  /** Applies bulk operations across selected assets. */
  async bulkUpdateAssets(ids: string[], ops: BulkAssetOps): Promise<Asset[]> {
    const out: Asset[] = [];
    for (const id of ids) {
      const asset = this.requireAsset(id);
      const tags = this.applyTagOps(asset.tags, ops.addTags, ops.removeTags);
      const next: Asset = {
        ...asset,
        ...(ops.metadataPatch ?? {}),
        ...(ops.setDomain ? { domain: ops.setDomain } : {}),
        ...(ops.setFolderId !== undefined ? { folderId: ops.setFolderId } : {}),
        tags,
        updatedAt: new Date().toISOString()
      };
      this.replaceAsset(next);
      out.push(next);
    }
    return out;
  }

  /** Lists folder tree with computed asset counts. */
  async listFolders(): Promise<FolderNode[]> {
    return buildFolderTree(this.state.folderRecords, this.state.assets);
  }

  /** Creates folder under parent while enforcing sibling-name uniqueness. */
  async createFolder(parentId: string | null, name: string): Promise<FolderNode> {
    const normalized = this.normalizeFolderName(name);
    if (!normalized) throw new Error('Folder name is required.');
    if (parentId && !this.hasFolder(parentId)) throw new Error('Parent folder not found.');
    this.assertUniqueFolderName(parentId, normalized);

    this.folderSeq += 1;
    const newRecord: FolderRecord = {
      id: `fld_dyn_${String(this.folderSeq).padStart(4, '0')}`,
      name: normalized,
      parentId
    };
    this.state.folderRecords.push(newRecord);
    return this.findFolderNode(newRecord.id);
  }

  /** Renames folder and enforces sibling-name uniqueness. */
  async renameFolder(id: string, name: string): Promise<FolderNode> {
    const folder = this.requireFolder(id);
    const normalized = this.normalizeFolderName(name);
    if (!normalized) throw new Error('Folder name is required.');
    this.assertUniqueFolderName(folder.parentId, normalized, id);
    folder.name = normalized;
    return this.findFolderNode(id);
  }

  /** Moves folder under another folder/root and prevents cycles. */
  async moveFolder(id: string, newParentId: string | null): Promise<FolderNode> {
    const folder = this.requireFolder(id);
    if (newParentId === id) throw new Error('Cannot move a folder into itself.');
    if (newParentId && !this.hasFolder(newParentId)) throw new Error('Destination folder not found.');
    if (newParentId && this.getDescendantFolderIds(id).has(newParentId)) {
      throw new Error('Cannot move a folder into its descendant.');
    }
    this.assertUniqueFolderName(newParentId, folder.name, id);
    folder.parentId = newParentId;
    return this.findFolderNode(id);
  }

  /** Deletes folder subtree; blocks when content exists unless move target is provided. */
  async deleteFolder(id: string, strategy: DeleteFolderStrategy): Promise<void> {
    this.requireFolder(id);
    const subtree = this.getDescendantFolderIds(id);
    subtree.add(id);
    const assetsInSubtree = this.state.assets.filter((asset) => asset.folderId && subtree.has(asset.folderId));

    if (assetsInSubtree.length > 0 && strategy.moveContentsToFolderId === undefined) {
      throw new Error('Folder has content. Provide moveContentsToFolderId to move assets before delete.');
    }

    if (strategy.moveContentsToFolderId !== undefined) {
      const destination = strategy.moveContentsToFolderId;
      if (destination !== null && !this.hasFolder(destination)) throw new Error('moveContentsToFolderId does not exist.');
      if (destination && subtree.has(destination)) throw new Error('moveContentsToFolderId cannot be inside the deleted subtree.');
      for (const asset of assetsInSubtree) {
        this.replaceAsset({ ...asset, folderId: destination, updatedAt: new Date().toISOString() });
      }
    }

    this.state.folderRecords = this.state.folderRecords.filter((folder) => !subtree.has(folder.id));
  }

  /** Moves assets to target folder/root. Copy behavior is intentionally not supported. */
  async moveAssets(assetIds: string[], folderId: string | null): Promise<Asset[]> {
    if (folderId && !this.hasFolder(folderId)) throw new Error('Destination folder not found.');
    return assetIds.map((id) => {
      const asset = this.requireAsset(id);
      const next = { ...asset, folderId, updatedAt: new Date().toISOString() };
      this.replaceAsset(next);
      return next;
    });
  }

  /** Returns usage summary if available, else zero counts. */
  async getUsageSummary(assetId: string): Promise<UsageSummary> {
    this.requireAsset(assetId);
    return this.state.usageByAssetId[assetId] ?? {
      assetId,
      placements: { draft: 0, published: 0, total: 0 },
      projects: { draft: 0, published: 0, total: 0 },
      campaigns: { draft: 0, published: 0, total: 0 },
      collectionTypes: {},
      total: { draft: 0, published: 0, total: 0 }
    };
  }

  /** Creates deterministic upload jobs and tracks them in memory. */
  async startUpload(files: File[], targetFolderId: string | null): Promise<UploadJob[]> {
    if (targetFolderId && !this.hasFolder(targetFolderId)) throw new Error('Upload target folder not found.');

    const jobs = files.map((file) => {
      const index = this.uploadSeq++;
      const asset = this.createUploadedAsset(file, targetFolderId, index);
      this.state.assets.unshift(asset);
      return {
        id: `upl_${String(index).padStart(5, '0')}`,
        fileName: file.name,
        fileSizeBytes: file.size,
        targetFolderId,
        assetId: asset.id,
        status: 'queued',
        progressPercent: 0,
        startedAt: new Date(Date.UTC(2026, 0, 1, 0, 0, index)).toISOString()
      } satisfies UploadJob;
    });

    this.state.uploadJobs.push(...jobs);
    return jobs;
  }

  private createUploadedAsset(file: File, folderId: string | null, index: number): Asset {
    const id = `ast_upl_${String(index).padStart(5, '0')}`;
    const now = new Date(Date.UTC(2026, 0, 1, 0, 0, index)).toISOString();
    const ext = file.name.includes('.') ? file.name.split('.').pop()?.toLowerCase() ?? '' : '';
    const kind = inferKind(file.type, ext);
    const base = {
      id,
      kind,
      fileName: file.name,
      mimeType: file.type || fallbackMimeType(kind),
      fileSizeBytes: file.size,
      folderId,
      status: 'draft' as const,
      title: file.name.replace(/\.[^.]+$/, ''),
      createdAt: now,
      updatedAt: now,
      createdBy: 'upload.bot',
      license: 'Internal',
      domain: DOMAINS[1],
      topics: [TOPICS[1]],
      tags: ['uploaded'],
      technologyArea: [TECHNOLOGY_AREAS[0]],
      component: [COMPONENTS[0]]
    };

    if (kind === 'image') {
      return { ...base, kind, width: 1280, height: 720, thumbnailUrl: `https://example.test/thumbs/upload-${index}.jpg` };
    }
    if (kind === 'pdf') {
      return { ...base, kind, pageCount: 1 };
    }
    if (kind === 'office') {
      return { ...base, kind, officeType: 'other' };
    }
    if (kind === 'audio') {
      return { ...base, kind, durationSeconds: 60, codec: 'mp3' };
    }
    if (kind === 'tableau') {
      return { ...base, kind, workbookName: 'Uploaded Workbook' };
    }
    return { ...base, kind: 'powerbi', workspaceId: 'upload', reportId: id };
  }

  private applyQuery(assets: Asset[], query: ListAssetsQuery): Asset[] {
    const folderSet = query.filters?.folderId ? this.folderWithDescendants(query.filters.folderId) : null;

    let list = assets.filter((asset) => {
      if (query.searchText) {
        const q = query.searchText.toLowerCase().trim();
        const haystack = `${asset.title} ${asset.fileName} ${asset.domain} ${asset.tags.join(' ')} ${asset.topics.join(' ')}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      const f = query.filters;
      if (!f) return true;
      if (folderSet && (!asset.folderId || !folderSet.has(asset.folderId))) return false;
      if (f.kinds && !f.kinds.includes(asset.kind)) return false;
      if (f.statuses && !f.statuses.includes(asset.status)) return false;
      if (f.domains && !f.domains.includes(asset.domain)) return false;
      if (f.licenseValues && !f.licenseValues.includes(asset.license)) return false;
      if (f.hasLegacy === true && !asset.legacySystem) return false;
      if (f.hasLegacy === false && asset.legacySystem) return false;
      if (f.legacySystems && (!asset.legacySystem || !f.legacySystems.includes(asset.legacySystem))) return false;
      if (f.createdBy && !f.createdBy.includes(asset.createdBy)) return false;
      if (f.topics && !f.topics.some((t) => asset.topics.includes(t))) return false;
      if (f.tags && !f.tags.some((t) => asset.tags.includes(t))) return false;
      if (f.technologyAreas && !f.technologyAreas.some((t) => asset.technologyArea.includes(t))) return false;
      if (f.components && !f.components.some((c) => asset.component.includes(c))) return false;
      if (f.createdAfter && asset.createdAt < f.createdAfter) return false;
      if (f.createdBefore && asset.createdAt > f.createdBefore) return false;
      return true;
    });

    if (query.sort) {
      const { field, direction } = query.sort;
      list = [...list].sort((a, b) => {
        const av = a[field];
        const bv = b[field];
        if (av === bv) return 0;
        const cmp = av > bv ? 1 : -1;
        return direction === 'asc' ? cmp : -cmp;
      });
    }

    return list;
  }

  private applyTagOps(current: string[], addTags?: string[], removeTags?: string[]): string[] {
    const set = new Set(current);
    addTags?.forEach((tag) => set.add(tag));
    removeTags?.forEach((tag) => set.delete(tag));
    return [...set];
  }

  private folderWithDescendants(folderId: string): Set<string> {
    const ids = this.getDescendantFolderIds(folderId);
    ids.add(folderId);
    return ids;
  }

  private getDescendantFolderIds(folderId: string): Set<string> {
    const out = new Set<string>();
    const queue = [folderId];
    while (queue.length) {
      const current = queue.shift();
      if (!current) continue;
      const children = this.state.folderRecords.filter((folder) => folder.parentId === current);
      for (const child of children) {
        if (!out.has(child.id)) {
          out.add(child.id);
          queue.push(child.id);
        }
      }
    }
    return out;
  }

  private hasFolder(id: string): boolean {
    return this.state.folderRecords.some((folder) => folder.id === id);
  }

  private requireFolder(id: string): FolderRecord {
    const folder = this.state.folderRecords.find((f) => f.id === id);
    if (!folder) throw new Error(`Folder not found: ${id}`);
    return folder;
  }

  private requireAsset(id: string): Asset {
    const asset = this.state.assets.find((a) => a.id === id);
    if (!asset) throw new Error(`Asset not found: ${id}`);
    return asset;
  }

  private replaceAsset(next: Asset): void {
    this.state.assets = this.state.assets.map((asset) => (asset.id === next.id ? next : asset));
  }

  private findFolderNode(id: string): FolderNode {
    const stack = [...buildFolderTree(this.state.folderRecords, this.state.assets)];
    while (stack.length) {
      const current = stack.shift();
      if (!current) continue;
      if (current.id === id) return current;
      stack.push(...current.children);
    }
    throw new Error(`Folder not found: ${id}`);
  }

  private normalizeFolderName(name: string): string {
    return name.trim().replace(/\s+/g, ' ');
  }

  private assertUniqueFolderName(parentId: string | null, name: string, excludeId?: string): void {
    const lower = name.toLowerCase();
    const duplicate = this.state.folderRecords.some((folder) => {
      if (excludeId && folder.id === excludeId) return false;
      return folder.parentId === parentId && folder.name.toLowerCase() === lower;
    });
    if (duplicate) throw new Error(`Folder "${name}" already exists in this location.`);
  }
}

function inferKind(mimeType: string, extension: string): Asset['kind'] {
  if (mimeType.startsWith('image/') || ['png', 'jpg', 'jpeg', 'webp', 'gif'].includes(extension)) return 'image';
  if (mimeType === 'application/pdf' || extension === 'pdf') return 'pdf';
  if (mimeType.startsWith('audio/') || ['mp3', 'wav', 'm4a'].includes(extension)) return 'audio';
  if (extension === 'twb') return 'tableau';
  if (extension === 'pbix') return 'powerbi';
  return 'office';
}

function fallbackMimeType(kind: Asset['kind']): string {
  if (kind === 'image') return 'image/jpeg';
  if (kind === 'pdf') return 'application/pdf';
  if (kind === 'audio') return 'audio/mpeg';
  if (kind === 'tableau') return 'application/tableau';
  if (kind === 'powerbi') return 'application/powerbi';
  return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
}
