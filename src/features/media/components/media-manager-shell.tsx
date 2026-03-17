import { useMemo, useRef, useState, type DragEvent } from 'react';

import { AssetDetailSheetContainer } from '@/features/media/components/asset-detail-sheet-container';
import { EmptyPlaceholder } from '@/features/media/components/empty-placeholder';
import { FilterPanel, emptyFilters, type FilterPanelOptions, type MediaFilterState } from '@/features/media/components/filter-panel';
import { FolderTreePanelContainer } from '@/features/media/components/folder-tree-panel-container';
import { MediaGrid } from '@/features/media/components/media-grid';
import { MediaList } from '@/features/media/components/media-list';
import { MediaToolbar, type ActiveFilterChip, type MediaSortValue } from '@/features/media/components/media-toolbar';
import { MediaPickerDialog } from '@/features/media/components/media-picker-dialog';
import { UploadTray } from '@/features/media/components/upload-tray';
import type { AssetKind, AssetSort } from '@/features/media/domain/media.types';
import { COMPONENTS, DOMAINS, LEGACY_SYSTEMS, TAG_SUGGESTIONS, TECHNOLOGY_AREAS, TOPICS } from '@/features/media/domain/media.constants';
import { useAssetsQuery } from '@/features/media/hooks/use-assets-query';
import { useUploadController } from '@/features/media/hooks/use-upload-controller';
import { mediaUiSelectors, useMediaUiActions, useMediaUiStore } from '@/features/media/state/media-ui.store';
import { mediaPanel } from '@/features/media/components/media-ui.variants';

const FILTER_OPTIONS: FilterPanelOptions = {
  fileTypes: ['image', 'pdf', 'office', 'tableau', 'powerbi', 'audio'],
  domains: [...DOMAINS],
  topics: [...TOPICS],
  licenses: ['Internal', 'CC-BY', 'CC-BY-SA', 'Royalty Free'],
  tags: [...TAG_SUGGESTIONS],
  technologyAreas: [...TECHNOLOGY_AREAS],
  components: [...COMPONENTS],
  legacySystems: [...LEGACY_SYSTEMS]
};

