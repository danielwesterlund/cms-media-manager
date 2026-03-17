import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import type { DragEvent } from 'react';

import { IconButton } from '@/components/ui/icon-button';
import { PopoverContent, PopoverItem } from '@/components/ui/popover';
import { TreeRow } from '@/components/ui/tree';
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
        <h2 className="ui-type-body-2-strong">Folders</h2>
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
          <TreeRow
            active={activeFolderId === null}
            depth={0}
            expanded={false}
            label="All assets"
            onDragOver={(event) => {
              event.preventDefault();
              onAssetDragOverFolder(null);
            }}
            onDrop={(event) => {
              event.preventDefault();
              onAssetDropToFolder(null, readDraggedAssetIds(event));
            }}
            onSelect={() => onSelectFolder(null)}
            selected={dropTargetFolderId === null}
          />
        </li>

        {tree.map((node) => (
          <FolderTreeItem
            activeFolderId={activeFolderId}
            depth={1}
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
  depth: number;
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
  depth,
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
      <TreeRow
        active={activeFolderId === node.id}
        depth={depth}
        expanded={isExpanded}
        label={
          <>
            {node.name}
            <span className="ui-tree-meta">({node.assetCount})</span>
          </>
        }
        onDragOver={(event) => {
          event.preventDefault();
          onAssetDragOverFolder(node.id);
        }}
        onDrop={(event) => {
          event.preventDefault();
          onAssetDropToFolder(node.id, readDraggedAssetIds(event));
        }}
        onSelect={() => onSelectFolder(node.id)}
        onToggle={hasChildren ? () => onToggleExpand(node.id) : undefined}
        selected={dropTargetFolderId === node.id}
        trailing={
          <FolderMenu
            onCreateFolder={() => onCreateFolder(node.id)}
            onDeleteFolder={() => onDeleteFolder(node.id)}
            onMoveFolder={() => onMoveFolder(node.id)}
            onRenameFolder={() => onRenameFolder(node.id)}
          />
        }
      />

      {hasChildren && isExpanded ? (
        <ul className="mt-1 space-y-1" role="group">
          {node.children.map((child) => (
            <FolderTreeItem
              activeFolderId={activeFolderId}
              depth={depth + 1}
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
        <IconButton
          aria-label="Folder actions"
          className="ui-type-muted"
          icon={<span aria-hidden="true" className="material-symbols-outlined">more_vert</span>}
          size="xsmall"
          variant="ghost"
        />
      </DropdownMenu.Trigger>

      <PopoverContent align="end">
        <PopoverItem onSelect={onCreateFolder}>New subfolder</PopoverItem>
        <PopoverItem onSelect={onRenameFolder}>Rename</PopoverItem>
        <PopoverItem onSelect={onMoveFolder}>Move folder...</PopoverItem>
        <PopoverItem danger onSelect={onDeleteFolder}>
          Delete
        </PopoverItem>
      </PopoverContent>
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
