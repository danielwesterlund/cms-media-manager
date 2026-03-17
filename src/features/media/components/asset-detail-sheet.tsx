import { useEffect, useState } from 'react';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';

import type { Asset, UsageSummary } from '@/features/media/domain/media.types';
import type { AssetEditableMetadata, AssetEditableMetadataPatch } from '@/features/media/domain/media.schemas';
import { AssetMetadataForm } from '@/features/media/components/asset-metadata-form';
import { MediaAssetIcon, kindLabel } from '@/features/media/components/media-asset-icon';
import { IconButton } from '@/components/ui/icon-button';
import { mediaBadge, mediaButton, mediaPanel } from '@/features/media/components/media-ui.variants';
import { AssetUsagePanel } from '@/features/media/components/asset-usage-panel';
import { Tabs } from '@/components/ui/tabs';
import { cn } from '@/lib/cn';
import { Checkbox } from '@/components/ui/checkbox';
import { Select } from '@/components/ui/select';
import { Tag } from '@/components/ui/tag';
import { TOPICS, DOMAINS } from '@/features/media/domain/media.constants';
import { TagsChipInput } from '@/features/media/components/tags-chip-input';

type AssetDetailSheetProps = {
  asset: Asset | null;
  usage: UsageSummary | null;
  selectedCount?: number;
  saving?: boolean;
  onClose: () => void;
  onSave: (values: AssetEditableMetadata) => Promise<void> | void;
  onSaveBulk?: (values: AssetEditableMetadataPatch) => Promise<void> | void;
};

/**
 * Presentational asset detail sheet with editable metadata.
 */
