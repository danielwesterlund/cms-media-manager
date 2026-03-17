import { mediaButton, mediaChip, mediaPanel } from '@/features/media/components/media-ui.variants';
import { cn } from '@/lib/cn';

export type ActiveFilterChip = {
  id: string;
  label: string;
};

type MediaSortValue = 'updatedAt-desc' | 'updatedAt-asc' | 'createdAt-desc' | 'createdAt-asc' | 'title-asc' | 'title-desc';

type MediaToolbarProps = {
  searchText: string;
  sortValue: MediaSortValue;
  viewMode: 'grid' | 'list';
  filterPanelOpen: boolean;
  selectedCount: number;
  activeFilterChips: ActiveFilterChip[];
  onSearchChange: (value: string) => void;
  onSortChange: (value: MediaSortValue) => void;
  onToggleFilterPanel: () => void;
  onToggleViewMode: () => void;
  onBulkActionsClick: () => void;
  onUploadClick: () => void;
  onRemoveFilterChip: (chipId: string) => void;
  onClearAllFilters: () => void;
};

/**
 * Presentational media toolbar with search/sort/view controls.
 */
export function MediaToolbar({
  searchText,
  sortValue,
  viewMode,
  filterPanelOpen,
  selectedCount,
  activeFilterChips,
  onSearchChange,
  onSortChange,
  onToggleFilterPanel,
  onToggleViewMode,
  onBulkActionsClick,
  onUploadClick,
  onRemoveFilterChip,
  onClearAllFilters
}: MediaToolbarProps) {
  return (
    <section aria-label="Media toolbar" className={cn(mediaPanel(), 'p-3')}>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sr-only" htmlFor="media-search">
            Search assets
          </label>
          <input
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
            id="media-search"
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search assets"
            type="search"
            value={searchText}
          />

          <label className="sr-only" htmlFor="media-sort">
            Sort assets
          </label>
          <select
            className="h-9 min-w-44 rounded-md border border-input bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
            id="media-sort"
            onChange={(event) => onSortChange(event.target.value as MediaSortValue)}
            value={sortValue}
          >
            <option value="updatedAt-desc">Updated: Newest</option>
            <option value="updatedAt-asc">Updated: Oldest</option>
            <option value="createdAt-desc">Created: Newest</option>
            <option value="createdAt-asc">Created: Oldest</option>
            <option value="title-asc">Title: A-Z</option>
            <option value="title-desc">Title: Z-A</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            aria-label={filterPanelOpen ? 'Hide filters' : 'Show filters'}
            className={cn(mediaButton({ variant: 'outline', size: 'md' }), filterPanelOpen && 'bg-selection-soft')}
            onClick={onToggleFilterPanel}
            type="button"
          >
            <span aria-hidden="true" className="material-symbols-outlined mr-1 text-sm">
              tune
            </span>
            Filters
          </button>
          <button
            aria-label="Toggle view mode"
            className={cn(
              mediaButton({ variant: 'outline', size: 'md' }),
              viewMode === 'list' && 'bg-muted'
            )}
            onClick={onToggleViewMode}
            type="button"
          >
            <span aria-hidden="true" className="material-symbols-outlined mr-1 text-sm">
              {viewMode === 'grid' ? 'grid_view' : 'view_list'}
            </span>
            {viewMode === 'grid' ? 'Grid' : 'List'}
          </button>

          <p className="text-sm text-muted-foreground" role="status">
            {selectedCount} selected
          </p>

          <button className={mediaButton({ variant: 'ghost', size: 'md' })} onClick={onBulkActionsClick} type="button">
            <span aria-hidden="true" className="material-symbols-outlined mr-1 text-sm">
              select_all
            </span>
            Bulk actions
          </button>
          <button className={mediaButton({ variant: 'default', size: 'md' })} onClick={onUploadClick} type="button">
            <span aria-hidden="true" className="material-symbols-outlined mr-1 text-sm">
              upload
            </span>
            Upload
          </button>
        </div>
      </div>

      {activeFilterChips.length > 0 ? (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {activeFilterChips.map((chip) => (
            <button
              className={mediaChip({ tone: 'neutral' })}
              key={chip.id}
              onClick={() => onRemoveFilterChip(chip.id)}
              type="button"
            >
              {chip.label} ×
            </button>
          ))}
          <button className={mediaButton({ variant: 'outline', size: 'sm' })} onClick={onClearAllFilters} type="button">
            Clear filters
          </button>
        </div>
      ) : null}
    </section>
  );
}

export type { MediaSortValue };
