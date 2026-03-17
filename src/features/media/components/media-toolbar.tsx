import { useMemo, useState } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

import { ContentSwitcher } from '@/components/ui/content-switcher';
import { Input } from '@/components/ui/input';
import { PopoverContent, PopoverItem } from '@/components/ui/popover';
import { Tag } from '@/components/ui/tag';
import type { AssetKind } from '@/features/media/domain/media.types';
import { mediaButton, mediaPanel } from '@/features/media/components/media-ui.variants';
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
  fileTypeFilters: AssetKind[];
  selectedCount: number;
  activeFilterChips: ActiveFilterChip[];
  onSearchChange: (value: string) => void;
  onSortChange: (value: MediaSortValue) => void;
  onToggleFileTypeFilter: (kind: AssetKind) => void;
  onResetFileTypeFilters: () => void;
  domainOptions: string[];
  topicOptions: string[];
  licenseOptions: string[];
  tagOptions: string[];
  domainFilters: string[];
  topicFilters: string[];
  licenseFilters: string[];
  tagFilters: string[];
  onToggleDomainFilter: (value: string) => void;
  onToggleTopicFilter: (value: string) => void;
  onToggleLicenseFilter: (value: string) => void;
  onToggleTagFilter: (value: string) => void;
  onResetDomainFilters: () => void;
  onResetTopicFilters: () => void;
  onResetLicenseFilters: () => void;
  onResetTagFilters: () => void;
  onToggleViewMode: () => void;
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
  fileTypeFilters,
  selectedCount,
  activeFilterChips,
  onSearchChange,
  onSortChange,
  onToggleFileTypeFilter,
  onResetFileTypeFilters,
  domainOptions,
  topicOptions,
  licenseOptions,
  tagOptions,
  domainFilters,
  topicFilters,
  licenseFilters,
  tagFilters,
  onToggleDomainFilter,
  onToggleTopicFilter,
  onToggleLicenseFilter,
  onToggleTagFilter,
  onResetDomainFilters,
  onResetTopicFilters,
  onResetLicenseFilters,
  onResetTagFilters,
  onToggleViewMode,
  onUploadClick,
  onRemoveFilterChip,
  onClearAllFilters
}: MediaToolbarProps) {
  const sortOptions: Array<{
    value: MediaSortValue;
    label: string;
    directionIcon?: 'arrow_upward' | 'arrow_downward';
  }> = [
    { value: 'updatedAt-desc', label: 'Updated: Newest', directionIcon: 'arrow_downward' },
    { value: 'updatedAt-asc', label: 'Updated: Oldest', directionIcon: 'arrow_upward' },
    { value: 'createdAt-desc', label: 'Created: Newest', directionIcon: 'arrow_downward' },
    { value: 'createdAt-asc', label: 'Created: Oldest', directionIcon: 'arrow_upward' },
    { value: 'title-asc', label: 'Title A-Z', directionIcon: 'arrow_upward' },
    { value: 'title-desc', label: 'Title Z-A', directionIcon: 'arrow_downward' }
  ];

  const fileTypeOptions: AssetKind[] = ['image', 'pdf', 'office', 'tableau', 'powerbi', 'audio'];
  const activeSortOption = sortOptions.find((option) => option.value === sortValue);
  const activeSortLabel = sortValue.startsWith('updatedAt')
    ? 'Updated'
    : sortValue.startsWith('createdAt')
      ? 'Created'
      : 'Title';

  return (
    <section aria-label="Media toolbar" className={cn(mediaPanel(), 'p-3')}>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex w-full flex-col gap-2">
          <div className="flex w-full gap-2 sm:items-center">
            <label className="sr-only" htmlFor="media-search">
              Search assets
            </label>
            <Input
              className="w-full"
              id="media-search"
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search assets"
              trailingIcon={<span className="material-symbols-outlined">search</span>}
              type="search"
              value={searchText}
            />

            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button
                  aria-label="Sort assets"
                  className={mediaButton({ variant: 'outline', size: 'sm' })}
                  type="button"
                >
                  <span aria-hidden="true" className="material-symbols-outlined mr-1">
                    sort
                  </span>
                  <span>{activeSortLabel}</span>
                  {activeSortOption?.directionIcon ? (
                    <span aria-hidden="true" className="material-symbols-outlined ml-1 text-[16px]">
                      {activeSortOption.directionIcon}
                    </span>
                  ) : null}
                </button>
              </DropdownMenu.Trigger>
              <PopoverContent align="end" sideOffset={6}>
                {sortOptions.map((option) => (
                  <PopoverItem key={option.value} onSelect={() => onSortChange(option.value)}>
                    <span
                      aria-hidden="true"
                      className={cn('material-symbols-outlined text-[18px]', option.value === sortValue ? 'opacity-100' : 'opacity-0')}
                    >
                      check
                    </span>
                    <span>{option.label}</span>
                  </PopoverItem>
                ))}
              </PopoverContent>
            </DropdownMenu.Root>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <TaxonomyFilterPopover
              label="File type"
              onClear={onResetFileTypeFilters}
              onToggle={(value) => onToggleFileTypeFilter(value as AssetKind)}
              options={fileTypeOptions}
              selected={fileTypeFilters}
            />
            <TaxonomyFilterPopover
              label="Domain"
              onClear={onResetDomainFilters}
              onToggle={onToggleDomainFilter}
              options={domainOptions}
              selected={domainFilters}
            />
            <TaxonomyFilterPopover
              label="License"
              onClear={onResetLicenseFilters}
              onToggle={onToggleLicenseFilter}
              options={licenseOptions}
              selected={licenseFilters}
            />
            <TaxonomyFilterPopover
              label="Topics"
              onClear={onResetTopicFilters}
              onToggle={onToggleTopicFilter}
              options={topicOptions}
              selected={topicFilters}
            />
            <TaxonomyFilterPopover
              label="Tags"
              onClear={onResetTagFilters}
              onToggle={onToggleTagFilter}
              options={tagOptions}
              selected={tagFilters}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ContentSwitcher
            ariaLabel="Media view mode"
            items={[
              {
                value: 'grid',
                label: 'Grid',
                icon: <span aria-hidden="true" className="material-symbols-outlined">grid_view</span>
              },
              {
                value: 'list',
                label: 'List',
                icon: <span aria-hidden="true" className="material-symbols-outlined">view_list</span>
              }
            ]}
            onValueChange={(nextMode) => {
              if (nextMode !== viewMode) onToggleViewMode();
            }}
            value={viewMode}
          />

          <button className={mediaButton({ variant: 'default', size: 'md' })} onClick={onUploadClick} type="button">
            <span aria-hidden="true" className="material-symbols-outlined mr-1">
              upload
            </span>
            Upload
          </button>
        </div>
      </div>

      {activeFilterChips.length > 0 ? (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {activeFilterChips.map((chip) => (
            <Tag closeable key={chip.id} onClose={() => onRemoveFilterChip(chip.id)} tone="gray">
              {chip.label}
            </Tag>
          ))}
          <button className={mediaButton({ variant: 'outline', size: 'sm' })} onClick={onClearAllFilters} type="button">
            Clear filters
          </button>
        </div>
      ) : null}
    </section>
  );
}

