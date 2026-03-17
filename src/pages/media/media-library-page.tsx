import { MediaManagerShell } from '@/features/media/components/media-manager-shell';

export function MediaLibraryPage() {
  return (
    <main aria-label="Media library page" className="h-screen overflow-hidden bg-background p-3 md:p-4">
      <section className="flex h-full min-h-0 flex-col rounded-2xl border border-border bg-background p-3 ui-elevation-surface md:p-4">
        <header className="mb-3 flex items-start justify-between gap-3 border-b border-border pb-3">
          <div>
            <h1 className="ui-type-h6 md:ui-type-h5">Media Library</h1>
            <p className="ui-type-body-2 ui-type-muted">Optimized for full-screen CMS workflows.</p>
          </div>
          <p className="ui-type-small-1 ui-type-muted hidden rounded-full border border-border bg-muted px-2 py-1 md:block">
            Esc closes dialogs and picker
          </p>
        </header>
        <MediaManagerShell />
      </section>
    </main>
  );
}
