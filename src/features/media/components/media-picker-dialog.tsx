import { mediaButton } from '@/features/media/components/media-ui.variants';
import { useMemo } from 'react';

import { ModalShell } from '@/features/media/components/modal-shell';
import type { MediaPickerContext } from '@/features/media/state/media-ui.store';

type MediaPickerDialogProps = {
  open: boolean;
  context: MediaPickerContext;
  attachmentsSelectionOrderedIds: string[];
  onOpenChange: (open: boolean) => void;
  onChangeAttachmentsOrder: (ids: string[]) => void;
};

/**
 * Picker modal skeleton with keyboard reorder controls for attachments context.
 */
export function MediaPickerDialog({
  open,
  context,
  attachmentsSelectionOrderedIds,
  onOpenChange,
  onChangeAttachmentsOrder
}: MediaPickerDialogProps) {
  const title = useMemo(() => `Media Picker (${context})`, [context]);

  return (
    <ModalShell className="max-w-lg" onOpenChange={onOpenChange} open={open} titleId="media-picker-dialog-title">
      <h2 className="text-base font-semibold" id="media-picker-dialog-title">
        {title}
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">Pick media and confirm selection.</p>

      {context === 'attachments' ? (
        <AttachmentsOrderEditor ids={attachmentsSelectionOrderedIds} onChange={onChangeAttachmentsOrder} />
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">Picker content placeholder for {context} context.</p>
      )}

      <div className="mt-4 flex justify-end gap-2">
        <button className={mediaButton({ variant: 'outline', size: 'md' })} onClick={() => onOpenChange(false)} type="button">
          Close
        </button>
        <button className={mediaButton({ variant: 'default', size: 'md' })} onClick={() => onOpenChange(false)} type="button">
          Use Selection
        </button>
      </div>
    </ModalShell>
  );
}

function AttachmentsOrderEditor({ ids, onChange }: { ids: string[]; onChange: (ids: string[]) => void }) {
  const move = (index: number, delta: -1 | 1) => {
    const next = [...ids];
    const target = index + delta;
    if (target < 0 || target >= ids.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  if (ids.length === 0) {
    return <p className="mt-4 text-sm text-muted-foreground">No attachments selected yet.</p>;
  }

  return (
    <section aria-label="Reorder attachments" className="mt-4 space-y-2">
      <h3 className="text-sm font-medium">Attachment Order</h3>
      <p className="text-xs text-muted-foreground">Use ArrowUp / ArrowDown on a row to reorder.</p>
      <ol className="space-y-2">
        {ids.map((id, index) => (
          <li key={id}>
            <div
              className="grid grid-cols-[1fr_auto] items-center gap-2 rounded border border-border p-2"
              onKeyDown={(event) => {
                if (event.key === 'ArrowUp') {
                  event.preventDefault();
                  move(index, -1);
                }
                if (event.key === 'ArrowDown') {
                  event.preventDefault();
                  move(index, 1);
                }
              }}
              tabIndex={0}
            >
              <span className="truncate text-sm">{id}</span>
              <div className="flex gap-1">
                <button aria-label={`Move ${id} up`} className={mediaButton({ variant: 'outline', size: 'sm' })} onClick={() => move(index, -1)} type="button">
                  Up
                </button>
                <button aria-label={`Move ${id} down`} className={mediaButton({ variant: 'outline', size: 'sm' })} onClick={() => move(index, 1)} type="button">
                  Down
                </button>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
