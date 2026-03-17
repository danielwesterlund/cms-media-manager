import { mediaButton } from '@/features/media/components/media-ui.variants';
import type { FolderNode } from '@/features/media/domain/media.types';
import { ModalShell } from '@/features/media/components/modal-shell';
import { flattenFolderOptions } from '@/features/media/components/tree-utils';

type MoveFolderDialogProps = {
  open: boolean;
  folderTree: FolderNode[];
  folderId: string | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (newParentId: string | null) => void;
};

/**
 * Dialog for moving a folder under a new parent.
 */
export function MoveFolderDialog({ open, folderTree, folderId, onOpenChange, onSubmit }: MoveFolderDialogProps) {
  if (!folderId) return null;

  const options = flattenFolderOptions(folderTree, folderId);

  return (
    <ModalShell onOpenChange={onOpenChange} open={open} titleId="move-folder-dialog-title">
      <h2 className="text-base font-semibold" id="move-folder-dialog-title">
        Move folder...
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">Choose a destination parent folder.</p>

      <div className="mt-4 space-y-2">
        <button className={mediaButton({ variant: 'outline', size: 'md' })} onClick={() => onSubmit(null)} type="button">
          Move to root
        </button>
        {options.map((option) => (
          <button
            className={mediaButton({ variant: 'outline', size: 'md' })}
            key={option.id}
            onClick={() => onSubmit(option.id)}
            type="button"
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="mt-4 flex justify-end">
        <button className={mediaButton({ variant: 'outline', size: 'md' })} onClick={() => onOpenChange(false)} type="button">
          Close
        </button>
      </div>
    </ModalShell>
  );
}
