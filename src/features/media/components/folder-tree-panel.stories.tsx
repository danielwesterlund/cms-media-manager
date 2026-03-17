import { FolderTreePanel } from '@/features/media/components/folder-tree-panel';
import type { FolderNode } from '@/features/media/domain/media.types';

const deepTree: FolderNode[] = [
  {
    id: 'a',
    name: 'Brand',
    parentId: null,
    assetCount: 4,
    children: [
      {
        id: 'a1',
        name: '2026',
        parentId: 'a',
        assetCount: 2,
        children: [
          {
            id: 'a1q1',
            name: 'Q1',
            parentId: 'a1',
            assetCount: 1,
            children: [
              {
                id: 'a1q1launch',
                name: 'Launch',
                parentId: 'a1q1',
                assetCount: 1,
                children: [
                  {
                    id: 'a1q1launchsocial',
                    name: 'Social',
                    parentId: 'a1q1launch',
                    assetCount: 1,
                    children: []
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'a2',
        name: '2025',
        parentId: 'a',
        assetCount: 2,
        children: []
      }
    ]
  },
  {
    id: 'b',
    name: 'Dashboards',
    parentId: null,
    assetCount: 3,
    children: [
      { id: 'b1', name: 'Tableau', parentId: 'b', assetCount: 2, children: [] },
      { id: 'b2', name: 'Power BI', parentId: 'b', assetCount: 1, children: [] }
    ]
  }
];

const meta = {
  title: 'Features/Media/FolderTreePanel',
  component: FolderTreePanel,
  args: {
    tree: deepTree,
    expandedFolderIds: ['a', 'a1', 'a1q1', 'a1q1launch', 'b'],
    activeFolderId: 'a1q1launchsocial',
    onSelectFolder: () => undefined,
    onToggleExpand: () => undefined,
    onCreateFolder: () => undefined,
    onRenameFolder: () => undefined,
    onDeleteFolder: () => undefined,
    onMoveFolder: () => undefined
  }
};

export default meta;

export const DeepTree = {};
