import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import type { DragEvent } from 'react';

import type { FolderNode } from '@/features/media/domain/media.types';
import { mediaButton, mediaPanel } from '@/features/media/components/media-ui.variants';
import { cn } from '@/lib/cn';

type FolderTreePanelProps = {
  tree: FolderNode[];
  expandedFolderIds: string[];
  activeFolderId: string | null;
  onSelectFolder: (folderId: string | null) => void;
  onToggleExpand: (folderId: string) => void;
  onCreateFolder: (parentId: string | null) => void;
  onRenameFolder: (folderId: string) => void;
  onDeleteFolder: (folderId: string) => void;
  onMoveFolder: (folderId: string) => void;
  dropTargetFolderId: string | null | undefined;
  onAssetDragOverFolder: (folderId: string | null) => void;
  onAssetDropToFolder: (folderId: string | null, assetIds: string[]) => void;
};

/**
 * Presentational folder tree with keyboard-accessible folder actions.
 */
export function FolderTreePanel({
  tree,
  expandedFolderIds,
  activeFolderId,
  onSelectFolder,
  onToggleExpand,
  onCreateFolder,
  onRenameFolder,
  onDeleteFolder,
  onMoveFolder,
  dropTargetFolderId,
  onAssetDragOverFolder,
  onAssetDropToFolder
}: FolderTreePanelProps) {
  const expanded = new Set(expandedFolderIds);

  return (
    <section aria-label="Folders" className={cn(mediaPanel(), 'p-3')}>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold">Folders</h2>
        <button
          className={mediaButton({ variant: 'outline', size: 'sm' })}
          onClick={() => onCreateFolder(null)}
          type="button"
        >
          New root
        </button>
      </div>

      <ul className="space-y-1" role="tree">
        <li>
          <button
            className={cn(
              'w-full rounded-md px-2 py-1 text-left text-sm hover:bg-muted',
              dropTargetFolderId === null && 'bg-selection-soft ring-1 ring-selection-border',
              activeFolderId === null && 'bg-muted font-medium'
            )}
            onDragOver={(event) => {
              event.preventDefault();
              onAssetDragOverFolder(null);
            }}
            onDrop={(event) => {
              event.preventDefault();
              onAssetDropToFolder(null, readDraggedAssetIds(event));
            }}
            onClick={() => onSelectFolder(null)}
            type="button"
          >
            All assets
          </button>
        </li>

        {tree.map((node) => (
          <FolderTreeItem
            activeFolderId={activeFolderId}
            expanded={expanded}
            key={node.id}
            node={node}
            onCreateFolder={onCreateFolder}
            onDeleteFolder={onDeleteFolder}
            onMoveFolder={onMoveFolder}
            onRenameFolder={onRenameFolder}
            onSelectFolder={onSelectFolder}
            onToggleExpand={onToggleExpand}
            dropTargetFolderId={dropTargetFolderId}
            onAssetDragOverFolder={onAssetDragOverFolder}
            onAssetDropToFolder={onAssetDropToFolder}
          />
        ))}
      </ul>
    </section>
  );
}

type FolderTreeItemProps = {
  node: FolderNode;
  expanded: Set<string>;
  activeFolderId: string | null;
  onSelectFolder: (folderId: string) => void;
  onToggleExpand: (folderId: string) => void;
  onCreateFolder: (parentId: string | null) => void;
  onRenameFolder: (folderId: string) => void;
  onDeleteFolder: (folderId: string) => void;
  onMoveFolder: (folderId: string) => void;
  dropTargetFolderId: string | null | undefined;
  onAssetDragOverFolder: (folderId: string | null) => void;
  onAssetDropToFolder: (folderId: string | null, assetIds: string[]) => void;
};

