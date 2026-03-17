import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { DeleteFolderDialog } from '@/features/media/components/delete-folder-dialog';
import { FolderNameDialog } from '@/features/media/components/folder-name-dialog';
import { FolderTreePanel } from '@/features/media/components/folder-tree-panel';
import { MoveFolderDialog } from '@/features/media/components/move-folder-dialog';
import { MoveToFolderDialog } from '@/features/media/components/move-to-folder-dialog';
import type { FolderNode } from '@/features/media/domain/media.types';
import { useAssetMutations } from '@/features/media/hooks/use-asset-mutations';
import { useFoldersQuery } from '@/features/media/hooks/use-folders-query';
import { mediaUiSelectors, useMediaUiActions, useMediaUiStore } from '@/features/media/state/media-ui.store';

type DialogMode = null | 'create' | 'rename' | 'delete' | 'move-folder' | 'move-assets';

/**
 * Smart container for folder tree operations with dialogs and toasts.
 */
export function FolderTreePanelContainer() {
  const { data } = useFoldersQuery();
  const tree = data ?? [];
  const activeFolderId = useMediaUiStore(mediaUiSelectors.activeFolderId);
  const selectedAssetIds = useMediaUiStore(mediaUiSelectors.selectedAssetIds);
  const { clearSelection, setActiveFolder } = useMediaUiActions();
  const mutations = useAssetMutations();

  const [expandedFolderIds, setExpandedFolderIds] = useState<string[]>([]);
  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [dialogFolderId, setDialogFolderId] = useState<string | null>(null);
  const [deleteNeedsMoveFlow, setDeleteNeedsMoveFlow] = useState(false);
  const [dropTargetFolderId, setDropTargetFolderId] = useState<string | null | undefined>(undefined);

  const folderById = useMemo(() => mapFolderTreeById(tree), [tree]);

  useEffect(() => {
    if (!activeFolderId) return;
    if (!folderById.has(activeFolderId)) {
      setActiveFolder(null);
    }
  }, [activeFolderId, folderById, setActiveFolder]);

  const openCreateDialog = (parentId: string | null) => {
    setDialogFolderId(parentId);
    setDialogMode('create');
  };

  const openRenameDialog = (folderId: string) => {
    setDialogFolderId(folderId);
    setDialogMode('rename');
  };

  const openDeleteDialog = (folderId: string) => {
    setDialogFolderId(folderId);
    setDeleteNeedsMoveFlow((folderById.get(folderId)?.assetCount ?? 0) > 0);
    setDialogMode('delete');
  };

  const openMoveFolderDialog = (folderId: string) => {
    setDialogFolderId(folderId);
    setDialogMode('move-folder');
  };

  const submitCreate = async (name: string) => {
    try {
      await mutations.createFolder.mutateAsync({ parentId: dialogFolderId, name });
      toast.success('Folder created.');
      setDialogMode(null);
    } catch (error) {
      toast.error(asErrorMessage(error));
    }
  };

  const submitRename = async (name: string) => {
    if (!dialogFolderId) return;
    try {
      await mutations.renameFolder.mutateAsync({ id: dialogFolderId, name });
      toast.success('Folder renamed.');
      setDialogMode(null);
    } catch (error) {
      toast.error(asErrorMessage(error));
    }
  };

  const submitMoveFolder = async (newParentId: string | null) => {
    if (!dialogFolderId) return;
    try {
      await mutations.moveFolder.mutateAsync({ id: dialogFolderId, newParentId });
      toast.success('Folder moved.');
      setDialogMode(null);
    } catch (error) {
      toast.error(asErrorMessage(error));
    }
  };

  const submitDelete = async (moveContentsToFolderId: string | null | undefined) => {
    if (!dialogFolderId) return;

    try {
      await mutations.deleteFolder.mutateAsync({
        id: dialogFolderId,
        strategy: { moveContentsToFolderId }
      });
      toast.success('Folder deleted.');
      setDialogMode(null);
    } catch (error) {
      const message = asErrorMessage(error);
      if (message.includes('Folder has content')) {
        setDeleteNeedsMoveFlow(true);
        toast.error('This folder has content. Choose a destination first.');
        return;
      }
      toast.error(message);
    }
  };

  const submitMoveAssets = async (folderId: string | null) => {
    if (selectedAssetIds.length === 0) {
      toast.error('Select assets first.');
      return;
    }

    try {
      await mutations.moveAssets.mutateAsync({ assetIds: selectedAssetIds, folderId });
      clearSelection();
      toast.success('Assets moved.');
      setDialogMode(null);
    } catch (error) {
      toast.error(asErrorMessage(error));
    }
  };

  const dropAssetsToFolder = async (folderId: string | null, assetIds: string[]) => {
    setDropTargetFolderId(undefined);
    if (assetIds.length === 0) {
      toast.error('Drag one or more assets to a folder.');
      return;
    }

    try {
      await mutations.moveAssets.mutateAsync({ assetIds, folderId });
      clearSelection();
      toast.success(`Moved ${assetIds.length} asset${assetIds.length === 1 ? '' : 's'}.`);
    } catch (error) {
      toast.error(asErrorMessage(error));
    }
  };

  return (
    <>
      <div className="space-y-2">
        <FolderTreePanel
          activeFolderId={activeFolderId}
          dropTargetFolderId={dropTargetFolderId}
          expandedFolderIds={expandedFolderIds}
          onAssetDragOverFolder={setDropTargetFolderId}
          onAssetDropToFolder={(folderId, assetIds) => void dropAssetsToFolder(folderId, assetIds)}
          onCreateFolder={openCreateDialog}
          onDeleteFolder={openDeleteDialog}
          onMoveFolder={openMoveFolderDialog}
          onRenameFolder={openRenameDialog}
          onSelectFolder={setActiveFolder}
          onToggleExpand={(folderId) => {
            setExpandedFolderIds((current) =>
              current.includes(folderId) ? current.filter((id) => id !== folderId) : [...current, folderId]
            );
          }}
          tree={tree}
        />

        <button
          className="w-full rounded-md border border-input px-3 py-2 text-sm hover:bg-muted"
          onClick={() => setDialogMode('move-assets')}
          type="button"
        >
          Move selected assets...
        </button>
      </div>

      <FolderNameDialog
        confirmLabel="Create"
        mode="create"
        onOpenChange={(open) => !open && setDialogMode(null)}
        onSubmit={submitCreate}
        open={dialogMode === 'create'}
      />

      <FolderNameDialog
        confirmLabel="Save"
        initialName={dialogFolderId ? folderById.get(dialogFolderId)?.name ?? '' : ''}
        mode="rename"
        onOpenChange={(open) => !open && setDialogMode(null)}
        onSubmit={submitRename}
        open={dialogMode === 'rename'}
      />

      <MoveFolderDialog
        folderId={dialogFolderId}
        folderTree={tree}
        onOpenChange={(open) => !open && setDialogMode(null)}
        onSubmit={submitMoveFolder}
        open={dialogMode === 'move-folder'}
      />

      <DeleteFolderDialog
        folderId={dialogFolderId}
        folderName={dialogFolderId ? folderById.get(dialogFolderId)?.name : undefined}
        folderTree={tree}
        onConfirm={submitDelete}
        onOpenChange={(open) => !open && setDialogMode(null)}
        open={dialogMode === 'delete'}
        requiresMoveContents={deleteNeedsMoveFlow}
      />

      <MoveToFolderDialog
        folderTree={tree}
        onOpenChange={(open) => !open && setDialogMode(null)}
        onSubmit={submitMoveAssets}
        open={dialogMode === 'move-assets'}
        selectedCount={selectedAssetIds.length}
      />
    </>
  );
}

function mapFolderTreeById(tree: FolderNode[]): Map<string, FolderNode> {
  const map = new Map<string, FolderNode>();
  const stack = [...tree];
  while (stack.length) {
    const node = stack.shift();
    if (!node) continue;
    map.set(node.id, node);
    stack.push(...node.children);
  }
  return map;
}

function asErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return 'Something went wrong.';
}