export function MediaManagerShell() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [searchText, setSearchText] = useState('');
  const [sortValue, setSortValue] = useState<MediaSortValue>('updatedAt-desc');
  const [filters, setFilters] = useState<MediaFilterState>(emptyFilters());
  const viewMode = useMediaUiStore(mediaUiSelectors.viewMode);
  const filterPanelOpen = useMediaUiStore(mediaUiSelectors.filterPanelOpen);
  const activeFolderId = useMediaUiStore(mediaUiSelectors.activeFolderId);
  const selectedAssetIds = useMediaUiStore(mediaUiSelectors.selectedAssetIds);
  const uploadJobs = useMediaUiStore(mediaUiSelectors.uploadTray);
  const isPickerOpen = useMediaUiStore(mediaUiSelectors.isPickerOpen);
  const pickerContext = useMediaUiStore(mediaUiSelectors.pickerContext);
  const attachmentsSelectionOrderedIds = useMediaUiStore(mediaUiSelectors.attachmentsSelectionOrderedIds);
  const actions = useMediaUiActions();
  const uploadController = useUploadController();

  const sort = useMemo(() => parseSort(sortValue), [sortValue]);
  const activeFilterChips = useMemo(() => buildFilterChips(filters), [filters]);

  const assetsQuery = useAssetsQuery({
    searchText,
    sort,
    filters: toAssetQueryFilters(filters, activeFolderId),
    pagination: { page: 1, pageSize: 200 }
  });

  const assets = assetsQuery.data?.items ?? [];

  const onFileSelection = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    await uploadController.startUpload(Array.from(files), null);
  };

  const onDragStartAsset = (assetId: string, event: DragEvent<HTMLElement>) => {
    const ids = selectedAssetIds.includes(assetId) ? selectedAssetIds : [assetId];
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('application/x-media-asset-ids', JSON.stringify(ids));
  };

  return (
    <section aria-label="Media manager" className="flex h-full min-h-0 flex-col gap-3">
      <header className="sticky top-0 z-20 bg-background pb-1">
        <MediaToolbar
          activeFilterChips={activeFilterChips}
          filterPanelOpen={filterPanelOpen}
          onBulkActionsClick={() => undefined}
          onClearAllFilters={() => setFilters(emptyFilters())}
          onRemoveFilterChip={(chipId) => setFilters((current) => removeChip(current, chipId))}
          onSearchChange={setSearchText}
          onSortChange={setSortValue}
          onToggleFilterPanel={() => actions.setFilterPanelOpen(!filterPanelOpen)}
          onToggleViewMode={actions.toggleViewMode}
          onUploadClick={() => fileInputRef.current?.click()}
          searchText={searchText}
          selectedCount={selectedAssetIds.length}
          sortValue={sortValue}
          viewMode={viewMode}
        />
        <input
          className="sr-only"
          multiple
          onChange={(event) => void onFileSelection(event.target.files)}
          ref={fileInputRef}
          type="file"
        />
      </header>

      <section
        aria-label="Media workspace"
        className="grid min-h-0 flex-1 gap-3 lg:grid-cols-[220px_minmax(0,1fr)_360px]"
      >
        <aside aria-label="Folder tree" className="min-h-0 overflow-auto">
          <FolderTreePanelContainer />
        </aside>

        <main aria-label="Assets" className="min-h-0 overflow-auto rounded-xl border border-border bg-card p-3">
          {assets.length === 0 && !assetsQuery.isLoading ? (
            <EmptyPlaceholder />
          ) : viewMode === 'grid' ? (
            <MediaGrid
              assets={assets}
              onDragStartAsset={onDragStartAsset}
              loading={assetsQuery.isLoading}
              onFilesDropped={(files) => void uploadController.startUpload(files, null)}
              onOpenDetail={actions.openAssetDetail}
              onToggleSelect={actions.toggleAsset}
              selectedAssetIds={selectedAssetIds}
            />
          ) : (
            <MediaList
              assets={assets}
              onDragStartAsset={onDragStartAsset}
              loading={assetsQuery.isLoading}
              onFilesDropped={(files) => void uploadController.startUpload(files, null)}
              onOpenDetail={actions.openAssetDetail}
              onToggleSelect={actions.toggleAsset}
              selectedAssetIds={selectedAssetIds}
            />
          )}

          {assets.length > 120 ? (
            <p className="mt-3 text-xs text-muted-foreground">Large list detected. Consider react-window virtualization.</p>
          ) : null}

          {uploadJobs.length > 0 ? (
            <section className="mt-4" aria-label="Upload tray">
              <UploadTray
                jobs={uploadJobs}
                onCancel={uploadController.cancelUpload}
                onCopyError={(jobId) => void uploadController.copyError(jobId)}
                onRemove={uploadController.removeUpload}
                onRetry={uploadController.retryUpload}
              />
            </section>
          ) : null}
        </main>

        <aside aria-label="Inspector" className="min-h-0 space-y-3 overflow-auto">
          {filterPanelOpen ? (
            <section className="relative">
              <button
                aria-label="Collapse filters"
                aria-expanded={filterPanelOpen}
                className="absolute right-2 top-2 z-10 inline-flex h-7 w-7 items-center justify-center rounded-md border border-input bg-background text-muted-foreground hover:bg-muted"
                onClick={() => actions.setFilterPanelOpen(false)}
                type="button"
              >
                <span aria-hidden="true" className="material-symbols-outlined text-sm">expand_less</span>
              </button>
              <FilterPanel onChange={setFilters} options={FILTER_OPTIONS} value={filters} />
            </section>
          ) : (
            <section className={mediaPanel()}>
              <div className="flex items-center justify-between px-3 py-2">
                <h2 className="text-sm font-semibold">Filters</h2>
                <button
                  aria-label="Expand filters"
                  aria-expanded={filterPanelOpen}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-input text-muted-foreground hover:bg-muted"
                  onClick={() => actions.setFilterPanelOpen(true)}
                  type="button"
                >
                  <span aria-hidden="true" className="material-symbols-outlined text-sm">expand_more</span>
                </button>
              </div>
            </section>
          )}

          <section>
            <AssetDetailSheetContainer />
          </section>
        </aside>
      </section>

      <MediaPickerDialog
        attachmentsSelectionOrderedIds={attachmentsSelectionOrderedIds}
        context={pickerContext}
        onChangeAttachmentsOrder={actions.setAttachmentsOrderedSelection}
        onOpenChange={(open) => {
          if (!open) actions.closePicker();
        }}
        open={isPickerOpen}
      />
    </section>
  );
}

