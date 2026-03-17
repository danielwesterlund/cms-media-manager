import { useMemo, useState } from 'react';

import { mediaButton } from '@/features/media/components/media-ui.variants';
import type { FolderNode } from '@/features/media/domain/media.types';
import { ModalShell } from '@/features/media/components/modal-shell';
import { flattenFolderOptions } from '@/features/media/components/tree-utils';

type MoveToFolderDialogProps = {
  open: boolean;
  folderTree: FolderNode[];
  selectedCount: number;
  onOpenChange: (open: boolean) => void;
  onSubmit: (folderId: string | null) => void;
};

/**
 * Dialog for moving selected assets to a target folder.
 */
export function MoveToFolderDialog({ open, folderTree, selectedCount, onOpenChange, onSubmit }: MoveToFolderDialogProps) {
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const options = useMemo(() => {
    const base = flattenFolderOptions(folderTree).map((item) => ({ ...item, plainLabel: item.label.trim() }));
    return [...base].sort((a, b) =>
      sortOrder === 'asc' ? a.plainLabel.localeCompare(b.plainLabel) : b.plainLabel.localeCompare(a.plainLabel)
    );
  }, [folderTree, sortOrder]);

  return (
    <ModalShell onOpenChange={onOpenChange} open={open} titleId="move-to-folder-dialog-title">
      <h2 className="text-base font-semibold" id="move-to-folder-dialog-title">
        Move selected assets
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">{selectedCount} selected. Choose destination folder.</p>

      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Folders</p>
          <button
            className={mediaButton({ variant: 'outline', size: 'sm' })}
            onClick={() => setSortOrder((current) => (current === 'asc' ? 'desc' : 'asc'))}
            type="button"
          >
            Sort {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
          </button>
        </div>

        <div className="max-h-64 space-y-1 overflow-auto rounded-md border border-border bg-background p-2">
          <label className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-sm hover:bg-muted">
            <input
              checked={selectedFolderId === null}
              name="move-target-folder"
              onChange={() => setSelectedFolderId(null)}
              type="radio"
            />
            <span>Root</span>
          </label>

          {options.map((option) => (
            <label className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-sm hover:bg-muted" key={option.id}>
              <input
                checked={selectedFolderId === option.id}
                name="move-target-folder"
                onChange={() => setSelectedFolderId(option.id)}
                type="radio"
              />
              <span className="truncate">{option.plainLabel}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <button className={mediaButton({ variant: 'default', size: 'md' })} onClick={() => onSubmit(selectedFolderId)} type="button">
          Move assets
        </button>
        <button className={mediaButton({ variant: 'outline', size: 'md' })} onClick={() => onOpenChange(false)} type="button">
          Close
        </button>
      </div>
    </ModalShell>
  );
}
