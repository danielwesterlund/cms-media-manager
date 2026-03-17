import { MediaManagerShell } from '@/features/media/components/media-manager-shell';

export function MediaLibraryPage() {
  return (
    <main aria-label="Media library page" className="h-screen overflow-hidden bg-background p-3 md:p-4">
      <section className="flex h-full min-h-0 flex-col rounded-2xl border border-border bg-background p-3 shadow-sm md:p-4">
        <header className="mb-3 flex items-start justify-between gap-3 border-b border-border pb-3">
          <div>
            <h1 className="text-xl font-semibold tracking-tight md:text-2xl">Media Library</h1>
            <p className="text-sm text-muted-foreground">Optimized for full-screen CMS workflows.</p>
          </div>
          <p className="hidden rounded-full border border-border bg-muted px-2 py-1 text-xs text-muted-foreground md:block">
            Esc closes dialogs and picker
          </p>
        </header>
        <MediaManagerShell />
      </section>
    </main>
  );
}
