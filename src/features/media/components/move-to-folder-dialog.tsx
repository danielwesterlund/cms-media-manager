import { useMemo, useState } from 'react';

import { Radio } from '@/components/ui/radio';
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
      <h2 className="ui-type-body-1-strong" id="move-to-folder-dialog-title">
        Move selected assets
      </h2>
      <p className="ui-type-body-2 ui-type-muted mt-1">{selectedCount} selected. Choose destination folder.</p>

      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between">
          <p className="ui-type-small-2 ui-type-muted">Folders</p>
          <button
            className={mediaButton({ variant: 'outline', size: 'sm' })}
            onClick={() => setSortOrder((current) => (current === 'asc' ? 'desc' : 'asc'))}
            type="button"
          >
            Sort {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
          </button>
        </div>

        <div className="max-h-64 space-y-1 overflow-auto rounded-md border border-border bg-background p-2">
          <Radio
            checked={selectedFolderId === null}
            className="w-full rounded px-2 py-1 hover:bg-muted"
            label="Root"
            name="move-target-folder"
            onChange={() => setSelectedFolderId(null)}
          />
          {options.map((option) => (
            <Radio
              checked={selectedFolderId === option.id}
              className="w-full rounded px-2 py-1 hover:bg-muted"
              key={option.id}
              label={<span className="truncate">{option.plainLabel}</span>}
              name="move-target-folder"
              onChange={() => setSelectedFolderId(option.id)}
            />
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