export function AssetDetailSheet({
  asset,
  usage,
  selectedCount = 0,
  saving = false,
  onClose,
  onSave,
  onSaveBulk
}: AssetDetailSheetProps) {
  const [activeTab, setActiveTab] = useState<'metadata' | 'usage' | 'system'>('metadata');
  const isMultiSelected = selectedCount > 1;

  useEffect(() => {
    setActiveTab('metadata');
  }, [asset?.id, isMultiSelected]);

  if (isMultiSelected) {
    return (
      <section className={cn(mediaPanel(), 'sticky top-0 space-y-3 p-4')} aria-label="Asset details">
        <p className="ui-type-small-1 ui-type-muted">{selectedCount} selected</p>
        <header className="flex items-center justify-between gap-2">
          <h2 className="ui-type-body-1-strong">Multiple selected</h2>
          <IconButton
            aria-label="Close asset detail"
            icon={<span aria-hidden="true" className="material-symbols-outlined">close</span>}
            onClick={onClose}
            size="small"
            variant="ghost"
          />
        </header>
        <section className="rounded-md border border-border p-3">
          <p className="ui-type-body-2-strong">{selectedCount} assets selected</p>
          <p className="ui-type-small-1 ui-type-muted mt-1">
            Name, usage and system details are only available when a single asset is selected.
          </p>
          <BulkMetadataForm onSubmit={onSaveBulk} submitting={saving} />
        </section>
      </section>
    );
  }

  if (!asset) {
    return (
      <section className={cn(mediaPanel(), 'sticky top-0 space-y-2 p-4')}>
        <p className="ui-type-small-1 ui-type-muted">{selectedCount} selected</p>
        <p className="ui-type-body-2 ui-type-muted">No items selected. Please select an asset to view details.</p>
      </section>
    );
  }

  const legacyUrl = asset.legacyUrl ?? '';
  const looksLikeUrl = /^https?:\/\//i.test(legacyUrl);
  const defaultValues: AssetEditableMetadata = {
    title: asset.title,
    creditsSource: asset.creditsSource,
    license: asset.license,
    domain: asset.domain,
    topics: asset.topics,
    tags: asset.tags,
    technologyArea: asset.technologyArea,
    component: asset.component
  };

  return (
    <section className={cn(mediaPanel(), 'sticky top-0 space-y-3 p-4')} aria-label="Asset details">
      <p className="ui-type-small-1 ui-type-muted">{selectedCount} selected</p>
      <header className="flex items-center justify-between gap-2">
        <h2 className="ui-type-body-1-strong">Asset Detail</h2>
        <IconButton
          aria-label="Close asset detail"
          icon={<span aria-hidden="true" className="material-symbols-outlined">close</span>}
          onClick={onClose}
          size="small"
          variant="ghost"
        />
      </header>

      <Tabs
        ariaLabel="Detail tabs"
        items={[
          { value: 'metadata', label: 'Metadata' },
          { value: 'usage', label: 'Usage' },
          { value: 'system', label: 'System' }
        ]}
        onValueChange={(value) => setActiveTab(value as 'metadata' | 'usage' | 'system')}
        value={activeTab}
      />

      {activeTab === 'metadata' ? (
        <>
          <section className="rounded-md border border-border p-3" aria-label="Preview">
            {asset.kind === 'image' && asset.thumbnailUrl ? (
              <img alt={asset.title} className="h-36 w-full rounded object-cover" src={asset.thumbnailUrl} />
            ) : (
              <div className="flex h-24 items-center justify-center">
                <MediaAssetIcon asset={asset} className="h-14 w-14" />
              </div>
            )}
            <p className="ui-type-body-2-strong mt-2">{asset.title}</p>
            <p className="ui-type-small-1 ui-type-muted">{kindLabel(asset)}</p>
          </section>

          <section className="rounded-md border border-border p-3" aria-label="Metadata form">
            <AssetMetadataForm
              key={asset.id}
              defaultValues={defaultValues}
              onSubmit={onSave}
              submitting={saving}
            />
          </section>
        </>
      ) : null}

      {activeTab === 'usage' ? (
        usage ? (
          <AssetUsagePanel usage={usage} />
        ) : (
          <section className="rounded-md border border-border p-3">
            <p className="ui-type-body-2 ui-type-muted">No usage data for this asset yet.</p>
          </section>
        )
      ) : null}

      {activeTab === 'system' ? (
        <>
          <section className="rounded-md border border-border p-3" aria-label="System metadata">
            <h3 className="ui-type-body-2-strong">System</h3>
            <dl className="ui-type-small-1 mt-2 grid grid-cols-2 gap-2">
              <dt className="ui-type-muted">Asset ID</dt>
              <dd>{asset.id}</dd>
              <dt className="ui-type-muted">File</dt>
              <dd>{asset.fileName}</dd>
              <dt className="ui-type-muted">Created By</dt>
              <dd>{asset.createdBy}</dd>
              <dt className="ui-type-muted">Created At</dt>
              <dd>{asset.createdAt}</dd>
            </dl>
          </section>

          <section className="rounded-md border border-border p-3" aria-label="Legacy metadata">
            <h3 className="ui-type-body-2-strong">Legacy</h3>
            <p className="ui-type-small-1 ui-type-muted mt-1">System</p>
            <p className="mt-1">
              <span className={mediaBadge({ tone: asset.legacySystem ? 'info' : 'neutral' })}>
                {asset.legacySystem ?? 'None'}
              </span>
            </p>

            <p className="ui-type-small-1 ui-type-muted mt-2">Legacy URL</p>
            <div className="mt-1 flex gap-2">
              <code className="ui-type-code flex-1 overflow-hidden text-ellipsis whitespace-nowrap rounded bg-muted px-2 py-1">
                {legacyUrl || 'N/A'}
              </code>
              <button
                aria-label="Copy legacy URL"
                className={mediaButton({ variant: 'outline', size: 'sm' })}
                disabled={!legacyUrl}
                onClick={() => legacyUrl && navigator.clipboard.writeText(legacyUrl)}
                type="button"
              >
                Copy
              </button>
              {looksLikeUrl ? (
                <a className="ui-type-small-1 rounded-md border border-input px-2 py-1" href={legacyUrl} rel="noreferrer" target="_blank">
                  Open
                </a>
              ) : null}
            </div>
          </section>
        </>
      ) : null}
    </section>
  );
}

