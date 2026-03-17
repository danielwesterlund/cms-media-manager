import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { ContentSwitcher } from '@/components/ui/content-switcher';
import { IconButton } from '@/components/ui/icon-button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Tabs } from '@/components/ui/tabs';
import { MediaAssetIcon } from '@/features/media/components/media-asset-icon';
import { MediaManagerShell } from '@/features/media/components/media-manager-shell';
import { ModalShell } from '@/features/media/components/modal-shell';
import type { Asset, AssetKind } from '@/features/media/domain/media.types';
import { useAssetQuery } from '@/features/media/hooks/use-assets-query';
import { useMediaUiActions } from '@/features/media/state/media-ui.store';

type MediaTarget = 'attachments' | 'cover' | 'thumbnail';

export function HomePage() {
  const [activeCmsTab, setActiveCmsTab] = useState('document');
  const [isMediaOpen, setIsMediaOpen] = useState(false);
  const [mediaTarget, setMediaTarget] = useState<MediaTarget>('thumbnail');
  const [mediaFileTypePreset, setMediaFileTypePreset] = useState<AssetKind[]>([]);
  const [selectedCmsAssets, setSelectedCmsAssets] = useState<{
    thumbnail: string | null;
    cover: string | null;
    attachments: string | null;
  }>({
    thumbnail: null,
    cover: null,
    attachments: null
  });
  const mediaUiActions = useMediaUiActions();

  const thumbnailAssetQuery = useAssetQuery(selectedCmsAssets.thumbnail ?? '');
  const coverAssetQuery = useAssetQuery(selectedCmsAssets.cover ?? '');
  const attachmentAssetQuery = useAssetQuery(selectedCmsAssets.attachments ?? '');

  const openMediaManager = (target: MediaTarget) => {
    const currentlySelectedAssetId = selectedCmsAssets[target];

    if (currentlySelectedAssetId) {
      mediaUiActions.selectAsset(currentlySelectedAssetId);
      mediaUiActions.openAssetDetail(currentlySelectedAssetId);
    } else {
      mediaUiActions.clearSelection();
      mediaUiActions.closeAssetDetail();
    }

    setMediaTarget(target);
    setMediaFileTypePreset(target === 'attachments' ? [] : ['image']);
    setIsMediaOpen(true);
  };

  const onConfirmCmsAsset = (assetId: string) => {
    setSelectedCmsAssets((current) => ({
      ...current,
      [mediaTarget]: assetId
    }));
    setIsMediaOpen(false);
  };

  return (
    <>
      <main aria-label="Home page" className="min-h-screen bg-background">
        <div className="grid min-h-screen lg:grid-cols-[80px_220px_minmax(0,1fr)]">
          <SidebarIconRail />
          <SidebarNavigation />
          <NewPageEditor
            activeCmsTab={activeCmsTab}
            attachmentAsset={attachmentAssetQuery.data ?? null}
            coverAsset={coverAssetQuery.data ?? null}
            onOpenMediaManager={openMediaManager}
            onTabChange={setActiveCmsTab}
            thumbnailAsset={thumbnailAssetQuery.data ?? null}
          />
        </div>
      </main>

      <ModalShell fullScreen onOpenChange={setIsMediaOpen} open={isMediaOpen} titleId="media-library-modal-title">
        <main aria-label="Media library modal" className="flex h-full min-h-0 flex-col gap-4 overflow-hidden bg-card">
          <header className="flex items-start justify-between gap-4 border-b border-border pb-4">
            <div>
              <h2 className="ui-type-h3" id="media-library-modal-title">
                Media Library · {mediaTarget}
              </h2>
              <p className="ui-type-body-1 ui-type-muted">
                {mediaTarget === 'attachments'
                  ? 'Choose from all available file types.'
                  : 'Image filter is preselected for this field.'}
              </p>
            </div>
            <IconButton
              aria-label="Close media library"
              icon={<span aria-hidden="true" className="material-symbols-outlined">close</span>}
              onClick={() => setIsMediaOpen(false)}
              size="small"
              variant="ghost"
            />
          </header>

          <MediaManagerShell
            initialFileTypes={mediaFileTypePreset}
            onAssetConfirmed={onConfirmCmsAsset}
          />
        </main>
      </ModalShell>
    </>
  );
}

