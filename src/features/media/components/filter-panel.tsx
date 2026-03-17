import { useMemo, useState } from 'react';

import type { AssetKind } from '@/features/media/domain/media.types';
import type { ComponentTag, Domain, LegacySystem, TechnologyArea, Topic } from '@/features/media/domain/media.constants';
import { mediaButton, mediaChip, mediaPanel } from '@/features/media/components/media-ui.variants';
import { cn } from '@/lib/cn';

export type MediaFilterState = {
  fileTypes: AssetKind[];
  domains: Domain[];
  topics: Topic[];
  licenses: string[];
  tags: string[];
  technologyAreas: TechnologyArea[];
  components: ComponentTag[];
  legacy: boolean | null;
  legacySystems: LegacySystem[];
};

export type FilterPanelOptions = {
  fileTypes: AssetKind[];
  domains: Domain[];
  topics: Topic[];
  licenses: string[];
  tags: string[];
  technologyAreas: TechnologyArea[];
  components: ComponentTag[];
  legacySystems: LegacySystem[];
};

type FilterPanelProps = {
  value: MediaFilterState;
  options: FilterPanelOptions;
  onChange: (next: MediaFilterState) => void;
};

/**
 * Presentational filter panel for media list filtering.
 */
export function FilterPanel({ value, options, onChange }: FilterPanelProps) {
  return (
    <section aria-label="Filters" className={cn(mediaPanel(), 'p-3')}>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold">Filters</h2>
        <button className={mediaButton({ variant: 'ghost', size: 'sm' })} onClick={() => onChange(emptyFilters())} type="button">
          Clear all
        </button>
      </div>

      <div className="space-y-3">
        <SearchableMultiSelectSection
          label="File Type"
          onChange={(next) => onChange({ ...value, fileTypes: next })}
          onClear={() => onChange({ ...value, fileTypes: [] })}
          options={options.fileTypes}
          selected={value.fileTypes}
        />
        <SearchableMultiSelectSection
          label="Domain"
          onChange={(next) => onChange({ ...value, domains: next })}
          onClear={() => onChange({ ...value, domains: [] })}
          options={options.domains}
          selected={value.domains}
        />
        <SearchableMultiSelectSection
          label="Topics"
          onChange={(next) => onChange({ ...value, topics: next })}
          onClear={() => onChange({ ...value, topics: [] })}
          options={options.topics}
          selected={value.topics}
        />
        <SearchableMultiSelectSection
          label="License"
          onChange={(next) => onChange({ ...value, licenses: next })}
          onClear={() => onChange({ ...value, licenses: [] })}
          options={options.licenses}
          selected={value.licenses}
        />
        <SearchableMultiSelectSection
          label="Tags"
          onChange={(next) => onChange({ ...value, tags: next })}
          onClear={() => onChange({ ...value, tags: [] })}
          options={options.tags}
          selected={value.tags}
        />
        <SearchableMultiSelectSection
          label="Technology Area"
          onChange={(next) => onChange({ ...value, technologyAreas: next })}
          onClear={() => onChange({ ...value, technologyAreas: [] })}
          options={options.technologyAreas}
          selected={value.technologyAreas}
        />
        <SearchableMultiSelectSection
          label="Component"
          onChange={(next) => onChange({ ...value, components: next })}
          onClear={() => onChange({ ...value, components: [] })}
          options={options.components}
          selected={value.components}
        />

        <section>
          <div className="mb-1 flex items-center justify-between">
            <h3 className="text-sm font-medium">Legacy</h3>
            <button className={mediaButton({ variant: 'ghost', size: 'sm' })} onClick={() => onChange({ ...value, legacy: null })} type="button">
              Clear
            </button>
          </div>
          <div className="flex gap-2">
            <LegacyButton active={value.legacy === null} label="Any" onClick={() => onChange({ ...value, legacy: null })} />
            <LegacyButton active={value.legacy === true} label="Yes" onClick={() => onChange({ ...value, legacy: true })} />
            <LegacyButton active={value.legacy === false} label="No" onClick={() => onChange({ ...value, legacy: false })} />
          </div>
        </section>

        <SearchableMultiSelectSection
          label="Legacy System"
          onChange={(next) => onChange({ ...value, legacySystems: next })}
          onClear={() => onChange({ ...value, legacySystems: [] })}
          options={options.legacySystems}
          selected={value.legacySystems}
        />
      </div>
    </section>
  );
}

function SearchableMultiSelectSection<TOption extends string>({
  label,
  options,
  selected,
  onChange,
  onClear
}: {
  label: string;
  options: readonly TOption[];
  selected: TOption[];
  onChange: (next: TOption[]) => void;
  onClear: () => void;
}) {
  const [query, setQuery] = useState('');
  const filtered = useMemo(
    () => options.filter((option) => option.toLowerCase().includes(query.toLowerCase().trim())),
    [options, query]
  );

  return (
    <section>
      <div className="mb-1 flex items-center justify-between">
        <h3 className="text-sm font-medium">{label}</h3>
        <button className={mediaButton({ variant: 'ghost', size: 'sm' })} onClick={onClear} type="button">
          Clear
        </button>
      </div>
      <input
        className="mb-1 h-8 w-full rounded border border-input px-2 text-xs"
        onChange={(event) => setQuery(event.target.value)}
        placeholder={`Search ${label.toLowerCase()}...`}
        type="search"
        value={query}
      />
      <div className="max-h-32 space-y-1 overflow-auto rounded border border-border p-2">
        {filtered.map((option) => {
          const checked = selected.includes(option);
          return (
            <label className="flex items-center gap-2 text-xs" key={option}>
              <input
                checked={checked}
                onChange={() =>
                  onChange(checked ? selected.filter((item) => item !== option) : [...selected, option])
                }
                type="checkbox"
              />
              <span>{option}</span>
            </label>
          );
        })}
      </div>
    </section>
  );
}

function LegacyButton({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      className={mediaChip({ tone: active ? 'selected' : 'neutral' })}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}

export function emptyFilters(): MediaFilterState {
  return {
    fileTypes: [],
    domains: [],
    topics: [],
    licenses: [],
    tags: [],
    technologyAreas: [],
    components: [],
    legacy: null,
    legacySystems: []
  };
}