type BulkMetadataFormValues = {
  applyDomain: boolean;
  domain: string;
  applyLicense: boolean;
  license: string;
  applyTopics: boolean;
  topics: string[];
  applyTags: boolean;
  tags: string[];
};

const KNOWN_LICENSES = ['Internal', 'CC-BY', 'CC-BY-SA', 'Royalty Free'] as const;

function BulkMetadataForm({
  onSubmit,
  submitting
}: {
  onSubmit?: (values: AssetEditableMetadataPatch) => Promise<void> | void;
  submitting: boolean;
}) {
  const { register, control, handleSubmit, watch } = useForm<BulkMetadataFormValues>({
    defaultValues: {
      applyDomain: false,
      domain: DOMAINS[0],
      applyLicense: false,
      license: KNOWN_LICENSES[0],
      applyTopics: false,
      topics: [],
      applyTags: false,
      tags: []
    }
  });

  const applyDomain = watch('applyDomain');
  const applyLicense = watch('applyLicense');
  const applyTopics = watch('applyTopics');
  const applyTags = watch('applyTags');

  const submit: SubmitHandler<BulkMetadataFormValues> = async (values) => {
    if (!onSubmit) return;

    const patch: AssetEditableMetadataPatch = {};
    if (values.applyDomain) patch.domain = values.domain as AssetEditableMetadataPatch['domain'];
    if (values.applyLicense) patch.license = values.license;
    if (values.applyTopics) patch.topics = values.topics as AssetEditableMetadataPatch['topics'];
    if (values.applyTags) patch.tags = values.tags;

    if (Object.keys(patch).length === 0) return;
    await onSubmit(patch);
  };

  return (
    <form className="mt-3 space-y-3" onSubmit={handleSubmit(submit)}>
      <label className="block">
        <Checkbox {...register('applyDomain')} label="Edit Domain" />
        <Select {...register('domain')} className="mt-2" disabled={!applyDomain}>
          {DOMAINS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
      </label>

      <label className="block">
        <Checkbox {...register('applyLicense')} label="Edit License" />
        <Select {...register('license')} className="mt-2" disabled={!applyLicense}>
          {KNOWN_LICENSES.map((license) => (
            <option key={license} value={license}>
              {license}
            </option>
          ))}
        </Select>
      </label>

      <div className="space-y-2">
        <Checkbox {...register('applyTopics')} label="Edit Topics" />
        <Controller
          control={control}
          name="topics"
          render={({ field }) => (
            <div className={cn(!applyTopics && 'pointer-events-none opacity-50')}>
              <MultiSelectChips
                onChange={field.onChange}
                options={TOPICS}
                value={field.value}
              />
            </div>
          )}
        />
      </div>

      <div className="space-y-2">
        <Checkbox {...register('applyTags')} label="Edit Tags" />
        <Controller
          control={control}
          name="tags"
          render={({ field }) => (
            <div className={cn(!applyTags && 'pointer-events-none opacity-50')}>
              <TagsChipInput
                id="bulk-asset-tags"
                label="Tags"
                onChange={field.onChange}
                value={field.value}
              />
            </div>
          )}
        />
      </div>

      <button className={mediaButton({ variant: 'default', size: 'md' })} disabled={submitting} type="submit">
        {submitting ? 'Saving...' : 'Apply to selected'}
      </button>
    </form>
  );
}

function MultiSelectChips({
  value,
  options,
  onChange
}: {
  value: string[];
  options: readonly string[];
  onChange: (values: string[]) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1">
      {options.map((option) => {
        const selected = value.includes(option);
        return (
          <Tag
            as="button"
            clickable
            key={option}
            onClick={(event) => {
              event.preventDefault();
              onChange(selected ? value.filter((item) => item !== option) : [...value, option]);
            }}
            tone={selected ? 'primary' : 'gray'}
          >
            {option}
          </Tag>
        );
      })}
    </div>
  );
}