function parseSort(value: MediaSortValue): AssetSort {
  if (value === 'updatedAt-asc') return { field: 'updatedAt', direction: 'asc' };
  if (value === 'createdAt-desc') return { field: 'createdAt', direction: 'desc' };
  if (value === 'createdAt-asc') return { field: 'createdAt', direction: 'asc' };
  if (value === 'title-asc') return { field: 'title', direction: 'asc' };
  if (value === 'title-desc') return { field: 'title', direction: 'desc' };
  return { field: 'updatedAt', direction: 'desc' };
}

function toAssetQueryFilters(filters: MediaFilterState, activeFolderId: string | null) {
  return {
    folderId: activeFolderId,
    kinds: asOptionalArray(filters.fileTypes) as AssetKind[] | undefined,
    domains: asOptionalArray(filters.domains),
    topics: asOptionalArray(filters.topics),
    licenseValues: asOptionalArray(filters.licenses),
    tags: asOptionalArray(filters.tags),
    technologyAreas: asOptionalArray(filters.technologyAreas),
    components: asOptionalArray(filters.components),
    hasLegacy: filters.legacy === null ? undefined : filters.legacy,
    legacySystems: asOptionalArray(filters.legacySystems)
  };
}

function buildFilterChips(filters: MediaFilterState): ActiveFilterChip[] {
  const chips: ActiveFilterChip[] = [];
  filters.fileTypes.forEach((value) => chips.push({ id: `fileTypes:${value}`, label: `Type: ${value}` }));
  filters.domains.forEach((value) => chips.push({ id: `domains:${value}`, label: `Domain: ${value}` }));
  filters.topics.forEach((value) => chips.push({ id: `topics:${value}`, label: `Topic: ${value}` }));
  filters.licenses.forEach((value) => chips.push({ id: `licenses:${value}`, label: `License: ${value}` }));
  filters.tags.forEach((value) => chips.push({ id: `tags:${value}`, label: `Tag: ${value}` }));
  filters.technologyAreas.forEach((value) => chips.push({ id: `technologyAreas:${value}`, label: `Tech: ${value}` }));
  filters.components.forEach((value) => chips.push({ id: `components:${value}`, label: `Component: ${value}` }));
  if (filters.legacy !== null) chips.push({ id: `legacy:${String(filters.legacy)}`, label: `Legacy: ${filters.legacy ? 'Yes' : 'No'}` });
  filters.legacySystems.forEach((value) => chips.push({ id: `legacySystems:${value}`, label: `Legacy System: ${value}` }));
  return chips;
}

function removeChip(filters: MediaFilterState, chipId: string): MediaFilterState {
  const [key, value] = chipId.split(':');
  if (!key || value === undefined) return filters;

  if (key === 'fileTypes') return { ...filters, fileTypes: filters.fileTypes.filter((item) => item !== (value as AssetKind)) };
  if (key === 'domains') return { ...filters, domains: filters.domains.filter((item) => item !== value) };
  if (key === 'topics') return { ...filters, topics: filters.topics.filter((item) => item !== value) };
  if (key === 'licenses') return { ...filters, licenses: filters.licenses.filter((item) => item !== value) };
  if (key === 'tags') return { ...filters, tags: filters.tags.filter((item) => item !== value) };
  if (key === 'technologyAreas') return { ...filters, technologyAreas: filters.technologyAreas.filter((item) => item !== value) };
  if (key === 'components') return { ...filters, components: filters.components.filter((item) => item !== value) };
  if (key === 'legacy') return { ...filters, legacy: null };
  if (key === 'legacySystems') return { ...filters, legacySystems: filters.legacySystems.filter((item) => item !== value) };

  return filters;
}

function asOptionalArray<T>(items: T[]): T[] | undefined {
  return items.length > 0 ? items : undefined;
}
