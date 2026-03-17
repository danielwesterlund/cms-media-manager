import { mediaButton } from '@/features/media/components/media-ui.variants';
import { useState } from 'react';

import type { FolderNode } from '@/features/media/domain/media.types';
import { ModalShell } from '@/features/media/components/modal-shell';
import { flattenFolderOptions } from '@/features/media/components/tree-utils';

type DeleteFolderDialogProps = {
  open: boolean;
  folderId: string | null;
  folderName?: string;
  requiresMoveContents: boolean;
  folderTree: FolderNode[];
  onOpenChange: (open: boolean) => void;
  onConfirm: (moveContentsToFolderId: string | null | undefined) => void;
};

/**
 * Delete-folder dialog with optional move-contents flow.
 */
export function DeleteFolderDialog({
  open,
  folderId,
  folderName,
  requiresMoveContents,
  folderTree,
  onOpenChange,
  onConfirm
}: DeleteFolderDialogProps) {
  const [moveTarget, setMoveTarget] = useState<string | null>(null);
  if (!folderId) return null;

  const options = flattenFolderOptions(folderTree, folderId);

  return (
    <ModalShell className="max-w-lg" onOpenChange={onOpenChange} open={open} titleId="delete-folder-dialog-title">
      <h2 className="ui-type-body-1-strong" id="delete-folder-dialog-title">
        Delete folder
      </h2>
      <p className="ui-type-body-2 ui-type-muted mt-1">
        Delete <span className="ui-type-body-2-strong text-foreground">{folderName ?? 'this folder'}</span>.
      </p>

      {requiresMoveContents ? (
        <div className="mt-4 rounded-md border border-border bg-muted/40 p-3">
          <p className="ui-type-body-2">This folder contains assets. Choose where to move them first.</p>
          <div className="mt-2 space-y-2">
            <button className={mediaButton({ variant: 'outline', size: 'md' })} onClick={() => setMoveTarget(null)} type="button">
              Move to root
            </button>
            {options.map((option) => (
              <button
                className={mediaButton({ variant: 'outline', size: 'md' })}
                key={option.id}
                onClick={() => setMoveTarget(option.id)}
                type="button"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-4 flex justify-end gap-2">
        <button className={mediaButton({ variant: 'outline', size: 'md' })} onClick={() => onOpenChange(false)} type="button">
          Cancel
        </button>
        <button
          className={mediaButton({ variant: 'danger', size: 'md' })}
          onClick={() => onConfirm(requiresMoveContents ? moveTarget : undefined)}
          type="button"
        >
          Delete folder
        </button>
      </div>
    </ModalShell>
  );
}
