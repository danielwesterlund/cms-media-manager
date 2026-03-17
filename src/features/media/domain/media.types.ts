import type { ComponentTag, Domain, LegacySystem, TechnologyArea, Topic } from '@/features/media/domain/media.constants';

/**
 * Supported asset kinds for the media library.
 */
export type AssetKind = 'image' | 'pdf' | 'office' | 'tableau' | 'powerbi' | 'audio';

/**
 * Common lifecycle states for a media asset.
 */
export type AssetStatus = 'draft' | 'published' | 'archived';

/**
 * ISO timestamp string.
 */
export type ISODateString = string;

/**
 * Shared fields for all asset variants.
 */
export type AssetBase = {
  id: string;
  kind: AssetKind;
  fileName: string;
  mimeType: string;
  fileSizeBytes: number;
  folderId: string | null;
  status: AssetStatus;
  title: string;
  createdAt: ISODateString;
  updatedAt: ISODateString;
  createdBy: string;
  creditsSource?: string;
  license: string;
  domain: Domain;
  topics: Topic[];
  tags: string[];
  technologyArea: TechnologyArea[];
  component: ComponentTag[];
  legacySystem?: LegacySystem;
  legacyUrl?: string;
  thumbnailUrl?: string;
};

/**
 * Image asset model.
 */
export type ImageAsset = AssetBase & {
  kind: 'image';
  width: number;
  height: number;
};

/**
 * PDF asset model.
 */
export type PdfAsset = AssetBase & {
  kind: 'pdf';
  pageCount?: number;
};

/**
 * Office document model (Word, Excel, PowerPoint, etc).
 */
export type OfficeAsset = AssetBase & {
  kind: 'office';
  officeType: 'word' | 'excel' | 'powerpoint' | 'other';
};

/**
 * Tableau asset model.
 */
export type TableauAsset = AssetBase & {
  kind: 'tableau';
  workbookName?: string;
  sheetName?: string;
  externalUrl?: string;
};

/**
 * Power BI asset model.
 */
export type PowerBiAsset = AssetBase & {
  kind: 'powerbi';
  workspaceId?: string;
  reportId?: string;
  externalUrl?: string;
};

/**
 * Audio asset model.
 */
export type AudioAsset = AssetBase & {
  kind: 'audio';
  durationSeconds?: number;
  codec?: string;
};

/**
 * Media asset union.
 */
export type Asset = ImageAsset | PdfAsset | OfficeAsset | TableauAsset | PowerBiAsset | AudioAsset;

/**
 * Folder tree node used by the media explorer.
 */
export type FolderNode = {
  id: string;
  name: string;
  parentId: string | null;
  children: FolderNode[];
  assetCount: number;
};

/**
 * Usage counts for where an asset is referenced.
 */
export type UsageCounts = {
  draft: number;
  published: number;
  total: number;
};

/**
 * Usage summary for an asset across content placements.
 */
export type UsageSummary = {
  assetId: string;
  placements: UsageCounts;
  projects: UsageCounts;
  campaigns: UsageCounts;
  collectionTypes?: Partial<Record<ComponentTag, UsageCounts>>;
  total: UsageCounts;
};

/**
 * Filter state for listAssets queries.
 */
export type AssetQueryFilters = {
  folderId?: string | null;
  kinds?: AssetKind[];
  statuses?: AssetStatus[];
  domains?: Domain[];
  topics?: Topic[];
  licenseValues?: string[];
  tags?: string[];
  technologyAreas?: TechnologyArea[];
  components?: ComponentTag[];
  hasLegacy?: boolean;
  legacySystems?: LegacySystem[];
  createdBy?: string[];
  createdAfter?: ISODateString;
  createdBefore?: ISODateString;
};

/**
 * Sort direction options.
 */
export type SortDirection = 'asc' | 'desc';

/**
 * Allowed listAssets sort fields.
 */
export type AssetSortField = 'createdAt' | 'updatedAt' | 'title' | 'fileSizeBytes' | 'fileName';

/**
 * Sort model for listAssets.
 */
export type AssetSort = {
  field: AssetSortField;
  direction: SortDirection;
};

/**
 * Pagination model for listAssets.
 */
export type Pagination = {
  page: number;
  pageSize: number;
};

/**
 * Query model for listAssets.
 */
export type ListAssetsQuery = {
  searchText?: string;
  filters?: AssetQueryFilters;
  sort?: AssetSort;
  pagination: Pagination;
};

/**
 * Paginated listAssets response.
 */
export type ListAssetsResult = {
  items: Asset[];
  totalItems: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

/**
 * Upload job status values.
 */
export type UploadJobStatus = 'queued' | 'uploading' | 'processing' | 'completed' | 'failed' | 'canceled';

/**
 * Upload error details shown in the upload tray.
 */
export type UploadError = {
  code:
    | 'file-too-large'
    | 'unsupported-type'
    | 'network-error'
    | 'permission-denied'
    | 'validation-error'
    | 'unknown';
  message: string;
  retryable: boolean;
  details?: string;
};

/**
 * Upload job model tracked by the upload tray.
 */
export type UploadJob = {
  id: string;
  fileName: string;
  fileSizeBytes: number;
  targetFolderId: string | null;
  status: UploadJobStatus;
  progressPercent: number;
  startedAt: ISODateString;
  completedAt?: ISODateString;
  assetId?: string;
  error?: UploadError;
};