function FolderTreeItem({
  node,
  expanded,
  activeFolderId,
  onSelectFolder,
  onToggleExpand,
  onCreateFolder,
  onRenameFolder,
  onDeleteFolder,
  onMoveFolder,
  dropTargetFolderId,
  onAssetDragOverFolder,
  onAssetDropToFolder
}: FolderTreeItemProps) {
  const isExpanded = expanded.has(node.id);
  const hasChildren = node.children.length > 0;

  return (
    <li role="treeitem">
      <div className="group flex items-center gap-1 rounded-md px-1 py-0.5 hover:bg-muted/60">
        <button
          aria-label={isExpanded ? 'Collapse folder' : 'Expand folder'}
          className="inline-flex h-6 w-6 items-center justify-center rounded hover:bg-muted"
          onClick={() => hasChildren && onToggleExpand(node.id)}
          type="button"
        >
          {hasChildren ? (isExpanded ? '-' : '+') : '·'}
        </button>

        <button
          className={cn(
            'min-w-0 flex-1 truncate rounded px-1 py-0.5 text-left text-sm',
            dropTargetFolderId === node.id && 'bg-selection-soft ring-1 ring-selection-border',
            activeFolderId === node.id && 'bg-muted font-medium'
          )}
          onDragOver={(event) => {
            event.preventDefault();
            onAssetDragOverFolder(node.id);
          }}
          onDrop={(event) => {
            event.preventDefault();
            onAssetDropToFolder(node.id, readDraggedAssetIds(event));
          }}
          onClick={() => onSelectFolder(node.id)}
          type="button"
        >
          {node.name}
          <span className="ml-1 text-xs text-muted-foreground">({node.assetCount})</span>
        </button>

        <FolderMenu
          onCreateFolder={() => onCreateFolder(node.id)}
          onDeleteFolder={() => onDeleteFolder(node.id)}
          onMoveFolder={() => onMoveFolder(node.id)}
          onRenameFolder={() => onRenameFolder(node.id)}
        />
      </div>

      {hasChildren && isExpanded ? (
        <ul className="ml-4 mt-1 space-y-1" role="group">
          {node.children.map((child) => (
            <FolderTreeItem
              activeFolderId={activeFolderId}
              expanded={expanded}
              key={child.id}
              node={child}
              onCreateFolder={onCreateFolder}
              onDeleteFolder={onDeleteFolder}
              onMoveFolder={onMoveFolder}
              onRenameFolder={onRenameFolder}
              onSelectFolder={onSelectFolder}
              onToggleExpand={onToggleExpand}
              dropTargetFolderId={dropTargetFolderId}
              onAssetDragOverFolder={onAssetDragOverFolder}
              onAssetDropToFolder={onAssetDropToFolder}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

type FolderMenuProps = {
  onCreateFolder: () => void;
  onRenameFolder: () => void;
  onDeleteFolder: () => void;
  onMoveFolder: () => void;
};

function FolderMenu({ onCreateFolder, onRenameFolder, onDeleteFolder, onMoveFolder }: FolderMenuProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
          <button
            aria-label="Folder actions"
          className={cn(mediaButton({ variant: 'ghost', size: 'sm' }), 'h-6 w-6 p-0 text-muted-foreground')}
          type="button"
        >
          ⋮
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          className="z-50 min-w-40 rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md"
          sideOffset={4}
        >
          <DropdownMenu.Item className="cursor-pointer rounded px-2 py-1.5 text-sm hover:bg-muted" onSelect={onCreateFolder}>
            New subfolder
          </DropdownMenu.Item>
          <DropdownMenu.Item className="cursor-pointer rounded px-2 py-1.5 text-sm hover:bg-muted" onSelect={onRenameFolder}>
            Rename
          </DropdownMenu.Item>
          <DropdownMenu.Item className="cursor-pointer rounded px-2 py-1.5 text-sm hover:bg-muted" onSelect={onMoveFolder}>
            Move folder...
          </DropdownMenu.Item>
          <DropdownMenu.Item className="cursor-pointer rounded px-2 py-1.5 text-sm text-destructive hover:bg-muted" onSelect={onDeleteFolder}>
            Delete
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

function readDraggedAssetIds(event: DragEvent<HTMLElement>): string[] {
  const raw = event.dataTransfer.getData('application/x-media-asset-ids');
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : [];
  } catch {
    return [];
  }
}
