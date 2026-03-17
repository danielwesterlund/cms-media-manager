import { useEffect, useState } from 'react';

import type { Asset, UsageSummary } from '@/features/media/domain/media.types';
import type { AssetEditableMetadata } from '@/features/media/domain/media.schemas';
import { AssetMetadataForm } from '@/features/media/components/asset-metadata-form';
import { MediaAssetIcon, kindLabel } from '@/features/media/components/media-asset-icon';
import { mediaBadge, mediaPanel } from '@/features/media/components/media-ui.variants';
import { AssetUsagePanel } from '@/features/media/components/asset-usage-panel';
import { cn } from '@/lib/cn';

type AssetDetailSheetProps = {
  asset: Asset | null;
  usage: UsageSummary | null;
  saving?: boolean;
  onClose: () => void;
  onSave: (values: AssetEditableMetadata) => Promise<void> | void;
};

/**
 * Presentational asset detail sheet with editable metadata.
 */
export function AssetDetailSheet({ asset, usage, saving = false, onClose, onSave }: AssetDetailSheetProps) {
  const [activeTab, setActiveTab] = useState<'metadata' | 'usage' | 'system'>('metadata');

  useEffect(() => {
    setActiveTab('metadata');
  }, [asset?.id]);

  if (!asset) {
    return (
      <section className={cn(mediaPanel(), 'sticky top-0 p-4')}>
        <p className="text-sm text-muted-foreground">Select an asset to view details.</p>
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
      <header className="flex items-center justify-between gap-2">
        <h2 className="text-base font-semibold">Asset Detail</h2>
        <button
          aria-label="Close asset detail"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-input text-muted-foreground hover:bg-muted"
          onClick={onClose}
          type="button"
        >
          <span className="material-symbols-outlined text-base">close</span>
        </button>
      </header>

      <div aria-label="Detail tabs" className="flex gap-1 rounded-md border border-border bg-muted/40 p-1">
        <TabButton active={activeTab === 'metadata'} label="Metadata" onClick={() => setActiveTab('metadata')} />
        <TabButton active={activeTab === 'usage'} label="Usage" onClick={() => setActiveTab('usage')} />
        <TabButton active={activeTab === 'system'} label="System" onClick={() => setActiveTab('system')} />
      </div>

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
            <p className="mt-2 text-sm font-medium">{asset.title}</p>
            <p className="text-xs text-muted-foreground">{kindLabel(asset)}</p>
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
            <p className="text-sm text-muted-foreground">No usage data for this asset yet.</p>
          </section>
        )
      ) : null}

      {activeTab === 'system' ? (
        <>
          <section className="rounded-md border border-border p-3" aria-label="System metadata">
            <h3 className="text-sm font-semibold">System</h3>
            <dl className="mt-2 grid grid-cols-2 gap-2 text-xs">
              <dt className="text-muted-foreground">Asset ID</dt>
              <dd>{asset.id}</dd>
              <dt className="text-muted-foreground">File</dt>
              <dd>{asset.fileName}</dd>
              <dt className="text-muted-foreground">Created By</dt>
              <dd>{asset.createdBy}</dd>
              <dt className="text-muted-foreground">Created At</dt>
              <dd>{asset.createdAt}</dd>
            </dl>
          </section>

          <section className="rounded-md border border-border p-3" aria-label="Legacy metadata">
            <h3 className="text-sm font-semibold">Legacy</h3>
            <p className="mt-1 text-xs text-muted-foreground">System</p>
            <p className="mt-1">
              <span className={mediaBadge({ tone: asset.legacySystem ? 'info' : 'neutral' })}>
                {asset.legacySystem ?? 'None'}
              </span>
            </p>

            <p className="mt-2 text-xs text-muted-foreground">Legacy URL</p>
            <div className="mt-1 flex gap-2">
              <code className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap rounded bg-muted px-2 py-1 text-xs">
                {legacyUrl || 'N/A'}
              </code>
              <button
                aria-label="Copy legacy URL"
                className="rounded-md border border-input px-2 py-1 text-xs"
                disabled={!legacyUrl}
                onClick={() => legacyUrl && navigator.clipboard.writeText(legacyUrl)}
                type="button"
              >
                Copy
              </button>
              {looksLikeUrl ? (
                <a className="rounded-md border border-input px-2 py-1 text-xs" href={legacyUrl} rel="noreferrer" target="_blank">
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

function TabButton({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      aria-selected={active}
      className={
        active
          ? 'rounded-md bg-background px-2 py-1 text-xs font-medium shadow-sm'
          : 'rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-background/70'
      }
      onClick={onClick}
      role="tab"
      type="button"
    >
      {label}
    </button>
  );
}