function NewPageEditor({
  activeCmsTab,
  thumbnailAsset,
  coverAsset,
  attachmentAsset,
  onTabChange,
  onOpenMediaManager
}: {
  activeCmsTab: string;
  thumbnailAsset: Asset | null;
  coverAsset: Asset | null;
  attachmentAsset: Asset | null;
  onTabChange: (value: string) => void;
  onOpenMediaManager: (target: MediaTarget) => void;
}) {
  const [pageStatus, setPageStatus] = useState<'draft' | 'unpublished'>('draft');

  return (
    <section className="flex min-w-0 flex-col px-4 py-4 lg:px-6">
      <header className="mb-4 rounded-md bg-selection-soft p-4">
        <div className="flex items-center justify-between gap-3">
          <h1 className="ui-type-h5">Content · New Page</h1>
          <ContentSwitcher
            ariaLabel="Page status"
            items={[
              { value: 'draft', label: 'Draft' },
              { value: 'unpublished', label: 'Not Published' }
            ]}
            onValueChange={(value) => setPageStatus(value as 'draft' | 'unpublished')}
            value={pageStatus}
          />
        </div>
      </header>

      <div className="flex-1">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
          <section className="rounded-lg border border-border bg-card p-4 ui-elevation-surface">
            <Tabs
              ariaLabel="CMS content tabs"
              items={[
                { value: 'document', label: 'Document' },
                { value: 'content', label: 'Content' },
                { value: 'taxonomy', label: 'Taxonomy' }
              ]}
              onValueChange={onTabChange}
              value={activeCmsTab}
            />

            <section aria-label="Document form" className="mt-4 space-y-4">
              <div className="space-y-2">
                <label className="ui-type-body-2-strong block" htmlFor="doc-title">
                  Title
                </label>
                <Input id="doc-title" placeholder="Enter page title" />
              </div>

              <div className="space-y-2">
                <label className="ui-type-body-2-strong block" htmlFor="doc-slug">
                  Slug
                </label>
                <Input disabled id="doc-slug" placeholder="Generated from title" />
              </div>

              <div className="space-y-2">
                <label className="ui-type-body-2-strong block" htmlFor="doc-parent">
                  Parent
                </label>
                <Select id="doc-parent">
                  <option>Choose a parent</option>
                  <option>Terms &amp; Conditions</option>
                  <option>Contact Us</option>
                  <option>About TTI</option>
                </Select>
                <p className="ui-type-small-1 ui-type-muted">Info</p>
              </div>

              <div className="space-y-2 border-t border-border pt-3">
                <h2 className="ui-type-small-2 ui-type-muted">Image</h2>
                <div className="grid gap-3 md:grid-cols-2">
                  <MediaField
                    label="Thumbnail"
                    asset={thumbnailAsset}
                    onSelect={() => onOpenMediaManager('thumbnail')}
                  />
                  <MediaField
                    label="Cover"
                    asset={coverAsset}
                    onSelect={() => onOpenMediaManager('cover')}
                  />
                </div>
              </div>

              <div className="space-y-2 border-t border-border pt-3">
                <h2 className="ui-type-small-2 ui-type-muted">Attachment</h2>
                <div className="rounded-lg border border-border bg-muted/40 p-4">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      {attachmentAsset ? (
                        <>
                          <p className="ui-type-body-2-strong">Selected attachment</p>
                          <div className="mt-2 flex items-center gap-2">
                            <MediaAssetIcon asset={attachmentAsset} className="h-9 w-9" />
                            <div>
                              <p className="ui-type-body-2-strong">{attachmentAsset.title}</p>
                              <p className="ui-type-small-1 ui-type-muted">{attachmentAsset.fileName}</p>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <p className="ui-type-body-2-strong">Upload files here</p>
                          <p className="ui-type-small-1 ui-type-muted">
                            Max file size is 500kb. Supported file types are .jpg and .png
                          </p>
                        </>
                      )}
                    </div>
                    <Button onClick={() => onOpenMediaManager('attachments')} size="small" variant="outline">
                      {attachmentAsset ? 'Replace' : 'Select'}
                    </Button>
                  </div>
                </div>
              </div>
            </section>
          </section>

          <aside className="space-y-3">
            <section className="rounded-lg border border-border bg-card p-3 ui-elevation-surface">
              <h2 className="ui-type-body-2-strong mb-2">Info</h2>
              <dl className="ui-type-small-1 grid grid-cols-2 gap-y-2">
                <dt className="ui-type-muted">Created by</dt>
                <dd className="text-right">-</dd>
                <dt className="ui-type-muted">Created On</dt>
                <dd className="text-right">-</dd>
                <dt className="ui-type-muted">Published At</dt>
                <dd className="text-right">-</dd>
                <dt className="ui-type-muted">Edited By</dt>
                <dd className="text-right">-</dd>
              </dl>
            </section>

            <section className="rounded-lg border border-border bg-card p-3 ui-elevation-surface">
              <h2 className="ui-type-body-2-strong mb-2">Version History</h2>
              <p className="ui-type-small-1 ui-type-muted">No version history yet.</p>
            </section>
          </aside>
        </div>
      </div>

      <section className="sticky bottom-0 z-20 mt-4 border-t border-border bg-background/95 py-3 backdrop-blur">
        <div className="flex items-center justify-between rounded-lg border border-border bg-muted/40 p-3">
          <Button
            trailingIcon={<span aria-hidden="true" className="material-symbols-outlined">close</span>}
            variant="secondary"
          >
            Close
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              Preview
            </Button>
            <Button trailingIcon={<span aria-hidden="true" className="material-symbols-outlined">arrow_right_alt</span>}>
              Publish
            </Button>
          </div>
        </div>
      </section>
    </section>
  );
}