function TaxonomyFilterPopover({
  label,
  options,
  selected,
  onToggle,
  onClear
}: {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
  onClear: () => void;
}) {
  const [query, setQuery] = useState('');
  const filteredOptions = useMemo(
    () => options.filter((option) => option.toLowerCase().includes(query.trim().toLowerCase())),
    [options, query]
  );
  const triggerLabel = selected.length > 0 ? `${label} (${selected.length})` : label;

  return (
    <DropdownMenu.Root onOpenChange={(open) => !open && setQuery('')}>
      <DropdownMenu.Trigger asChild>
        <button
          aria-label={`Filter by ${label.toLowerCase()}`}
          className={cn(mediaButton({ variant: 'outline', size: 'sm' }), selected.length > 0 && 'bg-selection-soft')}
          type="button"
        >
          {triggerLabel}
        </button>
      </DropdownMenu.Trigger>
      <PopoverContent align="start" className="ui-popover-scrollable" sideOffset={6}>
        <div className="px-3 pb-1">
          <label className="sr-only" htmlFor={`media-filter-${label.toLowerCase().replace(/\s+/g, '-')}`}>
            Search {label}
          </label>
          <input
            className="ui-type-body-2 w-full rounded-md border border-border bg-card px-2 py-1"
            id={`media-filter-${label.toLowerCase().replace(/\s+/g, '-')}`}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => event.stopPropagation()}
            placeholder={`Search ${label.toLowerCase()}`}
            type="text"
            value={query}
          />
        </div>

        <div className="max-h-56 overflow-auto">
          {filteredOptions.length === 0 ? (
            <p className="ui-type-small-1 ui-type-muted px-3 py-2">No results</p>
          ) : (
            filteredOptions.map((option) => {
              const isSelected = selected.includes(option);
              return (
                <PopoverItem
                  key={option}
                  onSelect={(event) => {
                    event.preventDefault();
                    onToggle(option);
                  }}
                >
                  <span
                    aria-hidden="true"
                    className={cn('material-symbols-outlined text-[18px]', isSelected ? 'opacity-100' : 'opacity-0')}
                  >
                    check
                  </span>
                  <span>{option}</span>
                </PopoverItem>
              );
            })
          )}
        </div>

        {selected.length > 0 ? (
          <PopoverItem
            onSelect={(event) => {
              event.preventDefault();
              onClear();
            }}
          >
            <span aria-hidden="true" className="material-symbols-outlined text-[18px]">close</span>
            <span>Clear</span>
          </PopoverItem>
        ) : null}
      </PopoverContent>
    </DropdownMenu.Root>
  );
}

export type { MediaSortValue };
