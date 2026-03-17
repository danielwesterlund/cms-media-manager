import type { FolderNode } from '@/features/media/domain/media.types';

export type FolderOption = {
  id: string;
  label: string;
};

/**
 * Flattens nested folder tree into prefixed labels for select-like lists.
 */
export function flattenFolderOptions(tree: FolderNode[], excludeFolderId?: string): FolderOption[] {
  const out: FolderOption[] = [];

  const walk = (nodes: FolderNode[], depth: number) => {
    for (const node of nodes) {
      if (excludeFolderId && node.id === excludeFolderId) {
        walk(node.children, depth + 1);
        continue;
      }

      out.push({
        id: node.id,
        label: `${'  '.repeat(depth)}${node.name}`
      });

      walk(node.children, depth + 1);
    }
  };

  walk(tree, 0);
  return out;
}