function SidebarIconRail() {
  const icons = ['description', 'dashboard', 'news', 'bar_chart', 'groups', 'calendar_month'];

  return (
    <aside className="hidden bg-selection p-3 lg:flex lg:flex-col lg:items-center lg:justify-between">
      <div className="w-full">
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-card ui-type-body-2-strong">
          tti
        </div>

        <nav aria-label="Primary sections">
          <ul className="space-y-2">
            {icons.map((icon, index) => (
              <li key={icon}>
                <button
                  aria-label={icon}
                  className={`flex h-9 w-9 items-center justify-center rounded-md ${index === 0 ? 'bg-card text-foreground' : 'text-foreground/75 hover:bg-card/60'}`}
                  type="button"
                >
                  <span aria-hidden="true" className="material-symbols-outlined">
                    {icon}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-card ui-type-small-1 ui-type-body-2-strong">
        DW
      </div>
    </aside>
  );
}

function SidebarNavigation() {
  const contentItems = [
    'Notebooks',
    'Dashboards',
    'News',
    'Reports',
    'Profiles',
    'People',
    'Events',
    'Podcasts',
    'Showcase'
  ];
  const pageItems = ['Terms & Conditions', 'Contact Us', 'About TTI', 'About S&P', 'Privacy Policy'];

  return (
    <aside className="hidden bg-[#142345] p-4 text-white lg:block">
      <div className="ui-type-small-2 mb-2 text-white/75">Content</div>
      <ul className="mb-4 space-y-1">
        {contentItems.map((item) => (
          <li key={item}>
            <button
              className="ui-type-body-2 w-full rounded-md px-2 py-1 text-left text-white/90 hover:bg-white/10"
              type="button"
            >
              {item}
            </button>
          </li>
        ))}
      </ul>

      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="ui-type-small-2 text-white/75">Pages</span>
        <IconButton
          aria-label="Create new page"
          icon={<span aria-hidden="true" className="material-symbols-outlined text-[20px]">add</span>}
          size="xsmall"
          variant="ghostWhite"
        />
      </div>

      <ul className="space-y-1">
        <li>
          <button className="ui-type-body-2 w-full rounded-md bg-white/20 px-2 py-1 text-left text-white" type="button">
            New Page
          </button>
        </li>
        {pageItems.map((item) => (
          <li key={item}>
            <button
              className="ui-type-body-2 w-full rounded-md px-2 py-1 text-left text-white/90 hover:bg-white/10"
              type="button"
            >
              {item}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

function MediaField({
  label,
  asset,
  onSelect
}: {
  label: string;
  asset: Asset | null;
  onSelect: () => void;
}) {
  return (
    <article className="rounded-lg border border-border bg-muted/40 p-2">
      <p className="ui-type-body-2-strong mb-2">{label}</p>
      <div className="mb-2 flex h-40 items-center justify-center rounded bg-background/70">
        {asset?.kind === 'image' && asset.thumbnailUrl ? (
          <img alt={asset.title} className="h-full w-full rounded object-cover" src={asset.thumbnailUrl} />
        ) : asset ? (
          <div className="flex flex-col items-center gap-1">
            <MediaAssetIcon asset={asset} />
            <span className="ui-type-small-1 ui-type-muted px-2 text-center">{asset.fileName}</span>
          </div>
        ) : (
          <span aria-hidden="true" className="material-symbols-outlined ui-type-muted">
            image
          </span>
        )}
      </div>
      <div className="flex justify-end">
        <Button
          onClick={onSelect}
          size="small"
          trailingIcon={<span aria-hidden="true" className="material-symbols-outlined">upload</span>}
          variant="outline"
        >
          {asset ? 'Replace' : 'Select'}
        </Button>
      </div>
    </article>
  );
}
