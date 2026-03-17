import { useMemo, useState } from 'react';

import { AccordionItem } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { RadioGroup } from '@/components/ui/radio';
import type { AssetKind } from '@/features/media/domain/media.types';
import type { ComponentTag, Domain, LegacySystem, TechnologyArea, Topic } from '@/features/media/domain/media.constants';
import { mediaButton, mediaPanel } from '@/features/media/components/media-ui.variants';
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
        <h2 className="ui-type-body-2-strong">Filters</h2>
        <button className={mediaButton({ variant: 'ghost', size: 'sm' })} onClick={() => onChange(emptyFilters())} type="button">
          Clear all
        </button>
      </div>

      <div className="space-y-3">
        <SearchableMultiSelectSection
          label="File Type"
          defaultOpen
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

        <AccordionItem
          actionLabel="Clear"
          badgeCount={value.legacy !== null ? 1 : 0}
          defaultOpen
          id="filters-legacy"
          onActionClick={() => onChange({ ...value, legacy: null })}
          title="Legacy"
        >
          <RadioGroup
            className="ui-radio-group"
            name="legacy-filter"
            onValueChange={(next) =>
              onChange({
                ...value,
                legacy: next === 'any' ? null : next === 'yes'
              })
            }
            options={[
              { value: 'any', label: 'Any' },
              { value: 'yes', label: 'Yes' },
              { value: 'no', label: 'No' }
            ]}
            orientation="horizontal"
            value={value.legacy === null ? 'any' : value.legacy ? 'yes' : 'no'}
          />
        </AccordionItem>

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
  onClear,
  defaultOpen = false
}: {
  label: string;
  options: readonly TOption[];
  selected: TOption[];
  onChange: (next: TOption[]) => void;
  onClear: () => void;
  defaultOpen?: boolean;
}) {
  const [query, setQuery] = useState('');
  const filtered = useMemo(
    () => options.filter((option) => option.toLowerCase().includes(query.toLowerCase().trim())),
    [options, query]
  );

  return (
    <AccordionItem
      actionLabel="Clear"
      badgeCount={selected.length}
      defaultOpen={defaultOpen}
      id={`filters-${label.toLowerCase().replace(/\s+/g, '-')}`}
      onActionClick={onClear}
      title={label}
    >
      <Input
        className="mb-2 h-8 px-2"
        onChange={(event) => setQuery(event.target.value)}
        placeholder={`Search ${label.toLowerCase()}...`}
        type="search"
        value={query}
      />
      <div className="max-h-36 space-y-1 overflow-auto rounded border border-border bg-background p-2">
        {filtered.map((option) => {
          const checked = selected.includes(option);
          return (
            <Checkbox
              checked={checked}
              key={option}
              label={option}
              onChange={() => onChange(checked ? selected.filter((item) => item !== option) : [...selected, option])}
            />
          );
        })}
      </div>
    </AccordionItem>
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
