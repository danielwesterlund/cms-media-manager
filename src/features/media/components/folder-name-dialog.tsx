import { mediaButton } from '@/features/media/components/media-ui.variants';
import { useEffect, useState } from 'react';

import { ModalShell } from '@/features/media/components/modal-shell';

type FolderNameDialogProps = {
  open: boolean;
  mode: 'create' | 'rename';
  initialName?: string;
  title?: string;
  confirmLabel?: string;
  onOpenChange: (open: boolean) => void;
  onSubmit: (name: string) => void;
};

/**
 * Simple controlled dialog for creating or renaming folders.
 */
export function FolderNameDialog({
  open,
  mode,
  initialName = '',
  title,
  confirmLabel,
  onOpenChange,
  onSubmit
}: FolderNameDialogProps) {
  const [name, setName] = useState(initialName);

  useEffect(() => {
    setName(initialName);
  }, [initialName, open]);

  return (
    <ModalShell onOpenChange={onOpenChange} open={open} titleId="folder-name-dialog-title">
      <h2 className="text-base font-semibold" id="folder-name-dialog-title">
        {title ?? (mode === 'create' ? 'Create folder' : 'Rename folder')}
      </h2>
      <label className="mt-3 block text-sm">
        Folder name
        <input
          autoFocus
          className="mt-1 h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
          onChange={(event) => setName(event.target.value)}
          value={name}
        />
      </label>

      <div className="mt-4 flex justify-end gap-2">
        <button className={mediaButton({ variant: 'outline', size: 'md' })} onClick={() => onOpenChange(false)} type="button">
          Cancel
        </button>
        <button className={mediaButton({ variant: 'default', size: 'md' })} onClick={() => onSubmit(name)} type="button">
          {confirmLabel ?? (mode === 'create' ? 'Create' : 'Save')}
        </button>
      </div>
    </ModalShell>
  );
}
